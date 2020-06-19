import React, { Fragment } from "react";
import PropTypes from "prop-types";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import DashboardScreen from "./DashboardScreen";
import BottomAppBar from "../components/BottomAppBar";
import MenuButton from "../components/MenuButton";
import FabButton from "../components/FabButton";
import Button from "../components/Button";
import FailureView from "../components/FailureView";
import LoadingIndicator from "../components/LoadingIndicator";
import Assets from "../assets";
import Theme from "../assets/Theme";

import * as balance from "../redux/modules/balance";
import * as intl from "../redux/modules/internationalization";
import * as settings from "../redux/modules/settings";

import BalanceComponent from "../components/BalanceComponent";
import FutureSettlementsComponent from "../components/FutureSettlementsComponent";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.white
  }
});

class BalanceScreen extends React.Component {
  static navigationOptions = {
    headerShown: false
  };

  static propTypes = {
    navigation: PropTypes.any.isRequired
  };

  componentDidMount() {
    const { actions, loaded } = this.props;
    if (!loaded) {
      actions.loadBalance();
    }
  }

  refresh = () => {
    const { actions, refreshing } = this.props;
    if (!refreshing) {
      actions.refreshBalance();
    }
  };

  render() {
    const {
      balance,
      futureSettlements,
      navigation,
      errorMessage,
      loaded,
      loading,
      refreshing,
      intlActions,
      accountData
    } = this.props;

    const { isVerified } = accountData;

    const fab = (
      <FabButton
        icon={Assets.attachMoneyIcon}
        accessibilityLabel="PayButton"
        accessibilityHint="PayButton"
        onPress={() => navigation.navigate("Payment")}
        disabled={!isVerified}
      />
    );

    if (errorMessage) {
      return (
        <FailureView
          text={errorMessage}
          label={intlActions.getString("RETRY_LITERAL")}
          onPress={this.refresh}
        >
          <ActivityIndicator animating={loading} />
        </FailureView>
      );
    }

    const requestPaymentLiteral = intlActions.getString(
      "REQUEST_PAYMENT_LITERAL"
    );

    return (
      <DashboardScreen screen="Balance" navigation={navigation}>
        {loaded ? (
          <ScrollView
            style={styles.container}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={this.refresh}
              />
            }
          >
            <BalanceComponent
              balance={balance.formatted}
              sksTokens={balance.sks_tokens}
              navigation={navigation}
            ></BalanceComponent>
            <Button
              label={requestPaymentLiteral}
              onPress={() => navigation.navigate("RequestPaymentAmount")}
              disabled={!isVerified}
            ></Button>
            <FutureSettlementsComponent
              futureSettlements={futureSettlements}
              navigation={navigation}
            ></FutureSettlementsComponent>
          </ScrollView>
        ) : (
          <LoadingIndicator></LoadingIndicator>
        )}
        <BottomAppBar fab={fab}>
          <MenuButton
            icon={Assets.qrLogo}
            onPress={() => navigation.navigate("QRScanner")}
            accessibilityLabel="GrantCreditLine"
            disabled={!isVerified}
          />
        </BottomAppBar>
      </DashboardScreen>
    );
  }
}

const mapStateToProps = state => ({
  refreshing: balance.isRefreshing(state),
  loading: balance.isLoading(state),
  loaded: balance.isLoaded(state),
  errorMessage: balance.getErrorMessage(state),
  balance: balance.getBalance(state),
  futureSettlements: balance.getFutureSettlements(state),
  settings: settings.getAccountSettings(state),
  accountData: settings.getAccountData(state)
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(balance.actions, dispatch),
  intlActions: bindActionCreators(intl.actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(BalanceScreen);
