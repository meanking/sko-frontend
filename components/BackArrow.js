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

const BackArrow = ({ dismiss, navigation, onPress }) => {
  const action = () => {
    if (dismiss) {
      navigation.dismiss();
    } else {
      if (onPress) {
        // in case a custom action is provided
        onPress();
      } else {
        navigation.goBack();
      }
    }
  };

  return (
    <Touchable onPress={action} accessibilityLabel="Back">
      <View style={styles.surface}>
        <Image style={styles.icon} source={Assets.arrowBackIcon} />
        {/* <Text>Sum text</Text> */}
      </View>
    </Touchable>
  );
};

BackArrow.propTypes = {
  navigation: PropTypes.any.isRequired,
  dismiss: PropTypes.bool,
  onPress: PropTypes.func
};

BackArrow.defaultProps = {
  dismiss: false,
  onPress: null
};

export default withNavigation(BackArrow);
