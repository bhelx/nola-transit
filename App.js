import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { StackNavigator } from 'react-navigation';

import Home from './lib/scenes/Home';
import RouteList from './lib/scenes/RouteList';
import Route from './lib/scenes/Route';
import Stop from './lib/scenes/Stop';

const App = StackNavigator({
  Home: { screen: Home },
  Route: { screen: Route },
  Stop: { screen: Stop },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 65,
  },
  scene: {
    flex: 1,
    paddingTop: 20,
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
  },
});

export default App;
