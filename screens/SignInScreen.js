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
import * as Alerts from "../components/AlertBox.js";

import * as login from "../redux/modules/login";
import * as cryptographyModule from "../redux/modules/cryptography";

import { Buffer } from "buffer";

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

class SignInScreen extends React.Component {
  static navigationOptions = {
    headerShown: false,
  };

  static propTypes = {
    loginActions: PropTypes.objectOf(PropTypes.func).isRequired,
    navigation: PropTypes.any.isRequired,
    error: PropTypes.string,
  };

  static defaultProps = {
    error: null,
  };

  constructor(props) {
    super(props);
    this.state = { username: "", password: "", signingIn: false };
  }

  doLogin = () => {
    const { loginActions, navigation, cryptographyActions } = this.props;
    const { username, password } = this.state;

    this.setState({ signingIn: true });

    cryptographyActions.getPublicKey(username, {
      onKeyRead: (pKey) => {
        const publicKey = new Buffer(pKey).toString("hex");

        cryptographyActions.signMessage(username, publicKey, {
          onSigned: (signature, pKey) => {
            loginActions.login(username, password, publicKey, signature, {
              onSuccess: () => {
                this.setState({ signingIn: false });
                navigation.navigate("Main");
              },
              onFailed: (errorCode) => {
                this.setState({ signingIn: false });

                // consult API to see error codes
                switch (errorCode) {
                  // device not registered
                  case 105: {
                    Alerts.showChoiceAlert({
                      title: "Unknown device.",
                      message:
                        "Do you want to register this device for sikobaPay?\nYou will need a registered device.",
                      confirmText: "Register",
                      cancelText: "Cancel",

                      confirmAction: () => {
                        // go to register stack
                        navigation.navigate("RegisterDeviceQR", {
                          username: username,
                          publicKey: publicKey,
                        });
                      },
                      cancelAction: () => {},
                    });
                    break;
                  }
                }
              },
            });
          },
        });
      },
      onKeyNotFound: () => {
        // If no key is found, a new one will be created and login is re-attempted.
        cryptographyActions.createKey(username, (publicKeyBuffer) => {
          this.doLogin();
        });
      },
    });
  };

  render() {
    const { error, navigation } = this.props;
    const { username, password, signingIn } = this.state;

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <View style={styles.logoWrapper}>
            <Image source={Assets.logo} style={styles.logo} />
          </View>
          <View style={styles.fieldsContainer}>
            <TextInput
              style={styles.input}
              value={username}
              autoComplete="off"
              autoCorrect={false}
              placeholder="Username"
              accessibilityLabel="user_name"
              onChangeText={(text) => this.setState({ username: text })}
            />

            <TextInput
              style={styles.input}
              secureTextEntry
              value={password}
              placeholder="Password"
              accessibilityLabel="pass"
              onChangeText={(text) => this.setState({ password: text })}
            />

            {error ? <Text style={styles.loginError}>{error}</Text> : null}

            {signingIn ? (
              <ButtonLoading label="Signing in..." />
            ) : (
              <Button label="Sign In" onPress={this.doLogin} />
            )}
            <Button
              variant="white"
              label="Forgot password?"
              onPress={() => navigation.navigate("ChangePassword")}
              style={{ fontSize: 12 }}
            />

            <View style={styles.haveAccountContainer}>
              <View style={styles.haveAccountLine} />
              <Text style={styles.haveAccountText}>Not registered yet?</Text>
            </View>
            <Button
              variant="white"
              label="Create new account"
              onPress={() => navigation.navigate("SignUp")}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => ({
  error: state.login.error,
});

const mapDispatchToProps = (dispatch) => ({
  loginActions: bindActionCreators(login.actions, dispatch),
  cryptographyActions: bindActionCreators(cryptographyModule, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignInScreen);
