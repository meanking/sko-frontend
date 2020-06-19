import React from "react";
import PropTypes from "prop-types";
import {
  Animated,
  Easing,
  Platform,
  StyleSheet,
  Text,
  View
} from "react-native";
import Theme from "../assets/Theme";
import { variants } from "./Button";

const styles = StyleSheet.create({
  surface: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
    marginLeft: 12,
    marginTop: 10,
    height: 48,
    borderRadius: 24,
    overflow: "hidden"
  },
  text: {
    ...Theme.fonts.semiBold,
    textAlign: "center",
    paddingLeft: 10,
    paddingRight: 10,
    fontWeight: "bold",
    fontSize: 16
  },
  loading: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    height: 48,
    width: 0
  }
});

class ButtonLoading extends React.Component {
  constructor(props) {
    super(props);
    this.animatedWidth = new Animated.Value(0);
  }

  onButtonLayout = ev => {
    const { width } = ev.nativeEvent.layout;

    Animated.timing(this.animatedWidth, {
      toValue: width,
      duration: 18000,
      easing: Easing.linear
    }).start();
  };

  render() {
    const { label, style, variant } = this.props;

    const buttonLabel =
      Platform.OS === "android" ? label.toLocaleUpperCase() : label;
    return (
      <View
        style={[styles.surface, variants[variant].surface, style]}
        onLayout={this.onButtonLayout}
      >
        <Animated.View
          style={[
            styles.loading,
            variants[variant].loading,
            { width: this.animatedWidth }
          ]}
        />
        <Text style={[styles.text, variants[variant].text]}>{buttonLabel}</Text>
      </View>
    );
  }
}

ButtonLoading.propTypes = {
  label: PropTypes.string.isRequired,
  style: PropTypes.any,
  variant: PropTypes.oneOf(["default", "white"])
};

ButtonLoading.defaultProps = {
  style: null,
  variant: "default"
};

export default ButtonLoading;
