import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Navigator,
  ListView,
  TouchableHighlight,
} from 'react-native';
import RouteShield from "../components/RouteShield";

const routes = [
  {name: 'Marigny-Bywater', color: '#7D0349', textColor: '#FFFFFF', number: '5'},
  {name: 'Tchopitoulas', color: '#ED99C2', textColor: '#000000', number: '10'},
  {name: 'Magazine', color: '#9B5AA5', textColor: '#FFFFFF', number: '11'},
  {name: 'New Orleans East Owl', color: '#1F2D84', textColor: '#FFFFFF', number: '63'},
  {name: 'Carrolton', color: '#7A4028', textColor: '#FFFFFF', number: '90'},
  {name: 'Broad', color: '#FFC421', textColor: '#FFFFFF', number: '94'},
]

export default class RouteList extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows(routes),
    }
  }
  renderRow(route) {
    return (
      <TouchableHighlight>
        <View style={styles.RouteDetails}>
          <View style={styles.RouteShield}>
            <RouteShield
              backgroundColor={route.color}
              textColor={route.textColor}
              number={route.number}
            />
          </View>
          <Text style={styles.RouteName}>{route.name}</Text>
          <View style={styles.ListItemArrow}>
            <Text>&gt;</Text>
          </View>
        </View>
      </TouchableHighlight>
    )
  }
  render() {
    return (
      <ListView
        style={styles.RouteList}
        dataSource={this.state.dataSource}
        renderRow={this.renderRow.bind(this)}
      />
    );
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
  }
});
