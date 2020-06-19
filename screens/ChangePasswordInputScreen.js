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
import * as changePasswordModule from "../redux/modules/changepassword";

import Theme from "../assets/Theme";

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
    marginBottom: "8%"
  },
  label: {
    ...Theme.fonts.regular,
    color: Theme.colors.black,
    fontSize: 16,
    marginBottom: "5%"
  },
  textInputBorder: {
    height: 70,
    borderColor: Theme.colors.green
  },
  textInput: {
    fontSize: 36
  },
  textPrefix: {
    fontSize: 46,
    color: Theme.colors.darkgrey
  },
  errorStyle: { fontSize: 16, color: Theme.colors.red, textAlign: "center" }
});

class ChangePasswordInputScreen extends React.Component {
  static navigationOptions = {
    title: null
  };

  static propTypes = {
    creditLineActions: PropTypes.objectOf(PropTypes.func).isRequired,
    navigation: PropTypes.any.isRequired
  };

  constructor(props) {
    super(props);

    this.state = { password: null, passwordRepeat: null };
  }

  render() {
    const { intlActions, navigation, changePasswordActions } = this.props;

    const { password, passwordRepeat } = this.state;

    const updatePassword = pw => this.setState({ password: pw });
    const updatePasswordRepeat = pw => this.setState({ passwordRepeat: pw });

    const enterNewPasswordLiteral = intlActions.getString(
      "NEW_PASSWORD_LITERAL"
    );
    const repeatPasswordLiteral = intlActions.getString(
      "REPEAT_PASSWORD_LITERAL"
    );
    const enterYourNewPasswordLiteral = intlActions.getString(
      "ENTER_YOUR_NEW_PASSWORD_LITERAL"
    );
    const passwordsMustMatchString = intlActions.getString(
      "PASSWORDS_MUST_MATCH"
    );

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <TopBarBackHome screen="SignIn" />
          <View style={styles.innerContainer}>
            <Text style={styles.title}>{enterYourNewPasswordLiteral}</Text>

            <TextInputBorder
              secureTextEntry
              style={styles.textInputBorder}
              styleInput={styles.textInput}
              stylePrefix={styles.textPrefix}
              value={password}
              accessibilityLabel="Password"
              onChangeValue={updatePassword}
              borderTitle={enterNewPasswordLiteral}
            />

            <TextInputBorder
              secureTextEntry
              style={styles.textInputBorder}
              styleInput={styles.textInput}
              stylePrefix={styles.textPrefix}
              value={passwordRepeat}
              accessibilityLabel="PasswordRepeat"
              onChangeValue={updatePasswordRepeat}
              borderTitle={repeatPasswordLiteral}
            />

            {password && passwordRepeat && password !== passwordRepeat ? (
              <Text style={styles.errorStyle}>{passwordsMustMatchString}</Text>
            ) : null}

            {password && passwordRepeat && password === passwordRepeat ? (
              <Button
                label="Next"
                accessibilityLabel="Next"
                onPress={() => {
                  changePasswordActions.setPassword(password);
                  navigation.navigate("ChangePasswordCode");
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
  currency: creditLineModule.getCurrency(state)
});

const mapDispatchToProps = dispatch => ({
  creditLineActions: bindActionCreators(creditLineModule, dispatch),
  intlActions: bindActionCreators(intl.actions, dispatch),
  changePasswordActions: bindActionCreators(changePasswordModule, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChangePasswordInputScreen);
