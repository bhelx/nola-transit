/**
 * A circular "shield" showing the route number
 *
 *
 *      *  * 
 *   *        *
 *  *    11    *
 *  *          *
 *   *        *
 *      *  *
 *
 * @flow
 */
import React, { PureComponent, PropTypes } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

/**
 * Circular shield to display a route number
 */
export default class RouteShield extends PureComponent {
  static propTypes = {
    backgroundColor: PropTypes.string.isRequired,
    textColor: PropTypes.string.isRequired,
    number: PropTypes.string.isRequired,
  };

  render() {
    return (
      <View style={[styles.Shield, {backgroundColor: this.props.backgroundColor}]}>
        <Text style={[styles.SheldText, {color: this.props.textColor}]}>{this.props.number}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  Shield: {
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ShieldText: {
    fontWeight: 'bold',
  }
});
