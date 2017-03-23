import React, { PureComponent } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

/**
 * The bottom toolbar for the stop schedule view
 */
export default class ScheduleBottomBar extends PureComponent {
  buttonFor(dayOfWeek, extraStyle) {
    let style = styles.Pill;
    let textColor = '#000';

    if (this.props.dayOfWeek === dayOfWeek) {
      style = styles.PillSelected;
      textColor = '#fff';
    }

    return (
      <TouchableOpacity
        style={[style, extraStyle]}
        onPress={this.props.onPress.bind(this, dayOfWeek)}>
          <Text style={{color: textColor}}>{dayOfWeek}</Text>
      </TouchableOpacity>
    )
  }

  render() {
    return (
     <View style={styles.Container}>
        <View style={styles.FavStar}>
          <Icon name="star-o" size={30} color="#9B5AA5" />
        </View>
        {this.buttonFor('Weekday', {borderTopRightRadius: 0, borderBottomRightRadius: 0, borderRightWidth: 0})}
        {this.buttonFor('Sat', {borderRadius: 0})}
        {this.buttonFor('Sun', {borderTopLeftRadius: 0, borderBottomLeftRadius: 0, borderLeftWidth: 0})}
      </View>
    )
  }
}

ScheduleBottomBar.propTypes = {
  dayOfWeek: React.PropTypes.string.isRequired,
  onPress: React.PropTypes.func,
}

const styles = StyleSheet.create({
  Container: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 300,
  },
  PillSelected: {
    backgroundColor: '#9B5AA5',
    borderWidth: 1,
    borderColor: '#9B5AA5',
    padding: 7,
    borderRadius: 3,
    alignItems: 'center',
    flex: 1,
  },
  Pill: {
    borderWidth: 1,
    borderColor: '#9B5AA5',
    padding: 7,
    borderRadius: 3,
    alignItems: 'center',
    flex: 1,
  },
  FavStar: {
    alignItems: 'flex-start',
    flex: 1,
    paddingLeft: 10
  }
});
