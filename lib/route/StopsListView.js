/**
 * List of stops component for the Route screen.
 *
 * @flow
 */
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Navigator,
  ListView,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';

import Utils from '../Utils';

export default class StopsListView extends Component {
  static propTypes = {
    color: PropTypes.string.isRequired,
    stops: PropTypes.array.isRequired,
    navigateToStop: PropTypes.func.isRequired,
    style: PropTypes.number.isRequired,
  };

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });
    this.state = {
      dataSource: ds.cloneWithRows(this.props.stops),
      lastPosition: null,
    };
  }

  // TODO should be able to get rid of this with flatlist
  componentWillReceiveProps(nextProps) {
    if (this.props.stops != nextProps.stops) {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(nextProps.stops),
      });
    }
  }
  topSegment() {
    return (
      <View style={[styles.RouteLine, { paddingLeft: 8 }]}>
        <View
          style={[styles.RouteLineSegmentUnfilled, { backgroundColor: '#fff' }]}
        />
        <View
          style={[
            styles.RouteLineSegmentBig,
            { backgroundColor: this.props.color },
          ]}
        >
          <Text />
        </View>
        <View
          style={[
            styles.RouteLineSegmentFilled,
            { backgroundColor: this.props.color },
          ]}
        />
      </View>
    );
  }
  middleSegment() {
    return (
      <View style={[styles.RouteLine]}>
        <View
          style={[
            styles.RouteLineSegmentFilled,
            { backgroundColor: this.props.color },
          ]}
        />
        <View
          style={[styles.RouteLineSegment, { borderColor: this.props.color }]}
        >
          <Text />
        </View>
        <View
          style={[
            styles.RouteLineSegmentFilled,
            { backgroundColor: this.props.color },
          ]}
        />
      </View>
    );
  }
  bottomSegment() {
    return (
      <View style={styles.RouteLine}>
        <View
          style={[
            styles.RouteLineSegmentFilled,
            { backgroundColor: this.props.color },
          ]}
        />
        <View
          style={[styles.RouteLineSegment, { borderColor: this.props.color }]}
        >
          <Text />
        </View>
        <View
          style={[styles.RouteLineSegmentUnfilled, { backgroundColor: '#fff' }]}
        />
      </View>
    );
  }
  renderRow(stop, sectionId, rowId) {
    let dt = Utils.secsToDateTime(stop.departure_time_secs);
    let dtString = Utils.dateToString(dt, true);
    let extraStyles = {};
    let last = this.props.stops.length - 1;
    let segment;
    if (rowId == 0) {
      segment = this.topSegment();
      dtString = dtString + ' - ' + Utils.humanizeTimeAway(dt);
      extraStyles = { fontWeight: 'bold' };
    } else if (rowId == last) {
      segment = this.bottomSegment();
    } else {
      segment = this.middleSegment();
    }

    return (
      <TouchableOpacity onPress={this.props.navigateToStop.bind(this, stop)}>
        <View style={styles.StopRow}>
          {segment}
          <View style={styles.StopDetails}>
            <Text style={[styles.StopName, extraStyles]}>
              {Utils.slashedName(stop.stop_name)}
            </Text>
            <Text style={[styles.StopTime, extraStyles]}>{dtString}</Text>
          </View>
          <View style={styles.ListItemArrow}>
            <Text style={{ color: '#aaa' }}>&gt;</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
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
    borderTopWidth: 1,
  },
  StopRow: {
    height: 45,
    flex: 1,
    flexDirection: 'row',
  },
  StopDetails: {
    borderColor: '#E5E5E5',
    borderBottomWidth: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 10,
    marginLeft: 10,
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
    borderColor: '#E5E5E5', // TODO border should probably be in a wrapper instead
    borderBottomWidth: 1,
  },
  RouteLine: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 45,
    flexDirection: 'column',
    paddingLeft: 10,
  },
  RouteLineSegment: {
    borderWidth: 3,
    backgroundColor: '#FFF',
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  RouteLineSegmentBig: {
    borderWidth: 3,
    borderColor: '#FFF',
    width: 20,
    height: 20,
    borderRadius: Math.ceil(20 / 2),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'black',
    shadowOpacity: 0.8,
    shadowRadius: 3,
    shadowOffset: {
      height: 1,
      width: 1,
    },
  },
  RouteLineSegmentFilled: {
    width: 5,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  RouteLineSegmentUnfilled: {
    width: 5,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
});
