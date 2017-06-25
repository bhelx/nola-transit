/**
 * Map view component for the Route screen.
 *
 * @flow
 */
import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

import Utils from '../Utils';
import MapStyle from '../MapStyle';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 29.9301714;
const LONGITUDE = -90.0804212;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

export default class RouteMapView extends Component {
  static propTypes = {
    color: PropTypes.string.isRequired,
    coordinates: PropTypes.array.isRequired,
    stops: PropTypes.array.isRequired,
    directionId: PropTypes.number.isRequired,
    lastPosition: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.mapRef = null;
    this.state = {
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
    };
    if (this.props.lastPosition) {
      this.zoomMap();
    }
  }

  componentWillReceiveProps(nextProps) {
    // TODO will probably want to location constrain this
    if (nextProps.lastPosition != this.props.lastPosition) {
      this.zoomMap();
    }
  }

  closestStops(num) {
    return this.props.stops[1].slice(0, num);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.directionId != nextProps.directionId) {
      this.zoomMap();
    }
  }

  zoomMap() {
    // TODO intelligent way to do this
    setTimeout(() => {
      if (!this.props.lastPosition) return null;

      let closest = this.closestStops(10);
      closest.push(this.props.lastPosition.coords);
      this.mapRef.fitToCoordinates(closest, {
        edgePadding: { top: 40, right: 40, bottom: 40, left: 40 },
        animated: false,
      });
    }, 500);
  }

  onLocationButtonPress() {
    // if (this.state.lastPosition) {
    //   let coords = this.state.lastPosition.coords;
    //   this.map.animateToCoordinate(coords);
    // }
  }

  onRegionChange(region) {
    this.setState({ region });
  }

  render() {
    let clippedStops = this.props.stops;
    let rgb = hexToRgb(this.props.color);
    let transparentColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.33)`;

    let disabledStops = clippedStops[0].map((stop, idx) => {
      let markerStyle = [
        styles.StopMarkerDisabled,
        { borderColor: this.props.color },
      ];

      return (
        <MapView.Marker
          coordinate={stop}
          key={stop.stop_index}
          anchor={{ x: 0.5, y: 0.5 }}
          style={styles.StopMarkerContainer}
        >
          <View style={styles.StopMarkerWrapper}>
            <View style={markerStyle}>
              <Text style={{ width: 0, height: 0 }} />
            </View>
          </View>

        </MapView.Marker>
      );
    });

    let stops = clippedStops[1].map((stop, idx) => {
      //let dt = Utils.secsToDateTime(stop.departure_time_secs);
      //let dtString = Utils.dateToString(dt, true);
      //let timeAway = Utils.humanizeTimeAway(dt);
      let markerStyle = [styles.StopMarker, { borderColor: this.props.color }];
      if (idx == 0)
        markerStyle = [
          styles.StopMarkerBig,
          { backgroundColor: this.props.color },
        ];

      return (
        <MapView.Marker
          coordinate={stop}
          key={stop.stop_index}
          anchor={{ x: 0.5, y: 0.5 }}
          style={styles.StopMarkerContainer}
        >
          <View style={styles.StopMarkerWrapper}>
            <View style={markerStyle}>
              <Text style={{ width: 0, height: 0 }} />
            </View>
          </View>

        </MapView.Marker>
      );
    });

    return (
      <View style={styles.Container}>
        <MapView
          ref={ref => {
            this.mapRef = ref;
          }}
          provider={PROVIDER_GOOGLE}
          style={styles.Map}
          customMapStyle={MapStyle}
          loadingEnabled
          showsUserLocation
          followsUserLocation
          showsMyLocationButton
          onRegionChange={this.onRegionChange.bind(this)}
          initialRegion={this.state.region}
        >
          <MapView.Polyline
            key={Math.random()} // needs a key or else it persists in view
            coordinates={this.props.coordinates[0]}
            strokeColor={transparentColor}
            strokeWidth={5}
          />
          <MapView.Polyline
            coordinates={this.props.coordinates[1]}
            strokeColor={this.props.color}
            strokeWidth={5}
          />
          {disabledStops}
          {stops}
        </MapView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
  },
  Map: {
    ...StyleSheet.absoluteFillObject,
  },
  LocateButton: {
    alignSelf: 'flex-end',
    margin: 15,
    backgroundColor: 'rgba(0,0,235,0.6)',
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  StopMarkerContainer: {
    zIndex: 1000,
  },
  StopMarkerWrapper: {
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  StopMarkerDisabled: {
    justifyContent: 'center',
    backgroundColor: '#fff',
    width: 10,
    height: 10,
    borderWidth: 2,
    borderRadius: 5,
    opacity: 0.33,
  },
  StopMarker: {
    justifyContent: 'center',
    backgroundColor: '#fff',
    width: 16,
    height: 16,
    borderWidth: 3,
    borderRadius: 8,
  },
  StopMarkerBig: {
    justifyContent: 'center',
    width: 20,
    height: 20,
    borderWidth: 3,
    borderRadius: 10,
    borderColor: '#fff',
    shadowColor: 'black',
    shadowOpacity: 0.8,
    shadowRadius: 3,
    shadowOffset: {
      height: 1,
      width: 1,
    },
  },
});
