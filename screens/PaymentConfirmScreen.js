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
import * as paymentModule from "../redux/modules/payment";
import * as intl from "../redux/modules/internationalization";
import Theme from "../assets/Theme";
import Assets from "../assets";

const { CreatePaymentState } = paymentModule;

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
    marginBottom: 23
  },
  icon: {
    width: 250,
    height: 300,
    resizeMode: "contain"
  },
  failIcon: {
    width: 200,
    height: 285,
    marginTop: 40,
    resizeMode: "contain",
    marginBottom: 40
  },
  input: {
    marginBottom: 7
  },
  inputTotal: {
    borderColor: Theme.colors.black
  },
  inputTotalText: {
    ...Theme.fonts.semiBold,
    color: Theme.colors.black
  },
  inputTotalLabel: {
    color: Theme.colors.black
  }
});

const DimmableContainer = props => {
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
            backgroundColor: "#FFFFFFBF"
          }}
        />
      ) : null}
    </View>
  );
};

DimmableContainer.propTypes = {
  isDimmed: PropTypes.bool,
  children: PropTypes.arrayOf(PropTypes.element),
  style: PropTypes.any
};

DimmableContainer.defaultProps = {
  isDimmed: false,
  children: null,
  style: null
};

class PaymentConfirmScreen extends React.Component {
  static navigationOptions = {
    title: null
  };

  static propTypes = {
    paymentActions: PropTypes.objectOf(PropTypes.func).isRequired,
    navigation: PropTypes.any.isRequired,
    recipient: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    selectedOption: PropTypes.object.isRequired,
    status: PropTypes.string
  };

  static defaultProps = {
    status: null
  };

  render() {
    const {
      paymentActions,
      intlActions,
      navigation,
      recipient,
      login,
      selectedOption,
      status
    } = this.props;

    const baseAmount = selectedOption.amountFormatted;
    const baseAmountNoSymbol = selectedOption.amountFormattedNoSymbol;
    const timeTarget = selectedOption.target;
    const fees = selectedOption.feesFormatted;
    const totalAmount = selectedOption.maxAmountFormatted;
    //
    const recipientLiteral = intlActions.getString("RECIPIENT_LITERAL");
    const baseAmountLiteral = intlActions.getString("BASE_AMOUNT_LITERAL");
    const feesLiteral = intlActions.getString("FEES_LITERAL");
    const timeTargetLiteral = intlActions.getString("TIME_TARGET_LITERAL");
    const totalAmountLiteral = intlActions.getString("TOTAL_AMOUNT_LITERAL");
    const daysLiteral = intlActions.getString("DAYS_LITERAL");
    const confirmLiteral = intlActions.getString("CONFIRM_LITERAL");
    const processingPaymentLiteral = intlActions.getString(
      "PROCESSING_PAYMENT_LITERAL"
    );
    //
    const paymentConfirmedLiteral = intlActions.getString(
      "PAYMENT_CONFIRMED_LITERAL"
    );
    const paymentCreationFailedLiteral = intlActions.getString(
      "PAYMENT_CREATION_FAILED_LITERAL"
    );
    const retryLiteral = intlActions.getString("RETRY_LITERAL");
    const confirmPaymentLiteral = intlActions.getString(
      "CONFIRM_PAYMENT_LITERAL"
    );
    const reviewBeforeConfirmation = intlActions.getString(
      "REVIEW_BEFORE_CONFIRMATION_LITERAL"
    );

    const isProcessing =
      status === CreatePaymentState.CREATING ||
      status === CreatePaymentState.WAITING_TX_RESPONSE;

    if (status === CreatePaymentState.CREATE_SUCCESS) {
      return (
        // TODO; clear payment state after success
        <SuccessView
          text={paymentConfirmedLiteral}
          onTimeOut={() => {
            navigation.dismiss();
          }}
          icon={Assets.IOUIcon}
          iconStyle={styles.icon}
        />
      );
    }

    if (status === CreatePaymentState.CREATE_FAILED) {
      return (
        <FailureView
          text={paymentCreationFailedLiteral}
          label={retryLiteral}
          onCancel={() => navigation.dismiss()}
          onPress={() => paymentActions.resetCreatePaymentStatus()}
        />
      );
    }

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView style={styles.container}>
          <TopBarBackHome screen="Balance"></TopBarBackHome>
          <DimmableContainer
            style={styles.innerContainer}
            isDimmed={isProcessing}
          >
            <Text style={styles.title}>{confirmPaymentLiteral}</Text>

            <Text style={styles.label}>{reviewBeforeConfirmation}</Text>

            <TextInputBorder
              style={styles.input}
              styleLabel={{ color: Theme.colors.darkgrey }}
              styleInput={{ color: Theme.colors.darkgrey }}
              borderTitle={recipientLiteral}
              value={recipient}
              editable={false}
            />

            <TextInputBorder
              style={styles.input}
              styleLabel={{ color: Theme.colors.darkgrey }}
              styleInput={{ color: Theme.colors.darkgrey }}
              borderTitle={baseAmountLiteral}
              value={baseAmount}
              editable={false}
            />

            <TextInputBorder
              style={styles.input}
              styleLabel={{ color: Theme.colors.darkgrey }}
              styleInput={{ color: Theme.colors.darkgrey }}
              borderTitle={timeTargetLiteral}
              value={timeTarget + " " + daysLiteral.toLowerCase()}
              editable={false}
            />

            <TextInputBorder
              style={styles.input}
              styleLabel={{ color: Theme.colors.darkgrey }}
              styleInput={{ color: Theme.colors.darkgrey }}
              borderTitle={feesLiteral}
              value={fees}
              editable={false}
            />

            <TextInputBorder
              style={[styles.input, styles.inputTotal]}
              styleLabel={styles.inputTotalLabel}
              styleInput={styles.inputTotalText}
              borderTitle={totalAmountLiteral}
              value={totalAmount}
              editable={false}
            />
          </DimmableContainer>

          {isProcessing ? (
            <ButtonLoading label={processingPaymentLiteral} />
          ) : (
            <Button
              label={confirmLiteral}
              accessibilityLabel="Confirm"
              onPress={() =>
                paymentActions.createPayment({
                  payer: login.username,
                  recipient: recipient,
                  amount: baseAmountNoSymbol,
                  target: timeTarget,
                  path: selectedOption.path
                })
              }
            />
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  login: state.login,
  selectedOption: paymentModule.getSelectedPaymentOption(state),
  recipient: paymentModule.getPaymentRecipient(state),
  status: paymentModule.getCreatePaymentStatus(state)
});

const mapDispatchToProps = dispatch => ({
  paymentActions: bindActionCreators(paymentModule, dispatch),
  intlActions: bindActionCreators(intl.actions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PaymentConfirmScreen);
