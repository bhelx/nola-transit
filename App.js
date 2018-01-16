/**
 * Top-level App file. Sets up the screens and the react-native app.
 *
 * @flow
 */
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TouchableOpacity,
  Platform
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import { enhance } from './lib/navigation_experimental';

import Home from './lib/Home';
import Route from './lib/Route';
import Stop from './lib/Stop';

// This enhances the StackNavigator with
// these experimental APIs https://github.com/satya164/react-navigation-addons
const App = enhance(StackNavigator)({
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
