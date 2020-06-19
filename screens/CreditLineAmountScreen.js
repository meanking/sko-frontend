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
    fontSize: 46
  },
  textPrefix: {
    fontSize: 46,
    color: Theme.colors.darkgrey
  }
});

class CreditLineAmountScreen extends React.Component {
  static navigationOptions = {
    title: null
  };

  static propTypes = {
    creditLineActions: PropTypes.objectOf(PropTypes.func).isRequired,
    navigation: PropTypes.any.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      amount: null
    };
  }

  render() {
    const { creditLineActions, navigation, currency, intlActions } = this.props;

    const { amount } = this.state;

    const updateAmount = number => this.setState({ amount: number });

    const amountLiteral = intlActions.getString("AMOUNT_LITERAL");
    const howMuchCredit = intlActions.getString("HOW_MUCH_CREDIT");
    const nextLiteral = intlActions.getString("NEXT_LITERAL");

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <TopBarBackHome screen="CreditLines"></TopBarBackHome>
          <View style={styles.innerContainer}>
            <Text style={styles.title}>{amountLiteral}</Text>

            <Text style={styles.label}>{howMuchCredit}</Text>

            <TextInputBorder
              style={styles.textInputBorder}
              styleInput={styles.textInput}
              stylePrefix={styles.textPrefix}
              prefix={currency.symbol}
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
                  creditLineActions.setNewCreditLineAmount(amount);
                  navigation.navigate("CreditLineTimeTarget");
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
  intlActions: bindActionCreators(intl.actions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreditLineAmountScreen);
