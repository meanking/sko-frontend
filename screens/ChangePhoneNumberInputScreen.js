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
import * as settingsModule from "../redux/modules/settings";

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

class ChangePhoneNumberInputScreen extends React.Component {
  static navigationOptions = {
    title: null
  };

  static propTypes = {
    creditLineActions: PropTypes.objectOf(PropTypes.func).isRequired,
    navigation: PropTypes.any.isRequired
  };

  constructor(props) {
    super(props);

    this.state = { phoneNumber: null };
  }

  render() {
    const { intlActions, navigation, settingsActions } = this.props;

    const { phoneNumber } = this.state;
    const updatePhoneNumber = number => this.setState({ phoneNumber: number });

    const changePhoneNumberLiteral = intlActions.getString(
      "CHANGE_PHONE_NUMBER_LITERAL"
    );
    const enterNewPhoneNumber = intlActions.getString("ENTER_NEW_PHONE_NUMBER");

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <TopBarBackHome
            screen="Settings"
            onHome={() => settingsActions.resetPhoneNumberChange()}
          />
          <View style={styles.innerContainer}>
            <Text style={styles.title}>{changePhoneNumberLiteral}</Text>
            <Text style={styles.label}>{enterNewPhoneNumber}</Text>

            <TextInputBorder
              style={styles.textInputBorder}
              styleInput={styles.textInput}
              stylePrefix={styles.textPrefix}
              prefix={"+"}
              value={phoneNumber}
              accessibilityLabel="PhoneNumber"
              isNumeric
              onChangeValue={updatePhoneNumber}
            />

            {phoneNumber && phoneNumber.toString().length > 6 ? (
              <Button
                label="Next"
                accessibilityLabel="AmountNext"
                onPress={() => {
                  settingsActions.setNewPhoneNumber("+" + phoneNumber);
                  navigation.navigate("ChangePhoneNumberPassword");
                  // navigation.navigate("ChangePhoneNumberConfirm");
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
  settingsActions: bindActionCreators(settingsModule.actions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChangePhoneNumberInputScreen);
