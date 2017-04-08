export default class Utils {
  static pluralize(n, singular) {
    n = Math.floor(n)
    if (n === 1) {
      return `${n} ${singular}`;
    } else {
      return `${n} ${singular}s`;
    }
  }

  static timeAwayToString(timeAway) {
    if (timeAway.hours) {
      return Utils.pluralize(timeAway.hours, 'hour');
    } else if (timeAway.mins) {
      if (timeAway.secs > 0) {
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
}
