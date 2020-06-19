import React from "react";
import PropTypes from "prop-types";
import { Image, StyleSheet, Text, View } from "react-native";
import { withNavigation } from "react-navigation";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import Touchable from "./Touchable";
import ContextsBar from "./ContextsBar";

import Assets from "../assets";
import Theme from "../assets/Theme";

import * as login from "../redux/modules/login";
import * as settings from "../redux/modules/settings";
import * as intl from "../redux/modules/internationalization";

const styles = StyleSheet.create({
  container: {
    padding: 8,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: Theme.colors.darkviolet,
  },
  customBar: {
    backgroundColor: "#00000040",
    width: "20%",
    height: 5,
    borderRadius: 5,
    alignSelf: "center",
    marginTop: 5,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    padding: 8,
  },
  optionActive: {
    backgroundColor: "#00000040",
    borderRadius: 5,
  },
  optionDisabled: {
    opacity: 0.5,
  },
  icon: {
    tintColor: Theme.colors.white,
    width: 24,
    height: 24,
  },
  imageContainer: {
    backgroundColor: Theme.colors.grey,
    borderRadius: 24,
    width: 48,
    height: 48,
    alignItems: "center",
  },
  image: {
    flex: 1,
    width: 40,
    resizeMode: "contain",
  },
  label: {
    ...Theme.fonts.semiBold,
    fontSize: 16,
    color: Theme.colors.white,
    marginLeft: 24,
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
  userViewContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 3,
  },
  contextsLabelContainer: {
    alignItems: "center",
  },
  contextsLabelText: {
    ...Theme.fonts.regular,
    backgroundColor: Theme.colors.darkviolet,
    color: Theme.colors.darkgrey,
    fontSize: 16,
    marginTop: 23,
    marginBottom: 13,
    paddingLeft: 15,
    paddingRight: 15,
  },
  contextsLabelLine: {
    borderTopWidth: 1,
    height: 0,
    width: "100%",
    position: "absolute",
    top: 33,
  },
});

const Option = (props) => {
  const { icon, label, onPress, active, disabled } = props;

  const style = [
    styles.option,
    active ? styles.optionActive : null,
    disabled ? styles.optionDisabled : null,
  ];

  const content = (
    <View style={style}>
      <Image style={styles.icon} source={icon} />
      <Text style={styles.label}>{label}</Text>
    </View>
  );

  if (disabled) {
    return content;
  }

  return <Touchable onPress={onPress}>{content}</Touchable>;
};

Option.propTypes = {
  icon: PropTypes.any.isRequired,
  label: PropTypes.string,
  onPress: PropTypes.func,
  active: PropTypes.bool,
  disabled: PropTypes.bool,
};

Option.defaultProps = {
  label: null,
  active: false,
  onPress: null,
  disabled: false,
};

const UserView = ({ name, handle, onPress }) => (
  <Touchable onPress={() => onPress()}>
    <View style={styles.userViewContainer}>
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={Assets.connectionIcon} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{name}</Text>
        <Text style={styles.subtitle}>{handle}</Text>
      </View>
    </View>
  </Touchable>
);

UserView.propTypes = {
  name: PropTypes.string.isRequired,
  handle: PropTypes.string.isRequired,
};

const Drawer = ({ activeScreen, navigation, name, handle, intlActions }) => {
  const navigateTo = (screen) => () => {
    navigation.navigate(screen);
  };

  return (
    <View style={styles.container}>
      <View style={styles.customBar} />
      {/* <ContextsBar navigation={navigation} />
      <View style={styles.contextsLabelContainer}>
        <View style={styles.contextsLabelLine} />
        <Text style={styles.contextsLabelText}>
          {intlActions.getString("CONTEXTS_LITERAL")}
        </Text>
      </View> */}
      <UserView
        onPress={() => navigation.navigate("Settings")}
        name={name}
        handle={handle}
      />
      <Option
        icon={Assets.balanceIcon}
        label={intlActions.getString("DASHBOARD_LITERAL")}
        onPress={navigateTo("Balance")}
        active={activeScreen === "Balance"}
      />
      <Option
        icon={Assets.connectionsIcon}
        label={intlActions.getString("CONNECTIONS_LITERAL")}
        onPress={navigateTo("Connections")}
        active={activeScreen === "Connections"}
      />
      <Option
        icon={Assets.connectionIcon}
        label={intlActions.getString("CREDIT_LINES_LITERAL")}
        onPress={navigateTo("CreditLines")}
        active={activeScreen === "Credit lines"}
      />
      <Option
        icon={Assets.settingsIcon}
        label={intlActions.getString("SETTINGS_LITERAL")}
        accessibilityLabel="Settings"
        onPress={navigateTo("Settings")}
        active={activeScreen === "Settings"}
      />
      <Option icon={Assets.closeIcon} onPress={() => navigation.goBack()} />
    </View>
  );
};

Drawer.propTypes = {
  navigation: PropTypes.any.isRequired,
  activeScreen: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  handle: PropTypes.string.isRequired,
  intlActions: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  activeScreen: state.navigation.dashboardScreen,
  handle: login.getHandle(state),
  name: settings.getDisplayName(state),
});

const mapDispatchToProps = (dispatch) => ({
  intlActions: bindActionCreators(intl.actions, dispatch),
});

export default withNavigation(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Drawer)
);
