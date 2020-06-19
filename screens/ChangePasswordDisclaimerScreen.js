import React from "react";
import PropTypes from "prop-types";
import { Text, SafeAreaView, StyleSheet, View } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import TextInputBorder from "../components/TextInputBorder";

import TopBarBackHome from "../components/TopBarBackHome";
import Button from "../components/Button";

import * as settings from "../redux/modules/settings";
import * as intl from "../redux/modules/internationalization";
import * as userSearchModule from "../redux/modules/userSearch";
import * as changePasswordModule from "../redux/modules/changepassword";

import Theme from "../assets/Theme";
import TextInputUserSearch from "../components/TextInputUserSearch";

const { SearchUserState } = userSearchModule;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.colors.white,
    flex: 1,
    paddingTop: 16
  },
  innerContainer: {
    paddingLeft: 16,
    paddingRight: 16,
    flex: 1
  },
  title: {
    ...Theme.fonts.regular,
    color: Theme.colors.black,
    fontSize: 22,
    marginBottom: 19
  },
  label: {
    ...Theme.fonts.regular,
    color: Theme.colors.black,
    fontSize: 16,
    marginBottom: 15
  },
  textInputBorder: {
    height: 80,
    borderColor: Theme.colors.green
  },
  textInput: {
    fontSize: 30
  },
  textPrefix: {
    fontSize: 46,
    color: Theme.colors.darkgrey
  }
});

class ChangePasswordDisclaimerScreen extends React.Component {
  static navigationOptions = {
    title: null
  };

  static propTypes = {
    creditLineActions: PropTypes.objectOf(PropTypes.func).isRequired,
    navigation: PropTypes.any.isRequired
  };

  constructor(props) {
    super(props);

    this.state = { username: null };
  }

  render() {
    const {
      intlActions,
      navigation,
      userSearchActions,
      userSearch,
      changePasswordActions
    } = this.props;

    const { username } = this.state;

    const changePasswordLiteral = intlActions.getString(
      "CHANGE_PASSWORD_LITERAL"
    );
    const changePasswordDisclaimer = intlActions.getString(
      "CHANGE_PASSWORD_DISCLAIMER"
    );
    const continueLiteral = intlActions.getString("CONTINUE_LITERAL");
    const cancelLiteral = intlActions.getString("CANCEL_LITERAL");

    const updateUsername = username => {
      this.setState({ username: username });
    };

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <TopBarBackHome
            screen="SignIn"
            onBack={() => {
              navigation.navigate("SignIn");
              changePasswordActions.initiatePasswordChangeReset();
              userSearchActions.resetUserSearch();
            }}
          ></TopBarBackHome>

          <View style={styles.innerContainer}>
            <Text style={styles.title}>{changePasswordLiteral}</Text>
            <Text style={styles.label}>{changePasswordDisclaimer}</Text>

            <TextInputUserSearch
              style={styles.textInputBorder}
              userSearchState={userSearch.state}
              value={username}
              accessibilityLabel="Username"
              onChangeUser={username => {
                updateUsername(username);
                if (userSearch.state !== SearchUserState.IDLE) {
                  userSearchActions.resetUserSearch();
                }
              }}
              borderTitle={"Username"}
            />

            {username ? (
              <Button
                label={continueLiteral}
                accessibilityLabel="Continue"
                onPress={() => {
                  userSearchActions.searchUserNonAuth(username, {
                    onSuccess: () => {
                      changePasswordActions.initiatePasswordChange(username);
                      changePasswordActions.setUsername(username);
                      navigation.navigate("ChangePasswordInput");
                    }
                  });
                }}
              ></Button>
            ) : null}
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  userSearch: state.userSearch
});

const mapDispatchToProps = dispatch => ({
  settingsActions: bindActionCreators(settings.actions, dispatch),
  intlActions: bindActionCreators(intl.actions, dispatch),
  userSearchActions: bindActionCreators(userSearchModule, dispatch),
  changePasswordActions: bindActionCreators(changePasswordModule, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChangePasswordDisclaimerScreen);
