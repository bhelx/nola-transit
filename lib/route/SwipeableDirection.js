/**
 * Swipeable trips for the Route screen.
 *
 * @flow
 */
import React, {
  Component,
  PropTypes
} from 'react';

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
import Utils from '../Utils';

export default class RouteSwipeableDirection extends Component {
  static propTypes = {
    route: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    directionId: PropTypes.number.isRequired,
    directions: PropTypes.array.isRequired,
    onDirectionSelect: PropTypes.func.isRequired,
  };

  render() {
    let stopViews = this.props.directions.map((direction, idx) => {
      return (
        <Text key={idx} style={styles.TripHeadsignText}>
          {direction.trip_headsign}
        </Text>
      )
    })

    return (
      <View style={[styles.RouteRow, {backgroundColor: Utils.colorForRoute(this.props.route)}]}>
        <Text style={styles.RouteShortName}>
          {this.props.route.route_short_name}
        </Text>
        <Text style={styles.RouteName}>
          <Text style={styles.RouteLongName}>
            {this.props.route.route_long_name}
          </Text>
        </Text>
        <SwipeableViews
					index={this.props.directionId}
					onChangeIndex={this.props.onDirectionSelect}
          style={styles.TripHeadsign}
          threshold={2}>

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
    )
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
  RouteName: {
    flex: 1,
    alignSelf: 'center',
    paddingTop: 5,
  },
  RouteShortName: {
    position: 'absolute',
    zIndex: 1000,
    top: 2,
    left: 5,
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowRadius: 3,
    textShadowOffset: {
      width: 1,
      height: 2
    }
  },
  RouteLongName: {
    flex: 1,
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowRadius: 3,
    textShadowOffset: {
      width: 1,
      height: 2
    }
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
      width: 0.5,
      height: 0.75
    }
  },
  RouteStop: {
    fontSize: 14,
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowRadius: 2,
    textShadowOffset: {
      width: 0.5,
      height: 0.75
    }
  }
});
