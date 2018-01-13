/**
 * The route list view for the home screen.
 *
 * @flow
 */
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  Button,
  View,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';
import SwipeableDirection from './SwipeableDirection';

export default class RouteDataList extends Component {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    loadingNextPage: PropTypes.bool.isRequired,
    routes: PropTypes.array.isRequired,
    onFetchNextPage: PropTypes.func.isRequired,
    navigateTo: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this._renderRow = this._renderRow.bind(this);
  }

  _renderRow(row) {
    let route = row.item;
    if (route.nextPageButton) {
      if (this.props.loadingNextPage) {
        return (
          <ActivityIndicator
            style={{margin: 30}}
            animating={this.props.loadingNextPage}
            size="large"
          />
        );
      } else {
        return (
          <TouchableOpacity
            style={{flex: 1, flexDirection: 'row', justifyContent: 'center', padding: 30}}
            onPress={this.props.onFetchNextPage}
          >
            <Button
              title="See More Routes"
              color="#841584"
              onPress={this.props.onFetchNextPage}
            />
          </TouchableOpacity>
        );
      }
    } else {
      return (
        <SwipeableDirection
          route={route}
          trips={route.trips}
          index={0}
          onPress={this.props.navigateTo}
        />
      );
    }
  }

  render() {
    if (this.props.loading) {
      return (
        <ActivityIndicator
          animating={this.props.loading}
          style={[styles.Centering, { height: 300 }]}
          size="large"
        />
      );
    } else {
      let data = this.props.routes.slice(0); // clone
      data.push({nextPageButton: true});
      return (
        <FlatList
          data={data}
          keyExtractor ={(item, index) => {
            if (item.route_short_name) {
              return item.route_short_name
            } else {
              return "button";
            }
          }}
          renderItem={this._renderRow}
        />
      );
    }
  }
}

const styles = StyleSheet.create({
  Centering: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
});
