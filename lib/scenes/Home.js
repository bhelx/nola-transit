import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ListView,
  Dimensions,
} from 'react-native';

import SwipeableViews from 'react-swipeable-views-native';
import Pagination from '../components/swipeable/Pagination';
import HomeSwipeableDirection from '../components/HomeSwipeableDirection';
import tinycolor from 'tinycolor2';

import Gtfs from "../Gtfs";
import MapStyle from '../MapStyle';

import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 29.9301714;
const LONGITUDE = -90.0804212;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default class Home extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([]),
    }
  }
  static navigationOptions = {
    title: 'Home',
  };
  navigateTo(route) {
    const { navigate } = this.props.navigation;
    navigate('Route', { route });
  }
  componentWillMount() {
    Gtfs.getRoutes((err, routes) => {
      this.setState({dataSource: this.state.dataSource.cloneWithRows(routes)})
    })
  }
  renderRow(route, sectionId, rowId) {
    return (
			<HomeSwipeableDirection
				 key={route.route_short_name}
				 route={route}
				 stops={[{},{}]}
				 index={0}
				 onPress={this.navigateTo.bind(this, route)}
			 />
		)
  }
  render() {
    return (
      <View style={styles.Container}>
        <View style={styles.Map}>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.Map}
            loadingEnabled
            showsUserLocation
            followsUserLocation
            showsMyLocationButton
            customMapStyle={MapStyle}
            initialRegion={{
              latitude: LATITUDE,
              longitude: LONGITUDE,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            }}>
          </MapView>
        </View>
        <View style={styles.Routes}>
          <ListView
            removeClippedSubviews={false}
            dataSource={this.state.dataSource}
            renderRow={this.renderRow.bind(this)}
            enableEmptySections={true}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
  },
  Map: {
    flex: 2,
    borderColor: 'rgba(0,0,0,0.7)',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    shadowColor: 'white',
    shadowRadius: 0.5,
    shadowOpacity: 0.2,
  },
  Routes: {
    flex: 3,
  },
  RouteRow: {
    height: 100,
    borderColor: 'rgba(0,0,0,0.7)',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    shadowColor: 'white',
    shadowRadius: 0.5,
    shadowOpacity: 0.2,
  },
  RouteTripDetailsWrapper: {
  },
  RouteTripDetails: {
    flex: 1,
    flexDirection: 'row',
  },
  RouteTripDescription: {
    flexDirection: 'column',
    flex: 4,
    justifyContent: 'flex-end',
    paddingBottom: 10,
    paddingLeft: 10,
  },
  TimeAway: {
    flex: 1,
    alignItems: 'flex-end',
    paddingRight: 10,
    paddingTop: 10,
  },
  RouteName: {
    position: 'absolute',
    zIndex: 1000,
    left: 10,
    top: 10,
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
  RouteHeadsign: {
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
  },
  TimeAwayText: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowRadius: 3,
    textShadowOffset: {
      width: 1,
      height: 2
    }
  },
  TimeAwayUnitText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowRadius: 3,
    textShadowOffset: {
      width: 1,
      height: 2
    }
  }
});
