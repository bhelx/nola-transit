/**
 * The dot component for the Pagination component.
 *
 * @flow
 */

import React, { PureComponent, PropTypes } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

const styles = StyleSheet.create({
  root: {
    height: 18,
    width: 18,
  },
  dot: {
    backgroundColor: '#fff',
		opacity: 0.35,
    height: 10,
    width: 10,
    borderRadius: 5,
    margin: 3,
  },
  active: {
		opacity: 0.7,
  },
});

export default class PaginationDot extends PureComponent {
  static propTypes = {
    active: PropTypes.bool.isRequired,
    index: PropTypes.number.isRequired,
    onClick: PropTypes.func.isRequired,
  };

  handleClick = (event) => {
    this.props.onClick(event, this.props.index);
  };

  render() {
    const {
      active,
    } = this.props;

    let styleDot;

    if (active) {
      styleDot = [styles.dot, styles.active];
    } else {
      styleDot = styles.dot;
    }

    return (
      <TouchableOpacity style={styles.root} onPress={this.handleClick}>
        <View style={styleDot} />
      </TouchableOpacity>
    );
  }
}

