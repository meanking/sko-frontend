import React from "react";
import PropTypes from "prop-types";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import * as iouModule from "../redux/modules/iou";
import * as intl from "../redux/modules/internationalization";

import * as Alerts from "../components/AlertBox.js";

import Theme from "../assets/Theme";
import LoadingIndicator from "../components/LoadingIndicator.js";
import ButtonLoading from "../components/ButtonLoading.js";
import Button from "../components/Button";
import BackArrow from "../components/BackArrow.js";
import { qrTypes, generateQRComponent, QR_SIZE } from "../lib/qr.js";

const { FullSettleIOUState, PartialSettleIOUState } = iouModule;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.colors.white,
    flex: 1,
    flexDirection: "column",
    alignItems: "stretch",
  },
  otherUser: {
    color: Theme.colors.black,
    fontSize: 26,
    textAlign: "center",
    marginTop: "10%",
  },
  iouStatus: {
    color: Theme.colors.darkgrey,
    fontSize: 20,
    textAlign: "center",
  },
  amount: {
    color: Theme.colors.black,
    fontSize: 46,
    textAlign: "center",
    marginBottom: "1%",
    marginTop: "6%",
  },
  qrContainer: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    marginTop: "10%",
  },
  positiveAmount: { color: Theme.colors.green },
  negativeAmount: { color: Theme.colors.red },
  buttonHolder: { marginTop: "30%" },
  refundableStyle: {
    color: Theme.colors.darkgrey,
    fontSize: 20,
    alignSelf: "center",
    textAlign: "center",
    marginTop: "6%",
  },
});

class InspectIOUScreen extends React.Component {
  static navigationOptions = {
    headerShown: false,
  };

  static propTypes = {
    actions: PropTypes.objectOf(PropTypes.func).isRequired,
    navigation: PropTypes.any.isRequired,
    error: PropTypes.string,
    creditLine: PropTypes.object,
  };

  static defaultProps = {
    error: null,
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { iouActions, isSingleIOURefreshing } = this.props;

    if (!isSingleIOURefreshing) {
      iouActions.refreshSingleIOU();
    }
  }

  refresh() {
    const { iouActions, isIOURefreshing } = this.props;

    if (!isIOURefreshing) {
      iouActions.refreshSingleIOU();
    }
  }

  renderFullSettleButton = () => {
    const {
      iouId,
      fullSettleIOUStatus,
      login,
      iouActions,
      intlActions,
    } = this.props;

    const fullSettlingIOULiteral = intlActions.getString(
      "FULL_SETTLING_IOU_LITERAL"
    );
    const fullSettleLiteral = intlActions.getString("FULL_SETTLE_LITERAL");
    const fullSettleMessage = intlActions.getString("FULL_SETTLE_MESSAGE");
    const confirmLiteral = intlActions.getString("CONFIRM_LITERAL");
    const dismissLiteral = intlActions.getString("DISMISS_LITERAL");

    const isProcessing =
      fullSettleIOUStatus === FullSettleIOUState.SETTLING ||
      fullSettleIOUStatus === FullSettleIOUState.WAITING_TX_RESPONSE;

    const variant = "success";

    return isProcessing ? (
      <ButtonLoading variant={variant} label={fullSettlingIOULiteral + "..."} />
    ) : (
      <Button
        label={fullSettleLiteral}
        accesibilityLabel="FullSettle"
        variant={variant}
        onPress={() => {
          Alerts.showChoiceAlert({
            title: fullSettleLiteral,
            message: fullSettleMessage,
            confirmText: confirmLiteral,
            cancelText: dismissLiteral,
            confirmAction: () => {
              iouActions.fullSettleIOU({
                settler: login.username,
                iouId: iouId,
              });
            },
            cancelAction: () => {},
          });
        }}
      />
    );
  };

  renderPartialSettleButton = () => {
    const {
      iouId,
      partialSettleIOUStatus,
      login,
      iouActions,
      intlActions,
      navigation,
    } = this.props;

    const partialSettlingIOULiteral = intlActions.getString(
      "PARTIAL_SETTLING_IOU_LITERAL"
    );
    const partialSettleLiteral = intlActions.getString(
      "PARTIAL_SETTLE_LITERAL"
    );

    const isProcessing =
      partialSettleIOUStatus === PartialSettleIOUState.SETTLING ||
      partialSettleIOUStatus === PartialSettleIOUState.WAITING_TX_RESPONSE;

    const variant = "fancy";

    return isProcessing ? (
      <ButtonLoading variant={variant} label={partialSettlingIOULiteral} />
    ) : (
      <Button
        label={partialSettleLiteral}
        accesibilityLabel="PartialSettle"
        variant={variant}
        onPress={() => {
          // iouActions.partialSettleIOU show amount screen
          navigation.navigate("PartialSettleAmount");
        }}
      />
    );
  };

  renderQR() {
    const { iouId } = this.props;
    return generateQRComponent(qrTypes.iouId, iouId, {
      size: QR_SIZE / 1.5,
    });
  }

  renderRequestSettlementButton = () => {
    const { iouId, intlActions } = this.props;

    const showQr = intlActions.getString("SHOW_QR_TO_USER");

    return (
      <View style={styles.qrContainer}>
        <Text style={{ alignSelf: "center" }}>{showQr}</Text>
        <View style={{ marginTop: "5%" }}>{this.renderQR()}</View>
      </View>
    );
  };

  renderPayer = () => {
    return <View>{this.renderRequestSettlementButton()}</View>;
  };

  renderPayee = () => {
    return (
      <View style={styles.buttonHolder}>
        {this.renderFullSettleButton()}
        {this.renderPartialSettleButton()}
      </View>
    );
  };

  renderGenericData = () => {
    const { iou, intlActions } = this.props;
    const { otherUser, dueIn, status, amountFormatted, direction } = iou;

    const dueLiteral = intlActions.getString("DUE_LITERAL");
    const dueInLiteral = intlActions.getString("DUE_IN_LITERAL");
    const daysLiteral = intlActions.getString("DAYS_LITERAL").toLowerCase();
    const lateByLiteral = intlActions.getString("LATE_BY_LITERAL");
    const settledLiteral = intlActions.getString("SETTLED_LITERAL");

    const tomorrowLiteral = intlActions.getString("TOMORROW");
    const todayLiteral = intlActions.getString("TODAY");

    const dueInLabel = () => {
      if (dueIn > 1) return dueInLiteral + " " + dueIn + " " + daysLiteral;

      if (dueIn === 1) return dueLiteral + " " + tomorrowLiteral;

      if (dueIn === 0) return dueLiteral + " " + todayLiteral;

      if (dueIn < 0) {
        const lateBy = dueIn * -1;
        return lateByLiteral + " " + lateBy + " " + daysLiteral;
      }
    };

    const statusLabel = () => {
      return status === "RUNNING"
        ? dueInLabel()
        : status === "SETTLED"
        ? settledLiteral
        : status === "CLEARED"
        ? clearedLiteral
        : "NOT DEFINED STATUS";
    };

    const settleTodayAt = intlActions.getString("SETTLE_TODAY_AT");

    const refundableLabel = () => {
      return status === "RUNNING" ? (
        <Text style={styles.refundableStyle}>
          {settleTodayAt} {iou.amountRefundable}
        </Text>
      ) : null;
    };

    const extraAmountStyle = direction
      ? styles.positiveAmount
      : styles.negativeAmount;
    const sign = direction ? "+" : "-";

    return (
      <View>
        <Text style={[styles.otherUser]}>{otherUser}</Text>
        <Text style={[styles.amount, extraAmountStyle]}>
          {sign}
          {amountFormatted}
        </Text>
        <Text style={styles.iouStatus}>{statusLabel()}</Text>
        {/* <View style={styles.refundableStyle}>{refundableLabel()}</View> */}
      </View>
    );
  };

  renderContent = () => {
    const { isSingleIOULoaded, iou } = this.props;

    if (isSingleIOULoaded) {
      return (
        <View>
          {this.renderGenericData()}
          {iou.status === "RUNNING"
            ? iou.direction
              ? this.renderPayee()
              : this.renderPayer()
            : null}
        </View>
      );
    }
  };

  render() {
    const { isSingleIOULoading } = this.props;

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <BackArrow />
        <View style={styles.container}>
          {isSingleIOULoading ? <LoadingIndicator /> : this.renderContent()}
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => ({
  login: state.login,
  //
  iouId: iouModule.getInspectIOUId(state),
  //
  singleIOUErrorMessage: iouModule.getLoadSingleIOUStatus(state),
  isSingleIOULoading: iouModule.isSingleIOULoading(state),
  isSingleIOULoaded: iouModule.isSingleIOULoaded(state),
  isSingleIOURefreshing: iouModule.isSingleIOURefreshing(state),
  //
  iou: iouModule.getIOU(state),
  //
  fullSettleIOUStatus: iouModule.getFullSettleIOUStatus(state),
  partialSettleIOUStatus: iouModule.getPartialSettleIOUStatus(state),
});

const mapDispatchToProps = (dispatch) => ({
  iouActions: bindActionCreators(iouModule.actions, dispatch),
  intlActions: bindActionCreators(intl.actions, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InspectIOUScreen);
