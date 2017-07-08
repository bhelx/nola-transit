/**
 * Swipeable trips for the Route screen.
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

import SwipeableViews from 'react-swipeable-views-native';
import Pagination from '../shared/swipeable/Pagination';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';
import Utils from '../Utils';

export default class RouteSwipeableDirection extends Component {
  static propTypes = {
    route: PropTypes.object.isRequired,
    directionId: PropTypes.number.isRequired,
    directions: PropTypes.array.isRequired,
    onDirectionSelect: PropTypes.func.isRequired,
  };

  render() {
    let stopViews = this.props.directions.map((direction, idx) => {
      return (
        <View key={idx} style={styles.TripHeadsignWrapper}>
          <SimpleLineIcon
            name="arrow-right-circle"
            color="#fff"
            size={12}
            style={styles.TripHeadsignIcon}
          />
          <Text style={styles.TripHeadsignText}>
            {direction.trip_headsign}
          </Text>
        </View>
      );
    });

    let route_short_name = (
      <Text style={styles.RouteShortName}>
        {this.props.route.route_short_name}
      </Text>
    );

    if (this.props.route.route_type != 3) {
      if (this.props.route.route_type == 0) {
        route_short_name = (
          <View style={styles.RouteHeader}>
            <View style={styles.RouteIcon}>
              <MaterialIcon name="directions-subway" size={20} />
            </View>
          </View>
        );
      } else if (this.props.route.route_type == 4) {
        route_short_name = (
          <View style={styles.RouteHeader}>
            <View style={styles.RouteIcon}>
              <MaterialIcon name="directions-boat" size={20} />
            </View>
          </View>
        );
      }
    }

    return (
      <View
        style={[
          styles.RouteRow,
          { backgroundColor: Utils.colorForRoute(this.props.route) },
        ]}
      >
        {route_short_name}
        <Text style={styles.RouteName}>
          <Text style={styles.RouteLongName}>
            {this.props.route.route_long_name}
          </Text>
        </Text>
        <SwipeableViews
          index={this.props.directionId}
          onChangeIndex={this.props.onDirectionSelect}
          style={styles.TripHeadsign}
          threshold={2}
        >

          {stopViews}

        </SwipeableViews>
        <Pagination
          dots={this.props.directions.length}
          index={this.props.directionId}
          onChangeIndex={this.props.onDirectonSelect}
          style={{
            top: 5,
            right: 5,
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  RouteRow: {
    height: 70,
    borderColor: 'rgba(0,0,0,0.7)',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    shadowColor: 'white',
    shadowRadius: 0.5,
    shadowOpacity: 0.2,
    flexDirection: 'column',
  },
  RouteTripDetailsWrapper: {
    flex: 1,
  },
  RouteTripDetails: {
    flex: 1,
    flexDirection: 'row',
  },
  RouteHeader: {
    width: 50,
    zIndex: 1000,
    position: 'absolute',
    left: 10,
    top: 5,
  },
  RouteIcon: {
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    width: 34,
    height: 34,
    borderRadius: 17,
    shadowColor: '#222222',
    shadowRadius: 1.5,
    shadowOpacity: 0.4,
    shadowOffset: {
      width: 0.1,
      height: 0.5,
    },
  },
  RouteName: {
    flex: 1,
    alignSelf: 'center',
    paddingTop: 5,
  },
  RouteShortName: {
    position: 'absolute',
    zIndex: 1000,
    top: 2,
    left: 10,
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowRadius: 2,
    textShadowOffset: {
      width: 0.1,
      height: 0.5,
    },
  },
  RouteLongName: {
    flex: 1,
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowRadius: 2,
    textShadowOffset: {
      width: 0.1,
      height: 0.5,
    },
  },
  TripHeadsignWrapper: {
    alignSelf: 'center',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  TripHeadsignIcon: {
    paddingRight: 4,
  },
  TripHeadsign: {
    flex: 1,
  },
  TripHeadsignText: {
    alignSelf: 'center',
    fontSize: 16,
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowRadius: 2,
    textShadowOffset: {
      width: 0.1,
      height: 0.5,
    },
  },
  RouteStop: {
    fontSize: 14,
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowRadius: 2,
    textShadowOffset: {
      width: 0.1,
      height: 0.5,
    },
  },
});
