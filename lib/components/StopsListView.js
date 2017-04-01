import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Navigator,
  ListView,
  TouchableHighlight,
} from 'react-native';

export default class StopsListView extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows(this.props.stops),
      lastPosition: null,
    }
  }

  // TODO should be able to get rid of this with flatlist
  componentWillReceiveProps(nextProps) {
    if (this.props.stops != nextProps.stops) {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(nextProps.stops)
      })
    }
  }
  navigateToStop(stop) {
    this.props.navigator.push({
      scene: 'Stop',
      title: stop.stop_name,
      stop: stop
    });
  }
  topSegment() {
    return (
      <View style={styles.RouteLine}>
        <View style={[styles.RouteLineSegmentUnfilled, {backgroundColor: '#fff'}]} />
        <View style={[styles.RouteLineSegment, {borderColor: this.props.color}]}>
            <Text></Text>
        </View>
        <View style={[styles.RouteLineSegmentFilled, {backgroundColor: this.props.color}]} />
      </View>
    )
  }
  middleSegment() {
    return (
      <View style={[styles.RouteLine]}>
        <View style={[styles.RouteLineSegmentFilled, {backgroundColor: this.props.color}]} />
        <View style={[styles.RouteLineSegment, {borderColor: this.props.color}]}>
          <Text></Text>
        </View>
        <View style={[styles.RouteLineSegmentFilled, {backgroundColor: this.props.color}]} />
      </View>
    )
  }
  bottomSegment() {
    return (
      <View style={styles.RouteLine}>
        <View style={[styles.RouteLineSegmentFilled, {backgroundColor: this.props.color}]} />
        <View style={[styles.RouteLineSegment, {borderColor: this.props.color}]}>
          <Text></Text>
        </View>
        <View style={[styles.RouteLineSegmentUnfilled, {backgroundColor: '#fff'}]} />
      </View>
    )
  }
  renderRow(stop, sectionId, rowId) {
    let last = this.props.stops.length - 1;
    let segment;
    if (rowId == 0) {
      segment = this.topSegment();
    } else if (rowId == last) {
      segment = this.bottomSegment();
    } else if (stop.stop_name === 'Magazine at Washington') {
      segment = this.closestSegment();
    } else {
      segment = this.middleSegment();
    }
    return (
      <TouchableHighlight onPress={this.navigateToStop.bind(this, stop)}>
        <View style={styles.StopRow}>
          {segment}
          <View style={styles.StopDetails}>
            <Text style={styles.StopName}>{stop.stop_name}</Text>
            <Text style={styles.StopTime}>{stop.departure_time}</Text>
          </View>
          <View style={styles.ListItemArrow}>
            <Text>&gt;</Text>
          </View>
        </View>
      </TouchableHighlight>
    )
  }
  render() {
    return (
      <ListView
        style={styles.StopList}
        dataSource={this.state.dataSource}
        renderRow={this.renderRow.bind(this)}
      />
    );
  }
}

const styles = StyleSheet.create({
  StopList: {
    flex: 1,
    borderColor: '#E5E5E5',
    borderTopWidth: 1
  },
  StopRow: {
    height: 45,
    borderColor: '#E5E5E5',
    borderBottomWidth: 1,
    flex: 1,
    flexDirection: 'row',
  },
  StopDetails: {
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 10,
    paddingLeft: 10
  },
  StopName: {
    fontSize: 16,
    color: '#202020',
  },
  StopTime: {
    fontSize: 12,
    color: '#aaa',
  },
  ListItemArrow: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 10,
  },
  RouteLine: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 45,
    flexDirection: 'column',
    paddingLeft: 10,
  },
  RouteLineSegment: {
    borderColor: '#9B5AA5',
    borderWidth: 4,
    backgroundColor: '#FFF',
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  RouteLineSegmentFilled: {
    backgroundColor: '#9B5AA5',
    width: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  RouteLineSegmentUnfilled: {
    backgroundColor: '#9B5AA5',
    width: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  }
});
