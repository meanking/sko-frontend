import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import Touchable from "./Touchable";

import Theme from "../assets/Theme";
import Assets from "../assets";

import * as contextModule from "../redux/modules/context";
import { ContextType } from "../lib/types";

const styles = StyleSheet.create({
  contextImage: {
    backgroundColor: Theme.colors.grey,
    borderRadius: 24,
    width: 70,
    height: 70,
    alignItems: "center",
  },
  image: {
    flex: 1,
    width: 55,
    resizeMode: "contain",
  },
  title: {
    ...Theme.fonts.semiBold,
    fontSize: 16,
    color: Theme.colors.white,
    marginLeft: 12,
  },
  subtitle: {
    ...Theme.fonts.regular,
    fontSize: 12,
    color: Theme.colors.white,
    marginLeft: 12,
    opacity: 0.5,
  },
  contextViewContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
  },
  selectedContextImage: {
    backgroundColor: Theme.colors.grey,
    borderRadius: 24,
    width: 70,
    height: 70,
    alignItems: "center",
    borderBottomWidth: 4,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderColor: Theme.colors.darkred,
  },
});

const ContextView = (props) => {
  const { context, actions, currentContext } = props;

  const logo = Assets[context.idName + "Logo"];
  const isSelected = context.idName === currentContext.idName;

  return (
    <Touchable
      onPress={() => {
        actions.changeContext(context);
      }}
    >
      <View style={styles.contextViewContainer}>
        <View
          style={isSelected ? styles.selectedContextImage : styles.contextImage}
        >
          <Image style={styles.image} source={logo} />
        </View>
      </View>
    </Touchable>
  );
};

ContextView.propTypes = {
  context: ContextType.isRequired,
  currentContext: ContextType.isRequired,
};

ContextView.defaultProps = {
  children: null,
  style: null,
};

const mapStateToProps = (state) => ({
  currentContext: state.context.currentContext,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(contextModule, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContextView);
