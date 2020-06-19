import React from "react";
import PropTypes from "prop-types";
import { Image, StyleSheet } from "react-native";
import Touchable from "./Touchable";
import Theme from "../assets/Theme";

const styles = StyleSheet.create({
  icon: {
    width: 24,
    height: 24,
    tintColor: Theme.colors.white,
    margin: 16
  }
});

const MenuButton = props => {
  const { onPress, accessibilityLabel, icon, disabled } = props;
  return (
    <Touchable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      disabled={disabled}
    >
      <Image
        source={icon}
        style={[styles.icon, { opacity: disabled ? 0.4 : 1 }]}
      />
    </Touchable>
  );
};

MenuButton.propTypes = {
  onPress: PropTypes.func.isRequired,
  icon: PropTypes.any.isRequired,
  accessibilityLabel: PropTypes.string
};

MenuButton.defaultProps = {
  accessibilityLabel: null
};

export default MenuButton;
