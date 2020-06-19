import React from "react";
import PropTypes from "prop-types";
import { Text, SafeAreaView, StyleSheet, View } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import TextInputBorder from "../components/TextInputBorder";
import Button from "../components/Button";

import TopBarBackHome from "../components/TopBarBackHome";

import * as paymentModule from "../redux/modules/payment";
import * as intl from "../redux/modules/internationalization";
import * as settings from "../redux/modules/settings";

import Theme from "../assets/Theme";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
    backgroundColor: Theme.colors.white
  },
  innerContainer: {
    paddingLeft: 16,
    paddingRight: 16
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
    fontSize: 46
  },
  textPrefix: {
    fontSize: 46,
    color: Theme.colors.darkgrey
  }
});

class RequestPaymentAmountScreen extends React.Component {
  static navigationOptions = {
    title: null
  };

  static propTypes = {
    navigation: PropTypes.any.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      amount: null
    };
  }

  render() {
    const {
      paymentActions,
      navigation,
      login,
      intlActions,
      settings
    } = this.props;

    const { amount } = this.state;
    const { currencySymbol } = settings;

    const updateAmount = number => this.setState({ amount: number });

    const amountLiteral = intlActions.getString("AMOUNT_LITERAL");
    const howMuchPay = intlActions.getString("HOW_MUCH_REQUEST");
    const nextLiteral = intlActions.getString("NEXT_LITERAL");

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <TopBarBackHome
            screen="Balance"
            onBack={() => {
              navigation.navigate("Balance");
            }}
          ></TopBarBackHome>
          <View style={styles.innerContainer}>
            <Text style={styles.title}>{amountLiteral}</Text>

            <Text style={styles.label}>{howMuchPay}</Text>

            <TextInputBorder
              style={styles.textInputBorder}
              styleInput={styles.textInput}
              stylePrefix={styles.textPrefix}
              prefix={currencySymbol}
              value={amount}
              accessibilityLabel="Amount"
              isNumeric
              onChangeValue={updateAmount}
            />

            {amount ? (
              <Button
                label={nextLiteral}
                accessibilityLabel="AmountNext"
                onPress={() => {
                  paymentActions.setNewPaymentAmount(amount);
                  navigation.navigate("RequestPaymentConfirm", {
                    amount: amount
                  });
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
  login: state.login,
  currency: paymentModule.getPaymentCurrency(state),
  settings: settings.getAccountSettings(state)
});

const mapDispatchToProps = dispatch => ({
  paymentActions: bindActionCreators(paymentModule, dispatch),
  intlActions: bindActionCreators(intl.actions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RequestPaymentAmountScreen);
