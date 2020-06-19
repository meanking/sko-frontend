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

import * as intl from "../redux/modules/internationalization";
import * as verification from "../redux/modules/verification";
import * as settings from "../redux/modules/settings";

import Assets from "../assets";
import Theme from "../assets/Theme";

const { VerifyAccountState } = verification;

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
});

class PhoneNumberVerificationScreen extends React.Component {
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
    this.state = { code: "", isCodeUpdated: false, resendCodeMessage: null };
  }

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.handleBackButton);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton);
  }

  handleBackButton() {
    return true;
  }

  verifyNumber = () => {
    const { verificationActions, login } = this.props;

    const { username } = login;
    const { code } = this.state;

    verificationActions.verifyPhoneNumber(username, code);
  };

  resendPhoneNumberCode = () => {
    const { verificationActions, login } = this.props;

    verificationActions.resendPhoneNumberCode(
      login.username,
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
      verifyPhoneNumberStatus,
      verifyPhoneNumberErrorMessage,
      verificationActions,
      intlActions,
      navigation,
      settingsActions,
      login,
      accountData,
    } = this.props;

    const { phoneNumber } = accountData;
    const { code, resendCodeMessage } = this.state;
    const verificationSuccessfulLiteral = intlActions.getString(
      "VERIFICATION_SUCCESSFUL"
    );

    if (verifyPhoneNumberStatus === VerifyAccountState.VERIFY_SUCCESS) {
      settingsActions.loadAccountSettings();
      return (
        <SuccessView
          text={verificationSuccessfulLiteral}
          onTimeOut={() => {
            navigation.dismiss();
            verificationActions.resetVerificationProcess();
          }}
          icon={Assets.checkIcon}
          iconStyle={styles.icon}
        />
      );
    }

    if (
      verifyPhoneNumberStatus === VerifyAccountState.VERIFY_FAILED &&
      !this.state.wrongCode
    ) {
      this.setState({ wrongCode: true });
    }

    const isProcessing =
      verifyPhoneNumberStatus === VerifyAccountState.VERIFYING ||
      verifyPhoneNumberStatus === VerifyAccountState.WAITING_TX_RESPONSE;

    const updateCode = (input) => {
      this.setState({ code: input, wrongCode: false });
    };

    // literals
    const verifyPhoneNumberTitle = intlActions.getString(
      "VERIFY_PHONE_NUMBER_TITLE"
    );
    const verifyPhoneNmmberMessage = intlActions.getString(
      "VERIFY_PHONE_NUMBER_MESSAGE"
    );
    const verifyingPhoneNumberLiteral = intlActions.getString(
      "VERIFYING_PHONE_NUMBER_LITERAL"
    );
    const codeSentToLiteral = intlActions.getString("CODE_SENT_TO_LITERAL");
    const skipLiteral = intlActions.getString("SKIP_LITERAL");
    const wrongVerificationCodeLiteral = intlActions.getString(
      "WRONG_VERIFICATION_CODE_LITERAL"
    );

    const enterCodeLiteral = intlActions.getString("ENTER_CODE_LITERAL");
    const submitLiteral = intlActions.getString("SUBMIT_LITERAL");

    const variant = "success";

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <View style={styles.innerContainer}>
            <Text style={styles.title}>{verifyPhoneNumberTitle}</Text>
            <Text style={styles.label}>{verifyPhoneNmmberMessage}</Text>
            <Text style={styles.phoneNumberLabel}>
              {codeSentToLiteral + " " + accountData.phoneNumber}
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
                label={verifyingPhoneNumberLiteral}
              />
            ) : code ? (
              <Button
                style={styles.submitButton}
                label={submitLiteral}
                accessibilityLabel="Submit"
                onPress={() => {
                  this.verifyNumber();
                }}
              />
            ) : null}
            <View>
              {code ? null : (
                <Button
                  label="Resend code"
                  variant="fancy"
                  onPress={this.resendPhoneNumberCode}
                />
              )}
              {!isProcessing ? (
                <Button
                  variant="warning"
                  label={skipLiteral}
                  accessibilityLabel="Skip"
                  onPress={() => {
                    navigation.navigate("Balance");
                  }}
                />
              ) : null}
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => ({
  login: state.login,
  accountData: settings.getAccountData(state),
  verifyPhoneNumberStatus: verification.getVerifyPhoneNumberStatus(state),
  verifyPhoneNumberErrorMessage: verification.getVerifyPhoneNumberErrorMessage(
    state
  ),
});

const mapDispatchToProps = (dispatch) => ({
  verificationActions: bindActionCreators(verification.actions, dispatch),
  intlActions: bindActionCreators(intl.actions, dispatch),
  settingsActions: bindActionCreators(settings.actions, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PhoneNumberVerificationScreen);
