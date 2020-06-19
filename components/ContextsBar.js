import React from "react";
import { StyleSheet, View } from "react-native";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import * as intl from "../redux/modules/internationalization";
import * as contextModule from "../redux/modules/context.js";
import ContextsList from "./ContextsList";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
  },
});

const ContextsBar = (props) => {
  const { navigation } = props;

  const contexts = contextModule.getContexts();

  return (
    <View>
      <ContextsList
        contexts={contexts}
        onPressContext={() => navigation.navigate("Balance")}
        navigation={navigation}
      />
    </View>
  );
};

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(contextModule.actions, dispatch),
  intlActions: bindActionCreators(intl.actions, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContextsBar);
