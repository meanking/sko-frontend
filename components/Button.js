import React from "react";
import PropTypes from "prop-types";
import {
  Platform,
  StyleSheet,
  Text, 
  View,
} from "react-native";

import Theme from "../assets/Theme";

import Touchable from './Touchable'

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
  },
  text: {
    ...Theme.fonts.semiBold,
    fontSize: 16,
    textAlign: "center",
    paddingLeft: 10,
    paddingRight: 10,
  },
});

export const variants = {
  default: StyleSheet.create({
    surface: {
      backgroundColor: Theme.colors.green,
    },
    text: {
      color: Theme.colors.white,
    },
    loading: { backgroundColor: Theme.colors.blackgrey },
  }),
  white: StyleSheet.create({
    surface: {
      backgroundColor: Theme.colors.white,
    },
    text: {
      color: Theme.colors.green,
    },
    loading: { backgroundColor: Theme.colors.blackgrey },
  }),
  disabled: StyleSheet.create({
    surface: { backgroundColor: Theme.colors.grey },
    text: { color: Theme.colors.darkgreen },
    loading: { backgroundColor: Theme.colors.blackgrey },
  }),
  success: StyleSheet.create({
    surface: { backgroundColor: Theme.colors.green },
    text: { color: Theme.colors.white },
    loading: { backgroundColor: Theme.colors.blackgrey },
  }),
  warning: StyleSheet.create({
    surface: { backgroundColor: Theme.colors.yellow },
    text: { color: Theme.colors.white },
    loading: { backgroundColor: Theme.colors.blackgrey },
  }),
  danger: StyleSheet.create({
    surface: { backgroundColor: Theme.colors.darkred },
    text: { color: Theme.colors.white },
    loading: { backgroundColor: Theme.colors.blackgrey },
  }),
  normal: StyleSheet.create({
    surface: { backgroundColor: Theme.colors.blue },
    text: { color: Theme.colors.white },
    loading: { backgroundColor: Theme.colors.blackgrey },
  }),
  "normal-reverse": StyleSheet.create({
    surface: { backgroundColor: Theme.colors.white },
    text: { color: Theme.colors.blue },
    loading: { backgroundColor: Theme.colors.blackgrey },
  }),
  fancy: StyleSheet.create({
    surface: { backgroundColor: Theme.colors.cyan },
    text: { color: Theme.colors.white },
    loading: { backgroundColor: Theme.colors.blackgrey },
  }),
};

const Button = (props) => {
  const {
    label,
    accessibilityLabel,
    style,
    variant,
    onPress,
    disabled,
  } = props;
  
  const buttonLabel =
    Platform.OS === "android" ? label.toLocaleUpperCase() : label;

  const variantToUse = disabled ? "disabled" : variant;

  return (
    <Touchable
      disabled={disabled}
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
    >
      <View style={[styles.surface, variants[variantToUse].surface, style]}>
        <Text style={[styles.text, variants[variantToUse].text, style]}>
          {buttonLabel}
        </Text>
      </View>
    </Touchable>
  );
};

Button.propTypes = {
  label: PropTypes.string.isRequired,
  style: PropTypes.any,
  variant: PropTypes.oneOf(["default", "white"]),
  onPress: PropTypes.func.isRequired,
  accessibilityLabel: PropTypes.string,
};

Button.defaultProps = {
  style: null,
  variant: "default",
  accessibilityLabel: null,
};

export default Button;
