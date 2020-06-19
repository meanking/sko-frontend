import React from "react";
import PropTypes from "prop-types";
import { StyleSheet, View } from "react-native";

import BackArrow from "./BackArrow";
import HomeButton from "./HomeButton";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  leftComponent: { alignSelf: "flex-start", flex: 0.5 },
  rightComponent: { alignSelf: "flex-end", flex: 0.5 }
});

const TopBarBackHome = ({ screen, onBack, onHome }) => {
  return (
    <View style={styles.container}>
      <BackArrow onPress={onBack} />
      <HomeButton homeScreen={screen} extraAction={onHome} />
    </View>
  );
};

TopBarBackHome.propTypes = {
  navigation: PropTypes.any.isRequired,
  onPress: PropTypes.func
};

export default TopBarBackHome;
