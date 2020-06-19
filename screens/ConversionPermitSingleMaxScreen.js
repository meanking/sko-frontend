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
    fontSize: 46,
    textAlign: "left"
  },
  textPrefix: {
    fontSize: 30,
    color: Theme.colors.darkgrey
  },
  textSuffix: {
    fontSize: 30,
    color: Theme.colors.darkgrey
  }
});

class ConversionPermitSingleMaxScreen extends React.Component {
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
      amount:
        props.navigation.state.params.creditLine.single_max_formatted_no_symbol
    };
  }

  render() {
    const { creditLineActions, navigation, intlActions } = this.props;

    const { amount } = this.state;
    const { creditLine } = navigation.state.params;

    const currencySymbol = creditLine.currency_symbol;
    const globalMax = creditLine.global_max_formatted_no_symbol;

    const updateAmount = number => {
      const actNum = Math.min(number, globalMax);

      // if (number >= globalMax) this.setState({ showHint: true });
      // else this.setState({ showHint: false });

      // this.setState({ showHint: number >= globalMax });

      this.setState({ amount: actNum, showHint: number >= globalMax });
    };

    const singleMaxLiteral = intlActions.getString("SINGLE_MAX_LITERAL");
    const howMuchCredit = intlActions.getString("HOW_MUCH_CREDIT");
    const nextLiteral = intlActions.getString("NEXT_LITERAL");
    const cantExceedGlobalMax = intlActions.getString("CANT_EXCEED_GLOBAL_MAX");

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <TopBarBackHome screen="InspectCreditLine"></TopBarBackHome>
          <View style={styles.innerContainer}>
            <Text style={styles.title}>{singleMaxLiteral}</Text>

            <Text style={styles.label}>{howMuchCredit}</Text>

            <TextInputBorder
              style={styles.textInputBorder}
              styleInput={styles.textInput}
              stylePrefix={styles.textPrefix}
              styleSuffix={styles.textSuffix}
              prefix={currencySymbol}
              suffix={"/" + currencySymbol + globalMax}
              value={amount}
              accessibilityLabel="Amount"
              isNumeric
              onChangeValue={updateAmount}
              hint={this.state.showHint ? cantExceedGlobalMax : null}
            />

            {amount ? (
              <Button
                label={nextLiteral}
                accessibilityLabel="AmountNext"
                onPress={() => {
                  creditLineActions.setSingleMax(amount);
                  navigation.navigate("ConversionPermitConversionFee", {
                    creditLine: creditLine
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
  currency: creditLineModule.getCurrency(state)
});

const mapDispatchToProps = dispatch => ({
  creditLineActions: bindActionCreators(creditLineModule, dispatch),
  intlActions: bindActionCreators(intl.actions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConversionPermitSingleMaxScreen);
