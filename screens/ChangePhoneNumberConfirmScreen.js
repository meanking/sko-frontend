import React from "react";
import PropTypes from "prop-types";
import { Text, SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Button from "../components/Button";
import ButtonLoading from "../components/ButtonLoading";
import TextInputBorder from "../components/TextInputBorder";
import SuccessView from "../components/SuccessView";
import FailureView from "../components/FailureView";

import TopBarBackHome from "../components/TopBarBackHome";
import { formatAmount } from "../lib/format";
import * as connectionModule from "../redux/modules/connection";
import Theme from "../assets/Theme";
import Assets from "../assets";

import * as intl from "../redux/modules/internationalization";
import * as settingsModule from "../redux/modules/settings";

const { ChangePhoneNumberState } = settingsModule;
const Colors = Theme.colors;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    marginBottom: 20,
    backgroundColor: Colors.white
  },
  innerContainer: {
    paddingLeft: 16,
    paddingRight: 16
  },
  title: {
    ...Theme.fonts.regular,
    color: Colors.black,
    fontSize: 22,
    marginBottom: 19
  },
  label: {
    ...Theme.fonts.regular,
    color: Colors.black,
    fontSize: 16,
    marginBottom: 23
  },
  icon: {
    width: 197,
    height: 308,
    resizeMode: "contain",
    marginBottom: 15
  },
  input: {
    marginBottom: 7
  },
  disclaimer: {
    ...Theme.fonts.regular,
    color: Colors.black,
    fontSize: 14,
    marginLeft: 14,
    marginRight: 14,
    textAlign: "center"
  }
});

const DimmableContainer = props => {
  const { isDimmed, children, style } = props;

  return (
    <View style={style}>
      {children}

      {isDimmed ? (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "#FFFFFFBF"
          }}
        />
      ) : null}
    </View>
  );
};

DimmableContainer.propTypes = {
  isDimmed: PropTypes.bool,
  children: PropTypes.arrayOf(PropTypes.element),
  style: PropTypes.any
};

DimmableContainer.defaultProps = {
  isDimmed: false,
  children: null,
  style: null
};

class ChangePhoneNumberConfirmScreen extends React.Component {
  static navigationOptions = {
    title: null
  };

  static propTypes = {
    login: PropTypes.shape({
      username: PropTypes.string
    }).isRequired,
    navigation: PropTypes.any.isRequired
  };

  render() {
    const {
      login,
      navigation,
      errorMessage,
      intlActions,
      newPhoneNumber,
      password,
      status,
      settingsActions
    } = this.props;

    const isProcessing =
      status === ChangePhoneNumberState.CHANGING_PHONE_NUMBER ||
      status === ChangePhoneNumberState.WAITING_TX_RESPONSE;

    const phoneNumberChangedSuccess = intlActions.getString(
      "PHONE_NUMBER_CHANGED_SUCCESS"
    );
    const confirmPhoneNumberChangeLiteral = intlActions.getString(
      "CONFIRM_PHONE_NUMBER_CHANGE_LITERAL"
    );
    const reviewBeforeConfirmationLiteral = intlActions.getString(
      "REVIEW_BEFORE_CONFIRMATION_LITERAL"
    );
    const newPhoneNumberLiteral = intlActions.getString(
      "NEW_PHONE_NUMBER_LITERAL"
    );
    const processingRequestLiteral = intlActions.getString(
      "PROCESSING_YOUR_REQUEST_LITERAL"
    );
    const confirmLiteral = intlActions.getString("CONFIRM_LITERAL");

    const confirmationDisclaimer = intlActions.getString(
      "CHANGE_PHONE_NUMBER_VERIFICATION"
    );

    if (status === ChangePhoneNumberState.CHANGING_PHONE_NUMBER_SUCCESS) {
      return (
        <SuccessView
          text={phoneNumberChangedSuccess}
          onTimeOut={() => {
            settingsActions.resetPhoneNumberChange();
            navigation.dismiss();
          }}
          icon={Assets.confirmConnectionIcon}
          iconStyle={styles.icon}
        />
      );
    }

    if (status === ChangePhoneNumberState.CHANGING_PHONE_NUMBER_FAILED) {
      return (
        <FailureView
          text={errorMessage}
          label={intlActions.getString("RETRY_LITERAL")}
          onCancel={() => navigation.dismiss()}
          onPress={() => settingsActions.resetPhoneNumberChange()}
        />
      );
    }

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView style={styles.container}>
          <TopBarBackHome
            screen="Settings"
            onHome={() => settingsActions.resetPhoneNumberChange()}
          />
          <DimmableContainer
            style={styles.innerContainer}
            isDimmed={isProcessing}
          >
            <Text style={styles.title}>{confirmPhoneNumberChangeLiteral}</Text>
            <Text style={styles.label}>{reviewBeforeConfirmationLiteral}</Text>

            <TextInputBorder
              style={styles.input}
              styleLabel={{ color: Colors.darkgrey }}
              styleInput={{ color: Colors.darkgrey }}
              borderTitle={newPhoneNumberLiteral}
              value={newPhoneNumber.toString()}
              editable={false}
            />
          </DimmableContainer>

          {isProcessing ? (
            <ButtonLoading label={processingRequestLiteral + "..."} />
          ) : (
            <Button
              label={confirmLiteral}
              accessibilityLabel="Confirm"
              onPress={() => {
                settingsActions.changePhoneNumber({
                  username: login.username,
                  newPhoneNumber: newPhoneNumber,
                  password: password
                });
              }}
            />
          )}
          <Text style={styles.disclaimer}>{"*" + confirmationDisclaimer}</Text>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  login: state.login,
  connection: state.connection.newConnection,
  newPhoneNumber: settingsModule.getNewPhoneNumber(state),
  password: settingsModule.getPassword(state),
  errorMessage: connectionModule.getNewConnectionErrorMessage(state),
  status: settingsModule.getChangePhoneNumberStatus(state)
});

const mapDispatchToProps = dispatch => ({
  settingsActions: bindActionCreators(settingsModule.actions, dispatch),
  intlActions: bindActionCreators(intl.actions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChangePhoneNumberConfirmScreen);
