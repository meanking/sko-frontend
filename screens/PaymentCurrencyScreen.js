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
import * as creditlineModule from "../redux/modules/creditline";

import Theme from "../assets/Theme";
import CurrencyPicker from "../components/CurrencyPicker";

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
    marginBottom: 5
  },
  disclaimer: {
    ...Theme.fonts.regular,
    color: Theme.colors.grey,
    fontSize: 12,
    marginBottom: 15
  },
  textInputBorder: {
    height: 112,
    borderColor: Theme.colors.green
  },
  textInput: {
    fontSize: 46,
    textAlign: "right"
  },
  textSuffix: {
    fontSize: 30,
    color: Theme.colors.darkgrey
  }
});

class PaymentCurrencyScreen extends React.Component {
  static navigationOptions = {
    title: null
  };

  static propTypes = {
    paymentActions: PropTypes.objectOf(PropTypes.func).isRequired,
    navigation: PropTypes.any.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      currency: null
    };
  }

  componentDidMount() {
    const { creditLineActions, isLoadedSuccess } = this.props;
    if (!isLoadedSuccess) creditLineActions.loadCreditLines();
  }

  userCreditLineCurrencies = () => {
    const { creditLines, isLoadedSuccess } = this.props;

    if (isLoadedSuccess && creditLines.length > 0) {
      const cls = creditLines
        .map(x => x.currency)
        .reduce(function(a, b) {
          if (a.indexOf(b) < 0) a.push(b);
          return a;
        }, []);

      return cls;
    }

    return [];
  };

  render() {
    const { paymentActions, navigation, intlActions, settings } = this.props;

    var { currency } = this.state;

    if (currency === null) {
      currency = settings.currencyISO;
    }

    const updateValue = currency => this.setState({ currency: currency });

    const currencyLiteral = intlActions.getString("CURRENCY_LITERAL");
    const selectCurrency = intlActions.getString("SELECT_CURRENCY");
    const nextLiteral = intlActions.getString("NEXT_LITERAL");
    const cancelLiteral = intlActions.getString("CANCEL_LITERAL");

    const availableCurrencies = this.userCreditLineCurrencies();

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <TopBarBackHome screen="Balance"></TopBarBackHome>
          <View style={styles.innerContainer}>
            <Text style={styles.title}>{currencyLiteral}</Text>
            <Text style={styles.label}>{selectCurrency}</Text>
            <CurrencyPicker
              onSelectCallback={updateValue}
              toSelect={
                this.state.currency === null ? settings.currencyISO : null
              }
              availableCurrencies={availableCurrencies}
            ></CurrencyPicker>

            {currency !== null && currency !== undefined ? (
              availableCurrencies.length > 0 ? (
                <Button
                  label={nextLiteral}
                  accessibilityLabel="CurrencyNext"
                  onPress={() => {
                    paymentActions.setNewPaymentCurrency(currency);
                    navigation.navigate("PaymentAmount");
                  }}
                />
              ) : (
                <Button
                  label={cancelLiteral}
                  accessibilityLabel={"Cancel"}
                  variant={"fancy"}
                  onPress={() => {
                    navigation.navigate("Balance");
                  }}
                ></Button>
              )
            ) : null}
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  settings: settings.getAccountSettings(state),
  creditLines: creditlineModule.getCreditLines(state),
  isLoading: creditlineModule.isLoading(state),
  isLoadedSuccess: creditlineModule.isLoadedSuccess(state)
});

const mapDispatchToProps = dispatch => ({
  paymentActions: bindActionCreators(paymentModule, dispatch),
  intlActions: bindActionCreators(intl.actions, dispatch),
  creditLineActions: bindActionCreators(creditlineModule.actions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PaymentCurrencyScreen);
