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

import * as paymentModule from "../redux/modules/payment";
import * as intl from "../redux/modules/internationalization";
import * as settings from "../redux/modules/settings";

import { qrTypes, generateQRComponent, QR_SIZE } from "../lib/qr.js";

import Theme from "../assets/Theme";
import Assets from "../assets";

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

  renderQR() {
    const { navigation, login } = this.props;
    const { currencyId, preferredPaymentTarget } = this.props.settings;
    const { amount } = navigation.state.params;

    return generateQRComponent(
      qrTypes.requestPayment,
      {
        amount,
        timeTarget: preferredPaymentTarget,
        currency: currencyId,
        creditorUsername: login.username
      },
      {
        size: QR_SIZE
      }
    );
  }

  render() {
    const { intlActions, navigation, settings } = this.props;
    const { preferredPaymentTarget, currencySymbol } = settings;
    const { amount } = navigation.state.params;

    const amountLiteral = intlActions.getString("AMOUNT_LITERAL");
    const timeTargetLiteral = intlActions.getString("TIME_TARGET_LITERAL");
    const daysLiteral = intlActions.getString("DAYS_LITERAL");
    const requestPaymentLiteral = intlActions.getString(
      "REQUEST_PAYMENT_LITERAL"
    );

    const showQR = intlActions.getString("SHOW_QR_TO_USER");

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView style={styles.container}>
          <TopBarBackHome screen="Balance"></TopBarBackHome>
          <DimmableContainer style={styles.innerContainer} isDimmed={false}>
            <Text style={[styles.title, { marginBottom: "6%" }]}>
              {requestPaymentLiteral}
            </Text>

            <TextInputBorder
              style={styles.input}
              styleLabel={{ color: Theme.colors.darkgrey }}
              styleInput={{ color: Theme.colors.darkgrey }}
              prefix={currencySymbol}
              borderTitle={amountLiteral}
              value={amount.toString()}
              editable={false}
            />

            <TextInputBorder
              style={styles.input}
              styleLabel={{ color: Theme.colors.darkgrey }}
              styleInput={{ color: Theme.colors.darkgrey }}
              borderTitle={timeTargetLiteral}
              value={preferredPaymentTarget + " " + daysLiteral.toLowerCase()}
              editable={false}
            />
            <Text style={[styles.label, { alignSelf: "center" }]}>
              {showQR}
            </Text>
            <View
              style={{
                marginTop: "0%",
                alignSelf: "center"
              }}
            >
              {this.renderQR()}
            </View>
          </DimmableContainer>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  login: state.login,
  selectedOption: paymentModule.getSelectedPaymentOption(state),
  recipient: paymentModule.getPaymentRecipient(state),
  status: paymentModule.getCreatePaymentStatus(state),
  settings: settings.getAccountSettings(state)
});

const mapDispatchToProps = dispatch => ({
  paymentActions: bindActionCreators(paymentModule, dispatch),
  intlActions: bindActionCreators(intl.actions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PaymentConfirmScreen);
