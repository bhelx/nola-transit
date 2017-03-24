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
  { shortName: "1", longName: "Algiers Point Ferry", type: 4, color: "#00FFFF", textColor: "#000000" },
  { shortName: "10", longName: "Tchoupitoulas", type: 3, color: "#ED99C2", textColor: "#000000" },
  { shortName: "100", longName: "Algiers Loop Owl", type: 3, color: "#245685", textColor: "#FFFFFF" },
  { shortName: "101", longName: "Algiers Point", type: 3, color: "#4FBDED", textColor: "#FFFFFF" },
  { shortName: "102", longName: "General Meyer", type: 3, color: "#CFAA78", textColor: "#000000" },
  { shortName: "106", longName: "Aurora", type: 3, color: "#F2A800", textColor: "#000000" },
  { shortName: "108", longName: "Algiers Local", type: 3, color: "#71C167", textColor: "#000000" },
  { shortName: "11", longName: "Magazine", type: 3, color: "#9B5AA5", textColor: "#FFFFFF" },
  { shortName: "114", longName: "General DeGaulle-Sullen", type: 3, color: "#D08313", textColor: "#000000" },
  { shortName: "115", longName: "General DeGaulle-Tullis", type: 3, color: "#D08313", textColor: "#000000" },
  { shortName: "12", longName: "St. Charles Streetcar", type: 0, color: "#006737", textColor: "#FFFFFF" },
  { shortName: "15", longName: "Freret", type: 3, color: "#D6ED6B", textColor: "#000000" },
  { shortName: "16", longName: "S. Claiborne", type: 3, color: "#692B91", textColor: "#FFFFFF" },
  { shortName: "2", longName: "Riverfront Streetcar", type: 0, color: "#0174F3", textColor: "#FFFFFF" },
  { shortName: "201", longName: "Kenner Loop", type: 3, color: "#86A7CE", textColor: "#000000" },
  { shortName: "202", longName: "Airport Express", type: 3, color: "#C0C0C0", textColor: "#000000" },
  { shortName: "27", longName: "Louisiana", type: 3, color: "#4FBDFF", textColor: "#000000" },
  { shortName: "28", longName: "M.L.King", type: 3, color: "#D60C8C", textColor: "#000000" },
  { shortName: "32", longName: "Leonidas-Treme", type: 3, color: "#8FD1C5", textColor: "#000000" },
  { shortName: "39", longName: "Tulane", type: 3, color: "#F58025", textColor: "#000000" },
  { shortName: "45", longName: "Lakeview", type: 3, color: "#2AB560", textColor: "#000000" },
  { shortName: "47", longName: "Canal Streetcar - Cemeteries", type: 0, color: "#C32F3D", textColor: "#FFFFFF" },
  { shortName: "48", longName: "Canal Streetcar - City Park/Museum", type: 0, color: "#87CB25", textColor: "#000000" },
  { shortName: "49", longName: "Loyola-UPT Streetcar", type: 0, color: "#FDBB30", textColor: "#000000" },
  { shortName: "5", longName: "Marigny-Bywater", type: 3, color: "#7D0349", textColor: "#FFFFFF" },
  { shortName: "51", longName: "St. Bernard-St.Anthony", type: 3, color: "#A62188", textColor: "#FFFFFF" },
  { shortName: "52", longName: "St. Bernard-Paris Avenue", type: 3, color: "#99AAD1", textColor: "#000000" },
  { shortName: "55", longName: "Elysian Fields", type: 3, color: "#51B948", textColor: "#000000" },
  { shortName: "57", longName: "Franklin", type: 3, color: "#00B1B0", textColor: "#000000" },
  { shortName: "60", longName: "Hayne", type: 3, color: "#AF7022", textColor: "#000000" },
  { shortName: "62", longName: "Morrison Express", type: 3, color: "#00B6DE", textColor: "#000000" },
  { shortName: "63", longName: "New Orleans East Owl", type: 3, color: "#1F2D84", textColor: "#FFFFFF" },
  { shortName: "64", longName: "Lake Forest Express", type: 3, color: "#1F2D84", textColor: "#FFFFFF" },
  { shortName: "65", longName: "Read-Crowder Express", type: 3, color: "#00873D", textColor: "#FFFFFF" },
  { shortName: "80", longName: "Desire-Louisa", type: 3, color: "#F8B9AB", textColor: "#000000" },
  { shortName: "84", longName: "Galvez", type: 3, color: "#B890C2", textColor: "#000000" },
  { shortName: "88", longName: "St. Claude/Jackson Barracks", type: 3, color: "#001D5B", textColor: "#FFFFFF" },
  { shortName: "90", longName: "Carrollton", type: 3, color: "#7A4028", textColor: "#FFFFFF" },
  { shortName: "91", longName: "Jackson-Esplanade", type: 3, color: "#A99B06", textColor: "#000000" },
  { shortName: "94", longName: "Broad", type: 3, color: "#FFC421", textColor: "#000000" },
].sort((r1, r2) => {
  let x = parseInt(r1.shortName);
  let y = parseInt(r2.shortName);
  if (x < y) return -1;
  if (x > y) return 1;
  return 0;
}) // hacky sort by shortname

export default class RouteList extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows(routes),
    }
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
      <TouchableHighlight onPress={this.navigateTo.bind(this, route)}>
        <View style={styles.RouteDetails}>
          <View style={styles.RouteShield}>
            <RouteShield
              backgroundColor={route.color}
              textColor={route.textColor}
              number={route.shortName}
            />
          </View>
          <Text style={styles.RouteName}>{route.longName}</Text>
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
