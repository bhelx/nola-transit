import {
  DeviceEventEmitter,
  NativeModules,
} from 'react-native';

import parallel from 'async/parallel';

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
        AND trip_headsign != ''
        ORDER BY direction_id;
      `;

      Gtfs.executeSql(sql, (err, results) => {
        const directions = results;
        const d0 = directions[0];
        const d1 = directions[1];

        Gtfs.getClosestStops(routeIndex, [d0.direction_id, d1.direction_id], serviceIds, myLoc, (err, closestStops) => {
          let now = Gtfs.secsSinceMidnight();

          parallel({
            d0Shapes: (callback) => {
              Gtfs.getShape(d0.shape_index, callback);
            },
            d1Shapes: (callback) => {
              Gtfs.getShape(d1.shape_index, callback);
            },
            d0Stops: (callback) => {
              Gtfs.getStopsAndSchedule(routeIndex, d0.direction_id, serviceIds, closestStops[0].stop_index, now, callback);
            },
            d1Stops: (callback) => {
              Gtfs.getStopsAndSchedule(routeIndex, d1.direction_id, serviceIds, closestStops[1].stop_index, now, callback);
            },
          }, (err, results) => {
            if (err) return done(err);

            done(null, {
              directions: directions,
              shapes: [results.d0Shapes, results.d1Shapes],
              stops: [results.d0Stops, results.d1Stops]
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

  static getStopsAndSchedule(routeIndex, directionId, serviceIds, closestStopIndex, now, done) {
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
        WHERE trips.route_index = ${routeIndex} AND trips.direction_id = ${directionId} AND trips.service_id IN (${serviceIds.join()})
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
      results.sort((s1, s2) => {
        let d1 = Math.sqrt(Math.pow(myLoc.latitude - s1.latitude, 2) + Math.pow(myLoc.longitude - s1.longitude, 2));
        let d2 = Math.sqrt(Math.pow(myLoc.latitude - s2.latitude, 2) + Math.pow(myLoc.longitude - s2.longitude, 2));
        if (d1 < d2) return -1;
        if (d1 > d2) return 1;
        return 0;
      });

      done(null, results[0]);
    });
  }

  static getStopSchedule(routeIndex, stopIndex, directionId, done) {
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
          AND trips.route_index = ${routeIndex}
          AND trips.direction_id = ${directionId}
          AND trips.service_id IN (${serviceIds.join()})
        ;
      `;

      Gtfs.executeSql(sql, done);
    });
  }

  static getClosestStopsAndTimes(lon, lat, done) {
    const sql = `
      -- find closest stops and upcoming times for each trip in both directions
      SELECT
        DISTINCT(s.stop_index), s.stop_name,
        st.arrival_time, st.departure_time,
        r.route_short_name, r.route_long_name, r.route_text_color, r.route_type,
        t.direction_id, t.trip_headsign,
        strftime('%s','now') - strftime('%s','now', 'start of day') AS seconds_since_today_started
      FROM stops s
      JOIN stop_times st ON s.stop_index = st.stop_index
      JOIN trips t ON st.trip_index = t.trip_index
      JOIN routes r ON t.route_index = r.route_index
      WHERE
        -- stops near me
        s.stop_lon > (${lon} - .005) AND s.stop_lon < (${lon} + .005)
        AND
        s.stop_lat < (${lat} + .005)  AND s.stop_lat > (${lat} - .005)
        AND
        -- arrivals & departures 1 hour (3600 seconds) into the future
        st.arrival_time_secs  > seconds_since_today_started  AND st.departure_time_secs > seconds_since_today_started
        AND
        st.arrival_time_secs < (st. arrival_time_secs + 3600) AND st.departure_time_secs < (st. departure_time_secs + 3600)
    `;

    Gtfs.executeSql(sql, done);
  }

static executeSql(sql, done) {
  console.log("Executing SQL: ", sql)
  let t0 = performance.now();
  NativeModules.Sqlite.executeSql(db, sql, function(results) {
    console.log("SQL done in " + (performance.now() - t0) + " milliseconds.");
    done(null, results.results)
  });
}

  // TODO make util, and probably not right
  static secsSinceMidnight() {
    var d = new Date();
    var e = new Date(d);
    return Math.floor((d - e.setHours(0,0,0,0)) / 1000);
  }
}
