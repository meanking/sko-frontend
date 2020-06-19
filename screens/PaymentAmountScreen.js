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

class PaymentAmountScreen extends React.Component {
  static navigationOptions = {
    title: null
  };

  static propTypes = {
    paymentActions: PropTypes.objectOf(PropTypes.func).isRequired,
    navigation: PropTypes.any.isRequired,
    recipient: PropTypes.string
  };

  static defaultProps = {
    recipient: null
  };

  constructor(props) {
    super(props);
    this.state = {
      amount: null
    };
  }

  paymentCapacityText = (capacities, currency) => {
    const { intlActions } = this.props;
    const currencyIso = currency.isoCode;

    if (
      capacities[currencyIso] !== null &&
      capacities[currencyIso] !== undefined
    ) {
      return (
        intlActions.getString("ESTIMATED_PAYMENT_CAPACITY") +
        " " +
        capacities[currencyIso]
      );
    } else {
      return intlActions.getString("ESTIMATED_PAYMENT_CAPACITY_NONE");
    }
  };

  render() {
    const {
      paymentActions,
      navigation,
      recipient,
      currency,
      paymentCapacity,
      intlActions
    } = this.props;

    const { amount } = this.state;

    const updateAmount = number => this.setState({ amount: number });

    const amountLiteral = intlActions.getString("AMOUNT_LITERAL");
    const howMuchPay = intlActions.getString("HOW_MUCH_PAY");

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <TopBarBackHome screen="Balance"></TopBarBackHome>

          <View style={styles.innerContainer}>
            <Text style={styles.title}>{amountLiteral}</Text>
            <Text style={styles.label}>{howMuchPay}</Text>

            <TextInputBorder
              style={styles.textInputBorder}
              styleInput={styles.textInput}
              stylePrefix={styles.textPrefix}
              prefix={currency.symbol}
              hint={this.paymentCapacityText(paymentCapacity, currency)}
              value={amount}
              accessibilityLabel="Amount"
              isNumeric
              onChangeValue={updateAmount}
            />

            {amount ? (
              <Button
                label="Next"
                accessibilityLabel="AmountNext"
                onPress={() => {
                  paymentActions.setNewPaymentAmount(amount);
                  navigation.navigate("PaymentTimeTarget");
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
  recipient: state.payment.recipient,
  paymentCapacity: paymentModule.getPaymentCapacity(state),
  currency: paymentModule.getPaymentCurrency(state)
});

const mapDispatchToProps = dispatch => ({
  paymentActions: bindActionCreators(paymentModule, dispatch),
  intlActions: bindActionCreators(intl.actions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PaymentAmountScreen);
