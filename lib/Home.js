/**
 * Home Screen
 * Shows a map and overview of closest routes.
 *
 * @flow
 */
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  Button,
  TouchableOpacity,
  View,
  ListView,
  FlatList,
  Dimensions,
  ActivityIndicator,
  AppState,
  Platform
} from 'react-native';

import Permissions from 'react-native-permissions';
import RouteDataList from './home/RouteDataList';
import Paginator from './home/Paginator';
import Utils from './Utils';
import Config from '../config';
import Gtfs from './Gtfs';

import MapStyle from './MapStyle';

import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

const NAV_STACK_INDEX = 0; // TODO figure out a cleaner way to do this

// number of routes to load each time you hit "see more" button
const ROUTE_PER_PAGE = 10;

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.navIndex = NAV_STACK_INDEX;
    this.state = {
      routeData: [],
      loading: true,
      appState: AppState.currentState,
      mapLines: [],
      mapRegion: Config.defaultMapRegion(Dimensions.get('window')),
      routeIdx: 0,
      routePerPage: 10,
      loadingNextPage: false,
      locationPermission: 'undetermined',
    };

    this._handleAppStateChange = this._handleAppStateChange.bind(this);
    this._handleNavStateChange = this._handleNavStateChange.bind(this);
  }
  static navigationOptions = {
    title: 'Home',
  };

  safelySetState(newState) {
    if (this.state.appState === 'active') {
      this.setState(newState);
    }
  }
  navigateTo(route, route_idx) {
    const { navigate } = this.props.navigation;
    navigate('Route', { route, route_idx });
  }
  componentWillMount() {
    console.log('Home will mount');
  }
  componentDidMount() {
    console.log('Home did mount');

    Permissions.request('location')
      .then(response => {
        console.log('location permission is ', response);
        // response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
        this.setState({ locationPermission: response });
        navigator.geolocation.getCurrentPosition(
          position => {
            this.updatePosition(position);
            this.updateInfo(position);
            if (this.mapRef) {
              console.log('fit map to user location');
              console.log(position.coords);
              // TODO this throws error (probably need rn-maps update)
              // https://github.com/airbnb/react-native-maps/pull/1115
              //this.mapRef.animateToCoordinate(position.coords);
            }
          },
          e => {
            console.log('geolocation error', e);
            // set a default location...maybe we should store the last known
            // position and use that instead of some arbitrary default
            let lat = Config.defaultMapRegion.latitude
            let lon = Config.defaultMapRegion.longitude;
            let position = {"coords": {"longitude": lon, "latitude": lat}};
            console.log('setting default position', position);
            this.updatePosition(position);
            this.updateInfo(position);
          },
          { enableHighAccuracy: true, timeout: 20000, maximumAge: 30000 }
        );
        this.startListeners();
        Gtfs.getMapLines((err, results) => {
          this.setState({
            mapLines: results,
          });
        });
      });

      // notification permission is iOS only
      // https://github.com/yonahforst/react-native-permissions#supported-permission-types
      if (Platform.OS === 'ios') {
        Permissions.request('notification', ['alert', 'badge'])
          .then(response => {
            this.setState({ notificationPermission: response });
          });
     }
  }
  componentWillUnmount() {
    console.log('Home will unmount');
    this.stopListeners();
  }
  _handleNavStateChange(state) {
    console.log('Home focus state changed ', state);
    if (state.index != this.navIndex) {
      console.log('Home new state concerns me');
      if (state.index != NAV_STACK_INDEX) {
        // we are navigating away
        this.stopListeners();
        AppState.removeEventListener('change', this._handleAppStateChange);
      } else {
        // we navigated to here
        this.updateInfo(); // get up to date info when they come back
        this.startListeners();
      }
    } else {
      console.log('Home new state doesnt concern me');
    }
    this.navIndex = state.index;
  }
  // TODO probably need to set the appstate in the state before i start calling functions
  // that think that the appState key will be new
  _handleAppStateChange(nextAppState) {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      console.log('Home foregrounded');
      this.clearInfo();
      this.updateInfo();
      this.startListeners();
    } else if (
      nextAppState.match(/inactive|background/) &&
      this.state.appState === 'active'
    ) {
      console.log('Home backrounded');
      this.stopListeners();
    }
    this.setState({ appState: nextAppState });
  }
  startListeners() {
    console.log('Home start listeners');
    if (!this.dataWatchId) {
      AppState.addEventListener('change', this._handleAppStateChange);
      this.props.navigation.addListener('change', this._handleNavStateChange);
      this.dataWatchId = setInterval(() => {
        console.log('Home polling data');
        if (this.state.lastPosition) this.updateInfo();
      }, Config.pollingInterval);
    }
  }
  // this is idempotent
  stopListeners() {
    console.log('Home stop listeners');
    clearInterval(this.dataWatchId);
    this.dataWatchId = null;
  }
  clearInfo() {
    console.log('Home clear info');
    this.setState({
      routeData: [],
      loading: true,
    });
  }
  updatePosition(position) {
    let lastPos = this.state.lastPosition;
    // if (lastPos && Utils.distance(position.coords, lastPos.coords) > 0.1) {
    //   //this.paginator = new Paginator(position.coords);
    // } else {
    // }
    this.paginator = new Paginator(position.coords);
    this.safelySetState({ lastPosition: position });
  }
  updateInfo(position) {
    position = position || this.state.lastPosition;
    //console.log('Home updating info with pos: ', position);
    console.log('Home updating info');
    if (this.paginator) {
      this.paginator.getNextTickOfEntryPoints((err, routes) => {
        // if this constraint is not true, it's possible
        // that this callback has returned after the user
        // has already loaded a new page. in that case, we will
        // ignore the new data.
        if (routes.length >= this.state.routeData.length) {
          this.safelySetState({
            routeData: routes,
            loading: false
          });
        }
      });
    }
  }
  fetchNextPage() {
    console.log('Fetching next page of routes');
    if (this.paginator) {
      this.safelySetState({
        loadingNextPage: true,
      });
      this.paginator.getNextPageOfEntryPoints((err, routes) => {
        this.safelySetState({
          routeData: routes,
          loadingNextPage: false,
        });
      });
    }
  }

  onRegionChange(region) {
    this.safelySetState({ mapRegion: region });
  }

  render() {
    if (this.state.appState !== 'active') return null;

    let polylines = this.state.mapLines.map(mapLine => {
      return (
        <MapView.Polyline
          key={Math.random()} // needs a key or else it persists in view
          coordinates={mapLine.coords}
          strokeColor={Utils.routeColor(`#${mapLine.color}`)}
          strokeWidth={3}
        />
      );
    });

    return (
      <View style={styles.Container}>
        <View style={styles.Map}>
          <MapView
            ref={mapRef => {
              this.mapRef = mapRef;
            }}
            provider={PROVIDER_GOOGLE}
            style={styles.Map}
            loadingEnabled
            showsUserLocation
            followsUserLocation
            showsMyLocationButton
            customMapStyle={MapStyle}
            region={this.state.mapRegion}
            onRegionChange={this.onRegionChange.bind(this)}
          >
            {polylines}
          </MapView>
        </View>
        <View style={styles.Routes}>
          <RouteDataList
            loading={this.state.loading}
            loadingNextPage={this.state.loadingNextPage}
            routes={this.state.routeData}
            onFetchNextPage={this.fetchNextPage.bind(this)}
            navigateTo={this.navigateTo.bind(this)}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: '#fff',
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
    backgroundColor: '#fff',
    height: 100,
    borderColor: 'rgba(0,0,0,0.7)',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    shadowColor: 'white',
    shadowRadius: 0.5,
    shadowOpacity: 0.2,
  },
  RouteTripDetailsWrapper: {},
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
      height: 2,
    },
  },
  RouteHeadsign: {
    fontSize: 16,
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowRadius: 2,
    textShadowOffset: {
      width: 0.5,
      height: 0.75,
    },
  },
  RouteStop: {
    fontSize: 14,
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowRadius: 2,
    textShadowOffset: {
      width: 0.5,
      height: 0.75,
    },
  },
  TimeAwayText: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowRadius: 3,
    textShadowOffset: {
      width: 1,
      height: 2,
    },
  },
  TimeAwayUnitText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowRadius: 3,
    textShadowOffset: {
      width: 1,
      height: 2,
    },
  },
  Centering: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
});
