import React from "react";
import PropTypes from "prop-types";
import { Image, StyleSheet, View, Text } from "react-native";
import { withNavigation } from "react-navigation";
import Touchable from "./Touchable";
import Assets from "../assets";
import Theme from "../assets/Theme";

const styles = StyleSheet.create({
  surface: {
    height: 48,
    width: 48,
    flex: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 24,
    marginBottom: 16
  },
  icon: {
    resizeMode: "contain",
    tintColor: Theme.colors.darkgrey
  }
});

const HomeButton = ({ navigation, homeScreen, extraAction, extraStyle }) => {
  const action = () => {
    navigation.navigate(homeScreen);
    if (extraAction && typeof extraAction === "function") {
      extraAction();
    }
  };

  return (
    <View>
      <Touchable onPress={action} accessibilityLabel="Back" style={extraStyle}>
        <View style={styles.surface}>
          <Image style={styles.icon} source={Assets.creditLineIcon} />
        </View>
      </Touchable>
    </View>
  );
};

HomeButton.propTypes = {
  navigation: PropTypes.any.isRequired
};

export default withNavigation(HomeButton);
