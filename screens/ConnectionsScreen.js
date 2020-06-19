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
import ConnectionsList from "../components/ConnectionsList";
import FailureView from "../components/FailureView";
import LoadingIndicator from "../components/LoadingIndicator";
import { DisplayUserType, ActionsType } from "../lib/types";
import Assets from "../assets";
import Theme from "../assets/Theme";

import * as settings from "../redux/modules/settings";
import * as connection from "../redux/modules/connection";
import * as intl from "../redux/modules/internationalization";

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
  connectionsList: {
    marginLeft: 16
  }
});

class ConnectionsScreen extends React.Component {
  static navigationOptions = {
    headerShown: false
  };

  static propTypes = {
    errorMessage: PropTypes.string,
    isLoading: PropTypes.bool.isRequired,
    isLoadedSuccess: PropTypes.bool.isRequired,
    connections: PropTypes.arrayOf(DisplayUserType),
    actions: ActionsType.isRequired,
    refreshing: PropTypes.bool.isRequired,
    onPressProps: PropTypes.object.isRequired,
    navigation: PropTypes.object
  };

  static defaultProps = {
    errorMessage: null,
    connections: null,
    onPressProps: null
  };

  constructor(props) {
    super(props);

    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  componentDidMount() {
    const { actions, isLoadedSuccess } = this.props;
    if (!isLoadedSuccess) {
      actions.loadConnections();
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

  refresh = () => {
    const { actions, refreshing } = this.props;
    if (!refreshing) {
      actions.refreshConnections();
    }
  };

  handleBackButtonClick() {
    this.props.navigation.navigate("Balance");
    return true;
  }

  filterConnections = () => {
    const { connections } = this.props;

    const filtered = [];

    for (var i in connections) {
      const conn = connections[i];

      // cancelled conn filter
      if (conn.status !== "CANCELLED") filtered.push(conn);
    }

    return filtered;
  };

  renderContent() {
    const {
      errorMessage,
      isLoading,
      isLoadedSuccess,
      refreshing,
      onPressProps,
      intlActions,
      navigation
    } = this.props;

    const connections = this.filterConnections();

    if (isLoadedSuccess && connections.length > 0) {
      return (
        <ConnectionsList
          style={styles.connectionsList}
          groupByInitial
          connections={connections}
          onPressConnection={() => navigation.navigate("InspectConnection")}
          refreshing={isLoading}
          onRefresh={this.refresh}
          navigation={navigation}
        />
      );
    }

    if (errorMessage) {
      return (
        <FailureView
          title={intlActions.getString("CONNECTIONS_LOADING_ERROR")}
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
          {intlActions.getString("NO_CONNECTIONS")}
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
        onPress={() => navigation.navigate("CreateConnection")}
        disabled={!isVerified}
      />
    );

    return (
      <DashboardScreen screen="Connections" navigation={navigation}>
        <View style={styles.container}>
          <Text style={styles.title}>
            {intlActions.getString("CONNECTIONS_LITERAL")}
          </Text>
          {isLoading ? <LoadingIndicator /> : this.renderContent()}
        </View>
        <BottomAppBar fab={fab} />
      </DashboardScreen>
    );
  }
}

const mapStateToProps = state => ({
  errorMessage: connection.errorMessage(state),
  connections: connection.getConnections(state),
  isLoading: connection.isLoading(state),
  isLoadedSuccess: connection.isLoadedSuccess(state),
  refreshing: connection.isRefreshing(state),
  accountData: settings.getAccountData(state)
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(connection.actions, dispatch),
  intlActions: bindActionCreators(intl.actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ConnectionsScreen);
