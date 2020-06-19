import React from "react";
import PropTypes from "prop-types";
import { Text, SafeAreaView, StyleSheet, View } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import TextInputBorder from "../components/TextInputBorder";

import TopBarBackHome from "../components/TopBarBackHome";
import Button from "../components/Button";

import * as creditLineModule from "../redux/modules/creditline";
import * as intl from "../redux/modules/internationalization";
import * as settings from "../redux/modules/settings";

import Theme from "../assets/Theme";
import ButtonLoading from "../components/ButtonLoading";

const { CheckCredentialsState } = settings;

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
    height: 112,
    borderColor: Theme.colors.green
  },
  textInput: {
    fontSize: 36
  },
  textPrefix: {
    fontSize: 46,
    color: Theme.colors.darkgrey
  }
});

class ChangePhoneNumberPasswordScreen extends React.Component {
  static navigationOptions = {
    title: null
  };

  static propTypes = {
    settingsActions: PropTypes.objectOf(PropTypes.func).isRequired,
    navigation: PropTypes.any.isRequired
  };

  constructor(props) {
    super(props);

    this.state = { password: null, wrongPassword: false };
  }

  render() {
    const {
      intlActions,
      navigation,
      settingsActions,
      login,
      status,
      validCredentials
    } = this.props;

    const { password } = this.state;

    const updatePassword = password => {
      settingsActions.resetCredentialsCheck();
      this.setState({ password: password, wrongPassword: false });
    };

    const changePhoneNumberLiteral = intlActions.getString(
      "CHANGE_PHONE_NUMBER_LITERAL"
    );

    const isProcessing = status == CheckCredentialsState.CHECKING_CREDENTIALS;
    const checkingCredentialsLiteral = intlActions.getString(
      "CHECKING_CREDENTIALS_LITERAL"
    );
    const pleaseEnterYourPasswordLiteral = intlActions.getString(
      "PLEASE_ENTER_YOUR_PASSWORD_LITERAL"
    );
    const wrongPasswordLiteral = intlActions.getString(
      "WRONG_PASSWORD_LITERAL"
    );
    const nextLiteral = intlActions.getString("NEXT_LITERAL");

    if (status === CheckCredentialsState.CHECKING_CREDENTIALS_SUCCESS) {
      if (validCredentials) {
        settingsActions.setPassword(password);
        navigation.navigate("ChangePhoneNumberConfirm");
      } else {
        if (this.state.wrongPassword !== true)
          this.setState({ wrongPassword: true });
      }
    }

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <TopBarBackHome
            screen="Settings"
            onHome={() => settingsActions.resetPhoneNumberChange()}
          />
          <View style={styles.innerContainer}>
            <Text style={styles.title}>{changePhoneNumberLiteral}</Text>
            <Text style={styles.label}>{pleaseEnterYourPasswordLiteral}</Text>

            <TextInputBorder
              style={styles.textInputBorder}
              styleInput={styles.textInput}
              stylePrefix={styles.textPrefix}
              value={password}
              accessibilityLabel="PhoneNumber"
              secureTextEntry
              onChangeValue={updatePassword}
            />

            {this.state.wrongPassword ? (
              <Text style={(styles.label, { textAlign: "center" })}>
                {wrongPasswordLiteral}
              </Text>
            ) : null}

            {isProcessing ? (
              <ButtonLoading label={checkingCredentialsLiteral + "..."} />
            ) : password ? (
              <Button
                label={nextLiteral}
                accessibilityLabel="AmountNext"
                onPress={() => {
                  this.setState({ wrongPassword: false });
                  settingsActions.checkCredentials(login.username, password);
                }}
              />
            ) : null}
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  currency: creditLineModule.getCurrency(state),
  login: state.login,
  status: settings.getCheckCredentialsStatus(state),
  validCredentials: settings.areCredentialsValid(state)
});

const mapDispatchToProps = dispatch => ({
  settingsActions: bindActionCreators(settings.actions, dispatch),
  intlActions: bindActionCreators(intl.actions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChangePhoneNumberPasswordScreen);
