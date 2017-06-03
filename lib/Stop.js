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
import PushNotification from 'react-native-push-notification';

import RouteShield from './shared/RouteShield';
import BottomBar from './stop/BottomBar';
import ReminderModal from './stop/ReminderModal';
import Gtfs from './Gtfs';
import Utils from './Utils';

export default class Stop extends Component {
  constructor(props) {
    super(props);

    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    });

    this.state = {
      dataSource: ds.cloneWithRowsAndSections([]),
      favorited: false,
      isReminderModalVisible: false,
      chosenScheduleItem: null,
    };
  }
  static navigationOptions = {
    title: 'Stop',
  };
  componentDidMount() {
    // TODO everything about this is gross
    const scheduleToMap = schedule => {
      let now = new Date();
      let map = {};
      schedule.forEach(s => {
        let dt = Utils.secsToDateTime(s.departure_time_secs);
        let hour = dt.getHours();
        // TODO gross
        let key;
        if (hour == 0 || hour == 24) {
          key = '12:00 AM';
        } else if (hour < 12) {
          key = hour + ':00 AM';
        } else if (hour == 12) {
          key = '12:00 PM';
        } else {
          key = hour - 12 + ':00 PM';
        }

        // hilighted or no?
        s.upcoming = dt > now;
        s.datetime = dt;

        if (map[key]) {
          map[key].push(s);
        } else {
          map[key] = [s];
        }
      });

      return map;
    };

    let stop = this.props.navigation.state.params.stop;
    let route = this.props.navigation.state.params.route;
    let direction = this.props.navigation.state.params.direction;

    Gtfs.getStopSchedule(
      route.route_index,
      stop.stop_index,
      direction.direction_id,
      (err, schedule) => {
        schedule = scheduleToMap(schedule);
        this.setState({
          dataSource: this.state.dataSource.cloneWithRowsAndSections(schedule),
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
          if (!upcoming) scrollTo += itemsSkipped * 45; // TODO figure out from stylesheet
          if (!upcoming) scrollTo += 20; // TODO figure out from stylesheet
        });
        this.listView.scrollTo({ x: 0, y: scrollTo, animated: true });
      }
    );
  }

  _showModal = scheduleItem =>
    this.setState({
      chosenScheduleItem: scheduleItem,
      isReminderModalVisible: true,
    });
  _hideModal = () => this.setState({ isReminderModalVisible: false });

  onSchedulePress(scheduleItem) {
    this._showModal(scheduleItem);
  }
  scheduleNotification(time, mins) {
    let stop = this.props.navigation.state.params.stop;
    let route = this.props.navigation.state.params.route;
    let msg = `Your #${route.route_short_name} bus will be at ${stop.stop_name} in ${mins} minutes!`;
    console.log('Scheduling notification for ', time);
    console.log('msg: ', msg);
    PushNotification.localNotificationSchedule({
      number: 0,
      message: msg, // (required)
      date: new Date(time), // time ms before the scheduled time
      vibrate: true,
    });
    this._hideModal();
  }
  onFavChange() {
    this.setState({ favorited: !this.state.favorited });
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
      timeTil = (
        <Text style={styles.ScheduleTimeAway}>
          {Utils.humanizeTimeAway(scheduleItem.datetime)}
        </Text>
      );
      alarmIcon = <Icon name="bell-o" size={20} color="black" />;
    }

    return (
      <TouchableOpacity onPress={this.onSchedulePress.bind(this, scheduleItem)}>
        <View style={styles.ScheduleListItem}>
          <View>
            <Text
              style={[
                styles.ScheduleTime,
                { color: scheduleItem.upcoming ? '#000' : '#aaa' },
              ]}
            >
              {Utils.dateToString(scheduleItem.datetime, true)}
            </Text>
          </View>
          {timeTil}
          <View style={styles.ScheduleListItemAlarm}>
            {alarmIcon}
          </View>
        </View>
      </TouchableOpacity>
    );
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
            <Text style={{ fontWeight: 'bold', color: '#aaa' }}>
              #{stop.stop_id}
            </Text>
          </View>
        </View>
        <View style={[styles.Route, { backgroundColor: color }]}>
          <RouteShield
            backgroundColor="#fff"
            textColor="#000"
            number={route.route_short_name}
          />
          <View style={styles.RouteName}>
            <Text
              ellipse="tail"
              numberOfLines={1}
              style={[styles.RouteNameText, { color: '#fff' }]}
            >
              {direction.trip_headsign}
            </Text>
          </View>
        </View>
        <ListView
          ref={lv => {
            this.listView = lv;
          }}
          style={styles.Schedule}
          dataSource={this.state.dataSource}
          renderRow={this.renderRow.bind(this)}
          renderSectionHeader={this.renderSectionHeader.bind(this)}
        />
        <BottomBar
          favorited={this.state.favorited}
          onFavPress={this.onFavChange.bind(this)}
          color={color}
        />
        <ReminderModal
          isVisible={this.state.isReminderModalVisible}
          scheduleItem={this.state.chosenScheduleItem}
          scheduleNotification={this.scheduleNotification.bind(this)}
          cancelNotification={this._hideModal.bind(this)}
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
    alignItems: 'flex-end',
  },
  Route: {
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  RouteName: {
    flex: 1,
  },
  RouteNameText: {
    fontSize: 18,
    paddingLeft: 10,
  },
  Schedule: {},
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
    paddingLeft: 10,
  },
  ScheduleListItemAlarm: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 15,
  },
});
