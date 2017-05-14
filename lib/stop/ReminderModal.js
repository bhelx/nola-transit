/**
 * Reminder Modal
 * This modal asks the user when they want to be reminded of
 * an incoming trip.
 *
 * @flow
 */
import React, { PureComponent, PropTypes } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Button } from 'react-native';
import Modal from 'react-native-modal';

export default class ReminderModal extends PureComponent {
  static propTypes = {
    scheduleItem: PropTypes.object,
    isVisible: PropTypes.bool.isRequired,
    scheduleNotification: PropTypes.func.isRequired,
    cancelNotification: PropTypes.func.isRequired,
  };

  reminderTimes(datetime) {
    let timeTil = datetime - new Date();
    let times = [
      5 * 1000 * 60, // 5 minutes
      10 * 1000 * 60, // 10 minutes
      15 * 1000 * 60, // 15 minutes
      30 * 1000 * 60, // 30 minutes
    ];

    return times.filter(time => time < timeTil);
  }

  renderButton(scheduleDateTime, timeBefore) {
    let mins = Math.floor(timeBefore / 60000);
    return (
      <Button
        key={timeBefore}
        onPress={this.props.scheduleNotification.bind(
          this,
          scheduleDateTime - timeBefore,
          mins
        )}
        title={`${mins}`}
        style={styles.Button}
      />
    );
  }

  render() {
    if (!this.props.scheduleItem) return null;

    let times = this.reminderTimes(this.props.scheduleItem.datetime);
    let buttons = times.map(time => {
      return this.renderButton(this.props.scheduleItem.datetime, time);
    });

    return (
      <Modal isVisible={this.props.isVisible}>
        <View style={styles.ModalContent}>
          <Text>
            Remind me
          </Text>
          <View style={styles.ButtonGroup}>
            {buttons}
          </View>
          <Text>
            minutes before my bus arrives
          </Text>
          <Button
            key="cancel"
            onPress={this.props.cancelNotification.bind(this)}
            title="Cancel"
            style={styles.Button}
          />
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  ModalContent: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  Button: {
    //flex: 1,
  },
  ButtonGroup: {
    //flex: 1,
    flexDirection: 'row',
  },
});
