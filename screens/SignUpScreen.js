/* eslint-disable linebreak-style */
import React from "react";
import PropTypes from "prop-types";
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import Button from "../components/Button";
import ButtonLoading from "../components/ButtonLoading";

import * as login from "../redux/modules/login";
import * as signup from "../redux/modules/signup";
import * as cryptographyModule from "../redux/modules/cryptography";

import Assets from "../assets";
import Theme from "../assets/Theme";

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.colors.white,
    flex: 1,
    flexDirection: "column",
    alignItems: "stretch",
  },
  logoWrapper: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  fieldsContainer: {
    flex: 0,
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  input: {
    ...Theme.fonts.regular,
    borderWidth: 2,
    borderColor: Theme.colors.lightgrey,
    borderRadius: 5,
    fontSize: 16,
    padding: 12,
    marginBottom: 24,
  },
  logo: {
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 30,
    resizeMode: "contain",
    height: 80,
  },
  loginError: {
    ...Theme.fonts.regular,
    color: Theme.colors.red,
    textAlign: "center",
    marginBottom: 12,
  },
  haveAccountContainer: {
    alignItems: "center",
  },
  haveAccountText: {
    ...Theme.fonts.regular,
    backgroundColor: Theme.colors.white,
    color: Theme.colors.darkgrey,
    fontSize: 16,
    marginTop: 23,
    marginBottom: 13,
    paddingLeft: 15,
    paddingRight: 15,
  },
  haveAccountLine: {
    borderTopWidth: 1,
    borderTopColor: Theme.colors.grey,
    height: 0,
    width: "100%",
    position: "absolute",
    top: 33,
  },
});

class SignUpScreen extends React.Component {
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
    this.state = { username: "", password: "", phoneNumber: "" };
  }

  doSignUp = () => {
    const {
      loginActions,
      signupActions,
      navigation,
      cryptographyActions,
    } = this.props;

    const { username, password, phoneNumber } = this.state;

    // generate key
    cryptographyActions.createKey(username, (publicKeyBuffer) => {
      const scheme = cryptographyModule.getScheme();
      const publicKey = publicKeyBuffer.toString("hex");

      signupActions.signup(username, password, phoneNumber, publicKey, scheme, {
        onSuccess: () => {
          // sign public key
          cryptographyActions.signMessage(username, publicKey, {
            onSigned: (calculatedSignature, usedPubKey) => {
              loginActions.login(
                username,
                password,
                publicKey,
                calculatedSignature,
                {
                  onSuccess: () => {
                    navigation.navigate("Main");
                  },
                }
              );
            },
          });
        },
      });
    });
  };

  onNumberEnter = (number) => {
    if (number[0] != "+" && number.length > 0) {
      this.setState({ phoneNumber: "+" + number });
    } else {
      this.setState({ phoneNumber: number });
    }
  };

  render() {
    const { navigation, isProcessing, errorMessage } = this.props;
    const { username, password, phoneNumber } = this.state;

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <View style={styles.logoWrapper}>
            <Image source={Assets.logo} style={styles.logo} />
          </View>
          <View style={styles.fieldsContainer}>
            <TextInput
              style={[styles.input, { marginBottom: 2 }]}
              value={username}
              editable={!isProcessing}
              autoComplete="off"
              autoCorrect={false}
              placeholder="Username"
              accessibilityLabel="Username"
              onChangeText={(text) => this.setState({ username: text })}
            />

            <TextInput
              style={styles.input}
              value={phoneNumber}
              editable={!isProcessing}
              placeholder="Phone number"
              accessibilityLabel="PhoneNumber"
              onChangeText={(text) => this.onNumberEnter(text)}
            />

            <TextInput
              style={styles.input}
              secureTextEntry
              value={password}
              editable={!isProcessing}
              placeholder="Password"
              accessibilityLabel="Password"
              onChangeText={(text) => this.setState({ password: text })}
            />

            {errorMessage ? (
              <Text style={styles.loginError}>{errorMessage}</Text>
            ) : null}
            {isProcessing ? (
              <ButtonLoading label="Registering user..." />
            ) : (
              <Button label="Create new account" onPress={this.doSignUp} />
            )}
            <View style={styles.haveAccountContainer}>
              <View style={styles.haveAccountLine} />
              <Text style={styles.haveAccountText}>
                Already have an account?
              </Text>
            </View>
            <Button
              variant="white"
              label="Sign In"
              onPress={() => navigation.navigate("SignIn")}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => ({
  isProcessing: signup.isProcessing(state),
  errorMessage: signup.getErrorMessage(state),
});

const mapDispatchToProps = (dispatch) => ({
  loginActions: bindActionCreators(login.actions, dispatch),
  signupActions: bindActionCreators(signup.actions, dispatch),
  cryptographyActions: bindActionCreators(cryptographyModule, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUpScreen);
