/* eslint-disable linebreak-style */
import React from "react";
import PropTypes from "prop-types";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  BackHandler,
} from "react-native";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Button from "../components/Button";
import ButtonLoading from "../components/ButtonLoading";
import TextInputBorder from "../components/TextInputBorder";
import SuccessView from "../components/SuccessView";
import TopBarBackHome from "../components/TopBarBackHome";

import * as intl from "../redux/modules/internationalization";
import * as settings from "../redux/modules/settings";
import * as changePasswordModule from "../redux/modules/changepassword";

import Assets from "../assets";
import Theme from "../assets/Theme";

const { ChangePasswordState } = changePasswordModule;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
    backgroundColor: Theme.colors.white,
  },
  innerContainer: {
    paddingLeft: 16,
    paddingRight: 16,
  },
  title: {
    ...Theme.fonts.regular,
    color: Theme.colors.black,
    fontSize: 26,
    textAlign: "center",
    marginTop: "10%",
  },
  label: {
    ...Theme.fonts.regular,
    color: Theme.colors.black,
    fontSize: 16,
    marginTop: "5%",
  },
  phoneNumberLabel: {
    ...Theme.fonts.regular,
    color: Theme.colors.black,
    fontSize: 16,
    marginTop: "5%",
    marginBottom: "10%",
    textAlign: "center",
  },
  textInputBorder: {
    height: 112,
    borderColor: Theme.colors.green,
  },
  textInput: {
    fontSize: 36,
    textAlign: "center",
  },
  textPrefix: {
    fontSize: 46,
    color: Theme.colors.darkgrey,
  },
  icon: {
    width: 250,
    height: 300,
    resizeMode: "contain",
  },
  errorMessage: { fontSize: 16, textAlign: "center" },
});

class ChangePasswordCodeScreen extends React.Component {
  static navigationOptions = {
    headerShown: false,
  };

  static propTypes = {
    loginActions: PropTypes.objectOf(PropTypes.func).isRequired,
    signupActions: PropTypes.objectOf(PropTypes.func).isRequired,
    navigation: PropTypes.any.isRequired,
    errorMessage: PropTypes.string,
    isProcessing: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    errorMessage: null,
  };

  constructor(props) {
    super(props);
    this.state = { code: "", errorMessage: null };
  }

  changePassword = () => {
    const { changePasswordActions, username, password, code } = this.props;

    changePasswordActions.changePassword({ username, password, code });
  };

  resendPasswordChangeCode = () => {
    const { changePasswordActions, username } = this.props;

    changePasswordActions.resendChangePasswordCode(
      username,
      () => {
        this.setState({ resendCodeMessage: "Code sent." });
      },
      (errorMessage) => {
        this.setState({ resendCodeMessage: errorMessage });
      }
    );
  };

  render() {
    const {
      changePasswordStatus,
      changePasswordErrorMessage,
      intlActions,
      navigation,
      changePasswordActions,
    } = this.props;

    const { code, resendCodeMessage } = this.state;

    const passwordChangedSuccess = intlActions.getString(
      "PASSWORD_CHANGED_SUCCESS"
    );

    if (
      changePasswordStatus === ChangePasswordState.CHANGING_PASSWORD_SUCCESS
    ) {
      return (
        <SuccessView
          text={passwordChangedSuccess}
          onTimeOut={() => {
            navigation.navigate("SignIn");
            changePasswordActions.changePasswordReset();
          }}
          icon={Assets.checkIcon}
          iconStyle={styles.icon}
        />
      );
    }

    const isProcessing =
      changePasswordStatus === ChangePasswordState.CHANGING_PASSWORD ||
      changePasswordStatus === ChangePasswordState.WAITING_TX_RESPONSE;

    const updateCode = (input) => {
      this.setState({ code: input });
      changePasswordActions.changePasswordStatusReset();
      changePasswordActions.setCode(input);
    };

    // literals
    const changePasswordLiteral = intlActions.getString(
      "CHANGE_PASSWORD_LITERAL"
    );
    const verifyPhoneNumberMessage = intlActions.getString(
      "VERIFY_PHONE_NUMBER_MESSAGE"
    );
    const updatingPasswordLiteral = intlActions.getString(
      "UPDATING_PASSWORD_LITERAL"
    );
    const wrongVerificationCodeLiteral = intlActions.getString(
      "WRONG_VERIFICATION_CODE_LITERAL"
    );

    const enterCodeLiteral = intlActions.getString("ENTER_CODE_LITERAL");
    const submitLiteral = intlActions.getString("SUBMIT_LITERAL");

    const variant = "success";

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <TopBarBackHome screen="SignIn" />
          <View style={styles.innerContainer}>
            <Text style={styles.title}>{changePasswordLiteral}</Text>
            <Text style={styles.phoneNumberLabel}>
              {verifyPhoneNumberMessage}
            </Text>
            <TextInputBorder
              style={styles.textInputBorder}
              styleInput={styles.textInput}
              value={code}
              placeholder={enterCodeLiteral}
              accessibilityLabel="Code"
              onChangeValue={updateCode}
              hint={this.state.wrongCode ? wrongVerificationCodeLiteral : null}
            />
            {resendCodeMessage ? (
              <Text style={{ marginBottom: "2%", alignSelf: "center" }}>
                {resendCodeMessage}
              </Text>
            ) : null}
            {isProcessing ? (
              <ButtonLoading
                style={styles.submitButton}
                variant={variant}
                label={updatingPasswordLiteral + "..."}
              />
            ) : code ? (
              <Button
                style={styles.submitButton}
                label={submitLiteral}
                accessibilityLabel="Submit"
                onPress={() => {
                  this.changePassword();
                }}
              />
            ) : null}
            {changePasswordErrorMessage ? (
              <Text style={styles.errorMessage}>
                {changePasswordErrorMessage}
              </Text>
            ) : null}

            {code ? null : (
              <Button
                label="Resend code"
                variant="fancy"
                onPress={this.resendPasswordChangeCode}
              />
            )}
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => ({
  changePasswordStatus: changePasswordModule.getPasswordChangeStatus(state),
  changePasswordErrorMessage: changePasswordModule.getChangePasswordErrorMessage(
    state
  ),
  code: changePasswordModule.getCode(state),
  password: changePasswordModule.getPassword(state),
  username: changePasswordModule.getUsername(state),
  login: state.login,
});

const mapDispatchToProps = (dispatch) => ({
  intlActions: bindActionCreators(intl.actions, dispatch),
  settingsActions: bindActionCreators(settings.actions, dispatch),
  changePasswordActions: bindActionCreators(changePasswordModule, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChangePasswordCodeScreen);
