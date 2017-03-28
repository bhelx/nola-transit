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
  buttonFor(directionId, extraStyle) {
    let direction = this.props.directions[directionId];
    let style = styles.Pill;
    let textColor = '#000';
    extraStyle.borderColor = this.props.color;

    if (this.props.directionId === directionId) {
      style = styles.PillSelected;
      textColor = this.props.textColor;
      extraStyle.backgroundColor = this.props.color;
    }

    let text = direction.trip_headsign;

    return (
      <TouchableOpacity
        style={[style, extraStyle]}
        onPress={this.props.onDirectionPress.bind(this, directionId)}>
          <Text style={{color: textColor}} ellipseMode="tail" numberOfLines={1}>{text}</Text>
      </TouchableOpacity>
    )
  }

  render() {
    return (
     <View style={styles.Container}>
       <View style={styles.PillContainer}>
        {this.buttonFor(0, {borderTopRightRadius: 0, borderBottomRightRadius: 0, borderRightWidth: 0})}
        {this.buttonFor(1, {borderTopLeftRadius: 0, borderBottomLeftRadius: 0, borderLeftWidth: 0})}
       </View>
      </View>
    )
  }
}

RouteBottomBar.propTypes = {
  directionId: React.PropTypes.number.isRequired,
  directions: React.PropTypes.array.isRequired,
  onDirectionPress: React.PropTypes.func,
  color: React.PropTypes.string.isRequired,
  textColor: React.PropTypes.string.isRequired,
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
    borderWidth: 1,
    padding: 7,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
  },
  Pill: {
    borderWidth: 1,
    padding: 7,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
  }
});
