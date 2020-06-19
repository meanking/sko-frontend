import React from "react";
import PropTypes from "prop-types";
import { StyleSheet, Text, View } from "react-native";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import * as intl from "../redux/modules/internationalization";

import ArrowRow from "./ArrowRow";
import Theme from "../assets/Theme";

const styles = StyleSheet.create({
  paymentPathView: {
    backgroundColor: Theme.colors.white,
    borderRadius: 4,
    marginBottom: 16,
    paddingLeft: 16
  },
  shadow: {
    shadowColor: Theme.colors.black,
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,

    elevation: 1
  },
  totalAmount: {
    ...Theme.fonts.light,
    fontSize: 40,
    color: Theme.colors.black
  },
  dueDate: {
    ...Theme.fonts.regular,
    fontSize: 16,
    color: Theme.colors.black
  },
  username: {
    ...Theme.fonts.regular,
    marginTop: 8,
    fontSize: 12,
    color: Theme.colors.darkgrey
  },
  amountComposition: {
    ...Theme.fonts.regular,
    marginTop: 2,
    fontSize: 12,
    color: Theme.colors.darkgrey
  }
});

const formatThrough = (intlActions, isDirectPayment, firshHop) => {
  const directPaymentLiteral = intlActions.getString("DIRECT_PAYMENT_LITERAL");
  const paidThroughLiteral = intlActions.getString("PAID_THROUGH_LITERAL");
  return isDirectPayment
    ? directPaymentLiteral
    : `${paidThroughLiteral} ${firshHop}`;
};

const formatPaymentComposition = (intlActions, path) => {
  return `${path.amountFormatted} + ${
    path.feesFormatted
  } ${intlActions.getString("FEE_LITERAL")}`;
};

const PaymentOptionView = props => {
  const { option, onPressPath, intlActions } = props;

  const dueInLiteral = intlActions.getString("DUE_IN_LITERAL").toLowerCase();

  return (
    <View style={[styles.paymentPathView, styles.shadow]}>
      <ArrowRow accessibilityLabel="Arrow" onPress={() => onPressPath(option)}>
        <Text style={styles.totalAmount}>{option.maxAmountFormatted}</Text>
        <Text style={styles.dueDate}>
          {dueInLiteral} {option.target}{" "}
          {intlActions.getString("DAYS_LITERAL").toLowerCase()}
        </Text>
        <Text style={styles.username}>
          {formatThrough(intlActions, option.direct, option.through)}
        </Text>
        <Text style={styles.amountComposition}>
          {formatPaymentComposition(intlActions, option)}
        </Text>
      </ArrowRow>
    </View>
  );
};

PaymentOptionView.propTypes = {
  option: PropTypes.any.isRequired,
  onPressPath: PropTypes.func.isRequired,
  intlActions: PropTypes.object
};

const PaymentOptionsList = props => {
  const { paymentOptions, onPressPath, intlActions } = props;

  const renderPath = option => (
    <PaymentOptionView
      key={paymentOptions.indexOf(option)}
      option={option}
      onPressPath={onPressPath}
      intlActions={intlActions}
    />
  );

  return <View>{paymentOptions.map(renderPath)}</View>;
};

PaymentOptionsList.propTypes = {
  paymentOptions: PropTypes.array.isRequired,
  onPressPath: PropTypes.func,
  intlActions: PropTypes.object
};

PaymentOptionsList.defaultProps = {
  onPressPath: null
};

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  intlActions: bindActionCreators(intl.actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(PaymentOptionsList);
