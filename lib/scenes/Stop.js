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
    }
  }
  renderRow(scheduleItem) {
    var timeAway;
    if (scheduleItem.next) {
      timeAway = <Text style={{paddingLeft: 10}}>{scheduleItem.timeAway}</Text>
    }
    return (
      <View style={styles.ScheduleListItem}>
        <View style={{width: 40}}></View>
        <View >
          <Text>{scheduleItem.time}</Text>
        </View>
        {timeAway}
      </View>
    )
  }
  render() {
    return (
      <View style={styles.Container}>
        <View style={styles.Stop}>
          <Text>Magazine at Washington</Text>
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
        <View style={styles.BottomToolbar}>
          <Button
            title="Weekday"
            color="#9B5AA5"
          />
          <Button
            title="Sat"
            color="#9B5AA5"
          />
          <Button
            title="Sun"
            color="#9B5AA5"
          />
        </View>
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
    padding: 10
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
    fontSize: 16,
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
  BottomToolbar: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  }
});
