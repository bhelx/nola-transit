import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TouchableOpacity,
  Platform,
  Navigator,
} from 'react-native';

import RouteList from './lib/scenes/RouteList';
import Route from './lib/scenes/Route';
import Stop from './lib/scenes/Stop';
import Home from './lib/scenes/Home';

import NavBar from './lib/components/NavBar.js';

export default class App extends Component {
  render() {
    return (
      <Navigator
        style={styles.container}
        initialRoute={{scene: 'Home', title: 'Home'}}
        renderScene={(route, navigator) => {
          if (route.scene === 'Home') {
            return <Home navigator={navigator} />
          } else if (route.scene === 'RouteList') {
            return <RouteList navigator={navigator} />
          } else if (route.scene === 'Route') {
            //route = {route: {"route_long_name":"M.L.King","route_short_name":"28","route_index":10,"route_type":3,"route_color":"D60C8C","route_text_color":"000000"}}
            return <Route navigator={navigator} route={route.route} />
          } else if (route.scene === 'Stop') {
            return <Stop navigator={navigator} stop={route.stop} direction={route.direction} route={route.route} />
          }
        }}
        navigationBar={
          <Navigator.NavigationBar
            routeMapper={NavBar}
            style={styles.navBar}
          />
        }
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: '#F5FCFF',
    backgroundColor: '#fff',
    paddingTop: 65,
  },
  scene: {
    flex: 1,
    paddingTop: 20,
    //backgroundColor: '#EAEAEA',
  },
  button: {
    padding: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '500',
  },
  navBar: {
    backgroundColor: 'white',
  },
  navBarText: {
    fontSize: 16,
    marginVertical: 10,
  },
  navBarTitleText: {
    color: '#373E4D',
    fontWeight: '500',
    marginVertical: 9,
  },
  navBarLeftButton: {
    paddingLeft: 10,
  },
  navBarRightButton: {
    paddingRight: 10,
  },
  navBarButtonText: {
    color: '#5890FF',
  },
  homeButton: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
  }
});
