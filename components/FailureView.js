import React from "react";
import PropTypes from "prop-types";
import { Image, StyleSheet, Text, View } from "react-native";
import { withNavigation } from "react-navigation";
import * as intl from "../redux/modules/internationalization";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import Assets from "../assets";
import Theme from "../assets/Theme";
import Button from "./Button";

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.colors.white,
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  textContainer: {
    flex: 0,
    flexDirection: "column",
    marginLeft: "5%",
    marginRight: "5%",
    alignItems: "center"
  },
  h1: {
    ...Theme.fonts.semiBold,
    color: Theme.colors.darkgrey,
    fontSize: 18
  },
  h2: {
    ...Theme.fonts.regular,
    fontSize: 14,
    color: Theme.colors.darkgrey,
    textAlign: "center",
    marginTop: 24
  },
  h3: {
    ...Theme.fonts.regular,
    fontSize: 16,
    color: Theme.colors.red,
    textAlign: "center",
    marginTop: 12
  },
  image: {
    flex: 0,
    width: "60%",
    maxHeight: 300,
    resizeMode: "contain",
    marginBottom: 24
  },
  buttonContainer: {
    marginTop: 32
  }
});

const FailureView = props => {
  const {
    children,
    icon,
    onCancel,
    onPress,
    text,
    title,
    label,
    helper,
    intlActions,
    errorMessage,
  } = props;

  const title_to_use = title || intlActions.getString("FAILURE_VIEW_TITLE");
  const label_to_use = label || intlActions.getString("FAILURE_VIEW_LABEL");
  const helper_to_use = helper || intlActions.getString("FAILURE_VIEW_HELPER");

  return (
    <View style={styles.container}>
      <Image source={icon} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.h1}>{title_to_use}</Text>
        {text ? <Text style={styles.h1}>{text}</Text> : null}
        {errorMessage? <Text style={styles.h3}>{errorMessage}</Text>: null}
        <Text style={styles.h2}>{helper_to_use}</Text>
      </View>
      <View>
        <Button label={label_to_use} variant="white" onPress={onPress} />
        {onCancel ? (
          <Button label="cancel" variant="white" onPress={onCancel} />
        ) : null}
        {children}
      </View>
    </View>
  );
};

FailureView.propTypes = {
  children: PropTypes.node,
  icon: Image.propTypes.source,
  title: PropTypes.string,
  helper: PropTypes.string,
  label: PropTypes.string,
  onCancel: PropTypes.func,
  onPress: PropTypes.func,
  text: PropTypes.string
};

FailureView.defaultProps = {
  children: null,
  icon: Assets.iceCreamIcon,
  onCancel: null,
  onPress: null,
  text: null
};

const mapStateToProps = state => ({
  errorMessage: state.creditline.errorMessage
});

const mapDispatchToProps = dispatch => ({
  intlActions: bindActionCreators(intl.actions, dispatch)
});

export default withNavigation(
  connect(mapStateToProps, mapDispatchToProps)(FailureView)
);
