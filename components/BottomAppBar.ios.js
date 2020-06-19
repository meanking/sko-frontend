import React from "react";
import PropTypes from "prop-types";
import { Image, StyleSheet, View, Text } from "react-native";
import { withNavigation } from "react-navigation";
import Touchable from "./Touchable";
import { FAB_SIZE } from "./FabButton";
import Assets from "../assets";
import Theme from "../assets/Theme";

export const BAR_HEIGHT = 56;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 2 * BAR_HEIGHT,
    justifyContent: "flex-end",
  },
  bar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: BAR_HEIGHT,
    backgroundColor: Theme.colors.darkviolet,
    zIndex: 1,
  },
  menuIcon: {
    width: 24,
    height: 24,
    margin: 16,
    tintColor: Theme.colors.white,
  },
  fabWrapper: {
    position: "absolute",
    alignSelf: "center",
    top: BAR_HEIGHT / 2,
    left: "50%",
    marginLeft: -FAB_SIZE / 2,
    zIndex: 2,
  },
  tools: {
    flexDirection: "row",
  },
});

const BottomAppBar = (props) => {
  const { fab, navigation, children } = props;

  return (
    <View style={styles.container}>
      <View style={styles.fabWrapper}>{fab}</View>
      <View style={styles.bar}>
        <Touchable
          accessibilityRole="button"
          accessibilityLabel="Menu"
          onPress={() => navigation.navigate("Drawer")}
        >
          <Image source={Assets.menuIcon} style={styles.menuIcon} />
        </Touchable>
        <View style={styles.tools}>{children}</View>
      </View>
    </View>
  );
};

BottomAppBar.propTypes = {
  fab: PropTypes.element,
  navigation: PropTypes.any.isRequired,
  children: PropTypes.node,
};

BottomAppBar.defaultProps = {
  fab: null,
  children: null,
};

export default withNavigation(BottomAppBar);
