import React, { PureComponent } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

/**
 * Circular shield to display a route number
 */
export default class RouteShield extends PureComponent {
  render() {
    return (
      <View style={[styles.Shield, {backgroundColor: this.props.backgroundColor}]}>
        <Text style={[styles.SheldText, {color: this.props.textColor}]}>{this.props.number}</Text>
      </View>
    )
  }
}

RouteShield.propTypes = {
  backgroundColor: React.PropTypes.string.isRequired,
  textColor: React.PropTypes.string.isRequired,
  number: React.PropTypes.string.isRequired
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
