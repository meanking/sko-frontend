import React from "react";
import PropTypes from "prop-types";
import {
  Slider,
  StyleSheet,
  Text,
  View,
  ShadowPropTypesIOS
} from "react-native";

import Theme from "../assets/Theme";

const Colors = Theme.colors;

const styles = StyleSheet.create({
  container: {
    margin: 10,
    height: 56
  },
  slider: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between"
  }
});

class CustomSlider extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    prefix: PropTypes.string,
    value: PropTypes.number,
    daysString: PropTypes.string,
    shouldReset: PropTypes.bool
  };

  static defaultProps = {
    prefix: null,
    value: undefined
  };

  constructor(props) {
    super(props);
    this.state = { value: null };
  }

  render() {
    const {
      title,
      prefix,
      value: propsValue,
      daysString,
      shouldReset,
      callback,
      ...sliderProps
    } = this.props;
    const { value: stateValue } = this.state;

    if (this.state.value && shouldReset) this.setState({ value: null });

    const value = shouldReset ? propsValue : stateValue || propsValue;

    return (
      <View style={styles.container}>
        <View style={styles.slider}>
          <Text>{title}</Text>
          {prefix ? (
            <Text>{`${prefix}${value} ${daysString.toLowerCase()}`}</Text>
          ) : (
            <Text>{`${value} ${daysString.toLowerCase()}`}</Text>
          )}
        </View>

        <Slider
          thumbTintColor={Colors.green}
          minimumTrackTintColor={Colors.green}
          value={propsValue}
          onValueChange={v => {
            this.setState({ value: v });
            callback();
          }}
          {...sliderProps}
        />
      </View>
    );
  }
}

export default CustomSlider;
