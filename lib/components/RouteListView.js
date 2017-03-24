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
  renderRow(stop) {
    return (
      <TouchableHighlight onPress={this.navigateToStop.bind(this, stop)}>
        <View style={styles.StopDetails}>
          <View style={styles.RouteLine}>
            <View style={styles.RouteLineSegment}>
              <View style={styles.RouteLineSegmentInner}>
                <Text></Text>
              </View>
            </View>
            <View style={styles.RouteLineSegmentBottom}>
            </View>
          </View>
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
  // RouteLine: {
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   height: 45,
  // },
  // RouteLineSegment: {
  //   backgroundColor: '#9B5AA5',
  //   width: 16,
  //   height: 16,
  //   borderRadius: 8,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  // RouteLineSegmentInner: {
  //   backgroundColor: '#FFF',
  //   width: 8,
  //   height: 8,
  //   borderRadius: 4,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  // RouteLineSegmentBottom: {
  //   backgroundColor: '#9B5AA5',
  //   width: 8,
  //   height: 16,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // }
});
