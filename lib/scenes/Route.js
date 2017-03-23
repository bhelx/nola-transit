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
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

import RouteShield from '../components/RouteShield';
import RouteBottomBar from '../components/RouteBottomBar';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 29.9301714;
const LONGITUDE = -90.0804212;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default class Route extends Component {
  constructor(props) {
    super(props);
    this.state = {
      direction: 'to_audobon',
    };
  }
  onDirectionChange(direction) {
    this.setState({direction: direction});
  }
  render() {
    let directionText = this.state.direction === 'to_audobon' ? 'Audobon Zoo' : 'Canal St';
    let coords = this.state.direction === 'to_audobon' ? toAudobon : toCanal;

    return (
      <View style={styles.Container}>
        <View style={[styles.Route, {backgroundColor: '#9B5AA5'}]}>
          <RouteShield
            backgroundColor='#fff'
            textColor='#000'
            number='11'
          />
          <View style={{paddingLeft: 10}}>
            <Text style={[styles.RouteName, {color: '#fff'}]}>Magazine</Text>
            <Text style={[styles.RouteDirection, {color: '#fff'}]}>To {directionText}</Text>
          </View>
        </View>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.Map}
          customMapStyle={mapStyle}
          initialRegion={{
            latitude: LATITUDE,
            longitude: LONGITUDE,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }}>
          <MapView.Polyline
            coordinates={coords}
            strokeColor='rgba(155, 90, 165, 1)'
            strokeWidth={3}
          />
        </MapView>
        <RouteBottomBar direction={this.state.direction} onDirectionPress={this.onDirectionChange.bind(this)}/>
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
    flex: 1,
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
    "featureType": "administrative",
    "elementType": "geometry",
    "stylers": [
      {
        "visibility": "off"
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
        "visibility": "off"
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
    "featureType": "road",
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
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
    "featureType": "transit",
    "stylers": [
      {
        "visibility": "off"
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


const toAudobon = [
  {longitude: -90.13261, latitude: 29.92714},
  {longitude: -90.13199, latitude: 29.92678},
  {longitude: -90.13164, latitude: 29.9266},
  {longitude: -90.13134, latitude: 29.92646},
  {longitude: -90.1312, latitude: 29.92639},
  {longitude: -90.12994, latitude: 29.92576},
  {longitude: -90.12943, latitude: 29.92549},
  {longitude: -90.12893, latitude: 29.92525},
  {longitude: -90.12721, latitude: 29.9244},
  {longitude: -90.12692, latitude: 29.92424},
  {longitude: -90.12664, latitude: 29.92411},
  {longitude: -90.12644, latitude: 29.92402},
  {longitude: -90.12547, latitude: 29.92362},
  {longitude: -90.12462, latitude: 29.92328},
  {longitude: -90.1244, latitude: 29.9232},
  {longitude: -90.12336, latitude: 29.92278},
  {longitude: -90.12256, latitude: 29.92247},
  {longitude: -90.12151, latitude: 29.92217},
  {longitude: -90.12059, latitude: 29.9219},
  {longitude: -90.11986, latitude: 29.92175},
  {longitude: -90.11894, latitude: 29.92156},
  {longitude: -90.11799, latitude: 29.92136},
  {longitude: -90.1173, latitude: 29.92122},
  {longitude: -90.11708, latitude: 29.92119},
  {longitude: -90.11693, latitude: 29.92118},
  {longitude: -90.11609, latitude: 29.92105},
  {longitude: -90.11504, latitude: 29.92087},
  {longitude: -90.11377, latitude: 29.92067},
  {longitude: -90.11274, latitude: 29.92046},
  {longitude: -90.11211, latitude: 29.92043},
  {longitude: -90.111, latitude: 29.9204},
  {longitude: -90.11006, latitude: 29.92036},
  {longitude: -90.10911, latitude: 29.92033},
  {longitude: -90.10799, latitude: 29.9203},
  {longitude: -90.10721, latitude: 29.92035},
  {longitude: -90.10611, latitude: 29.92044},
  {longitude: -90.10498, latitude: 29.92052},
  {longitude: -90.10384, latitude: 29.92061},
  {longitude: -90.10273, latitude: 29.9207},
  {longitude: -90.10219, latitude: 29.92074},
  {longitude: -90.1016, latitude: 29.9208},
  {longitude: -90.10138, latitude: 29.92081},
  {longitude: -90.1008, latitude: 29.92085},
  {longitude: -90.10023, latitude: 29.92089},
  {longitude: -90.0991, latitude: 29.92096},
  {longitude: -90.09797, latitude: 29.92106},
  {longitude: -90.09684, latitude: 29.92116},
  {longitude: -90.09575, latitude: 29.92124},
  {longitude: -90.09497, latitude: 29.92129},
  {longitude: -90.09412, latitude: 29.92146},
  {longitude: -90.09326, latitude: 29.92165},
  {longitude: -90.09256, latitude: 29.92184},
  {longitude: -90.09165, latitude: 29.9221},
  {longitude: -90.09071, latitude: 29.92238},
  {longitude: -90.09005, latitude: 29.92257},
  {longitude: -90.08895, latitude: 29.92298},
  {longitude: -90.08885, latitude: 29.92302},
  {longitude: -90.08774, latitude: 29.92341},
  {longitude: -90.08725, latitude: 29.92362},
  {longitude: -90.08647, latitude: 29.92398},
  {longitude: -90.08626, latitude: 29.92409},
  {longitude: -90.08545, latitude: 29.92453},
  {longitude: -90.08465, latitude: 29.92498},
  {longitude: -90.08384, latitude: 29.92545},
  {longitude: -90.08247, latitude: 29.92621},
  {longitude: -90.08162, latitude: 29.92669},
  {longitude: -90.08085, latitude: 29.92714},
  {longitude: -90.08003, latitude: 29.92758},
  {longitude: -90.07921, latitude: 29.92804},
  {longitude: -90.07847, latitude: 29.92845},
  {longitude: -90.07772, latitude: 29.92894},
  {longitude: -90.07676, latitude: 29.92959},
  {longitude: -90.07575, latitude: 29.93023},
  {longitude: -90.07468, latitude: 29.93098},
  {longitude: -90.07386, latitude: 29.93159},
  {longitude: -90.07308, latitude: 29.9322},
  {longitude: -90.07301, latitude: 29.93246},
  {longitude: -90.07275, latitude: 29.93344},
  {longitude: -90.07246, latitude: 29.93441},
  {longitude: -90.07216, latitude: 29.9354},
  {longitude: -90.07189, latitude: 29.9363},
  {longitude: -90.07161, latitude: 29.93727},
  {longitude: -90.07132, latitude: 29.93824},
  {longitude: -90.07101, latitude: 29.9393},
  {longitude: -90.07074, latitude: 29.94019},
  {longitude: -90.07071, latitude: 29.94028},
  {longitude: -90.07068, latitude: 29.94041},
  {longitude: -90.07063, latitude: 29.94058},
  {longitude: -90.0706, latitude: 29.94071},
  {longitude: -90.07057, latitude: 29.94082},
  {longitude: -90.07053, latitude: 29.94099},
  {longitude: -90.07051, latitude: 29.94108},
  {longitude: -90.07046, latitude: 29.94124},
  {longitude: -90.07021, latitude: 29.94198},
  {longitude: -90.06999, latitude: 29.94276},
  {longitude: -90.0697, latitude: 29.94367},
  {longitude: -90.06966, latitude: 29.94381},
  {longitude: -90.06921, latitude: 29.94535},
  {longitude: -90.06899, latitude: 29.94606},
  {longitude: -90.06878, latitude: 29.94679},
  {longitude: -90.06866, latitude: 29.94718},
  {longitude: -90.06848, latitude: 29.94786},
  {longitude: -90.06834, latitude: 29.94838},
  {longitude: -90.06819, latitude: 29.94895},
  {longitude: -90.06814, latitude: 29.9491},
  {longitude: -90.06796, latitude: 29.94965},
  {longitude: -90.06777, latitude: 29.9503},
  {longitude: -90.0677, latitude: 29.95055},
  {longitude: -90.0675, latitude: 29.95117},
  {longitude: -90.06735, latitude: 29.95165},


]

const toCanal = [
  {longitude: -90.06726, latitude: 29.9518},
  {longitude: -90.06743, latitude: 29.95191},
  {longitude: -90.06755, latitude: 29.95199},
  {longitude: -90.06785, latitude: 29.95218},
  {longitude: -90.06829, latitude: 29.95249},
  {longitude: -90.06835, latitude: 29.95239},
  {longitude: -90.06843, latitude: 29.95221},
  {longitude: -90.06865, latitude: 29.95167},
  {longitude: -90.06886, latitude: 29.95102},
  {longitude: -90.06904, latitude: 29.95039},
  {longitude: -90.06905, latitude: 29.95036},
  {longitude: -90.06916, latitude: 29.94998},
  {longitude: -90.06934, latitude: 29.94938},
  {longitude: -90.06939, latitude: 29.94921},
  {longitude: -90.06955, latitude: 29.94866},
  {longitude: -90.0697, latitude: 29.94816},
  {longitude: -90.06987, latitude: 29.94758},
  {longitude: -90.0699, latitude: 29.94748},
  {longitude: -90.07002, latitude: 29.94708},
  {longitude: -90.07045, latitude: 29.94562},
  {longitude: -90.0709, latitude: 29.94408},
  {longitude: -90.07098, latitude: 29.94382},
  {longitude: -90.0711, latitude: 29.94339},
  {longitude: -90.07121, latitude: 29.94302},
  {longitude: -90.07127, latitude: 29.94288},
  {longitude: -90.0716, latitude: 29.94169},
  {longitude: -90.07166, latitude: 29.94152},
  {longitude: -90.07169, latitude: 29.94141},
  {longitude: -90.07173, latitude: 29.9413},
  {longitude: -90.07175, latitude: 29.94122},
  {longitude: -90.07178, latitude: 29.94112},
  {longitude: -90.0718, latitude: 29.94102},
  {longitude: -90.07199, latitude: 29.94039},
  {longitude: -90.072, latitude: 29.94036},
  {longitude: -90.07223, latitude: 29.93958},
  {longitude: -90.07255, latitude: 29.93851},
  {longitude: -90.07281, latitude: 29.93759},
  {longitude: -90.07306, latitude: 29.93672},
  {longitude: -90.0731, latitude: 29.93657},
  {longitude: -90.07338, latitude: 29.9357},
  {longitude: -90.07368, latitude: 29.9347},
  {longitude: -90.07395, latitude: 29.93371},
  {longitude: -90.07413, latitude: 29.93317},
  {longitude: -90.07438, latitude: 29.9321},
  {longitude: -90.07468, latitude: 29.93098},
  {longitude: -90.07575, latitude: 29.93023},
  {longitude: -90.07676, latitude: 29.92959},
  {longitude: -90.07772, latitude: 29.92894},
  {longitude: -90.07847, latitude: 29.92845},
  {longitude: -90.07921, latitude: 29.92804},
  {longitude: -90.08003, latitude: 29.92758},
  {longitude: -90.08085, latitude: 29.92714},
  {longitude: -90.08162, latitude: 29.92669},
  {longitude: -90.08247, latitude: 29.92621},
  {longitude: -90.08384, latitude: 29.92545},
  {longitude: -90.08465, latitude: 29.92498},
  {longitude: -90.08545, latitude: 29.92453},
  {longitude: -90.08626, latitude: 29.92409},
  {longitude: -90.08647, latitude: 29.92398},
  {longitude: -90.08725, latitude: 29.92362},
  {longitude: -90.08774, latitude: 29.92341},
  {longitude: -90.08885, latitude: 29.92302},
  {longitude: -90.08895, latitude: 29.92298},
  {longitude: -90.09005, latitude: 29.92257},
  {longitude: -90.09071, latitude: 29.92238},
  {longitude: -90.09165, latitude: 29.9221},
  {longitude: -90.09256, latitude: 29.92184},
  {longitude: -90.09326, latitude: 29.92165},
  {longitude: -90.09412, latitude: 29.92146},
  {longitude: -90.09497, latitude: 29.92129},
  {longitude: -90.09575, latitude: 29.92124},
  {longitude: -90.09684, latitude: 29.92116},
  {longitude: -90.09797, latitude: 29.92106},
  {longitude: -90.0991, latitude: 29.92096},
  {longitude: -90.10023, latitude: 29.92089},
  {longitude: -90.1008, latitude: 29.92085},
  {longitude: -90.10138, latitude: 29.92081},
  {longitude: -90.1016, latitude: 29.9208},
  {longitude: -90.10219, latitude: 29.92074},
  {longitude: -90.10273, latitude: 29.9207},
  {longitude: -90.10384, latitude: 29.92061},
  {longitude: -90.10498, latitude: 29.92052},
  {longitude: -90.10611, latitude: 29.92044},
  {longitude: -90.10721, latitude: 29.92035},
  {longitude: -90.10799, latitude: 29.9203},
  {longitude: -90.10911, latitude: 29.92033},
  {longitude: -90.11006, latitude: 29.92036},
  {longitude: -90.111, latitude: 29.9204},
  {longitude: -90.11211, latitude: 29.92043},
  {longitude: -90.11274, latitude: 29.92046},
  {longitude: -90.11377, latitude: 29.92067},
  {longitude: -90.11504, latitude: 29.92087},
  {longitude: -90.11609, latitude: 29.92105},
  {longitude: -90.11693, latitude: 29.92118},
  {longitude: -90.11708, latitude: 29.92119},
  {longitude: -90.1173, latitude: 29.92122},
  {longitude: -90.11799, latitude: 29.92136},
  {longitude: -90.11894, latitude: 29.92156},
  {longitude: -90.11986, latitude: 29.92175},
  {longitude: -90.12059, latitude: 29.9219},
  {longitude: -90.12151, latitude: 29.92217},
  {longitude: -90.12256, latitude: 29.92247},
  {longitude: -90.12336, latitude: 29.92278},
  {longitude: -90.1244, latitude: 29.9232},
  {longitude: -90.12462, latitude: 29.92328},
  {longitude: -90.12547, latitude: 29.92362},
  {longitude: -90.12644, latitude: 29.92402},
  {longitude: -90.12664, latitude: 29.92411},
  {longitude: -90.12692, latitude: 29.92424},
  {longitude: -90.12721, latitude: 29.9244},
  {longitude: -90.12893, latitude: 29.92525},
  {longitude: -90.12943, latitude: 29.92549},
  {longitude: -90.12994, latitude: 29.92576},
  {longitude: -90.1312, latitude: 29.92639},
  {longitude: -90.13134, latitude: 29.92646},
  {longitude: -90.13164, latitude: 29.9266},
]

