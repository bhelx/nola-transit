import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Navigator,
  ListView,
  TouchableHighlight,
  Dimensions,
  Button,
} from 'react-native';

import RouteShield from '../components/RouteShield';

export default class Stop extends Component {
  render() {
    return (
      <View style={styles.Container}>
        <View style={styles.Stop}>
          <Text>Magazine at Washington</Text>
          <View style={styles.StopNumber}>
            <Text>#152</Text>
          </View>
        </View>
        <View style={[styles.Route, {backgroundColor: '#9B5AA5'}]}>
          <RouteShield
            backgroundColor='#fff'
            textColor='#000'
            number='11'
          />
          <Text style={[styles.RouteName, {color: '#fff'}]}>To Audobon Zoo</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
  },
  Stop: {
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10
  },
  StopNumber: {
    flex: 1,
    alignItems: 'flex-end'
  },
  Route: {
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  RouteName: {
    fontSize: 16,
    paddingLeft: 10
  },
  Map: {
    flex: 1,
  },
  DestinationChooser: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  }
});
