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
            this.props.navigator.push({scene: 'RouteList', title: 'Routes'});
          }}>
          <Text>Routes</Text>
        </TouchableHighlight>
        <TouchableHighlight
          style={styles.homeButton}
          onPress={() => {
            this.props.navigator.push({scene: 'Route', title: 'Route'});
          }}>
          <Text>Route</Text>
        </TouchableHighlight>
        <TouchableHighlight
          style={styles.homeButton}
          onPress={() => {
            this.props.navigator.push({scene: 'Stop', title: 'Schedule'});
          }}>
          <Text>Stop</Text>
        </TouchableHighlight>
      </View>
    )
  }
}

const NavigationBarRouteMapper = {
  LeftButton: function(route, navigator, index, navState) {
    if (route.scene === 'Home') {
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
        onPress={this.props.onPress}>
        <Text style={styles.buttonText}>{this.props.text}</Text>
      </TouchableHighlight>
    );
  }
}

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
            //route.route= {"route_long_name":"Magazine","route_short_name":"11","route_index":5,"route_type":3,"route_color":"9B5AA5","route_text_color":"FFFFFF"};
            return <Route navigator={navigator} route={route.route} />
          } else if (route.scene === 'Stop') {
            // route.stop = {"departure_time":"17:14:05","stop_id":"152","latitude":29.926115,"stop_name":"Magazine at Washington","stop_sequence":24,"longitude":-90.082509,"arrival_time":"17:14:05","stop_index":96};
            // route.direction = {"trip_headsign":"Canal Street via World War II Museum","direction_id":0,"shape_index":9};
            return <Stop navigator={navigator} stop={route.stop} direction={route.direction} route={route.route} />
          }
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

