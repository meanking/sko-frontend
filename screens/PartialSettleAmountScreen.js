import React from "react";
import PropTypes from "prop-types";
import { Text, SafeAreaView, StyleSheet, View } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import TextInputBorder from "../components/TextInputBorder";
import Button from "../components/Button";

import TopBarBackHome from "../components/TopBarBackHome";

import * as iouModule from "../redux/modules/iou";
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
  },
  textSuffix: {
    fontSize: 30,
    color: Theme.colors.darkgrey
  }
});

class PartialSettleAmountScreen extends React.Component {
  static navigationOptions = {
    title: null
  };

  static propTypes = {
    iouActions: PropTypes.objectOf(PropTypes.func).isRequired,
    navigation: PropTypes.any.isRequired,
    iou: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      amount: null
    };
  }

  render() {
    const { iouActions, navigation, iou, intlActions } = this.props;

    const { amount } = this.state;
    const { amountFormatted, currency } = iou;
    const amountFormattedNoSymbol = parseFloat(iou.amountFormattedNoSymbol);

    const updateAmount = number => {
      const actualAmount = Math.min(number, amountFormattedNoSymbol);

      this.setState({
        amount: actualAmount,
        showHint: number > amountFormattedNoSymbol
      });
    };

    const amountLiteral = intlActions.getString("AMOUNT_LITERAL");
    const howMuchPartialSettle = intlActions.getString(
      "HOW_MUCH_PARTIAL_SETTLE"
    );
    const cantExceedIOUAmount = intlActions.getString("CANT_EXCEED_IOU_AMOUNT");

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <TopBarBackHome
            screen="InspectIOU"
            onBack={() => navigation.navigate("InspectIOU")}
          ></TopBarBackHome>
          <View style={styles.innerContainer}>
            <Text style={styles.title}>{amountLiteral}</Text>

            <Text style={styles.label}>{howMuchPartialSettle}</Text>

            <TextInputBorder
              style={styles.textInputBorder}
              styleInput={styles.textInput}
              stylePrefix={styles.textPrefix}
              styleSuffix={styles.textSuffix}
              prefix={currency.symbol}
              suffix={"/" + amountFormatted}
              hint={
                intlActions.getString("IOU_AMOUNT_LITERAL") +
                ": " +
                amountFormatted
              }
              value={amount}
              accessibilityLabel="Amount"
              isNumeric
              onChangeValue={updateAmount}
              hint={this.state.showHint ? cantExceedIOUAmount : null}
            />

            {amount ? (
              <Button
                label="Next"
                accessibilityLabel="AmountNext"
                onPress={() => {
                  iouActions.partialSettleIOUSetAmount(amount);
                  navigation.navigate("PartialSettleConfirm");
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
  iou: iouModule.getIOU(state)
});

const mapDispatchToProps = dispatch => ({
  iouActions: bindActionCreators(iouModule, dispatch),
  intlActions: bindActionCreators(intl.actions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PartialSettleAmountScreen);
