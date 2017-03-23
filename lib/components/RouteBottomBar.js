import React, { PureComponent } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
} from 'react-native';

/**
 * The bottom toolbar for the route view
 */
export default class RouteBottomBar extends PureComponent {
  buttonFor(direction, extraStyle) {
    let style = styles.Pill;
    let textColor = '#000';

    if (this.props.direction === direction) {
      style = styles.PillSelected;
      textColor = '#fff';
    }

    let text = direction === 'to_audobon' ? 'Audobon Zoo' : 'Canal St';

    return (
      <TouchableOpacity
        style={[style, extraStyle]}
        onPress={this.props.onDirectionPress.bind(this, direction)}>
          <Text style={{color: textColor}}>{text}</Text>
      </TouchableOpacity>
    )
  }

  render() {
    return (
     <View style={styles.Container}>
       <View style={styles.PillContainer}>
        {this.buttonFor('to_canal', {borderTopRightRadius: 0, borderBottomRightRadius: 0, borderRightWidth: 0})}
        {this.buttonFor('to_audobon', {borderTopLeftRadius: 0, borderBottomLeftRadius: 0, borderLeftWidth: 0})}
       </View>
      </View>
    )
  }
}

RouteBottomBar.propTypes = {
  direction: React.PropTypes.string.isRequired,
  onDirectionPress: React.PropTypes.func,
}

const styles = StyleSheet.create({
  Container: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    borderColor: '#ddd',
    borderTopWidth: 1,
  },
  PillContainer: {
    width: 250,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  PillSelected: {
    backgroundColor: '#9B5AA5',
    borderWidth: 1,
    borderColor: '#9B5AA5',
    padding: 7,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
  },
  Pill: {
    borderWidth: 1,
    borderColor: '#9B5AA5',
    padding: 7,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
  }
});
