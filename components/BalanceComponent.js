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
import Button from "../components/Button";
import ButtonLoading from "../components/ButtonLoading";
import Theme from "../assets/Theme";
import { formatAmount, formatDueDate } from "../lib/format";
import { ActionsType, SettlementType } from "../lib/types";
import * as balance from "../redux/modules/balance";
import * as intl from "../redux/modules/internationalization";
import * as spvModule from "../redux/modules/spv";
import BalanceSlider from "./BalanceSlider";

const { RequestSKSTokenState } = spvModule;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.white
  },
  title: {
    ...Theme.fonts.regular,
    fontSize: 24,
    color: Theme.colors.black,
    marginTop: 24,
    marginLeft: 16
  },
  sks: {
    ...Theme.fonts.regular,
    fontSize: 16,
    marginRight: 14,
    alignSelf: "flex-end"
  }
});

class BalanceComponent extends React.Component {
  static propTypes = {
    balance: PropTypes.arrayOf,
    actions: ActionsType.isRequired
  };

  static defaultProps = {
    balance: null
  };

  sksComponent = sksTokens => {
    const { spvActions, requestSKSTokensStatus } = this.props;

    const isProcessing =
      requestSKSTokensStatus === RequestSKSTokenState.REQUESTING ||
      requestSKSTokensStatus === RequestSKSTokenState.WAITING_TX_RESPONSE;

    const requestSKSButton =
      sksTokens < 20 ? (
        <View>
          {isProcessing ? (
            <ButtonLoading label="Requesting SKS tokens..."></ButtonLoading>
          ) : (
            <Button
              onPress={() => spvActions.requestSKSTokens()}
              label="Request SKS"
            ></Button>
          )}
        </View>
      ) : null;

    return (
      <View>
        <Text style={styles.sks}>SKS: {sksTokens}</Text>
        {requestSKSButton}
      </View>
    );
  };

  renderContent() {
    const { balance, sksTokens, intlActions } = this.props;

    var balances = [];
    for (let [key, value] of Object.entries(balance)) {
      const obj = { currency_iso: key, formatted: value };
      balances.push(obj);
    }

    return (
      <View>
        <Text style={styles.title}>
          {intlActions.getString("BALANCE_LITERAL")}{" "}
          {balances.length === 0
            ? "- " + intlActions.getString("EMPTY_LITERAL").toLowerCase()
            : null}
        </Text>
        <BalanceSlider balances={balances}></BalanceSlider>
        {sksTokens ? this.sksComponent(sksTokens) : null}
      </View>
    );
  }

  render() {
    const { refreshing } = this.props;

    return (
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={this.refresh} />
        }
      >
        {this.renderContent()}
        <View style={{ height: 80 }} />
      </ScrollView>
    );
  }
}

const mapStateToProps = state => ({
  requestSKSTokensStatus: spvModule.requestSKSTokensStatus(state)
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(balance.actions, dispatch),
  intlActions: bindActionCreators(intl.actions, dispatch),
  spvActions: bindActionCreators(spvModule.actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(BalanceComponent);
