import Gtfs from './Gtfs';
import Utils from './Utils';
import { AsyncStorage } from 'react-native';

/**
 * The `this.index` has the schema:
 * index[route_index][trip_headsign] = closestStop;
 *
 * The `this.routeList` is the ordered preserved list
 * of routes (from closest to furthest).
 */
class EntryPointIndex {
  constructor() {
    this.index = {};
    this.routeList = []; // stays sorted
  }

  addPoint(point) {
    let route = point.route_index;
    let headsign = point.trip_headsign;
    if (this.routeList.indexOf(route) == -1) {
      this.routeList.push(route);
    }
    let routeIdx = this.index[route];
    if (!routeIdx) {
      let headsigns = {};
      headsigns[headsign] = point;
      this.index[route] = {headsigns: headsigns};
    } else {
      if (!routeIdx.headsigns[headsign]) {
        routeIdx.headsigns[headsign] = point;
      }
    }
  }
}

export default class GtfsIndex {
  constructor() {
    this.lastUpdated = null;
    this.index = null;
    this.entryPoints = null;
  }

  isLoaded() {
    return !!this.index;
  }

  /**
   * Updates the index. Will return immediately if
   * it's already loaded.
   *
   * TODO will want to intelligently reload this. It only
   * needs to be reloaded when the database is reloaded so
   * this should be fine for now.
   */
  updateIndex(done) {
    if (this.index) return done(null);

    AsyncStorage.getItem('@NolaTransit:stopIndex', (err, val) => {
      if (!val) {
        console.log("indexing gtfs entry points");
        Gtfs.getAllEntryPoints((err, points) => {
          if (err) return done(err);
          console.log("got all entry points from database");
          this.index = points;
          AsyncStorage.setItem('@NolaTransit:stopIndex', JSON.stringify(this.index));
          console.log(this.index);
          console.log("stored entry points and terminating");
          done(null);
        });
      } else {
        console.log("pulled entry points from storage and parsed");
        this.index = JSON.parse(val);
        done(null);
      }
    });
  }

  /**
   * Gives you the closest stops per route. The result
   * is a sorted array of this schema:
   * [routeIndex(integer), stop({})]
   */
  getClosestEntryPoints(latlng, done) {
    this.updateIndex(() => {
      // TODO need to break this cache when location changes
      if (!this.entryPoints) {
        let index = this.index;
        index = index.sort((a, b) => {
          return Utils.distance(latlng, a) - Utils.distance(latlng, b)
        });

        let results = new EntryPointIndex();
        index.forEach(point => {
          results.addPoint(point);
        })

        this.entryPoints = results;
      }

      done(null, this.entryPoints);
    })
  }
}
