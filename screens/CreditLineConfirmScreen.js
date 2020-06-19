import React from "react";
import PropTypes from "prop-types";
import { Text, SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Button from "../components/Button";
import ButtonLoading from "../components/ButtonLoading";
import TextInputBorder from "../components/TextInputBorder";
import SuccessView from "../components/SuccessView";
import FailureView from "../components/FailureView";

import TopBarBackHome from "../components/TopBarBackHome";
import { formatAmount } from "../lib/format";
import * as creditLineModule from "../redux/modules/creditline";
import * as connectionModule from "../redux/modules/connection";
import Theme from "../assets/Theme";
import Assets from "../assets";

import * as intl from "../redux/modules/internationalization";

const { CreateCreditLineState } = creditLineModule;
const Colors = Theme.colors;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    paddingTop: "2%",
    marginBottom: "2%",
    backgroundColor: Colors.white
  },
  innerContainer: {
    paddingLeft: 16,
    paddingRight: 16
  },
  title: {
    ...Theme.fonts.regular,
    color: Colors.black,
    fontSize: 22,
    marginBottom: "2%"
  },
  label: {
    ...Theme.fonts.regular,
    color: Colors.black,
    fontSize: 16,
    marginBottom: "5%"
  },
  icon: {
    width: 197,
    height: 308,
    resizeMode: "contain",
    marginBottom: 15
  },
  input: {
    marginBottom: 7
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

class CreditLineConfirmScreen extends React.Component {
  static navigationOptions = {
    title: null
  };

  static propTypes = {
    login: PropTypes.shape({
      username: PropTypes.string
    }).isRequired,
    creditline: PropTypes.any.isRequired,
    creditLineActions: PropTypes.objectOf(PropTypes.func).isRequired,
    navigation: PropTypes.any.isRequired
  };

  render() {
    const {
      login,
      creditline,
      creditLineActions,
      navigation,
      errorMessage,
      intlActions,
      selectedUsers,
      selectOption,
    } = this.props;

    const {
      recipient,
      currency,
      amount,
      timeTarget,
      interest,
      oneTimeFee,
      globalMax,
      singleMax,
      status
    } = creditline;

    const creditLineCreatedSuccess = intlActions.getString(
      "CREDIT_LINE_CREATED_SUCCESS"
    );
    const creditLineCreatedFailed = intlActions.getString(
      "CREDIT_LINE_CREATED_FAILED"
    );

    const isProcessing =
      status === CreateCreditLineState.CREATING ||
      status === CreateCreditLineState.WAITING_TX_RESPONSE;

    if (status === CreateCreditLineState.CREATE_SUCCESS) {
      return (
        // TODO; clear credit line state after success
        <SuccessView
          text={creditLineCreatedSuccess}
          onTimeOut={() => {
            navigation.dismiss();
          }}
          icon={Assets.confirmCreditLineIcon}
          iconStyle={styles.icon}
        />
      );
    }

    if (status === CreateCreditLineState.CREATE_FAILED) {
      return (
        <FailureView
          text={creditLineCreatedFailed}
          label={intlActions.getString("RETRY_LITERAL")}
          onCancel={() => navigation.dismiss()}
          onPress={() => creditLineActions.resetCreateCreditLineStatus()}
        />
      );
    }

    const confirmCreditLineLiteral = intlActions.getString(
      "CONFIRM_CREDIT_LINE_LITERAL"
    );
    const reviewBeforeConfirmationLiteral = intlActions.getString(
      "REVIEW_BEFORE_CONFIRMATION_LITERAL"
    );
    const recipientLiteral = intlActions.getString("RECIPIENT_LITERAL");
    const currencyLiteral = intlActions.getString("CURRENCY_LITERAL");
    const amountLiteral = intlActions.getString("AMOUNT_LITERAL");
    const timeTargetLiteral = intlActions.getString("TIME_TARGET_LITERAL");
    const interestLiteral = intlActions.getString("INTEREST_LITERAL");
    const oneTimeFeeLiteral = intlActions.getString("ONE_TIME_FEE_LITERAL");
    const processingCreditLine = intlActions.getString(
      "PROCESSING_YOUR_REQUEST_LITERAL"
    );
    const confirmLiteral = intlActions.getString("CONFIRM_LITERAL");
    const daysLiteral = intlActions.getString("DAYS_LITERAL").toLowerCase();

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView style={styles.container}>
          <TopBarBackHome screen="CreditLines" />
          <DimmableContainer
            style={styles.innerContainer}
            isDimmed={isProcessing}
          >
            <Text style={styles.title}>{confirmCreditLineLiteral}</Text>

            <Text style={styles.label}>{reviewBeforeConfirmationLiteral}</Text>

            <TextInputBorder
              style={styles.input}
              styleLabel={{ color: Colors.darkgrey }}
              styleInput={{ color: Colors.darkgrey }}
              borderTitle={recipientLiteral}
              value={ selectOption? selectedUsers.join(): recipient}
              editable={false}
            />

            <TextInputBorder
              style={styles.input}
              styleLabel={{ color: Colors.darkgrey }}
              styleInput={{ color: Colors.darkgrey }}
              borderTitle={currencyLiteral}
              value={`${currency.isoCode}`}
              editable={false}
            />

            <TextInputBorder
              style={styles.input}
              styleLabel={{ color: Colors.darkgrey }}
              styleInput={{ color: Colors.darkgrey }}
              borderTitle={amountLiteral}
              value={`${currency.isoCode}` + amount.toString()}
              editable={false}
            />

            <TextInputBorder
              style={styles.input}
              styleLabel={{ color: Colors.darkgrey }}
              styleInput={{ color: Colors.darkgrey }}
              borderTitle={timeTargetLiteral}
              value={`${timeTarget.toString()} ${daysLiteral}`}
              editable={false}
            />

            <TextInputBorder
              style={styles.input}
              styleLabel={{ color: Colors.darkgrey }}
              styleInput={{ color: Colors.darkgrey }}
              borderTitle={interestLiteral}
              value={`${interest.toString()}%`}
              editable={false}
            />

            <TextInputBorder
              style={styles.input}
              styleLabel={{ color: Colors.darkgrey }}
              styleInput={{ color: Colors.darkgrey }}
              borderTitle={oneTimeFeeLiteral}
              value={`${oneTimeFee.toString()}%`}
              editable={false}
            />
          </DimmableContainer>

          {isProcessing ? (
            <View style={{ marginBottom: 20 }}>
              <ButtonLoading
                style={{ marginBotton: 20 }}
                label={processingCreditLine}
              />
            </View>
          ) : (
            <View style={{ marginBottom: "5%" }}>
              <Button
                label={confirmLiteral}
                accessibilityLabel="Confirm"
                onPress={() => {
                  if (selectOption) {
                    creditLineActions.createMultiCreditLine({
                      creditor: login.username,
                      selectedUsers: selectedUsers,
                      amount: amount,
                      target: parseInt(timeTarget),
                      interest: parseFloat(interest),
                      one_time_fee: parseFloat(oneTimeFee),
                      currency_id: currency.id
                    });
                  } else {
                    creditLineActions.createCreditLine({
                      creditor: login.username,
                      debtor: recipient,
                      amount: amount,
                      target: parseInt(timeTarget),
                      interest: parseFloat(interest),
                      one_time_fee: parseFloat(oneTimeFee),
                      currency_id: currency.id
                    });
                  }
                }}
              />
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  login: state.login,
  creditline: state.creditline,
  errorMessage: creditLineModule.getErrorMessage(state),
  selectedUsers: connectionModule.getSelectedUsers(state),
  selectOption: connectionModule.getSelectOption(state)
});

const mapDispatchToProps = dispatch => ({
  creditLineActions: bindActionCreators(creditLineModule, dispatch),
  intlActions: bindActionCreators(intl.actions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreditLineConfirmScreen);
