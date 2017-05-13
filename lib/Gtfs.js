import {
  DeviceEventEmitter,
  NativeModules,
} from 'react-native';

import parallel from 'async/parallel';
import Utils from './Utils';

const db = 'gtfs.sqlite';

export default class Gtfs {

  static getDayOfWeek(dt) {
    let day = dt.getDay();

    if (day === 0) return 'sunday';
    if (day === 1) return 'monday';
    if (day === 2) return 'tuesday';
    if (day === 3) return 'wednesday';
    if (day === 4) return 'thursday';
    if (day === 5) return 'friday';
    if (day === 6) return 'saturday';
  }

  /**
   * TODO probably need to set the day one back
   * if the service runs past midnight
   */
  static getServiceIds(done) {
    let day = Gtfs.getDayOfWeek(new Date());
    const sql  = `
      SELECT service_id FROM calendar WHERE ${day} = 1;
    `;

    Gtfs.executeSql(sql, (err, results) => {
      if (err) return done(err);

      done(null, results.map(r => parseInt(r.service_id, 10)));
    });
  }

  static getRoutes(done) {
    const sql = `
      SELECT
        route_index,
        route_short_name,
        route_long_name,
        route_type,
        route_color,
        route_text_color
      FROM routes
      ORDER BY route_index;
    `;

    Gtfs.executeSql(sql, done);
  }

  static getRouteInfo(routeIndex, myLoc, done) {
    Gtfs.getServiceIds((err, serviceIds) => {
      // TODO understand why some trip_headsigns are empty
      const sql = `
        SELECT
          DISTINCT(direction_id),
          trip_headsign,
          shape_index
        FROM trips
        WHERE route_index = ${routeIndex}
        ORDER BY direction_id;
      `;

      Gtfs.executeSql(sql, (err, results) => {
        const directions = results;

        // unique directionIds (will probably always be 0 and 1)
        const directionIds = directions
          .map(direction => direction.direction_id)
          .filter((el,i,a) => {if(i==a.indexOf(el))return 1;return 0})
        const d0 = directionIds[0];
        const d1 = directionIds[1];

        Gtfs.getClosestStops(routeIndex, [d0, d1], serviceIds, myLoc, (err, closestStops) => {
          let now = Gtfs.secsSinceMidnight();

          let shapesFetchers = directions.map(direction => {
            return (callback) => {
              Gtfs.getShape(direction.shape_index, callback);
            }
          })

          let stopsFetchers = directions.map(direction => {
            return (callback) => {
              Gtfs.getStopsAndSchedule(routeIndex, direction.shape_index, serviceIds, closestStops[direction.direction_id].stop_index, now, callback);
            }
          })

          parallel({
            shapes: (callback) => {
              parallel(shapesFetchers, callback);
            },
            stops: (callback) => {
              parallel(stopsFetchers, callback);
            }
          }, (err, results) => {
            if (err) return done(err);

            // trim the results based on what stops we have
            let stopIndexes = results.stops.map((s, idx) => [idx, s.length]).filter(pair => pair[1] != 0).map(pair => pair[0]);

            let filteredDirections = directions.filter((d, idx) => {
              return stopIndexes.indexOf(idx) != -1;
            })

            let filteredShapes = results.shapes.filter((d, idx) => {
              return stopIndexes.indexOf(idx) != -1;
            })

            let filteredStops = results.stops.filter((d, idx) => {
              return stopIndexes.indexOf(idx) != -1;
            })

            done(null, {
              directions: filteredDirections,
              shapes: filteredShapes,
              stops: filteredStops
            })
          });
        });
      });
    });
  }

  static getShape(shape_index, done) {
    const sql = `
      SELECT
        shape_pt_lat as latitude,
        shape_pt_lon as longitude,
        shape_pt_sequence as sequence
      FROM shapes
      WHERE shape_index = ${shape_index}
      ORDER BY shape_pt_sequence;
    `;

    Gtfs.executeSql(sql, done);
  }

  static getStopsAndSchedule(routeIndex, shapeIndex, serviceIds, closestStopIndex, now, done) {
    const sql = `
      SELECT
        DISTINCT(stop_times.stop_index),
        stop_name,
        stop_id,
        arrival_time,
        departure_time,
        departure_time_secs,
        arrival_time_secs,
        stop_sequence,
        stops.stop_lat as latitude,
        stops.stop_lon as longitude
      FROM stop_times
      JOIN stops ON stops.stop_index = stop_times.stop_index
      WHERE stop_times.trip_index = (
        SELECT
          stop_times.trip_index
        FROM stop_times
        JOIN stops ON stops.stop_index = stop_times.stop_index
        JOIN trips ON stop_times.trip_index = trips.trip_index
        WHERE trips.route_index = ${routeIndex} AND trips.shape_index = ${shapeIndex} AND trips.service_id IN (${serviceIds.join()})
        AND stops.stop_index = ${closestStopIndex} AND stop_times.departure_time_secs > ${now}
        ORDER BY stop_times.trip_index, stop_sequence
        LIMIT 1
      )
      ORDER BY stop_sequence;
    `;

    Gtfs.executeSql(sql, done);
  }

  // this gets the closes stop in each direction
  // TODO may need to support more than 2 directions
  static getClosestStops(routeIndex, directionIds, serviceIds, myLoc, done) {
    parallel([
      (callback) => {
        Gtfs.getClosestStop(routeIndex, directionIds[0], serviceIds, myLoc, callback);
      },
      (callback) => {
        Gtfs.getClosestStop(routeIndex, directionIds[1], serviceIds, myLoc, callback);
      },
    ], (err, results) => {
      if (err) return done(err);
      done(null, results)
    });
  }

  /**
   * We need to fetch the stops on this route/direction/service.
   * We can't compute the schedule yet so we just take the first
   * trip on the route and use those stops.
   */
  static getClosestStop(routeIndex, directionId, serviceIds, myLoc, done) {
    const sql = `
      SELECT
        DISTINCT(stop_times.stop_index),
        stop_sequence,
        stops.stop_lat as latitude,
        stops.stop_lon as longitude
      FROM stop_times
      JOIN stops ON stops.stop_index = stop_times.stop_index
      WHERE stop_times.trip_index = (
        SELECT
          trip_index
        FROM trips
        WHERE route_index = ${routeIndex} AND direction_id = ${directionId} AND service_id IN (${serviceIds.join()})
        LIMIT 1
      )
      ORDER BY stop_sequence;
    `;

    Gtfs.executeSql(sql, (err, results) => {
      let closest;
      let min = Number.MAX_VALUE;
      results.forEach(s => {
        let d = Utils.distance(myLoc, s);
        if (d < min) {
          closest = s;
          min = d;
        }
      })

      done(null, closest);
    });
  }

  static getStopSchedule(routeIndex, stopIndex, directionId, done) {
    let now = Gtfs.secsSinceMidnight();

    Gtfs.getServiceIds((err, serviceIds) => {
      if (err) return done(err);

      const sql = `
        SELECT
          stop_times.arrival_time_secs,
          stop_times.departure_time_secs
        FROM stop_times
        JOIN trips ON stop_times.trip_index = trips.trip_index
        WHERE
          stop_times.stop_index = ${stopIndex}
          AND stop_times.arrival_time_secs > ${now} - 3600
          AND trips.route_index = ${routeIndex}
          AND trips.direction_id = ${directionId}
          AND trips.service_id IN (${serviceIds.join()})
        ;
      `;

      Gtfs.executeSql(sql, done);
    });
  }

  static executeSql(sql, done) {
    console.log("Executing SQL: ", sql)
    NativeModules.Sqlite.executeSql(db, sql, function(results) {
      done(null, results.results)
    });
  }

  // TODO make util, and probably not right
  static secsSinceMidnight() {
    let d = new Date();
    let e = new Date(d);
    // let's use yesterday's midnight if
    // it's before 4AM. This is not perfect but
    // should catch many more edge cases
    // this logic is repeated in Utils.secsToDateTime
    if (e.getHours() <= 3) {
      e = new Date(e - (24 * 60 * 60 * 1000));
    }
    return Math.floor((d - e.setHours(0,0,0,0)) / 1000);
  }
}
