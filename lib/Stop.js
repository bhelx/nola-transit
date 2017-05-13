/**
 * Stop Screen
 * Shows the schedule for a particular stop.
 *
 * @flow
 */
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ListView,
  TouchableOpacity,
  Dimensions,
  Button,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import RouteShield from './shared/RouteShield';
import ScheduleBottomBar from './stop/BottomBar';
import Gtfs from './Gtfs';
import Utils from './Utils';

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
  static navigationOptions = {
    title: 'Stop',
  };
  componentDidMount() {
    // TODO everything about this is gross
    const scheduleToMap = (schedule) => {
      let now = new Date();
      let map = {};
      schedule.forEach(s => {
        let dt = Utils.secsToDateTime(s.departure_time_secs);
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

    let stop = this.props.navigation.state.params.stop;
    let route = this.props.navigation.state.params.route;
    let direction = this.props.navigation.state.params.direction;

    Gtfs.getStopSchedule(route.route_index, stop.stop_index, direction.direction_id, (err, schedule) => {
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
        if (!upcoming) scrollTo += (itemsSkipped * 45); // TODO figure out from stylesheet
        if (!upcoming) scrollTo += 20; // TODO figure out from stylesheet
      });
      this.listView.scrollTo({x: 0, y: scrollTo, animated: true})
    })
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
        <Text style={styles.ScheduleHourSectionText}>{sectionId}</Text>
      </View>
    );
  }
  renderRow(scheduleItem, secId, rowId) {
    let timeTil;
    let alarmIcon;
    if (scheduleItem.upcoming) {
      timeTil = <Text style={styles.ScheduleTimeAway}>{Utils.humanizeTimeAway(scheduleItem.datetime)}</Text>
      alarmIcon = <Icon name="bell-o" size={20} color="#9B5AA5" />
    }

    // <View style={{width: 40, paddingLeft: 10}}>
    //   {alarmIcon}
    // </View>
    return (
      <TouchableOpacity onPress={this.onSchedulePress.bind(this, rowId)}>
        <View style={styles.ScheduleListItem}>
          <View>
            <Text style={[styles.ScheduleTime, {color: scheduleItem.upcoming ? '#000' : '#aaa'}]}>{Utils.dateToString(scheduleItem.datetime, true)}</Text>
          </View>
          {timeTil}
          <View style={styles.ScheduleListItemAlarm}>
            {alarmIcon}
          </View>
        </View>
      </TouchableOpacity>
    )
  }
  render() {
    let stop = this.props.navigation.state.params.stop;
    let direction = this.props.navigation.state.params.direction;
    let route = this.props.navigation.state.params.route;
    let color = Utils.colorForRoute(route);
    return (
      <View style={styles.Container}>
        <View style={styles.Stop}>
          <Text style={styles.StopName}>{stop.stop_name}</Text>
          <View style={styles.StopNumber}>
            <Text style={{fontWeight: 'bold', color: '#aaa'}}>#{stop.stop_id}</Text>
          </View>
        </View>
        <View style={[styles.Route, {backgroundColor: color}]}>
          <RouteShield
            backgroundColor='#fff'
            textColor='#000'
            number={route.route_short_name}
          />
          <View style={styles.RouteName}>
            <Text
              ellipse="tail"
              numberOfLines={1}
              style={[styles.RouteNameText, {color: '#fff'}]}>
                {direction.trip_headsign}
            </Text>
          </View>
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
          color={color}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: '#fff',
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
    flex: 1
  },
  RouteNameText: {
    fontSize: 18,
    paddingLeft: 10
  },
  Schedule: {

  },
  ScheduleHourSection: {
    backgroundColor: '#ececec',
    justifyContent: 'center',
    padding: 7,
    height: 20,
  },
  ScheduleHourSectionText: {
    color: '#888',
  },
  ScheduleListItem: {
    height: 45,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 20,
  },
  ScheduleTime: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  ScheduleTimeAway: {
    fontSize: 16,
    color: '#aaa',
    paddingLeft: 10
  },
  ScheduleListItemAlarm: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 15,
  },
});
