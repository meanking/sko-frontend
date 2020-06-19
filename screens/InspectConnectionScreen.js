import React from "react";
import PropTypes from "prop-types";
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  RefreshControl,
} from "react-native";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import Assets from "../assets";
import Theme from "../assets/Theme";
import { ActionsType } from "../lib/types.js";
import BalanceComponent from "../components/BalanceComponent.js";
import LoadingIndicator from "../components/LoadingIndicator.js";
import FutureSettlementsComponent from "../components/FutureSettlementsComponent.js";
import BackArrow from "../components/BackArrow.js";
import Button from "../components/Button";
import ButtonLoading from "../components/ButtonLoading";
import * as Alerts from "../components/AlertBox.js";

import { qrTypes, generateQRComponent, QR_SIZE } from "../lib/qr.js";

import * as connection from "../redux/modules/connection";
import * as intl from "../redux/modules/internationalization";

const {
  AcceptConnectionState,
  RejectConnectionState,
  CancelConnectionState,
  ReactivateConnectionState,
} = connection;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.colors.white,
    flex: 1,
    flexDirection: "column",
    alignItems: "stretch",
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
  },
  title: {
    fontSize: 20,
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
    backgroundColor: Theme.colors.white,
  },
  creditLinesCounter: {
    flexDirection: "row",
    flex: 1,
    left: "50%",
  },
  qrContainer: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    marginTop: "20%",
  },
});

class InspectConnectionScreen extends React.Component {
  static navigationOptions = {
    headerShown: false,
  };

  static propTypes = {
    connectionId: PropTypes.string.isRequired,
    navigation: PropTypes.any.isRequired,
    isConnectionLoading: PropTypes.bool.isRequired,
    isConnectionLoadedSuccess: PropTypes.bool.isRequired,
    connection: PropTypes.object,
    connectionActions: ActionsType.isRequired,
    isConnectionRefreshing: PropTypes.bool.isRequired,
    connectionErrorMessage: PropTypes.string,
  };

  static defaultProps = {
    connectionId: null,
    connectionErrorMessage: null,
    connection: null,
  };

  constructor(props) {
    super(props);

    this.state = { hideCancelButton: false };
  }

  componentDidMount() {
    const {
      connectionId,
      connectionActions,
      isConnectionRefreshing,
    } = this.props;

    if (!isConnectionRefreshing) {
      connectionActions.refreshConnection(connectionId);
    }
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.connection === null && this.props.connection === null)
      return false;

    if (nextProps.connection === null) return false;

    return true;
  }

  refresh(props) {
    const { connectionActions, isConnectionRefreshing, connectionId } = props;

    if (!isConnectionRefreshing) {
      connectionActions.refreshConnection(connectionId);
    }
  }

  renderFutureSettlementsComponent(futureSettlements) {
    const { navigation } = this.props;

    return (
      <FutureSettlementsComponent
        futureSettlements={futureSettlements}
        navigation={navigation}
      />
    );
  }

  renderAcceptButton() {
    const {
      connectionId,
      acceptConnectionStatus,
      login,
      connectionActions,
      intlActions,
    } = this.props;

    const acceptingConnectionLiteral = intlActions.getString(
      "ACCEPTING_CONNECTION_LITERAL"
    );
    const acceptConnectionLiteral = intlActions.getString(
      "ACCEPT_CONNECTION_LITERAL"
    );
    const acceptConnectionMessage = intlActions.getString(
      "ACCEPT_CONNECTION_MESSAGE"
    );
    const acceptLiteral = intlActions.getString("ACCEPT_LITERAL");
    const confirmLiteral = intlActions.getString("CONFIRM_LITERAL");
    const dismissLiteral = intlActions.getString("DISMISS_LITERAL");

    const isProcessing =
      acceptConnectionStatus === AcceptConnectionState.ACCEPTING ||
      acceptConnectionStatus === AcceptConnectionState.WAITING_TX_RESPONSE;

    const variant = "success";

    return isProcessing ? (
      <ButtonLoading
        variant={variant}
        label={acceptingConnectionLiteral + "..."}
      />
    ) : (
      <Button
        label={acceptLiteral}
        accessibilityLabel="Accept"
        variant={variant}
        onPress={() => {
          Alerts.showChoiceAlert({
            title: acceptConnectionLiteral,
            message: acceptConnectionMessage,
            confirmText: confirmLiteral,
            cancelText: dismissLiteral,
            confirmAction: () => {
              this.setState({ hideCancelButton: true });
              connectionActions.acceptConnection({
                acceptor: login.username,
                id: connectionId,
              });
            },
            cancelAction: () => {},
          });
        }}
      />
    );
  }

  renderRejectButton() {
    const {
      connectionId,
      rejectConnectionStatus,
      connectionActions,
      login,
      intlActions,
    } = this.props;

    const rejectingConnectionLiteral = intlActions.getString(
      "REJECTING_CONNECTION_LITERAL"
    );
    const rejectLiteral = intlActions.getString("REJECT_LITERAL");

    const isProcessing =
      rejectConnectionStatus === RejectConnectionState.REJECTING ||
      rejectConnectionStatus === RejectConnectionState.WAITING_TX_RESPONSE;

    const variant = "danger";

    return isProcessing ? (
      <ButtonLoading
        variant={variant}
        label={rejectingConnectionLiteral + "..."}
      />
    ) : (
      <Button
        label={rejectLiteral}
        accessibilityLabel="Reject"
        variant={variant}
        onPress={() => {
          connectionActions.rejectConnection({
            rejector: login.username,
            id: connectionId,
          });
        }}
      />
    );
  }

  renderReactivateButton() {
    const {
      connectionId,
      reactivateConnectionStatus,
      connectionActions,
      login,
      intlActions,
    } = this.props;

    const reactivatingConnectionLiteral = intlActions.getString(
      "REACTIVATING_CONNECTION_LITERAL"
    );
    const reactivateLiteral = intlActions.getString("REACTIVATE_LITERAL");

    const isProcessing =
      reactivateConnectionStatus === ReactivateConnectionState.REACTIVATING ||
      reactivateConnectionStatus ===
        ReactivateConnectionState.WAITING_TX_RESPONSE;

    const variant = "fancy";

    return isProcessing ? (
      <ButtonLoading
        variant={variant}
        label={reactivatingConnectionLiteral + "..."}
      />
    ) : (
      <Button
        label={reactivateLiteral}
        accessibilityLabel="Reactivate"
        variant={variant}
        onPress={() => {
          connectionActions.reactivateConnection({
            reactivator: login.username,
            id: connectionId,
          });
        }}
      />
    );
  }

  renderCancelButton() {
    const {
      connectionId,
      cancelConnectionStatus,
      connectionActions,
      login,
      connection,
      intlActions,
    } = this.props;

    const cancelingConnectionLiteral = intlActions.getString(
      "CANCELING_CONNECTION_LITERAL"
    );
    const cancelConnectionLiteral = intlActions.getString(
      "CANCEL_CONNECTION_LITERAL"
    );
    const cancelConnectionMessage = intlActions.getString(
      "CANCEL_CONNECTION_MESSAGE"
    );
    const cannotCancelConnection = intlActions.getString(
      "CANNOT_CANCEL_CONNECTION_IOUS"
    );

    const cancelLiteral = intlActions.getString("CANCEL_LITERAL");
    const dismissLiteral = intlActions.getString("DISMISS_LITERAL");
    const confirmLiteral = intlActions.getString("CONFIRM_LITERAL");

    const activeIOUs = connection.future_settlement_ious.length;

    const isProcessing =
      cancelConnectionStatus === CancelConnectionState.CANCELING ||
      cancelConnectionStatus === CancelConnectionState.WAITING_TX_RESPONSE;

    const variantEnabled = "danger";
    const variantDisabled = "disabled";
    const variant = "danger";

    return isProcessing ? (
      <ButtonLoading variant={variant} label={cancelingConnectionLiteral} />
    ) : (
      <Button
        label={cancelLiteral}
        accessibilityLabel="Cancel"
        variant={activeIOUs ? variantDisabled : variantEnabled}
        onPress={() => {
          activeIOUs
            ? Alerts.showNotificationAlert({
                title: cancelConnectionLiteral,
                message: cannotCancelConnection,
                cancelText: dismissLiteral,
                cancelAction: () => {},
              })
            : Alerts.showChoiceAlert({
                title: cancelConnectionLiteral,
                message: cancelConnectionMessage,
                confirmText: confirmLiteral,
                cancelText: dismissLiteral,
                confirmAction: () => {
                  connectionActions.cancelConnection({
                    canceller: login.username,
                    id: connectionId,
                  });
                },
                cancelAction: () => {},
              });
        }}
      />
    );
  }

  renderBalanceComponent(balance) {
    const { connection, isConnectionRefreshing, intlActions } = this.props;

    return (
      <View
        style={{
          width: null,
          flex: 1,
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <BalanceComponent
          navigation={this.props.navigation}
          refreshing={isConnectionRefreshing}
          balance={balance}
        />
        <View style={styles.creditLinesCounter}>
          <Image source={Assets.creditLineIcon} />
          <Text>
            {connection.creditlines.length > 0 ? (
              <Text>
                {connection.creditlines.length}{" "}
                {intlActions.getString("CREDIT_LINES_LITERAL").toLowerCase()}
              </Text>
            ) : (
              <Text>
                {intlActions.getString("NO_CREDIT_LINES_LITERAL").toLowerCase()}
              </Text>
            )}
          </Text>
        </View>
      </View>
    );
  }

  renderActiveConnection() {
    const { connection, intlActions } = this.props;

    const balance = connection.balance_formatted;
    const futureSettlements = connection.future_settlement_ious;

    return (
      <View>
        {this.renderBalanceComponent(balance)}
        {this.renderFutureSettlementsComponent(futureSettlements)}
        {this.state.hideCancelButton ? null : this.renderCancelButton()}
      </View>
    );
  }

  renderOutgoingPendingConnection() {
    return (
      <View style={styles.qrContainer}>
        <Text style={{ alignSelf: "center" }}>
          Show QR to user to find connection easier.
        </Text>
        <View style={{ marginTop: "5%" }}>{this.renderQR()}</View>
      </View>
    );
  }

  renderIncomingPendingConnection() {
    return (
      <View>
        <View style={styles.buttonContainer}>
          {this.renderAcceptButton()}
          {this.renderRejectButton()}
          {/* {this.renderCancelButton()} */}
        </View>
      </View>
    );
  }

  renderOutgoingInactiveConnection() {
    return <View />;
  }

  renderIncomingInactiveConnection() {
    return (
      <View>
        <View style={styles.buttonContainer}>
          {this.renderReactivateButton()}
          {this.renderCancelButton()}
        </View>
      </View>
    );
  }

  renderCancelledConnection() {
    return <View />;
  }

  renderConnectionStatusDependentContent() {
    const { connection, intlActions } = this.props;

    const connectionStatus = connection.status;
    const connectionDirection = connection.direction;

    switch (connectionStatus) {
      case "ACTIVE": {
        return this.renderActiveConnection();
      }
      case "PENDING": {
        return connectionDirection
          ? this.renderOutgoingPendingConnection()
          : this.renderIncomingPendingConnection();
      }
      case "INACTIVE": {
        return connectionDirection
          ? this.renderOutgoingInactiveConnection()
          : this.renderIncomingInactiveConnection();
      }
      case "CANCELLED": {
        return this.renderCancelledConnection();
      }
    }

    // const newCreditLineFab = (
    //   <FabButton
    //     icon={Assets.creditLineIcon}
    //     accessibilityLabel="PayButton"
    //     accessibilityHint="PayButton"
    //     onPress={() => navigation.navigate("Pay")}
    //   />
    // );
    // const paymentFab = (
    //   <FabButton
    //     icon={Assets.attachMoneyIcon}
    //     accessibilityLabel="PayButton"
    //     accessibilityHint="PayButton"
    //     onPress={() => navigation.navigate("Pay")}
    //   />
    // );
  }

  renderQR() {
    const { connectionId } = this.props;
    return generateQRComponent(qrTypes.connectionId, connectionId, {
      size: QR_SIZE,
    });
  }

  renderContent() {
    const {
      connectionErrorMessage,
      connection,
      isConnectionLoading,
      isConnectionLoadedSuccess,
      isConnectionRefreshing,
      intlActions,
    } = this.props;

    if (isConnectionLoadedSuccess) {
      // title component, present for all connection status
      const connectionTo = intlActions.getString("CONNECTION_TO");
      const titleComponent = (
        <View>
          <Text style={styles.title}>
            {connectionTo} {connection.username} -{" "}
            {intlActions.getString(connection.status)}
          </Text>
        </View>
      );

      // const bottomBar = <View fab1={newCreditLineFab} fab2={paymentFab}></View>;

      return (
        <View>
          {titleComponent}
          {this.renderConnectionStatusDependentContent()}
          {/* {bottomBar} */}
        </View>
      );
    } else {
      return (
        <View>
          <Text>Not Loaded yet</Text>
        </View>
      );
    }
  }

  render() {
    const {
      isConnectionLoadedSuccess,
      isConnectionLoading,
      isConnectionRefreshing,
      intlActions,
    } = this.props;

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          style={styles.scrollView}
          refreshControl={
            <RefreshControl
              refreshing={isConnectionRefreshing}
              onRefresh={() => {
                this.refresh(this.props);
              }}
            />
          }
        >
          <BackArrow />
          <View>
            {isConnectionLoading ? <LoadingIndicator /> : this.renderContent()}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => ({
  //
  login: state.login,
  //
  connectionId: connection.getInspectConnectionId(state),
  //
  connectionErrorMessage: connection.singleConnectionErrorMessage(state),
  isConnectionLoading: connection.isSingleConnectionLoading(state),
  isConnectionLoadedSuccess: connection.isSingleConnectionLoadedSuccess(state),
  isConnectionRefreshing: connection.isSingleConnectionRefreshing(state),
  connection: connection.getConnection(state),
  //
  acceptConnectionStatus: connection.getAcceptConnectionStatus(state),
  rejectConnectionStatus: connection.getRejectConnectionStatus(state),
  cancelConnectionStatus: connection.getCancelConnectionStatus(state),
  reactivateConnectionStatus: connection.getReactivateConnectionStatus(state),
});

const mapDispatchToProps = (dispatch) => ({
  connectionActions: bindActionCreators(connection.actions, dispatch),
  intlActions: bindActionCreators(intl.actions, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InspectConnectionScreen);
