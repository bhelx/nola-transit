/**
 * Swipeable view of a route's trips for the Home screen.
 *
 * @flow
 */
import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ListView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

import Utils from '../Utils';
import SwipeableViews from 'react-swipeable-views-native';
import Pagination from '../shared/swipeable/Pagination';

export default class HomeSwipeableDirection extends Component {
  static propTypes = {
    index: PropTypes.number.isRequired,
    trips: PropTypes.array.isRequired,
    onPress: PropTypes.func.isRequired,
    route: PropTypes.object.isRequired,
  };

  state = {
    index: 0,
  };

  handleChangeIndex = index => {
    this.setState({
      index,
    });
  };

  render() {
    let now = new Date();
    let stopViews = this.props.trips.map((trip, idx) => {
      let dt = Utils.secsToDateTime(trip.closestStop.departure_time_secs);
      let diffSecs = (dt.getTime() - now.getTime()) / 1000;
      let timeAway = Utils.toTimeAway(diffSecs);
      let unit;
      let amount;
      if (timeAway.hours) {
        amount = timeAway.hours;
        unit = 'hour';
      } else if (timeAway.mins) {
        amount = timeAway.mins;
        unit = 'minute';
      } else if (timeAway.secs) {
        amount = timeAway.secs;
        unit = 'second';
      }

      // pluralize if amount is not 1
      unit = amount != 1 ? unit + 's' : unit;

      return (
        <TouchableOpacity
          key={idx}
          style={styles.RouteTripDetails}
          onPress={this.props.onPress.bind(this, idx)}
        >
          <View style={styles.RouteTripDescription}>
            <Text style={styles.RouteHeadsign}>
              {trip.trip_headsign}
            </Text>
            <Text style={styles.RouteStop}>
              {trip.closestStop.stop_name}
            </Text>
          </View>
          <View style={styles.TimeAway}>
            <Text style={styles.TimeAwayText}>
              {amount}
            </Text>
            <Text style={styles.TimeAwayUnitText}>{unit}</Text>
          </View>
        </TouchableOpacity>
      );
    });

    return (
      <View
        style={[
          styles.RouteRow,
          { backgroundColor: Utils.colorForRoute(this.props.route) },
        ]}
      >
        <Text style={styles.RouteName}>
          {this.props.route.route_short_name}
        </Text>
        <SwipeableViews
          index={this.state.index}
          onChangeIndex={this.handleChangeIndex}
          style={styles.RouteTripDetailsWrapper}
          threshold={2}
        >

          {stopViews}

        </SwipeableViews>
        <Pagination
          dots={this.props.trips.length}
          index={this.state.index}
          onChangeIndex={this.handleChangeIndex}
          style={{ bottom: 5, right: 10 }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  RouteRow: {
    height: 100,
    borderColor: 'rgba(0,0,0,0.3)',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    shadowColor: '#222222',
    shadowRadius: 1.5,
    shadowOpacity: 0.4,
  },
  RouteTripDetailsWrapper: {},
  RouteTripDetails: {
    flex: 1,
    flexDirection: 'row',
  },
  RouteTripDescription: {
    flexDirection: 'column',
    flex: 4,
    justifyContent: 'flex-end',
    paddingBottom: 10,
    paddingLeft: 10,
  },
  TimeAway: {
    flex: 1,
    alignItems: 'flex-end',
    paddingRight: 10,
    paddingTop: 10,
  },
  RouteName: {
    position: 'absolute',
    zIndex: 1000,
    left: 10,
    top: 10,
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowRadius: 3,
    textShadowOffset: {
      width: 1,
      height: 2,
    },
  },
  RouteHeadsign: {
    fontSize: 16,
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowRadius: 2,
    textShadowOffset: {
      width: 0.5,
      height: 0.75,
    },
  },
  RouteStop: {
    fontSize: 14,
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowRadius: 2,
    textShadowOffset: {
      width: 0.5,
      height: 0.75,
    },
  },
  TimeAwayText: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowRadius: 3,
    textShadowOffset: {
      width: 1,
      height: 2,
    },
  },
  TimeAwayUnitText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowRadius: 3,
    textShadowOffset: {
      width: 1,
      height: 2,
    },
  },
});
