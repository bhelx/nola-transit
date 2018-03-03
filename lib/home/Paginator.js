import GtfsIndex from '../GtfsIndex';
import Gtfs from '../Gtfs';

const ROUTE_PER_PAGE = 10;

export default class Paginator {
  constructor(coords) {
    this.gtfsIndex = new GtfsIndex();
    this.coords = coords;
    this.routeList = [];
  }

  getNextPageOfEntryPoints(done) {
    this.gtfsIndex.getClosestEntryPoints(this.coords, (err, epIndex) => {
      if (err) return done(err);
      let routeList = epIndex.routeList.slice(0, this.routeList.length + ROUTE_PER_PAGE);
      Gtfs.getHomePageInfo(epIndex, this.coords, routeList, (err, routes) => {
        if (err) return done(err);
        console.log("getnextpageofentrypoints");
        this.routeList = routeList;
        done(null, routes);
      });
    });
  }

  getNextTickOfEntryPoints(done) {
    this.gtfsIndex.getClosestEntryPoints(this.coords, (err, epIndex) => {
      if (err) return done(err);
      if (this.routeList.length == 0) {
        this.routeList = epIndex.routeList.slice(0, ROUTE_PER_PAGE);
      }
      Gtfs.getHomePageInfo(epIndex, this.coords, this.routeList, (err, routes) => {
        if (err) return done(err);
        console.log("getnexttickofentrypoints");
        done(null, routes);
      });
    });
  }
}
