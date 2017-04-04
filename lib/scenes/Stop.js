import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Navigator,
  ListView,
  TouchableHighlight,
  Dimensions,
  Button,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import RouteShield from '../components/RouteShield';
import ScheduleBottomBar from '../components/ScheduleBottomBar';
import Gtfs from '../Gtfs';

const pluralize = (n, singular) => {
  n = Math.floor(n)

  if (n === 1) {
    return `${n} ${singular}`;
  } else {
    return `${n} ${singular}s`;
  }
}

const humanizeTime = (secs) => {
  if (secs < 60) {
    return pluralize(secs, 'sec');
  } else if (secs < 60*60) {
    return pluralize(secs / 60, 'min') + ' ' + humanizeTime(secs % 60);
  } else {
    return pluralize(secs / (60*60), 'hr') + ' ' + humanizeTime(secs % (60*60));
  }
}

const timeAway = (time) => {
  let now = new Date();
  let diffSecs = (time.getTime() - now.getTime()) / 1000;
  return humanizeTime(diffSecs);
}

const dateToString = (dt) => {
  let hour = dt.getHours();
  if (hour == 0 || hour == 24) {
    hour = 12;
  } else if (hour > 12) {
    hour = (hour - 12);
  }

  let min = dt.getMinutes();
  min = min < 10 ? "0" + min : min;

  return `${hour}:${min}`
}

export default class Stop extends Component {
  constructor(props) {
    super(props);

    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2
    });

    this.state = {
      dataSource: ds.cloneWithRowsAndSections([]),
      dayOfWeek: 'Sat',
      favorited: false
    }
  }
  componentDidMount() {
    const secsToDateTime = (secs) => {
      let midnight = new Date();
      midnight.setHours(0);
      midnight.setMinutes(0);
      midnight.setSeconds(0);
      midnight.setSeconds(secs);
      return midnight;
    }
    // TODO everything about this is gross
    const scheduleToMap = (schedule) => {
      let now = new Date();
      let map = {};
      schedule.forEach(s => {
        let dt = secsToDateTime(s.departure_time_secs);
        let hour = dt.getHours();
        // TODO gross
        let key;
        if (hour == 0 || hour == 24) {
          key = "12:00 AM";
        } else if (hour < 12) {
          key = hour + ":00 AM";
        } else if (hour == 12) {
          key = "12:00 PM";
        } else {
          key = (hour - 12) + ":00 PM";
        }

        // hilighted or no?
        s.upcoming = dt > now;
        s.datetime = dt;

        if (map[key]) {
          map[key].push(s);
        } else {
          map[key] = [s];
        }
      })

      return map;
    }

    Gtfs.getStopSchedule(this.props.route.route_index, this.props.stop.stop_index, this.props.direction.direction_id, (err, schedule) => {
      schedule = scheduleToMap(schedule);
      this.setState({
        dataSource: this.state.dataSource.cloneWithRowsAndSections(schedule)
      });

      let scrollTo = 0;
      let upoming = false;
      Object.keys(schedule).forEach(key => {
        let times = schedule[key];
        let itemsSkipped = 0;
        times.forEach(t => {
          upcoming = t.upcoming;
          if (!upcoming) itemsSkipped += 1;
        });
        scrollTo += (itemsSkipped * 45); // TODO figure out from stylesheet
        if (!upcoming) scrollTo += 20; // TODO figure out from stylesheet
      });
      this.listView.scrollTo({x: 0, y: scrollTo, animated: true})
    })
  }
  getCurrentTime() {
    let d = new Date();
    return `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`
  }
  onSchedulePress(rowId) {
    this.setState({timeSelected: parseInt(rowId, 10)});
  }
  onDayOfWeekChange(dayOfWeek) {
    // let scheduleIndex = 0;
    // if (dayOfWeek === 'Sat') scheduleIndex = 1;
    // if (dayOfWeek === 'Sun') scheduleIndex = 2;
    // this.setState({
    //   dayOfWeek: dayOfWeek,
    //   dataSource: this.state.dataSource.cloneWithRows(this.annotateSchedule(schedule[scheduleIndex]))
    // });
  }
  onFavChange() {
    this.setState({favorited: !this.state.favorited});
  }
  renderSectionHeader(sectionData, sectionId) {
    return (
      <View style={styles.ScheduleHourSection}>
        <Text>{sectionId}</Text>
      </View>
    );
  }
  renderRow(scheduleItem, secId, rowId) {
    let timeTil;
    if (scheduleItem.upcoming) {
      timeTil = <Text style={styles.ScheduleTimeAway}>{timeAway(scheduleItem.datetime)}</Text>
    }
    //let color = this.state.timeSelected == rowId ? '#ddd' : '#fff';
    // let alarmIcon;
    // if (this.state.timeSelected == rowId) {
    //   alarmIcon = <Icon name="bell-o" size={20} color="#9B5AA5" />
    //
    // }
    // <View style={{width: 40, paddingLeft: 10}}>
    //   {alarmIcon}
    // </View>
    return (
      <TouchableHighlight onPress={this.onSchedulePress.bind(this, rowId)}>
        <View style={styles.ScheduleListItem}>
          <View>
            <Text style={[styles.ScheduleTime, {color: scheduleItem.upcoming ? '#000' : '#aaa'}]}>{dateToString(scheduleItem.datetime)}</Text>
          </View>
          {timeTil}
        </View>
      </TouchableHighlight>
    )
  }
  render() {
    return (
      <View style={styles.Container}>
        <View style={styles.Stop}>
          <Text style={styles.StopName}>{this.props.stop.stop_name}</Text>
          <View style={styles.StopNumber}>
            <Text style={{fontWeight: 'bold', color: '#aaa'}}>#{this.props.stop.stop_id}</Text>
          </View>
        </View>
        <View style={[styles.Route, {backgroundColor: '#9B5AA5'}]}>
          <RouteShield
            backgroundColor='#fff'
            textColor='#000'
            number='11'
          />
          <Text style={[styles.RouteName, {color: '#fff'}]}>{this.props.direction.trip_headsign}</Text>
        </View>
        <ListView
          ref={lv => { this.listView = lv }}
          style={styles.Schedule}
          dataSource={this.state.dataSource}
          renderRow={this.renderRow.bind(this)}
          renderSectionHeader={this.renderSectionHeader.bind(this)}
        />
        <ScheduleBottomBar
          dayOfWeek={this.state.dayOfWeek}
          onDayOfWeekPress={this.onDayOfWeekChange.bind(this)}
          favorited={this.state.favorited}
          onFavPress={this.onFavChange.bind(this)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
  },
  Stop: {
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  StopName: {
    fontSize: 18,
  },
  StopNumber: {
    flex: 1,
    alignItems: 'flex-end'
  },
  Route: {
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  RouteName: {
    fontSize: 18,
    paddingLeft: 10
  },
  Schedule: {

  },
  ScheduleHourSection: {
    backgroundColor: '#eee',
    justifyContent: 'center',
    padding: 7,
    height: 20,
  },
  ScheduleListItem: {
    height: 45,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
  },
  ScheduleTime: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  ScheduleTimeAway: {
    fontSize: 16,
    color: '#aaa',
    paddingLeft: 10
  },
});
