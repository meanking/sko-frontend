import React from 'react';
import PropTypes from 'prop-types';
import {
  Image,
  StyleSheet,
  View,
} from 'react-native';

import Touchable from "./Touchable"

import Assets from '../assets';

const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    paddingTop: 18,
    paddingRight: 0,
    paddingBottom: 12,
    paddingLeft: 0,
  },
  arrow: {
    justifyContent: 'center',
    width: 32,
  },
  icon: {
    opacity: 0.5,
  },
});

const ArrowRow = (props) => {
  const {
    style,
    children,
    onPress,
    accessibilityLabel,
  } = props;

  return (
    <Touchable onPress={onPress} accessibilityLabel={accessibilityLabel} style={{flexGrow:1}} > 
      <View style={[styles.row, style]}>
        <View style={styles.content}>
          {children}
        </View>

        <View style={[styles.arrow]}>
          <Image style={styles.icon} source={Assets.rightArrowIcon} />
        </View>
      </View>
    </Touchable>
  );
};

ArrowRow.propTypes = {
  style: PropTypes.any,
  children: PropTypes.any,
  onPress: PropTypes.func,
  accessibilityLabel: PropTypes.string,
};

ArrowRow.defaultProps = {
  style: null,
  children: null,
  onPress: null,
  accessibilityLabel: null,
};

export default ArrowRow;
