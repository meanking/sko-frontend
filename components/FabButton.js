import React from "react";
import PropTypes from "prop-types";
import { Image, StyleSheet, View } from "react-native";

import Touchable from "./Touchable";
import Theme from "../assets/Theme";

export const FAB_SIZE = 56;

const styles = StyleSheet.create({
  fab: {
    flex: 1,
    height: FAB_SIZE,
    width: FAB_SIZE,
    backgroundColor: Theme.colors.green,
    borderRadius: FAB_SIZE / 2,
    alignItems: "center",
    justifyContent: "center"
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: Theme.colors.white
  }
});

const FabButton = ({ icon, onPress, accessibilityLabel, disabled }) => (
  <Touchable
    onPress={onPress}
    accessibilityLabel={accessibilityLabel}
    accessibilityRole="button"
    disabled={disabled}
  >
    <View style={styles.fab}>
      <Image
        source={icon}
        style={[styles.icon, { opacity: disabled ? 0.4 : 1 }]}
      />
    </View>
  </Touchable>
);

FabButton.propTypes = {
  icon: PropTypes.any.isRequired,
  onPress: PropTypes.func.isRequired,
  accessibilityLabel: PropTypes.string,
  disabled: PropTypes.bool
};

FabButton.defaultProps = {
  accessibilityLabel: null
};

export default FabButton;
