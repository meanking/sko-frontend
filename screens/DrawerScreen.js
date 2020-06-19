import React from "react";
import PropTypes from "prop-types";
import { TouchableWithoutFeedback, StyleSheet, View } from "react-native";
import Theme from "../assets/Theme";
import Drawer from "../components/Drawer";

const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "transparent"
  }
});

const DrawerScreen = ({ navigation }) => (
  <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
    <View style={styles.screen}>
      <TouchableWithoutFeedback onPress={() => null}>
        <View style={styles.container}>
          <Drawer />
        </View>
      </TouchableWithoutFeedback>
    </View>
  </TouchableWithoutFeedback>
);

DrawerScreen.navigationOptions = {
  headerShown: false
};

DrawerScreen.propTypes = {
  navigation: PropTypes.any.isRequired
};

export default DrawerScreen;
