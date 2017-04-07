export default class Utils {
  static pluralize(n, singular) {
    n = Math.floor(n)

    if (n === 1) {
      return `${n} ${singular}`;
    } else {
      return `${n} ${singular}s`;
    }
  }

  static humanizeSecs(secs) {
    if (secs < 60) {
      return Utils.pluralize(secs, 'sec');
    } else if (secs < 60*60) {
      return Utils.pluralize(secs / 60, 'min') + ' ' + Utils.humanizeSecs(secs % 60);
    } else {
      return Utils.pluralize(secs / (60*60), 'hr') + ' ' + Utils.humanizeSecs(secs % (60*60));
    }
  }

  static humanizeTimeAway(time) {
    let now = new Date();
    let diffSecs = (time.getTime() - now.getTime()) / 1000;
    return Utils.humanizeSecs(diffSecs);
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
}
