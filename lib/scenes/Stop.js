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

export default class Stop extends Component {
  constructor(props) {
    super(props);
    console.log(props)
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([]),
      dayOfWeek: 'Sat',
      timeSelected: 3,
      favorited: false
    }
  }
  componentDidMount() {
    Gtfs.getStopSchedule(this.props.route.route_index, this.props.stop.stop_index, this.props.direction.direction_id, (err, schedule) => {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(schedule)
      });
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
            <Text style={styles.ScheduleTime}>{scheduleItem.departure_time}</Text>
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
