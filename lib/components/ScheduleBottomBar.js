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
  // buttonFor(dayOfWeek, extraStyle) {
  //   let style = styles.Pill;
  //   let textColor = '#000';
  //
  //   if (this.props.dayOfWeek === dayOfWeek) {
  //     style = styles.PillSelected;
  //     textColor = '#fff';
  //   }
  //
  //   return (
  //     <TouchableOpacity
  //       style={[style, extraStyle]}
  //       onPress={this.props.onDayOfWeekPress.bind(this, dayOfWeek)}>
  //         <Text style={{fontSize: 11, color: textColor}}>{dayOfWeek}</Text>
  //     </TouchableOpacity>
  //   )
  // }
  //
  render() {
    let starType = this.props.favorited ? "star": "star-o";
    return (
      <View style={styles.Container}>
        <TouchableOpacity
          onPress={this.props.onFavPress.bind(this)}
          style={styles.FavStar}>
            <Icon name={starType} size={30} color={this.props.color} />
        </TouchableOpacity>
      </View>
    )
  }
}

ScheduleBottomBar.propTypes = {
  dayOfWeek: React.PropTypes.string.isRequired,
  onDayOfWeekPress: React.PropTypes.func,
  favorited: React.PropTypes.bool.isRequired,
  onFavPress: React.PropTypes.func,
}

const styles = StyleSheet.create({
  Container: {
    height: 50,
    borderColor: '#ddd',
    borderTopWidth: 1,
    justifyContent: 'center',
  },
  PillContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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
    alignItems: 'center',
  }
});
