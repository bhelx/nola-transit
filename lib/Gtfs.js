import {
  DeviceEventEmitter,
  NativeModules,
} from 'react-native';

import parallel from 'async/parallel';

const db = 'gtfs.sqlite';

export default class Gtfs {

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

  static getRouteInfo(route_index, now, done) {
    console.log('s since midnight ', now)
    const sql = `
      SELECT
        DISTINCT(direction_id),
        trip_headsign,
        shape_index
      FROM trips
      WHERE route_index = ${route_index}
      ORDER BY direction_id;
    `;

    Gtfs.executeSql(sql, (err, results) => {
      let directions = results;
      let d0 = directions[0];
      let d1 = directions[1];

      parallel({
        d0_shapes: (callback) => {
          Gtfs.getShape(d0.shape_index, callback);
        },
        d1_shapes: (callback) => {
          Gtfs.getShape(d1.shape_index, callback);
        },
        d0_stops: (callback) => {
          Gtfs.getStops(route_index, d0.direction_id, now, callback);
        },
        d1_stops: (callback) => {
          Gtfs.getStops(route_index, d1.direction_id, now, callback);
        },
      }, (err, results) => {
        if (err) return done(err);

        done(null, {
          directions: directions,
          shapes: [results.d0_shapes, results.d1_shapes],
          stops: [results.d0_stops, results.d1_stops]
        })
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

  static getStops(route_index, direction_id, now, done) {
    const sql = `
      SELECT
        DISTINCT(stop_times.stop_index),
        stop_name,
        arrival_time,
        departure_time,
        stop_sequence,
        stops.stop_lat as latitude,
        stops.stop_lon as longitude
      FROM stop_times
      JOIN stops ON stops.stop_index = stop_times.stop_index
      WHERE stop_times.trip_index IN (
        SELECT
          trip_index
        FROM trips
        WHERE route_index = ${route_index} AND direction_id = ${direction_id} AND service_id = 1
        LIMIT 1
      )
      ORDER BY stop_sequence;
    `;

    Gtfs.executeSql(sql, done);
  }

  static executeSql(sql, done) {
    console.log("Executing SQL: ", sql)
    NativeModules.Sqlite.executeSql(db, sql, function(results) {
      done(null, results.results)
    });
  }
}
