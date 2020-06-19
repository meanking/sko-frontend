import React from 'react';
import PropTypes from 'prop-types';
import {
  Image,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Assets from '../assets';
import Theme from '../assets/Theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.colors.green,
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    marginTop: 15,
  },
  text: {
    ...Theme.fonts.regular,
    color: Theme.colors.white,
    fontSize: 18,
  },
});

export default class SuccessView extends React.Component {
  static propTypes = {
    onTimeOut: PropTypes.func,
    text: PropTypes.string.isRequired,
    icon: Image.propTypes.source,
    iconStyle: Image.propTypes.style,
  };

  static defaultProps = {
    onTimeOut: null,
    icon: Assets.checkIcon,
    iconStyle: null,
  };

  componentDidMount() {
    this.timer = setTimeout(() => {
      const { onTimeOut } = this.props;
      if (onTimeOut && typeof (onTimeOut) === 'function') {
        onTimeOut();
      }
    }, 5000);
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  render() {
    const {
      icon,
      iconStyle,
      text,
      onTimeOut,
    } = this.props;

    return (
      <TouchableWithoutFeedback onPress={onTimeOut}>
        <View style={styles.container}>
          <View style={styles.item}>
            <Image
              source={icon}
              style={iconStyle}
            />
          </View>
          <View style={[styles.item, styles.textContainer]}>
            <Text style={styles.text}>{text}</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
