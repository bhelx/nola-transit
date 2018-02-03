import Gtfs from './Gtfs';
import Utils from './Utils';

export default class StopFinder {
  constructor() {
    this.lastUpdated = null;
    this.index = null;
  }

  /**
   * Updates the index. Will return immediately if
   * it's already loaded.
   * TODO will want to intelligently reload this. It only
   * needs to be reloaded when the database is reloaded so
   * this should be fine for now.
   */
  updateIndex(done) {
    if (!this.index) {
      console.log("indexing stops");
      Gtfs.getAllStops((err, results) => {
        if (err) return done(err);
        console.log("got all stops from database");

        this.index = {};
        results.forEach(stop => {
          let key = stop.stop_index;
          if (this.index[key]) {
            this.index[key].routes.push(stop.route_index);
          } else {
            this.index[key] = {
              latitude: stop.latitude,
              longitude: stop.longitude,
              index: stop.stop_index,
              routes: [stop.route_index]
            };
          }
        });
        console.log("done indexing stops");
        done(null);
      });
    } else {
      done(null);
    }
  }

  /**
   * Gives you the closest stops per route. The result
   * is a sorted array of this schema:
   * [routeIndex(integer), stop({latitude(float), longitude(float), index(int), routes(array)})]
   */
  getClosestStops(latlng, done) {
    this.updateIndex(() => {
      // map of route_index -> closest_stop_index
      let index = Object.values(this.index);
      index = index.sort((a, b) => {
        return Utils.distance(latlng, a) - Utils.distance(latlng, b)
      });

      let closestIndex = {};
      let closest = [];
      closest.forEach(stop => {
        stop.routes.forEach(route_index => {
          if (!closestIndex[route_index]) {
            closestIndex[route_index] = true;
            closest.push([route_index, stop])
          }
        });
      })

      done(null, results);
    })
  }
}
