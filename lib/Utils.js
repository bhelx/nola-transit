import tinycolor from 'tinycolor2';

export default class Utils {
  /**
   * Returns the `n` given with the naive plural
   * example:
   *
   * > pluralize(5, 'min')
   * 5 mins
   */
  static pluralize(n, singular) {
    n = Math.floor(n)
    if (n === 1) {
      return `${n} ${singular}`;
    } else {
      return `${n} ${singular}s`;
    }
  }

  /**
   * Turns the timeAway data structure into a string
   * given some rules. Tries to make it as human sounding
   * as possible.
   */
  static timeAwayToString(timeAway) {
    if (timeAway.hours) {
      if (timeAway.mins > 0) {
        return `${Utils.pluralize(timeAway.hours, 'hour')} ${Utils.pluralize(timeAway.mins, 'min')}`;
      } else {
        return Utils.pluralize(timeAway.hours, 'hour');
      }
    } else if (timeAway.mins) {
      if (timeAway.secs > 0 && timeAway.mins < 10) {
        return `${Utils.pluralize(timeAway.mins, 'min')} ${Utils.pluralize(timeAway.secs, 'sec')}`;
      } else {
        return Utils.pluralize(timeAway.mins, 'min');
      }
    } else {
      return Utils.pluralize(timeAway.secs, 'sec');
    }
  }

  /**
   * Turns seconds into a data structure to humaize the results:
   * example:
   *
   * > toTimeAway(100000)
   * { hours: 27, mins: 46, secs: 40 }
   */
  static toTimeAway(secs) {
    if (secs < 60) {
      return {secs: Math.floor(secs)};
    } else if (secs < 60*60) {
      let mins = Math.floor(secs / 60);
      let remainder = secs % 60;
      return Object.assign({mins: mins}, Utils.toTimeAway(remainder));
    } else {
      let hours = Math.floor(secs / (60 * 60));
      let remainder = secs % (60*60);
      return Object.assign({hours: hours}, Utils.toTimeAway(remainder));
    }
  }

  static humanizeTimeAway(time) {
    let now = new Date();
    let diffSecs = (time.getTime() - now.getTime()) / 1000;
    let timeAway = Utils.toTimeAway(diffSecs);
    return Utils.timeAwayToString(timeAway);
  }

  static dateToString(dt, period) {
    let hour = dt.getHours();
    let ampm = '';
    if (period) {
      ampm = hour >= 12 ? ' PM' : ' AM';
    }

    if (hour == 0 || hour == 24) {
      hour = 12;
    } else if (hour > 12) {
      hour = (hour - 12);
    }

    let min = dt.getMinutes();
    min = min < 10 ? "0" + min : min;

    return `${hour}:${min}${ampm}`
  }

  static secsToDateTime(secs) {
    let midnight = new Date();
    // let's use yesterday's midnight if
    // it's before 4AM. This is not perfect but
    // should catch many more edge cases
    // this logic is repeated in Gtfs.secsSinceMidnight
    if (midnight.getHours() <= 3) {
      midnight = new Date(midnight - (24 * 60 * 60 * 1000));
    }
    midnight.setHours(0);
    midnight.setMinutes(0);
    midnight.setSeconds(0);
    midnight.setSeconds(secs);
    return midnight;
  }

  /**
   * Distance b/w 2 lat lng coords. Doesn't need to be haversine
   * since this is all within walking distance.
   */
  static distance(a, b) {
    return Math.sqrt(Math.pow(a.latitude - b.latitude, 2) + Math.pow(a.longitude - b.longitude, 2));
  }

  /**
   * Given a route with a `route_color` property,
   * return a hex string color. We'll apply
   * some transforms to it to make it readable with
   * a white text color.
   */
  static colorForRoute(route) {
    let bgColor = tinycolor(route.route_color);
    // desaturate and darken if it's not readable with white text
    if (tinycolor.readability(bgColor, '#fff') < 3) {
      bgColor = bgColor.desaturate().darken();
    }
    return bgColor.toHexString();
  }

}
