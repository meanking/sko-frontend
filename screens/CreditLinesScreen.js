import React from "react";
import PropTypes from "prop-types";
import {
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
  BackHandler
} from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import DashboardScreen from "./DashboardScreen";
import BottomAppBar from "../components/BottomAppBar";
import FabButton from "../components/FabButton";
import CreditLinesList from "../components/CreditLinesList";
import FailureView from "../components/FailureView";
import LoadingIndicator from "../components/LoadingIndicator";
import { ActionsType } from "../lib/types";
import Assets from "../assets";
import Theme from "../assets/Theme";

import * as settings from "../redux/modules/settings";
import * as creditline from "../redux/modules/creditline";
import * as intl from "../redux/modules/internationalization";

import { BAR_HEIGHT } from "../components/BottomAppBar";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.white
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
  },
  creditLinesList: {
    marginLeft: 16,
    marginBottom: BAR_HEIGHT
  }
});

class CreditLinesScreen extends React.Component {
  static navigationOptions = {
    headerShown: false
  };

  static propTypes = {
    errorMessage: PropTypes.string,
    isLoading: PropTypes.bool.isRequired,
    isLoadedSuccess: PropTypes.bool.isRequired,
    actions: ActionsType.isRequired,
    refreshing: PropTypes.bool.isRequired
  };

  static defaultProps = {
    errorMessage: null,
    creditLines: null
  };

  constructor(props) {
    super(props);

    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  componentDidMount() {
    const { actions, isLoadedSuccess } = this.props;
    if (!isLoadedSuccess) {
      actions.loadCreditLines();
    }

    BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
  }

  handleBackButtonClick() {
    this.props.navigation.navigate("Balance");
    return true;
  }

  refresh = () => {
    const { actions, refreshing } = this.props;
    if (!refreshing) {
      actions.refreshCreditLines();
    }
  };

  filterCreditLines = () => {
    const { creditLines } = this.props;

    const filtered = [];
    for (var i in creditLines) {
      const cl = creditLines[i];

      // cancelled cl filter - parameterizable
      if (cl.status !== "CANCELLED") filtered.push(cl);
    }

    return filtered;
  };

  renderContent() {
    const {
      errorMessage,
      isLoading,
      isLoadedSuccess,
      refreshing,
      intlActions
    } = this.props;

    // apply filters
    const creditLines = this.filterCreditLines();

    if (isLoadedSuccess && creditLines.length > 0) {
      return (
        <CreditLinesList
          style={styles.creditLinesList}
          groupByInitial
          creditLines={creditLines}
          onPressCreditLine={() => {
            this.props.navigation.navigate("InspectCreditLine");
          }}
          refreshing={isLoading}
          onRefresh={this.refresh}
        />
      );
    }

    if (errorMessage) {
      return (
        <FailureView
          title={intlActions.getString("CREDIT_LINES_LOADING_ERROR")}
          label={intlActions.getString("RETRY_LITERAL")}
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
        <Image style={styles.emptyImage} source={Assets.connectionCalendar} />
        <Text style={styles.emptyText}>
          {intlActions.getString("NO_CREDIT_LINES")}
        </Text>
      </ScrollView>
    );
  }

  render() {
    const { isLoading, navigation, intlActions, accountData } = this.props;
    const { isVerified } = accountData;

    const fab = (
      <FabButton
        icon={Assets.addIcon}
        onPress={() => navigation.navigate("CreateCreditLine")}
        disabled={!isVerified}
      />
    );

    return (
      <DashboardScreen screen="CreditLines" navigation={navigation}>
        <View style={styles.container}>
          <Text style={styles.title}>
            {intlActions.getString("CREDIT_LINES_LITERAL")}
          </Text>
          {isLoading ? <LoadingIndicator /> : this.renderContent()}
        </View>
        <BottomAppBar fab={fab} />
      </DashboardScreen>
    );
  }
}

const mapStateToProps = state => ({
  errorMessage: creditline.errorMessage(state),
  creditLines: creditline.getCreditLines(state),
  isLoading: creditline.isLoading(state),
  isLoadedSuccess: creditline.isLoadedSuccess(state),
  refreshing: creditline.isRefreshing(state),
  accountData: settings.getAccountData(state)
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(creditline.actions, dispatch),
  intlActions: bindActionCreators(intl.actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(CreditLinesScreen);
