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

class Home extends Component {
  render() {
    return (
      <View>
        <TouchableHighlight
          style={styles.homeButton}
          onPress={() => {
            this.props.navigator.push(routes[1]);
          }}>
          <Text>Routes</Text>
        </TouchableHighlight>
        <TouchableHighlight
          style={styles.homeButton}
          onPress={() => {
            this.props.navigator.push(routes[2]);
          }}>
          <Text>Route</Text>
        </TouchableHighlight>
        <TouchableHighlight
          style={styles.homeButton}
          onPress={() => {
            this.props.navigator.push(routes[3]);
          }}>
          <Text>Stop</Text>
        </TouchableHighlight>
      </View>
    )
  }
}

const NavigationBarRouteMapper = {
  LeftButton: function(route, navigator, index, navState) {
    if (index === 0) {
      return null;
    }
    var previousRoute = navState.routeStack[index - 1];
    return (
      <TouchableOpacity
        onPress={navigator.pop}
        style={styles.navBarLeftButton}>
        <Text style={[styles.navBarText, styles.navBarButtonText]}>
          &lt; {previousRoute.title}
        </Text>
      </TouchableOpacity>
    );
  },

  RightButton: function(route, navigator, index, navState) {
    return null;
  },

  Title: function(route, navigator, index, navState) {
    return (
      <Text style={[styles.navBarText, styles.navBarTitleText]}>
        {route.title}
      </Text>
    );
  },
};

class NavButton extends Component {
  render() {
    return (
      <TouchableHighlight
        style={styles.button}
        underlayColor="#B5B5B5"
        onPress={this.props.onPress}>
        <Text style={styles.buttonText}>{this.props.text}</Text>
      </TouchableHighlight>
    );
  }
}

const routes = [
  {title: 'Home', scene: 'Home', index: 0},
  {title: 'Routes', scene: 'RouteList', index: 1},
  {title: 'Route', scene: 'Route', index: 1},
  {title: 'Stop Schedule', scene: 'Stop', index: 1},
];

export default class App extends Component {
  render() {
    return (
      <Navigator
        style={styles.container}
        initialRoute={routes[0]}
        renderScene={(route, navigator) => {
          // if (route.title === 'Home') {
          //   return <Home navigator={navigator} />
          // } else if (route.scene === 'RouteList') {
          //   return <RouteList navigator={navigator} />
          // } else if (route.scene === 'Route') {
          //   return <Route navigator={navigator} />
          // } else if (route.scene === 'Stop') {
            return <Stop navigator={navigator} />
          // }
        }}
        navigationBar={
          <Navigator.NavigationBar
            routeMapper={NavigationBarRouteMapper}
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
    backgroundColor: '#F5FCFF',
    paddingTop: Platform.OS === 'ios' ? 65 : 35,
  },
  scene: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#EAEAEA',
  },
  button: {
    backgroundColor: 'white',
    padding: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#CDCDCD',
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
    backgroundColor: '#ddd',
  }
});

