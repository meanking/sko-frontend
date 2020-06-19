import React from "react";
import PropTypes from "prop-types";
import { SafeAreaView, StyleSheet } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { NavigationEvents } from "react-navigation";

import * as navigationModule from "../redux/modules/navigation";
import * as settings from "../redux/modules/settings";

import Theme from "../assets/Theme";
import UserStatusTopBar from "../components/UserStatusTopBar";

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: Theme.colors.white
  }
});

class DashboardScreen extends React.Component {
  static navigationOptions = {
    headerShown: false
  };

  static propTypes = {
    children: PropTypes.arrayOf(PropTypes.node),
    actions: PropTypes.objectOf(PropTypes.func).isRequired,
    screen: PropTypes.string.isRequired
  };

  static defaultProps = {
    children: null
  };

  render() {
    const { actions, children, screen, isVerified, navigation } = this.props;

    return (
      <SafeAreaView style={styles.outerContainer}>
        <NavigationEvents
          onWillFocus={() => actions.dashboardSwitchTo(screen)}
        />
        {isVerified === false ? (
          <UserStatusTopBar
            onPress={() => {
              navigation.navigate("AccountVerification");
            }}
          ></UserStatusTopBar>
        ) : null}
        {children}
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  isVerified: settings.isVerified(state)
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(navigationModule, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(DashboardScreen);
