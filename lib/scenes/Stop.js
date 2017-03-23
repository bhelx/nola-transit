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

import RouteShield from '../components/RouteShield';
import ScheduleBottomBar from '../components/ScheduleBottomBar';

const schedule = [
  {time: "01:00am"},
  {time: "02:00am"},
  {time: "03:00am"},
  {time: "04:00am", next: true, timeAway: "8 mins"},
  {time: "05:00am", next: true, timeAway: "27 mins"},
  {time: "06:00am"},
  {time: "07:00am"},
  {time: "08:00am"},
  {time: "09:00am"},
  {time: "10:00am"},
  {time: "11:00am"},
  {time: "12:00pm"},
  {time: "01:00pm"},
  {time: "02:00pm"},
  {time: "04:00pm"},
  {time: "05:00pm"},
  {time: "06:00pm"},
  {time: "07:00pm"},
  {time: "08:00pm"},
  {time: "09:00pm"},
  {time: "10:00pm"},
]

export default class Stop extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows(schedule),
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
    return (
      <TouchableHighlight onPress={this.onSchedulePress.bind(this, rowId)}>
        <View style={[styles.ScheduleListItem, {backgroundColor: color}]}>
          <View style={{width: 40}}></View>
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
            <Text>#152</Text>
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
