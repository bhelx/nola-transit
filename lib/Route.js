/**
 * Route Screen
 * Shows an overview of a chosen route and the
 * available trips on that route.
 *
 * @flow
 */
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Dimensions,
  Button,
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import Gtfs from './Gtfs';
import Utils from './Utils';

import MapView from './route/MapView';
import StopsListView from './route/StopsListView';
import SwipeableDirection from './route/SwipeableDirection';

export default class Route extends Component {
  static navigationOptions = {
    title: 'Route',
  };

  state = {};

  updateInfo(position) {
    position = position || this.state.lastPosition;
    let route = this.props.navigation.state.params.route;

    Gtfs.getRouteInfo(route.route_index, position.coords, (err, results) => {
      if (!results.stops || results.stops.length == 0) {
        alert('There are no trips left on this route tonight');
        this.props.navigation.dispatch(NavigationActions.back());
      } else {
        this.setState({
          directions: results.directions,
          shapes: results.shapes,
          stops: results.stops,
          directionId: this.props.navigation.state.params.route_idx,
          lastPosition: position,
        });
      }
    });
  }

  componentDidMount() {
    console.log('Route mounted');
    navigator.geolocation.getCurrentPosition(
      position => {
        this.updateInfo(position);
      },
      e => console.log('geolocation error', e),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );

    this.watchID = navigator.geolocation.watchPosition(
      position => {
        this.setState({
          lastPosition: position,
        });
      },
      e => console.log('geolocation error', e),
      { maximumAge: 2000 }
    );
  }
  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  onDirectionChange(directionId) {
    this.setState({ directionId: directionId });
  }

  navigateToStop(stop) {
    const { navigate } = this.props.navigation;
    let route = this.props.navigation.state.params.route;
    let direction = this.state.directions[this.state.directionId];
    navigate('Stop', { stop, route, direction });
  }

  tripStops() {
    return this.state.stops[this.state.directionId];
  }
  tripShape() {
    return this.state.shapes[this.state.directionId];
  }

  closestStop() {
    if (!this.state.lastPosition) return null;
    let myLoc = this.state.lastPosition.coords;
    let stops = this.tripStops().slice(0);

    let closest;
    let min = Number.MAX_VALUE;
    stops.forEach(s => {
      let d = Utils.distance(myLoc, s);
      if (d < min) {
        closest = s;
        min = d;
      }
    });

    return closest;
  }

  clippedStops(closestStop) {
    if (!closestStop) return [[], this.tripStops()];
    if (this.tripStops().length <= 2) return [[], this.tripStops()];

    let disabled = this.tripStops().filter(stop => {
      return stop.stop_sequence < closestStop.stop_sequence;
    });
    let hilighted = this.tripStops().filter(stop => {
      return stop.stop_sequence >= closestStop.stop_sequence;
    });

    return [disabled, hilighted];
  }

  /**
   * Creates a phantom `fulcrum` point which aligns with the closetStop
   * on the route. Everything before this point will be `disabled`
   * and everything after will be normal `hilighted`
   */
  clippedShape(closestStop) {
    if (!closestStop) return this.tripShape();
    if (this.tripStops().length <= 2) return [[], this.tripShape()];

    let shape = this.tripShape().slice(0);

    let closest;
    let min = Number.MAX_VALUE;
    shape.forEach(s => {
      let d = Utils.distance(closestStop, s);
      if (d < min) {
        closest = s;
        min = d;
      }
    });

    if (closest.sequence === this.tripShape()[0].sequence)
      return [[], this.tripShape()];
    if (closest.sequence === this.tripShape()[shape.length - 1].sequence)
      return [this.tripShape(), []];

    let disabledPath = this.tripShape().filter(
      c => c.sequence < closest.sequence
    );
    let hilightedPath = this.tripShape().filter(
      c => c.sequence >= closest.sequence
    );

    let a = disabledPath[disabledPath.length - 1];
    let b = hilightedPath[0];

    let a_p = [closest.latitude - a.latitude, closest.longitude - a.longitude];
    let a_b = [b.latitude - a.latitude, b.longitude - a.longitude];

    let atb2 = Math.pow(a_b[0], 2) + Math.pow(a_b[1], 2);
    let atp_dot_atb = a_p[0] * a_b[0] + a_p[1] * a_b[1];
    let t = atp_dot_atb / atb2;

    let fulcrum = {
      latitude: a.latitude + a_b[0] * t,
      longitude: a.longitude + a_b[1] * t,
      sequence: a.sequence,
    };

    disabledPath.push(fulcrum);
    hilightedPath.unshift(fulcrum);

    return [disabledPath, hilightedPath];
  }

  render() {
    if (!this.state.stops) return <Text>Loading...</Text>;
    let route = this.props.navigation.state.params.route;
    let direction = this.state.directions[this.state.directionId];
    let closestStop = this.closestStop();
    let stops = this.clippedStops(closestStop);
    let shape = this.clippedShape(closestStop);
    let color = Utils.colorForRoute(route);

    return (
      <View style={styles.Container}>
        <SwipeableDirection
          directions={this.state.directions}
          directionId={this.state.directionId}
          route={route}
          onDirectionSelect={this.onDirectionChange.bind(this)}
        />
        <View style={styles.Map}>
          <MapView
            color={color}
            coordinates={shape}
            stops={stops}
            directionId={this.state.directionId}
            lastPosition={this.state.lastPosition}
          />
        </View>
        <StopsListView
          style={styles.StopsList}
          color={color}
          stops={stops[1]}
          navigateToStop={this.navigateToStop.bind(this)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  Route: {
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  RouteName: {
    fontSize: 16,
  },
  RouteDirection: {
    fontSize: 12,
  },
  Map: {
    flex: 2,
  },
  StopsList: {
    flex: 1,
  },
  MapIcon: {
    flex: 1,
    alignItems: 'flex-end',
    paddingRight: 10,
  },
});
