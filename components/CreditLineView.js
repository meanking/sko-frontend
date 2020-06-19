import React from "react";
import PropTypes from "prop-types";
import { Image, StyleSheet, Text, View } from "react-native";
import * as Progress from "react-native-progress";
import * as intl from "../redux/modules/internationalization";
import * as creditline from "../redux/modules/creditline";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import ArrowRow from "./ArrowRow";
import Theme from "../assets/Theme";
import Assets from "../assets";

const styles = StyleSheet.create({
  creditLineView: {
    flexDirection: "row",
    backgroundColor: Theme.colors.white,
    height: "auto"
  },
  border: {
    borderBottomColor: Theme.colors.lightgrey,
    borderBottomWidth: 1
  },
  creditLineName: {
    ...Theme.fonts.semiBold,
    fontSize: 16,
    color: Theme.colors.black,
    flex: 1
  },
  creditLineHandle: {
    ...Theme.fonts.regular,
    marginTop: 3,
    color: Theme.colors.darkgrey,
    fontSize: 12
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginRight: 12
  },
  creditLineInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
    width: null
  },
  children: {
    flexDirection: "column",
    alignItems: "flex-end"
  },
  conversionLabel: {
    fontSize: 12,
    color: "rgb(24, 77, 237)"
  },
  noConversionLabel: {
    fontSize: 12,
    color: "rgb(247, 72, 2)"
  },
  rightComponent: {
    textAlign: "right"
  },
  leftComponent: {
    textAlign: "left"
  },
  secondRowComponent: {
    fontSize: 13
  },
  creditingLine: {
    // color: "rgb(2, 191, 62)"
  },
  debtingLine: {}
});

const creditingLine = props => {
  const {
    creditLine,
    onPressCreditLine,
    children,
    style,
    intlActions,
    creditLineActions
  } = props;
  const w = creditLine.crediting_line ? "TO" : "FROM";
  const connectionWord = intlActions.getString(w + "_LITERAL");

  const usedCredit = creditLine.total_used_formatted;
  const usedCreditPercentage = parseFloat(creditLine.total_used_percentage);
  const target = creditLine.target;
  //

  //
  const oneTimeFee = parseFloat(creditLine.one_time_fee);
  const interestRate = parseFloat(creditLine.interest);
  const oneTimeFeeLabel = intlActions.getString("ONE_TIME_FEE_LITERAL");
  const interestLabel = intlActions.getString("INTEREST_LITERAL");

  // strings
  const used = intlActions.getString("USED_LITERAL");

  const statusLabel = intlActions.getString(creditLine.status);

  return (
    <View style={styles.creditLineView}>
      <ArrowRow
        style={styles.border}
        onPress={() => {
          creditLineActions.inspectCreditLine(creditLine.id),
            onPressCreditLine(creditLine);
        }}
      >
        <View style={styles.row}>
          <View style={styles.creditLineInfo}>
            <Text style={[styles.creditLineName, style, styles.creditingLine]}>
              {creditLine.amount_formatted}
            </Text>
            <Text style={[styles.creditLineName, style, styles.rightComponent]}>
              {target} {intlActions.getString("DAYS_LITERAL").toLowerCase()}
            </Text>
          </View>
          <View style={[styles.children]}>{children}</View>
        </View>
        <View style={styles.creditLineInfo}>
          <Text style={[styles.secondRowComponent]}>
            {usedCredit} {used}
          </Text>
          <Text
            style={[style, styles.rightComponent, styles.secondRowComponent]}
          >
            {oneTimeFee}% {oneTimeFeeLabel} + {interestRate}% {interestLabel}
          </Text>
        </View>
        <View style={{ flexDirection: "row", flex: 1 }}>
          <Progress.Bar
            style={{ flex: 1 }}
            width={null}
            color="rgb(0,0,0)"
            borderWidth={0}
            unfilledColor="rgb(190, 191, 194)"
            borderRadius={5}
            progress={usedCreditPercentage / 100}
          ></Progress.Bar>
        </View>
        <View>
          <Text style={[styles.rightComponent]}>{statusLabel}</Text>
        </View>
      </ArrowRow>
    </View>
  );
};

const debtingLine = props => {
  const {
    creditLine,
    onPressCreditLine,
    children,
    style,
    intlActions,
    creditLineActions
  } = props;
  const w = creditLine.crediting_line ? "TO" : "FROM";
  const connectionWord = intlActions.getString(w + "_LITERAL");

  const availableCredit = creditLine.available_formatted;
  const usedCreditPercentage = creditLine.total_used_percentage;
  const availableConversionCredit =
    creditLine.available_conversion_credit_formatted;
  const availableConversionPercentage =
    creditLine.available_conversion_percentage;

  // strings
  const available = intlActions.getString("AVAILABLE_LITERAL");
  const upTo = intlActions.getString("UP_TO_LITERAL");
  const forConversion = intlActions.getString("FOR_CONVERSION_LITERAL");
  const noConversionLabel = intlActions.getString("NO_CONVERSION_LABEL");
  //
  const oneTimeFee = parseFloat(creditLine.one_time_fee);
  const interestRate = parseFloat(creditLine.interest);
  const oneTimeFeeLabel = intlActions.getString("ONE_TIME_FEE_LITERAL");
  const interestLabel = intlActions.getString("INTEREST_LITERAL");

  const statusLabel = intlActions.getString(creditLine.status);

  return (
    <View style={styles.creditLineView}>
      <ArrowRow
        style={styles.border}
        onPress={() => {
          creditLineActions.inspectCreditLine(creditLine.id),
            onPressCreditLine(creditLine);
        }}
      >
        <View style={styles.row}>
          <View style={styles.creditLineInfo}>
            <Text style={[styles.creditLineName, style]}>
              {creditLine.amount_formatted}
            </Text>
            <Text style={[styles.creditLineName, style, styles.rightComponent]}>
              {creditLine.target}{" "}
              {intlActions.getString("DAYS_LITERAL").toLowerCase()}
            </Text>
          </View>
          <View style={styles.children}>{children}</View>
        </View>
        <View style={styles.creditLineInfo}>
          <Text style={[styles.secondRowComponent]}>
            {availableCredit} {available}
          </Text>
          <Text
            style={[style, styles.rightComponent, styles.secondRowComponent]}
          >
            {oneTimeFee}% {oneTimeFeeLabel} + {interestRate}% {interestLabel}
          </Text>
        </View>
        <View>
          <Progress.Bar
            width={null}
            style={{ flex: 1, transform: [{ rotateY: "180deg" }] }}
            color="rgb(0,0,0)"
            borderWidth={0}
            unfilledColor="rgb(190, 191, 194)"
            borderRadius={5}
            progress={usedCreditPercentage / 100}
          ></Progress.Bar>
          <Progress.Bar
            width={null}
            style={{ flex: 1, transform: [{ rotateY: "180deg" }] }}
            borderColor="rgb(40, 119, 247)"
            borderRadius={0}
            height={2}
            borderWidth={0}
            progress={availableConversionPercentage / 100}
          ></Progress.Bar>
          <View style={styles.creditLineInfo}>
            {creditLine.conversion_enabled ? (
              <Text style={[styles.conversionLabel, styles.leftComponent]}>
                {upTo} {availableConversionCredit} {forConversion.toLowerCase()}
              </Text>
            ) : (
              <Text style={styles.noConversionLabel}>{noConversionLabel}</Text>
            )}
            <Text style={[styles.rightComponent]}>{statusLabel}</Text>
          </View>
        </View>
      </ArrowRow>
    </View>
  );
};

const CreditLineView = props => {
  const { creditLine } = props;

  if (creditLine.crediting_line) {
    return creditingLine(props);
  } else {
    return debtingLine(props);
  }
};

CreditLineView.propTypes = {
  // creditLine: DisplayUserType.isRequired,
  // onPressCreditLine: PropTypes.func.isRequired,
  // children: PropTypes.node,
  // style: PropTypes.any
};

CreditLineView.defaultProps = {
  children: null,
  style: null
};

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  creditLineActions: bindActionCreators(creditline.actions, dispatch),
  intlActions: bindActionCreators(intl.actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(CreditLineView);
