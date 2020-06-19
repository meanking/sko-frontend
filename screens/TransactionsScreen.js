import React from "react";
import PropTypes from "prop-types";
import {
  Image,
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
import FabButton from "../components/FabButton";
import TransactionsList from "../components/TransactionsList";
import FailureView from "../components/FailureView";
import LoadingIndicator from "../components/LoadingIndicator";
import { ActionsType } from "../lib/types";
import Assets from "../assets";
import Theme from "../assets/Theme";
import * as transaction from "../redux/modules/transaction";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.white,
    paddingBottom: 56
  },
  title: {
    ...Theme.fonts.regular,
    fontSize: 24,
    color: Theme.colors.black,
    marginLeft: 16,
    marginTop: 32
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  emptyImage: {
    height: 48,
    width: 48,
    tintColor: Theme.colors.darkgrey
  },
  emptyText: {
    ...Theme.fonts.light,
    fontSize: 24,
    padding: 10,
    width: 250,
    textAlign: "center",
    color: Theme.colors.darkgrey
  }
});

class TransactionsScreen extends React.Component {
  static navigationOptions = {
    headerShown: false
  };

  static propTypes = {
    errorMessage: PropTypes.any,
    navigation: PropTypes.any.isRequired,
    isLoading: PropTypes.bool.isRequired,
    isLoadedSuccess: PropTypes.bool.isRequired,
    transactions: PropTypes.any,
    refreshing: PropTypes.bool.isRequired,
    actions: ActionsType.isRequired
  };

  static defaultProps = {
    errorMessage: null,
    transactions: null
  };

  componentDidMount() {
    const { actions, isLoadedSuccess } = this.props;
    if (!isLoadedSuccess) {
      actions.loadTransactions();
    }
  }

  refresh = () => {
    const { actions, isLoading } = this.props;
    if (!isLoading) {
      actions.refreshTransactions();
    }
  };

  renderContent() {
    const {
      errorMessage,
      isLoading,
      isLoadedSuccess,
      refreshing,
      transactions
    } = this.props;

    if (isLoadedSuccess && transactions.length > 0) {
      return (
        <TransactionsList
          transactions={transactions}
          refreshing={isLoading}
          onRefresh={this.refresh}
        />
      );
    }

    if (errorMessage) {
      return (
        <FailureView
          text={errorMessage || "Error loading transactions"}
          label="Retry"
          onPress={this.refresh}
        />
      );
    }

    return (
      <ScrollView
        contentContainerStyle={styles.emptyContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={this.refresh} />
        }
      >
        <Image style={styles.emptyImage} source={Assets.attachMoneyIcon} />
        <Text style={styles.emptyText}>
          You didn&apos;t make any transactions yet.
        </Text>
      </ScrollView>
    );
  }

  render() {
    const { navigation, isLoading } = this.props;

    const fab = (
      <FabButton
        icon={Assets.attachMoneyIcon}
        onPress={() => navigation.navigate("Pay")}
        accessibilityLabel="PayButton"
      />
    );

    return (
      <DashboardScreen screen="Transactions" navigation={navigation}>
        <View style={styles.container}>
          <Text style={styles.title}>Transactions</Text>
          {isLoading ? <LoadingIndicator /> : this.renderContent()}
        </View>
        <BottomAppBar fab={fab} />
      </DashboardScreen>
    );
  }
}

const mapStateToProps = state => ({
  errorMessage: transaction.errorMessage(state),
  isLoading: transaction.isLoading(state),
  isLoadedSuccess: transaction.isLoadedSuccess(state),
  refreshing: transaction.isRefreshing(state),
  transactions: transaction.getTransactions(state)
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(transaction.actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(TransactionsScreen);
