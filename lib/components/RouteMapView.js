import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import Icon from 'react-native-vector-icons/FontAwesome';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 29.9301714;
const LONGITUDE = -90.0804212;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default class RouteMapView extends Component {
  constructor(props) {
    super(props);
    this.mapRef = null;
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

  closestStops(position, num) {
    let myLoc = position.coords;

    let stops = this.clippedStops(position);

    return stops.sort((s1, s2) => {
      let d1 = Math.sqrt(Math.pow(myLoc.latitude - s1.latitude, 2) + Math.pow(myLoc.longitude - s1.longitude, 2));
      let d2 = Math.sqrt(Math.pow(myLoc.latitude - s2.latitude, 2) + Math.pow(myLoc.longitude - s2.longitude, 2));
      if (d1 < d2) return -1;
      if (d1 > d2) return 1;
      return 0;
    }).slice(0, num);
  }

  clippedStops() {
    if (!this.props.lastPosition) return this.props.stops;
    let myLoc = this.props.lastPosition.coords;

    let closest = this.props.stops.sort((s1, s2) => {
      let d1 = Math.sqrt(Math.pow(myLoc.latitude - s1.latitude, 2) + Math.pow(myLoc.longitude - s1.longitude, 2));
      let d2 = Math.sqrt(Math.pow(myLoc.latitude - s2.latitude, 2) + Math.pow(myLoc.longitude - s2.longitude, 2));
      if (d1 < d2) return -1;
      if (d1 > d2) return 1;
      return 0;
    })[0];

    return this.props.stops.filter(stop => stop.stop_sequence >= closest.stop_sequence)
  }

  clippedCoordinates() {
    if (!this.props.lastPosition) return this.props.coordinates;

    let myLoc = this.props.lastPosition.coords;
    let coords = this.props.coordinates.slice(0);

    let closest = coords.sort((s1, s2) => {
      let d1 = Math.sqrt(Math.pow(myLoc.latitude - s1.latitude, 2) + Math.pow(myLoc.longitude - s1.longitude, 2));
      let d2 = Math.sqrt(Math.pow(myLoc.latitude - s2.latitude, 2) + Math.pow(myLoc.longitude - s2.longitude, 2));
      if (d1 < d2) return -1;
      if (d1 > d2) return 1;
      return 0;
    })[0];

    return coords.filter(c => c.sequence >= closest.sequence - 1)
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

      let closest = this.closestStops(this.props.lastPosition, 2);
      closest.push(this.props.lastPosition.coords)
      this.mapRef.fitToCoordinates(closest, { edgePadding: { top: 40, right: 40, bottom: 40, left: 40 }, animated: false });
    }, 500);
  }


  onLocationButtonPress() {
    // if (this.state.lastPosition) {
    //   let coords = this.state.lastPosition.coords;
    //   this.map.animateToCoordinate(coords);
    // }
  }

  // could do a circle instead of marker but need the radius
  // to be derived from zoom
  // <MapView.Circle
  //   key={stop.stop_index}
  //   center={stop}
  //   radius={5}
  //   fillColor={'#FFF'}
  //   strokeColor={this.props.color}
  // />
  render() {
    //let clippedStops = this.clippedStops();
    //let clippedCoordinates = this.clippedCoordinates();
    let clippedStops = this.props.stops;
    let clippedCoordinates = this.props.coordinates;

    let stops = clippedStops.map(stop => {
      return (
        <MapView.Marker coordinate={stop} key={stop.stop_index} pinColor={this.props.color}>
          <MapView.Callout>
            <View style={{flex: 1, flexDirection: 'row'}}>
              <View style={{flex: 1, flexDirection: 'column'}}>
                <View style={{flex: 1}}>
                  <Text>{stop.name}</Text>
                </View>
                <View style={{flex: 1}}>
                  <Text>{stop.time}</Text>
                </View>
              </View>
              <View style={{flex: 1, padding: 10, alignItems: 'center', justifyContent: 'center'}}>
                <Icon name="info-circle" color="#000" size={20} />
              </View>
            </View>
          </MapView.Callout>
        </MapView.Marker>
      )
    });

    // unused locate button
    // <View style={styles.LocateButton}>
    //   <TouchableOpacity onPress={this.onLocationButtonPress.bind(this)}>
    //     <Icon name="location-arrow" color="#FFF" size={20} />
    //   </TouchableOpacity>
    // </View>

    return (
      <View style={styles.Container}>
        <MapView
          ref={(ref) => { this.mapRef = ref; }}
          provider={PROVIDER_GOOGLE}
          style={styles.Map}
          customMapStyle={mapStyle}
          loadingEnabled
          showsUserLocation
          followsUserLocation
          showsMyLocationButton
          initialRegion={{
            latitude: LATITUDE,
            longitude: LONGITUDE,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }}>
          <MapView.Polyline
            coordinates={clippedCoordinates}
            strokeColor={this.props.color}
            strokeWidth={7}
          />
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
});

const mapStyle = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#f5f5f5"
      }
    ]
  },
  {
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#f5f5f5"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#bdbdbd"
      }
    ]
  },
  {
    "featureType": "poi",
    "stylers": [
      {
        "visibility": "on"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#eeeeee"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e5e5e5"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#ffffff"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dadada"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e5e5e5"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#eeeeee"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#c9c9c9"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  }
];

