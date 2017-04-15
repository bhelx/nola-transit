import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Navigator,
  TouchableHighlight,
  Dimensions,
  Button,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Gtfs from '../Gtfs';
import Utils from '../Utils';

import RouteShield from '../components/RouteShield';
import RouteBottomBar from '../components/RouteBottomBar';
import RouteMapView from '../components/RouteMapView';
import StopsListView from '../components/StopsListView';

export default class Route extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
        (position) => {
          Gtfs.getRouteInfo(this.props.route.route_index, position.coords, (err, results) => {
            this.setState({
              directions: results.directions,
              shapes: results.shapes,
              stops: results.stops,
              directionId: 0,
              lastPosition: position,
            });
          })
        },
        (error) => alert(error),
        {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
      );

    this.watchID = navigator.geolocation.watchPosition((position) => {
      this.setState({
        lastPosition: position,
      });
    }, {maximumAge: 2000});
  }
  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  onDirectionChange(directionId) {
    this.setState({directionId: directionId});
  }

  navigateToStop(stop) {
    console.log('navigate to stop', stop);
    this.props.navigator.push({
      scene: 'Stop',
      title: stop.stop_name,
      stop: stop,
      route: this.props.route,
      direction: this.state.directions[this.state.directionId]
    });
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
    if (!closestStop) return this.tripStops();

    let disabled = this.tripStops().filter(stop => {
      return (stop.stop_sequence < closestStop.stop_sequence);
    });
    let hilighted = this.tripStops().filter(stop => {
      return (stop.stop_sequence >= closestStop.stop_sequence);
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

    if (closest.sequence === this.tripShape()[0].sequence) return [[], this.tripShape()]
    if (closest.sequence === this.tripShape()[shape.length - 1].sequence) return [this.tripShape(), []]

    let disabledPath = this.tripShape().filter(c => c.sequence < closest.sequence);
    let hilightedPath = this.tripShape().filter(c => c.sequence >= closest.sequence);

    let a = disabledPath[disabledPath.length -1];
    let b = hilightedPath[0];

    let a_p = [closest.latitude - a.latitude, closest.longitude - a.longitude];
    let a_b = [b.latitude - a.latitude, b.longitude - a.longitude];

    let atb2 = Math.pow(a_b[0], 2) + Math.pow(a_b[1], 2);
    let atp_dot_atb = a_p[0]*a_b[0] + a_p[1]*a_b[1];
    let t = atp_dot_atb / atb2;

    let fulcrum = {
      latitude: a.latitude + a_b[0] * t,
      longitude: a.longitude + a_b[1] * t,
      sequence: a.sequence,
    }

    disabledPath.push(fulcrum);
    hilightedPath.unshift(fulcrum);

    return [
      disabledPath,
      hilightedPath
    ]
  }

  render() {
    if (!this.state.stops) return <Text>Loading...</Text>;

    let route = this.props.route;
    let direction = this.state.directions[this.state.directionId];
    let closestStop = this.closestStop();
    let stops = this.clippedStops(closestStop);
    let shape = this.clippedShape(closestStop);

    return (
      <View style={styles.Container}>
        <View style={[styles.Route, {backgroundColor: `#${route.route_color}`}]}>
          <RouteShield
            backgroundColor='#fff'
            textColor='#000'
            number={route.route_short_name}
          />
          <View style={{flex: 10, paddingLeft: 10}}>
            <Text style={[styles.RouteName, {color: `#${route.route_text_color}`}]}>{route.route_long_name}</Text>
            <Text ellipseMode='tail' numberOfLines={1} style={[styles.RouteDirection, {color: `#${route.route_text_color}`}]}>To {direction.trip_headsign}</Text>
          </View>
        </View>
        <View style={styles.Map}>
          <RouteMapView
            color={`#${route.route_color}`}
            coordinates={shape}
            stops={stops}
            directionId={this.state.directionId}
            lastPosition={this.state.lastPosition}
          />
        </View>
        <StopsListView
          style={styles.StopsList}
          color={`#${route.route_color}`}
          stops={stops[1]}
          navigateToStop={this.navigateToStop.bind(this)}
        />
        <RouteBottomBar
          directions={this.state.directions}
          directionId={this.state.directionId}
          color={`#${route.route_color}`}
          textColor={`#${route.route_text_color}`}
          onDirectionPress={this.onDirectionChange.bind(this)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
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
    paddingRight: 10
  }
});
