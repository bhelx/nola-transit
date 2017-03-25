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

export default class Stop extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows(schedule[1]),
      dayOfWeek: 'Sat',
      timeSelected: 3,
      favorited: false
    }
  }
  onSchedulePress(rowId) {
    this.setState({timeSelected: parseInt(rowId, 10)});
  }
  onDayOfWeekChange(dayOfWeek) {
    this.setState({dayOfWeek: dayOfWeek});
  }
  onFavChange() {
    this.setState({favorited: !this.state.favorited});
  }
  renderRow(scheduleItem, secId, rowId) {
    var timeAway;
    if (scheduleItem.next) {
      timeAway = <Text style={styles.ScheduleTimeAway}>{scheduleItem.timeAway}</Text>
    }
    let color = this.state.timeSelected == rowId ? '#ddd' : '#fff';
    let alarmIcon;
    if (this.state.timeSelected == rowId) {
      alarmIcon = <Icon name="bell-o" size={20} color="#9B5AA5" />

    }
    return (
      <TouchableHighlight onPress={this.onSchedulePress.bind(this, rowId)}>
        <View style={[styles.ScheduleListItem, {backgroundColor: color}]}>
          <View style={{width: 40, paddingLeft: 10}}>
            {alarmIcon}
          </View>
          <View >
            <Text style={styles.ScheduleTime}>{scheduleItem.time}</Text>
          </View>
          {timeAway}
        </View>
      </TouchableHighlight>
    )
  }
  render() {
    return (
      <View style={styles.Container}>
        <View style={styles.Stop}>
          <Text style={styles.StopName}>Magazine at Washington</Text>
          <View style={styles.StopNumber}>
            <Text style={{fontWeight: 'bold', color: '#aaa'}}>#152</Text>
          </View>
        </View>
        <View style={[styles.Route, {backgroundColor: '#9B5AA5'}]}>
          <RouteShield
            backgroundColor='#fff'
            textColor='#000'
            number='11'
          />
          <Text style={[styles.RouteName, {color: '#fff'}]}>To Audobon Zoo</Text>
        </View>
        <ListView
          style={styles.Schedule}
          dataSource={this.state.dataSource}
          renderRow={this.renderRow.bind(this)}
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
  ScheduleListItem: {
    height: 45,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
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

const schedule= [
  [
    {time: "5:41:26"},
    {time: "6:11:26"},
    {time: "6:41:26"},
    {time: "6:56:26"},
    {time: "7:11:26"},
    {time: "7:26:26"},
    {time: "7:41:26"},
    {time: "7:56:26"},
    {time: "8:11:26"},
    {time: "8:26:26"},
    {time: "8:41:26"},
    {time: "8:56:26"},
    {time: "9:11:26"},
    {time: "9:26:26"},
    {time: "9:41:26"},
    {time: "9:56:26"},
    {time: "10:11:26"},
    {time: "10:31:26"},
    {time: "10:51:26"},
    {time: "11:11:26"},
    {time: "11:31:26"},
    {time: "11:51:26"},
    {time: "12:11:26"},
    {time: "12:31:26"},
    {time: "12:51:26"},
    {time: "13:11:26"},
    {time: "13:31:26"},
    {time: "13:51:26"},
    {time: "14:11:26"},
    {time: "14:31:26"},
    {time: "14:51:26"},
    {time: "15:11:26"},
    {time: "15:31:26"},
    {time: "15:51:26"},
    {time: "16:11:26"},
    {time: "16:31:26"},
    {time: "16:51:26"},
    {time: "17:11:26"},
    {time: "17:31:26"},
    {time: "17:51:26"},
    {time: "18:11:26"},
    {time: "18:31:26"},
    {time: "18:51:26"},
    {time: "19:09:26"},
    {time: "19:29:26"},
    {time: "19:59:26"},
    {time: "20:29:26"},
    {time: "20:59:26"},
    {time: "21:29:26"},
    {time: "22:29:26"},
    {time: "23:29:26"},
    {time: "24:29:26"},
  ],
  [
    {time: "5:49:26"},
    {time: "6:50:26"},
    {time: "7:50:26"},
    {time: "8:20:26"},
    {time: "8:50:26"},
    {time: "9:20:26"},
    {time: "9:50:26"},
    {time: "10:23:26"},
    {time: "10:43:26"},
    {time: "11:13:26"},
    {time: "11:33:26"},
    {time: "11:53:26"},
    {time: "12:23:26"},
    {time: "12:43:26"},
    {time: "13:03:26"},
    {time: "13:33:26"},
    {time: "13:53:26"},
    {time: "14:13:26"},
    {time: "14:43:26"},
    {time: "15:03:26"},
    {time: "15:23:26"},
    {time: "15:53:26"},
    {time: "16:13:26"},
    {time: "16:33:26"},
    {time: "17:03:26"},
    {time: "17:23:26"},
    {time: "17:43:26"},
    {time: "18:13:26"},
    {time: "18:31:26"},
    {time: "18:56:26"},
    {time: "19:25:26"},
    {time: "19:55:26"},
    {time: "20:25:26"},
    {time: "21:24:26"},
    {time: "22:24:26"},
    {time: "23:24:26"},
    {time: "24:24:26"},
  ],
  [
    {time: "5:49:26"},
    {time: "6:50:26"},
    {time: "7:50:26"},
    {time: "8:20:26"},
    {time: "8:50:26"},
    {time: "9:20:26"},
    {time: "9:50:26"},
    {time: "10:23:26"},
    {time: "10:43:26"},
    {time: "11:13:26"},
    {time: "11:33:26"},
    {time: "11:53:26"},
    {time: "12:23:26"},
    {time: "12:43:26"},
    {time: "13:03:26"},
    {time: "13:33:26"},
    {time: "13:53:26"},
    {time: "14:13:26"},
    {time: "14:43:26"},
    {time: "15:03:26"},
    {time: "15:23:26"},
    {time: "15:53:26"},
    {time: "16:13:26"},
    {time: "16:33:26"},
    {time: "17:03:26"},
    {time: "17:23:26"},
    {time: "17:43:26"},
    {time: "18:13:26"},
    {time: "18:31:26"},
    {time: "18:56:26"},
    {time: "19:25:26"},
    {time: "19:55:26"},
    {time: "20:25:26"},
    {time: "21:24:26"},
    {time: "22:24:26"},
    {time: "23:24:26"},

  ]
]
