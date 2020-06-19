import React from "react";
import PropTypes from "prop-types";
import { Text, SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Button from "../components/Button";
import ButtonLoading from "../components/ButtonLoading";

import TopBarBackHome from "../components/TopBarBackHome";
import TextInputBorder from "../components/TextInputBorder";
import SuccessView from "../components/SuccessView";
import FailureView from "../components/FailureView";
import { formatAmount } from "../lib/format";
import * as iouModule from "../redux/modules/iou";
import * as intl from "../redux/modules/internationalization";
import Theme from "../assets/Theme";
import Assets from "../assets";

const { PartialSettleIOUState } = iouModule;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
    backgroundColor: Theme.colors.white,
  },
  innerContainer: {
    paddingLeft: 16,
    paddingRight: 16,
  },
  title: {
    ...Theme.fonts.regular,
    color: Theme.colors.black,
    fontSize: 22,
    marginBottom: 19,
  },
  label: {
    ...Theme.fonts.regular,
    color: Theme.colors.black,
    fontSize: 16,
    marginBottom: 23,
  },
  icon: {
    width: 250,
    height: 300,
    resizeMode: "contain",
  },
  failIcon: {
    width: 200,
    height: 285,
    marginTop: 40,
    resizeMode: "contain",
    marginBottom: 40,
  },
  input: {
    marginBottom: 7,
  },
  inputTotal: {
    borderColor: Theme.colors.black,
  },
  inputTotalText: {
    ...Theme.fonts.semiBold,
    color: Theme.colors.black,
  },
  inputTotalLabel: {
    color: Theme.colors.black,
  },
});

const DimmableContainer = (props) => {
  const { isDimmed, children, style } = props;

  return (
    <View style={style}>
      {children}

      {isDimmed ? (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "#FFFFFFBF",
          }}
        />
      ) : null}
    </View>
  );
};

DimmableContainer.propTypes = {
  isDimmed: PropTypes.bool,
  children: PropTypes.arrayOf(PropTypes.element),
  style: PropTypes.any,
};

DimmableContainer.defaultProps = {
  isDimmed: false,
  children: null,
  style: null,
};

class PartialSettleConfirmScreen extends React.Component {
  static navigationOptions = {
    title: null,
  };

  static propTypes = {
    iouActions: PropTypes.objectOf(PropTypes.func).isRequired,
    navigation: PropTypes.any.isRequired,
    amount: PropTypes.number.isRequired,
    status: PropTypes.string,
  };

  static defaultProps = {
    status: null,
  };

  render() {
    const {
      iouActions,
      intlActions,
      navigation,
      iou,
      amount,
      login,
      status,
    } = this.props;

    const userLiteral = intlActions.getString("USER_LITERAL");
    const iouAmountLiteral = intlActions.getString("IOU_AMOUNT_LITERAL");
    const settleAmountLiteral = intlActions.getString("SETTLE_AMOUNT_LITERAL");
    const remainderLiteral = intlActions.getString("REMAINDER_LITERAL");
    const confirmLiteral = intlActions.getString("CONFIRM_LITERAL");
    const processingSettlementLiteral = intlActions.getString(
      "PROCESSING_SETTLEMENT_LITERAL"
    );
    //
    const partialSettlementConfirmed = intlActions.getString(
      "PARTIAL_SETTLEMENT_CONFIRMED_LITERAL"
    );
    const settlementFailedLiteral = intlActions.getString(
      "SETTLEMENT_FAILED_LITERAL"
    );
    const retryLiteral = intlActions.getString("RETRY_LITERAL");
    const confirmSettlementLiteral = intlActions.getString(
      "CONFIRM_PARTIAL_SETTLEMENT_LITERAL"
    );
    const reviewBeforeConfirmation = intlActions.getString(
      "REVIEW_BEFORE_CONFIRMATION_LITERAL"
    );

    const isProcessing =
      status === PartialSettleIOUState.SETTLING ||
      status === PartialSettleIOUState.WAITING_TX_RESPONSE;

    if (status === PartialSettleIOUState.SETTLE_SUCCESS) {
      return (
        <SuccessView
          text={partialSettlementConfirmed}
          onTimeOut={() => {
            iouActions.resetPartialSettleIOUStatus();
            navigation.navigate("Balance");
            navigation.dismiss();
          }}
          icon={Assets.IOUIcon}
          iconStyle={styles.icon}
        />
      );
    }

    if (status === PartialSettleIOUState.CREATE_FAILED) {
      return (
        <FailureView
          text={settlementFailedLiteral}
          label={retryLiteral}
          onCancel={() => {
            iouActions.resetPartialSettleIOUStatus();
            navigation.navigate("Balance");
            navigation.dismiss();
          }}
          //   onPress={() => iouActions.resetCreatePaymentStatus()}
        />
      );
    }

    const settleAmount = amount;
    const settlee = iou.otherUser;
    const iouAmount = iou.amountFormattedNoSymbol;
    const remainder = iouAmount - settleAmount;
    const { currency } = iou;

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView style={styles.container}>
          <TopBarBackHome screen="InspectIOU" />
          <DimmableContainer
            style={styles.innerContainer}
            isDimmed={isProcessing}
          >
            <Text style={styles.title}>{confirmSettlementLiteral}</Text>

            <Text style={styles.label}>{reviewBeforeConfirmation}</Text>

            <TextInputBorder
              style={styles.input}
              styleLabel={{ color: Theme.colors.darkgrey }}
              styleInput={{ color: Theme.colors.darkgrey }}
              borderTitle={userLiteral}
              value={settlee}
              editable={false}
            />

            <TextInputBorder
              style={styles.input}
              styleLabel={{ color: Theme.colors.darkgrey }}
              styleInput={{ color: Theme.colors.darkgrey }}
              borderTitle={iouAmountLiteral}
              prefix={currency.symbol}
              value={iouAmount}
              editable={false}
            />

            <TextInputBorder
              style={styles.input}
              styleLabel={{ color: Theme.colors.darkgrey }}
              styleInput={{ color: Theme.colors.darkgrey }}
              borderTitle={settleAmountLiteral}
              prefix={currency.symbol}
              value={settleAmount.toString()}
              editable={false}
            />

            <TextInputBorder
              style={styles.input}
              styleLabel={{ color: Theme.colors.darkgrey }}
              styleInput={{ color: Theme.colors.darkgrey }}
              prefix={currency.symbol}
              borderTitle={remainderLiteral}
              value={remainder.toString()}
              editable={false}
            />
          </DimmableContainer>

          {isProcessing ? (
            <ButtonLoading label={processingSettlementLiteral} />
          ) : (
            <Button
              label={confirmLiteral}
              accessibilityLabel="Confirm"
              onPress={() =>
                iouActions.partialSettleIOU({
                  settler: login.username,
                  iouId: iou.id,
                  amount: amount,
                })
              }
            />
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => ({
  login: state.login,
  iou: iouModule.getIOU(state),
  status: iouModule.getPartialSettleIOUStatus(state),
  amount: iouModule.getPartialSettleIOUAmount(state),
});

const mapDispatchToProps = (dispatch) => ({
  iouActions: bindActionCreators(iouModule.actions, dispatch),
  intlActions: bindActionCreators(intl.actions, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PartialSettleConfirmScreen);
