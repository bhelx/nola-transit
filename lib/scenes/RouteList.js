import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Navigator,
  ListView,
  TouchableOpacity,
} from 'react-native';
import RouteShield from "../components/RouteShield";
import Gtfs from "../Gtfs";

export default class RouteList extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([]),
    }
    this.loadRoutes();
  }
  loadRoutes() {
    Gtfs.getRoutes((err, routes) => {
      this.setState({dataSource: this.state.dataSource.cloneWithRows(routes)})
    })
  }
  navigateTo(route) {
    this.props.navigator.push({
      scene: 'Route',
      title: 'Route',
      route: route
    })
  }
  renderRow(route) {
    return (
      <TouchableOpacity onPress={this.navigateTo.bind(this, route)}>
        <View style={styles.RouteDetails}>
          <View style={styles.RouteShield}>
            <RouteShield
              backgroundColor={`#${route.route_color}`}
              textColor={`#${route.route_text_color}`}
              number={route.route_short_name}
            />
          </View>
          <Text style={styles.RouteName}>{route.route_long_name}</Text>
          <View style={styles.ListItemArrow}>
            <Text style={{color: '#aaa'}}>&gt;</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
  render() {
    if (this.state && this.state.dataSource) {
      return (
        <ListView
          style={styles.RouteList}
          dataSource={this.state.dataSource}
          renderRow={this.renderRow.bind(this)}
          enableEmptySections={true}
        />
      );
    } else {
      return <Text>Loading...</Text>
    }
  }
}

const styles = StyleSheet.create({
  RouteList: {
    flex: 1,
    borderColor: '#E5E5E5',
    borderTopWidth: 1
  },
  RouteDetails: {
    height: 45,
    padding: 10,
    borderColor: '#E5E5E5',
    borderBottomWidth: 1,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  RouteShield: {
    flex: 1,
    alignItems: 'flex-start'
  },
  RouteName: {
    flex: 10,
    fontSize: 16,
    color: '#202020',
    paddingLeft: 10
  },
  ListItemArrow: {
    flex: 1,
    alignItems: 'flex-end',
    paddingRight: 10
  }
});
