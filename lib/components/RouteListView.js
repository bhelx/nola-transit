import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Navigator,
  ListView,
  TouchableHighlight,
} from 'react-native';

export default class RouteMapView extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows(this.props.stops),
    }
  }
  navigateToStop(stop) {
    this.props.navigator.push({
      scene: 'Stop',
      title: stop.name,
      stop: stop
    });
  }
  topSegment() {
    return (
      <View style={styles.RouteLine}>
        <View style={[styles.RouteLineSegmentUnfilled, {backgroundColor: '#fff'}]} />
        <View style={styles.RouteLineSegment}>
          <View style={styles.RouteLineSegmentInner}>
            <Text></Text>
          </View>
        </View>
        <View style={styles.RouteLineSegmentFilled} />
      </View>
    )
  }
  middleSegment() {
    return (
      <View style={[styles.RouteLine, {paddingLeft: 14}]}>
        <View style={[styles.RouteLineSegmentUnfilled]} />
        <View style={styles.RouteLineSegmentFilled} />
      </View>
    )
  }
  bottomSegment() {
    return (
      <View style={styles.RouteLine}>
        <View style={styles.RouteLineSegmentFilled} />
        <View style={styles.RouteLineSegment}>
          <View style={styles.RouteLineSegmentInner}>
            <Text></Text>
          </View>
        </View>
        <View style={[styles.RouteLineSegmentUnfilled, {backgroundColor: '#fff'}]} />
      </View>
    )
  }
  closestSegment() {
    return (
      <View style={styles.RouteLine}>
        <View style={styles.RouteLineSegmentFilled} />
        <View style={styles.RouteLineSegment}>
          <Text></Text>
        </View>
        <View style={styles.RouteLineSegmentFilled} />
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
    } else if (stop.name === 'Magazine at Washington') {
      segment = this.closestSegment();
    } else {
      segment = this.middleSegment();
    }
    return (
      <TouchableHighlight onPress={this.navigateToStop.bind(this, stop)}>
        <View style={styles.StopDetails}>
          {segment}
          <Text style={styles.StopName}>{stop.name}: {stop.time}</Text>
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
  StopDetails: {
    height: 45,
    borderColor: '#E5E5E5',
    borderBottomWidth: 1,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  StopName: {
    flex: 10,
    fontSize: 16,
    color: '#202020',
    paddingLeft: 10
  },
  ListItemArrow: {
    flex: 1,
    alignItems: 'flex-end',
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
    backgroundColor: '#9B5AA5',
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  RouteLineSegmentInner: {
    backgroundColor: '#FFF',
    width: 6,
    height: 6,
    borderRadius: 3,
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
