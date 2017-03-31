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


// TODO make util, and probably not right
const secondsSinceMidnight = () => {
  var d = new Date();
  var e = new Date(d);
  return Math.floor((d - e.setHours(0,0,0,0)) / 1000);
}

export default class Route extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    Gtfs.getRouteInfo(props.route.route_index, secondsSinceMidnight(), (err, results) => {
      this.setState({
        directions: results.directions,
        shapes: results.shapes,
        stops: results.stops,
        directionId: 0,
        view: RouteMapView
      });
    })
  }
  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
        (position) => {
          this.setState({lastPosition: position});
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
  // onViewChange() {
  //   let view = this.state.view === RouteMapView ? RouteListView : RouteMapView;
  //   this.setState({view});
  // }

  clippedStops(tripStops) {
    if (!this.state.lastPosition) return tripStops;
    let myLoc = this.state.lastPosition.coords;
    let stops = tripStops.slice(0);

    stops.sort((s1, s2) => {
      let d1 = Math.sqrt(Math.pow(myLoc.latitude - s1.latitude, 2) + Math.pow(myLoc.longitude - s1.longitude, 2));
      let d2 = Math.sqrt(Math.pow(myLoc.latitude - s2.latitude, 2) + Math.pow(myLoc.longitude - s2.longitude, 2));
      if (d1 < d2) return -1;
      if (d1 > d2) return 1;
      return 0;
    });

    let closestStop = stops[0];
    return tripStops.filter(stop => {
      return (stop.stop_sequence > closestStop.stop_sequence);
    });
  }

  render() {
    if (!this.state.view) return <Text>Loading...</Text>;

    let route = this.props.route;
    let direction = this.state.directions[this.state.directionId];
    let stops = this.clippedStops(this.state.stops[this.state.directionId]);

    let view = React.createElement(this.state.view, {
    });

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
            coordinates={this.state.shapes[this.state.directionId]}
            stops={stops}
            directionId={this.state.directionId}
            lastPosition={this.state.lastPosition}
          />
        </View>
        <StopsListView
          style={styles.StopsList}
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
