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
    });
  }
  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  onDirectionChange(directionId) {
    this.setState({directionId: directionId});
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

    stops.sort((s1, s2) => {
      let d1 = Math.sqrt(Math.pow(myLoc.latitude - s1.latitude, 2) + Math.pow(myLoc.longitude - s1.longitude, 2));
      let d2 = Math.sqrt(Math.pow(myLoc.latitude - s2.latitude, 2) + Math.pow(myLoc.longitude - s2.longitude, 2));
      if (d1 < d2) return -1;
      if (d1 > d2) return 1;
      return 0;
    });

    return stops[0];
  }

  clippedStops(closestStop) {
    if (!closestStop) return this.tripStops();
    return this.tripStops().filter(stop => {
      return (stop.stop_sequence >= closestStop.stop_sequence);
    });
  }

  clippedShape(closestStop) {
    if (!closestStop) return this.tripShape();
    let shape = this.tripShape().slice(0);

    let closest = shape.sort((s1, s2) => {
      let d1 = Math.sqrt(Math.pow(closestStop.latitude - s1.latitude, 2) + Math.pow(closestStop.longitude - s1.longitude, 2));
      let d2 = Math.sqrt(Math.pow(closestStop.latitude - s2.latitude, 2) + Math.pow(closestStop.longitude - s2.longitude, 2));
      if (d1 < d2) return -1;
      if (d1 > d2) return 1;
      return 0;
    })[0];

    return this.tripShape().filter(c => c.sequence >= closest.sequence - 1)
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
          stops={stops}
          navigator={this.props.navigator}
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
