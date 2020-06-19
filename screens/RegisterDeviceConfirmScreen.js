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

import * as intl from "../redux/modules/internationalization";
import * as publickeyModule from "../redux/modules/publickey";
import * as cryptographyModule from "../redux/modules/cryptography";

import Theme from "../assets/Theme";
import Assets from "../assets";
const Colors = Theme.colors;

const { AddPublicKeyState } = publickeyModule;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    marginBottom: 20,
    backgroundColor: Colors.white,
  },
  innerContainer: {
    paddingLeft: 16,
    paddingRight: 16,
  },
  title: {
    ...Theme.fonts.regular,
    color: Colors.black,
    fontSize: 22,
    marginBottom: 19,
  },
  label: {
    ...Theme.fonts.regular,
    color: Colors.black,
    fontSize: 16,
    marginBottom: 23,
  },
  icon: {
    width: 197,
    height: 308,
    resizeMode: "contain",
    marginBottom: 15,
  },
  input: {
    marginBottom: 7,
  },
});

const DimmableContainer = (props) => {
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
            backgroundColor: "#FFFFFFBF",
          }}
        />
      ) : null}
    </View>
  );
};

DimmableContainer.propTypes = {
  isDimmed: PropTypes.bool,
  children: PropTypes.arrayOf(PropTypes.element),
  style: PropTypes.any,
};

DimmableContainer.defaultProps = {
  isDimmed: false,
  children: null,
  style: null,
};

class RegisterDeviceConfirmScreen extends React.Component {
  static navigationOptions = {
    title: null,
  };

  static propTypes = {
    publicKeyActions: PropTypes.objectOf(PropTypes.func).isRequired,
    navigation: PropTypes.any.isRequired,
  };

  render() {
    const {
      login,
      publicKeyActions,
      navigation,
      errorMessage,
      status,
      intlActions,
    } = this.props;

    const loginUsername = login.username;
    const { username, publicKey } = this.props.navigation.state.params;
    const scheme = cryptographyModule.getScheme();

    if (loginUsername !== username) {
      return (
        <FailureView
          text={errorMessage}
          label={intlActions.getString("CANNOT_REGISTER_FOR_OTHER_USER")}
          onCancel={() => navigation.dismiss()}
          onPress={() => publicKeyActions.resetAddPublicKeyStatus()}
        />
      );
    }

    const isProcessing =
      status === AddPublicKeyState.ADDING ||
      status === AddPublicKeyState.WAITING_TX_RESPONSE;

    const registerDeviceSuccess = intlActions.getString(
      "REGISTER_DEVICE_SUCCESS"
    );
    const confirmDeviceRegister = intlActions.getString(
      "CONFIRM_REGISTER_DEVICE_LITERAL"
    );
    const reviewBeforeConfirmationLiteral = intlActions.getString(
      "REVIEW_BEFORE_CONFIRMATION_LITERAL"
    );
    const addDeviceForLiteral = intlActions.getString("ADD_DEVICE_FOR_LITERAL");
    const processingRequestLiteral = intlActions.getString(
      "PROCESSING_YOUR_REQUEST_LITERAL"
    );
    const confirmLiteral = intlActions.getString("CONFIRM_LITERAL");

    if (status === AddPublicKeyState.ADD_SUCCESS) {
      return (
        // TODO; clear cryptography state after success
        <SuccessView
          text={registerDeviceSuccess}
          onTimeOut={() => {
            navigation.dismiss();
          }}
          icon={Assets.confirmConnectionIcon}
          iconStyle={styles.icon}
        />
      );
    }

    if (status === AddPublicKeyState.ADD_FAILED) {
      return (
        <FailureView
          text={errorMessage}
          label={intlActions.getString("RETRY_LITERAL")}
          onCancel={() => navigation.dismiss()}
          onPress={() => publicKeyActions.resetAddPublicKeyStatus()}
        />
      );
    }

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView style={styles.container}>
          <TopBarBackHome screen="Balance" />
          <DimmableContainer
            style={styles.innerContainer}
            isDimmed={isProcessing}
          >
            <Text style={styles.title}>{confirmDeviceRegister}</Text>

            <Text style={styles.label}>{reviewBeforeConfirmationLiteral}</Text>

            <TextInputBorder
              style={styles.input}
              styleLabel={{ color: Colors.darkgrey }}
              styleInput={{ color: Colors.darkgrey }}
              borderTitle={addDeviceForLiteral}
              value={username}
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
                publicKeyActions.addPublicKey(username, publicKey, scheme);
              }}
            />
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => ({
  login: state.login,
  status: publickeyModule.getAddPublicKeyStatus(state),
  errorMessage: publickeyModule.getAddPublicKeyErrorMessage(state),
});

const mapDispatchToProps = (dispatch) => ({
  publicKeyActions: bindActionCreators(publickeyModule, dispatch),
  intlActions: bindActionCreators(intl.actions, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RegisterDeviceConfirmScreen);
