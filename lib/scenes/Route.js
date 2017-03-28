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
import RouteListView from '../components/RouteListView';

export default class Route extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    Gtfs.getRouteInfo(props.route.route_index, (err, results) => {
      this.setState({
        directions: results.directions,
        shapes: results.shapes,
        stops: results.stops,
        directionId: 0,
        view: RouteMapView
      });
    })
  }
  onDirectionChange(directionId) {
    this.setState({directionId: directionId});
  }
  onViewChange() {
    let view = this.state.view === RouteMapView ? RouteListView : RouteMapView;
    this.setState({view});
  }
  render() {
    if (!this.state.view) return <Text>Loading...</Text>;

    let route = this.props.route;
    let direction = this.state.directions[this.state.directionId];
    let stops = this.state.stops[this.state.directionId];

    let view = React.createElement(this.state.view, {
      color: `#${route.route_color}`,
      coordinates: this.state.shapes[this.state.directionId],
      stops: stops,
      navigator: this.props.navigator
    });

    return (
      <View style={styles.Container}>
        <TouchableHighlight onPress={this.onViewChange.bind(this)}>
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
            <View style={styles.MapIcon}>
              <Icon size={20} name="map-o" color={`#${route.route_text_color}`} />
            </View>
          </View>
        </TouchableHighlight>
        {view}
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
    flex: 1,
  },
  MapIcon: {
    flex: 1,
    alignItems: 'flex-end',
    paddingRight: 10
  }
});

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

const toCanalStops = [
  { time: "4:59:00", latitude: 29.926577, longitude: -90.131819, name: "Audubon Zoo"},
  { time: "4:59:24", latitude: 29.926185, longitude: -90.130915, name: "Magazine at natatorium"},
  { time: "5:00:41", latitude: 29.924366, longitude: -90.127368, name: "Magazine at oak mall"},
  { time: "5:00:58", latitude: 29.923986, longitude: -90.126525, name: "Magazine at exposition"},
  { time: "5:01:38", latitude: 29.923183, longitude: -90.124583, name: "Magazine at henry clay"},
  { time: "5:02:38", latitude: 29.922138, longitude: -90.121623, name: "Magazine at state"},
  { time: "5:03:27", latitude: 29.921524, longitude: -90.119066, name: "Magazine at nashville"},
  { time: "5:04:01", latitude: 29.921143, longitude: -90.117296, name: "Magazine at joseph"},
  { time: "5:04:41", latitude: 29.920833, longitude: -90.115198, name: "Magazine at jefferson"},
  { time: "5:05:25", latitude: 29.920448, longitude: -90.11286, name: "Magazine at valmont"},
  { time: "5:06:16", latitude: 29.9203, longitude: -90.110135, name: "Magazine at soniat"},
  { time: "5:06:53", latitude: 29.920233, longitude: -90.108137, name: "Magazine at upperline"},
  { time: "5:07:29", latitude: 29.92037, longitude: -90.106221, name: "Magazine at bordeaux"},
  { time: "5:08:11", latitude: 29.92054, longitude: -90.103947, name: "Magazine at cadiz"},
  { time: "5:09:00", latitude: 29.920694, longitude: -90.101676, name: "Magazine at napoleon"},
  { time: "5:09:45", latitude: 29.920913, longitude: -90.099229, name: "Magazine at milan"},
  { time: "5:10:27", latitude: 29.921096, longitude: -90.096921, name: "Magazine at constantinople"},
  { time: "5:11:01", latitude: 29.921232, longitude: -90.095046, name: "Magazine at general taylor"},
  { time: "5:11:47", latitude: 29.921767, longitude: -90.092624, name: "Magazine at antonine"},
  { time: "5:12:22", latitude: 29.922276, longitude: -90.090792, name: "Magazine at aline"},
  { time: "5:13:00", latitude: 29.922881, longitude: -90.089011, name: "Magazine at louisiana"},
  { time: "5:13:46", latitude: 29.923888, longitude: -90.0865, name: "Magazine at harmony"},
  { time: "5:14:21", latitude: 29.924895, longitude: -90.084712, name: "Magazine at seventh street"},
  { time: "5:15:05", latitude: 29.926115, longitude: -90.082509, name: "Magazine at washington"},
  { time: "5:15:37", latitude: 29.927043, longitude: -90.080893, name: "Magazine at third street"},
  { time: "5:16:09", latitude: 29.927944, longitude: -90.079257, name: "Magazine at 1st street"},
  { time: "5:17:00", latitude: 29.929351, longitude: -90.076948, name: "Magazine at jackson"},
  { time: "5:18:14", latitude: 29.93088, longitude: -90.074681, name: "Magazine at st andrew"},
  { time: "5:19:19", latitude: 29.933051, longitude: -90.074131, name: "Sophie Wright at Felicity"},
  { time: "5:20:07", latitude: 29.934604, longitude: -90.073664, name: "Camp at race"},
  { time: "5:21:04", latitude: 29.936457, longitude: -90.073082, name: "Camp at terpsichore"},
  { time: "5:22:04", latitude: 29.938413, longitude: -90.072502, name: "Camp at thalia"},
  { time: "5:23:00", latitude: 29.94024, longitude: -90.071981, name: "Camp at gaiennie"},
  { time: "5:23:42", latitude: 29.941599, longitude: -90.071479, name: "Camp at calliope"},
  { time: "5:24:55", latitude: 29.943982, longitude: -90.070872, name: "Camp at st joseph"},
  { time: "5:25:42", latitude: 29.945525, longitude: -90.070436, name: "Camp at julia"},
  { time: "5:26:27", latitude: 29.946987, longitude: -90.069999, name: "Camp at girod"},
  { time: "5:27:00", latitude: 29.948061, longitude: -90.069674, name: "Camp at lafayette"},
  { time: "5:27:32", latitude: 29.949117, longitude: -90.069359, name: "Camp at poydras"},
  { time: "5:28:27", latitude: 29.950913, longitude: -90.068852, name: "Camp at gravier"},
  { time: "5:30:00", latitude: 29.951803, longitude: -90.067354, name: "Canal at Magazine"},
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

const toAudobonStops = [
  { time: "5:30:00", latitude: 29.951803, longitude: -90.067354, name: "Canal at Magazine"},
  { time: "5:30:30", latitude: 29.950648, longitude: -90.067772, name: "Magazine at Gravier"},
  { time: "5:31:05", latitude: 29.949254, longitude: -90.06813, name: "Magazine at Poydras"},
  { time: "5:31:54", latitude: 29.947305, longitude: -90.0687, name: "Magazine at Capdeville"},
  { time: "5:32:40", latitude: 29.945475, longitude: -90.069251, name: "Magazine at Julia"},
  { time: "5:33:19", latitude: 29.943929, longitude: -90.069703, name: "Magazine at St Joseph"},
  { time: "5:34:06", latitude: 29.942074, longitude: -90.070279, name: "Magazine at Poeyfarre"},
  { time: "5:35:41", latitude: 29.938319, longitude: -90.071374, name: "Magazine at Thalia"},
  { time: "5:36:29", latitude: 29.936398, longitude: -90.07193, name: "Magazine at Terpsichore"},
  { time: "5:37:16", latitude: 29.934538, longitude: -90.072485, name: "Magazine at Race"},
  { time: "5:38:53", latitude: 29.931216, longitude: -90.074476, name: "Magazine at St Andrew"},
  { time: "5:40:00", latitude: 29.929729, longitude: -90.076683, name: "Magazine at Jackson"},
  { time: "5:40:51", latitude: 29.928137, longitude: -90.079177, name: "Magazine at 1st Street"},
  { time: "5:41:26", latitude: 29.92716, longitude: -90.080977, name: "Magazine at Third Street"},
  { time: "5:41:55", latitude: 29.926317, longitude: -90.082427, name: "Magazine at Washington"},
  { time: "5:42:38", latitude: 29.925094, longitude: -90.084612, name: "Magazine at Seventh Street"},
  { time: "5:43:10", latitude: 29.924183, longitude: -90.08623, name: "Magazine at Harmony"},
  { time: "5:44:00", latitude: 29.923115, longitude: -90.088775, name: "Magazine at Louisiana"},
  { time: "5:44:35", latitude: 29.922466, longitude: -90.090597, name: "Magazine at Aline"},
  { time: "5:45:14", latitude: 29.921893, longitude: -90.092666, name: "Magazine at Antonine"},
  { time: "5:45:59", latitude: 29.921349, longitude: -90.095078, name: "Magazine at General Taylor"},
  { time: "5:46:32", latitude: 29.921232, longitude: -90.096933, name: "Magazine at Constantinople"},
  { time: "5:47:09", latitude: 29.921044, longitude: -90.099015, name: "Magazine at Milan"},
  { time: "5:48:00", latitude: 29.920694, longitude: -90.101676, name: "Magazine at Napoleon"},
  { time: "5:48:49", latitude: 29.920682, longitude: -90.103733, name: "Magazine at Cadiz"},
  { time: "5:49:42", latitude: 29.920508, longitude: -90.105962, name: "Magazine at Bordeaux"},
  { time: "5:50:27", latitude: 29.92036, longitude: -90.107863, name: "Magazine at Upperline"},
  { time: "5:51:16", latitude: 29.920414, longitude: -90.109911, name: "Magazine at Soniat"},
  { time: "5:52:21", latitude: 29.920517, longitude: -90.112647, name: "Magazine at Valmont"},
  { time: "5:53:16", latitude: 29.920905, longitude: -90.114901, name: "Magazine at Jefferson"},
  { time: "5:54:05", latitude: 29.921232, longitude: -90.116917, name: "Magazine at Joseph"},
  { time: "5:54:50", latitude: 29.921581, longitude: -90.118792, name: "Magazine at Nashville"},
  { time: "5:55:53", latitude: 29.922207, longitude: -90.12136, name: "Magazine at State"},
  { time: "5:57:08", latitude: 29.923237, longitude: -90.124259, name: "Magazine at Henry Clay"},
  { time: "5:58:02", latitude: 29.924031, longitude: -90.12633, name: "Magazine at Exposition"},
  { time: "5:58:23", latitude: 29.924415, longitude: -90.127122, name: "Magazine at Oak Mall"},
  { time: "6:00:04", latitude: 29.926266, longitude: -90.130813, name: "Magazine at Natatorium"},
  { time: "6:01:00", latitude: 29.926577, longitude: -90.131819, name: "Audubon Zoo"},
]
