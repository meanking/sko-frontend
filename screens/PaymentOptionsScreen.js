import React from "react";
import PropTypes from "prop-types";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PaymentOptionsList from "../components/PaymentOptionsList";
import FailureView from "../components/FailureView";
import LoadingIndicator from "../components/LoadingIndicator";

import TopBarBackHome from "../components/TopBarBackHome";
import * as paymentModule from "../redux/modules/payment";
import * as intl from "../redux/modules/internationalization";
import Theme from "../assets/Theme";
import Assets from "../assets";

const { PaymentOptionsState } = paymentModule;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.lightgrey
  },
  header: {
    backgroundColor: Theme.colors.white,
    paddingTop: 15
  },
  innerHeader: {
    paddingLeft: 16,
    paddingRight: 16
  },
  content: {
    backgroundColor: "transparent",
    padding: 16
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
  }
});

class PaymentOptionsScreen extends React.Component {
  static navigationOptions = {
    title: null
  };

  static propTypes = {
    paymentActions: PropTypes.objectOf(PropTypes.func).isRequired,
    status: PropTypes.string,
    paymentOptions: PropTypes.array,
    navigation: PropTypes.any.isRequired
  };

  static defaultProps = {
    status: null,
    paymentOptions: null
  };

  componentDidMount() {
    const { paymentActions, arePaymentOptionsLoadedSuccess } = this.props;
    if (!arePaymentOptionsLoadedSuccess) {
      paymentActions.loadPaymentOptions();
    }
  }

  refresh = () => {
    const { paymentActions, arePaymentOptionsRefreshing } = this.props;
    if (!arePaymentOptionsRefreshing) {
      // paymentActions.refreshCreditLines();
    }
  };

  renderContent() {
    const { paymentActions, paymentOptions, navigation } = this.props;

    return (
      <View>
        <PaymentOptionsList
          paymentOptions={paymentOptions}
          onPressPath={option => {
            paymentActions.selectPaymentOption(option);
            navigation.navigate("PaymentConfirm");
          }}
        />
      </View>
    );
  }

  render() {
    const { status, navigation, intlActions } = this.props;

    if (
      status === PaymentOptionsState.LOADING_PAYMENT_OPTIONS ||
      status === null
    ) {
      return <LoadingIndicator />;
    }

    const paymentOptionsLiteral = intlActions.getString(
      "PAYMENT_OPTIONS_LITERAL"
    );
    const errorLoadingPaymentOptions = intlActions.getString(
      "ERROR_LOADING_PAYMENT_OPTIONS"
    );
    const understoodLiteral = intlActions.getString("UNDERSTOOD_LITERAL");
    const noPaymentOptionFoundLiteral = intlActions.getString(
      "NO_PAYMENT_OPTION_FOUND"
    );
    const needCreditLine = intlActions.getString("NEED_CREDIT_LINE");
    const selectOneOption = intlActions.getString("SELECT_ONE_OPTION");

    if (status === PaymentOptionsState.LOADING_PAYMENT_OPTIONS_FAILED) {
      return (
        <FailureView
          title={paymentOptionsLiteral}
          icon={Assets.deadEndSignIcon}
          // helper="You will need a credit line to pay since you don't have connections in common for credit conversion."
          helper={errorLoadingPaymentOptions}
          label={understoodLiteral}
          onPress={() => navigation.goBack()}
        />
      );
    }

    const { paymentOptions } = this.props;
    if (paymentOptions.length === 0) {
      return (
        <FailureView
          title={noPaymentOptionFoundLiteral}
          icon={Assets.deadEndSignIcon}
          helper={needCreditLine}
          label={understoodLiteral}
          onPress={() => navigation.goBack()}
        />
      );
    }

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView style={styles.container}>
          <View style={styles.header}>
            <TopBarBackHome screen="Balance"></TopBarBackHome>
            <View style={styles.innerHeader}>
              <Text style={styles.title}>{paymentOptionsLiteral}</Text>
              <Text style={styles.label}>{selectOneOption}</Text>
            </View>
          </View>
          <View style={styles.content}>{this.renderContent()}</View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  status: paymentModule.getLoadingPaymentOptionsStatus(state),
  paymentOptions: paymentModule.getPaymentOptions(state),
  arePaymentOptionsLoadedSuccess: paymentModule.arePaymentOptionsLoadedSuccess(
    state
  ),
  arePaymentOptionsRefreshing: paymentModule.arePaymentOptionsRefreshing(state)
});

const mapDispatchToProps = dispatch => ({
  paymentActions: bindActionCreators(paymentModule, dispatch),
  intlActions: bindActionCreators(intl.actions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PaymentOptionsScreen);
