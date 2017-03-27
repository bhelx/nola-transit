import {
  DeviceEventEmitter,
  NativeModules,
} from 'react-native';

const db = 'gtfs.sqlite';

export default class Gtfs {

  static getRoutes(done) {
    const sql = `
      SELECT
        route_short_name,
        route_long_name,
        route_type,
        route_color,
        route_text_color
      FROM routes
      ORDER BY route_index;
    `;

    NativeModules.Sqlite.executeSql(db, sql, function(results) {
      done(null, results.results)
    });
  }

  // static getRouteAndShapes(route_index, done) {
  //   const sql = `
  //     SELECT
  //       route_short_name,
  //       route_long_name,
  //       route_type,
  //       route_color,
  //       route_text_color
  //     FROM routes
  //     ORDER BY route_index;
  //   `;
  //
  //   NativeModules.Sqlite.executeSql(db, sql, function(results) {
  //     done(null, results.results)
  //   });
  // }
}
