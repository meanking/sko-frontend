import React from "react";
import PropTypes from "prop-types";
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  RefreshControl,
  TouchableWithoutFeedback,
} from "react-native";

import BackArrow from "../components/BackArrow.js";
import Button from "../components/Button";
import ButtonLoading from "../components/ButtonLoading";
import LoadingIndicator from "../components/LoadingIndicator";
import SuccessView from "../components/SuccessView";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import * as creditline from "../redux/modules/creditline";
import * as intl from "../redux/modules/internationalization";

import Theme from "../assets/Theme";
import { ActionsType } from "../lib/types.js";
import FutureSettlementsComponent from "../components/FutureSettlementsComponent.js";
import ConversionPermitsComponent from "../components/ConversionPermitsComponent.js";
import { qrTypes, generateQRComponent, QR_SIZE } from "../lib/qr.js";
import * as Alerts from "../components/AlertBox.js";

import Assets from "../assets";

const {
  AcceptCreditLineState,
  RejectCreditLineState,
  CancelCreditLineState,
  FreezeCreditLineState,
  UnfreezeCreditLineState,
  GrantConversionPermitState,
} = creditline;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.colors.white,
    flex: 1,
    flexDirection: "column",
    alignItems: "stretch",
  },
  regularComponents: {
    paddingTop: 20,
    flexDirection: "column",
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "stretch",
  },
  row: {
    flexDirection: "row",
    flex: 1,
    width: null,
    justifyContent: "space-between",
    marginLeft: 4,
    marginRight: 4,
  },
  title: {
    textAlign: "center",
    fontSize: 20,
  },
  rightComponent: {
    textAlign: "right",
  },
  leftComponent: {
    textAlign: "left",
  },
  conversionLabel: {
    paddingTop: 10,
    paddingBottom: 4,
    marginLeft: 4,
    color: Theme.colors.darkgrey,
  },
  noConversion: {
    fontSize: 14,
    color: Theme.colors.red,
    marginLeft: 4,
  },
  heading1: { fontSize: 20 },
  heading2: { fontSize: 16 },
  heading3: { fontSize: 14 },
  touchableLabel: {
    ...Theme.fonts.regular,
    fontSize: 15,
    color: Theme.colors.darkgrey,
    textAlign: "center",
    flex: 0.5,
  },
  touchableContainer: {
    marginTop: 15,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  selectedLabel: {
    // backgroundColor: Theme.colors.grey,
    color: Theme.colors.red,
    ...Theme.fonts.regular,
    fontSize: 20,
    textAlign: "center",
    flex: 0.5,
  },
  qrContainer: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    marginTop: "20%",
  },
});

class InspectCreditLineScreen extends React.Component {
  static navigationOptions = {
    headerShown: false,
  };

  static propTypes = {
    creditLineId: PropTypes.number.isRequired,
    navigation: PropTypes.any.isRequired,
    isCreditLineLoading: PropTypes.bool.isRequired,
    isCreditLineLoadedSuccess: PropTypes.bool.isRequired,
    creditLine: PropTypes.object,
    creditLineActions: ActionsType.isRequired,
    isCreditLineRefreshing: PropTypes.bool.isRequired,
    creditLineErrorMessage: PropTypes.string,
  };

  static defaultProps = {
    creditLineId: null,
    creditLineErrorMessage: null,
    creditLine: null,
  };

  constructor(props) {
    super(props);

    this.state = { show: "ious", hideCancelButton: false };
  }

  componentDidMount() {
    const {
      creditLineId,
      creditLineActions,
      isCreditLineRefreshing,
      intlActions,
    } = this.props;

    if (!isCreditLineRefreshing) {
      creditLineActions.refreshCreditLine(creditLineId);
    }
  }

  refresh(props) {
    const { creditLineId, creditLineActions, isCreditLineRefreshing } = props;

    if (!isCreditLineRefreshing) {
      creditLineActions.refreshCreditLine(creditLineId);
    }
  }

  /** Render action buttons. */
  renderAcceptButton() {
    const {
      creditLineId,
      acceptCreditLineStatus,
      login,
      creditLineActions,
      intlActions,
    } = this.props;

    const acceptingCreditLineLiteral = intlActions.getString(
      "ACCEPTING_CREDIT_LINE_LITERAL"
    );
    const acceptCreditLineLiteral = intlActions.getString(
      "ACCEPT_CREDIT_LINE_LITERAL"
    );
    const acceptCreditLineMessage = intlActions.getString(
      "ACCEPT_CREDIT_LINE_MESSAGE"
    );
    const acceptLiteral = intlActions.getString("ACCEPT_LITERAL");
    const confirmLiteral = intlActions.getString("CONFIRM_LITERAL");
    const dismissLiteral = intlActions.getString("DISMISS_LITERAL");

    const isProcessing =
      acceptCreditLineStatus === AcceptCreditLineState.ACCEPTING ||
      acceptCreditLineStatus === AcceptCreditLineState.WAITING_TX_RESPONSE;

    const variant = "success";

    return isProcessing ? (
      <ButtonLoading
        variant={variant}
        label={acceptingCreditLineLiteral + "..."}
      />
    ) : (
      <Button
        label={acceptLiteral}
        accessibilityLabel="Accept"
        variant={variant}
        onPress={() => {
          Alerts.showChoiceAlert({
            title: acceptCreditLineLiteral,
            message: acceptCreditLineMessage,
            confirmText: confirmLiteral,
            cancelText: dismissLiteral,
            confirmAction: () => {
              this.setState({ hideCancelButton: true });
              creditLineActions.acceptCreditLine(
                {
                  acceptor: login.username,
                  id: creditLineId,
                },
                () => {
                  console.log("SUCCESS");
                  this.setState({ creditLineAccepted: true });
                },
                () => {}
              );
            },
            cancelAction: () => {},
          });
        }}
      />
    );
  }

  renderRejectButton() {
    const {
      creditLineId,
      rejectCreditLineStatus,
      creditLineActions,
      login,
      intlActions,
    } = this.props;

    const rejectingCreditLineLiteral = intlActions.getString(
      "REJECTING_CREDIT_LINE_LITERAL"
    );
    const rejectLiteral = intlActions.getString("REJECT_LITERAL");

    const isProcessing =
      rejectCreditLineStatus === RejectCreditLineState.REJECTING ||
      rejectCreditLineStatus === RejectCreditLineState.WAITING_TX_RESPONSE;

    const variant = "danger";

    return isProcessing ? (
      <ButtonLoading
        variant={variant}
        label={rejectingCreditLineLiteral + "..."}
      />
    ) : (
      <Button
        label={rejectLiteral}
        accessibilityLabel="Reject"
        variant={variant}
        onPress={() => {
          creditLineActions.rejectCreditLine({
            rejector: login.username,
            id: creditLineId,
          });
        }}
      />
    );
  }

  renderCancelButton() {
    const {
      creditLineId,
      cancelCreditLineStatus,
      creditLineActions,
      login,
      creditLine,
      intlActions,
    } = this.props;

    const cancelingCreditLineLiteral = intlActions.getString(
      "CANCELING_CREDIT_LINE_LITERAL"
    );
    const cancelLiteral = intlActions.getString("CANCEL_LITERAL");
    const dismissLiteral = intlActions.getString("DISMISS_LITERAL");
    const cancelCreditLineLiteral = intlActions.getString(
      "CANCEL_CREDIT_LINE_LITERAL"
    );
    const cancelCreditLineMessage = intlActions.getString(
      "CANCEL_CREDIT_LINE_MESSAGE"
    );
    const confirmLiteral = intlActions.getString("CONFIRM_LITERAL");

    const cannotCancelCreditLine = intlActions.getString(
      "CANNOT_CANCEL_CREDIT_LINE_IOUS"
    );

    const hasActiveIOUs = () => {
      const ious = creditLine.ious;
      for (var i in ious) {
        const iou = ious[i];

        if (iou.status === "RUNNING") return true;
      }

      return false;
    };

    const isProcessing =
      cancelCreditLineStatus === CancelCreditLineState.CANCELING ||
      cancelCreditLineStatus === CancelCreditLineState.WAITING_TX_RESPONSE;

    const variantEnabled = "danger";
    const variant = "danger";
    const variantDisabled = "disabled";
    const activeIOUs = hasActiveIOUs();

    return isProcessing ? (
      <ButtonLoading variant={variant} label={cancelingCreditLineLiteral} />
    ) : (
      <Button
        label={cancelLiteral}
        accessibilityLabel="Cancel"
        variant={activeIOUs ? variantDisabled : variantEnabled}
        onPress={() => {
          activeIOUs
            ? Alerts.showNotificationAlert({
                title: cancelCreditLineLiteral,
                message: cannotCancelCreditLine,
                cancelText: dismissLiteral,
                cancelAction: () => {},
              })
            : Alerts.showChoiceAlert({
                title: cancelCreditLineLiteral,
                message: cancelCreditLineMessage,
                confirmText: confirmLiteral,
                cancelText: dismissLiteral,
                confirmAction: () => {
                  creditLineActions.cancelCreditLine({
                    canceller: login.username,
                    id: creditLineId,
                  });
                },
                cancelAction: () => {},
              });
        }}
      />
    );
  }

  renderFreezeButton() {
    const {
      creditLineId,
      freezeCreditLineStatus,
      creditLineActions,
      login,
      intlActions,
    } = this.props;

    const freezingCreditLineLiteral = intlActions.getString(
      "FREEZING_CREDIT_LINE_LITERAL"
    );
    const freezeLiteral = intlActions.getString("FREEZE_LITERAL");

    const isProcessing =
      freezeCreditLineStatus === FreezeCreditLineState.FREEZING ||
      freezeCreditLineStatus === FreezeCreditLineState.WAITING_TX_RESPONSE;

    const variant = "normal";

    return isProcessing ? (
      <ButtonLoading variant={variant} label={freezingCreditLineLiteral} />
    ) : (
      <Button
        label={freezeLiteral}
        accessibilityLabel="Freeze"
        variant={variant}
        onPress={() => {
          creditLineActions.freezeCreditLine({
            freezer: login.username,
            id: creditLineId,
          });
        }}
      />
    );
  }

  renderUnfreezeButton() {
    const {
      creditLineId,
      unfreezeCreditLineStatus,
      creditLineActions,
      login,
      intlActions,
    } = this.props;

    const unfreezingCreditLineLiteral = intlActions.getString(
      "UNFREEZING_CREDIT_LINE_LITERAL"
    );
    const unfreezeLiteral = intlActions.getString("UNFREEZE_LITERAL");

    const isProcessing =
      unfreezeCreditLineStatus === UnfreezeCreditLineState.UNFREEZING ||
      unfreezeCreditLineStatus === UnfreezeCreditLineState.WAITING_TX_RESPONSE;

    const variant = "normal-reverse";

    return isProcessing ? (
      <ButtonLoading variant={variant} label={unfreezingCreditLineLiteral} />
    ) : (
      <Button
        label={unfreezeLiteral}
        accessibilityLabel="Unfreeze"
        variant={variant}
        onPress={() => {
          creditLineActions.unfreezeCreditLine({
            unfreezer: login.username,
            id: creditLineId,
          });
        }}
      />
    );
  }

  renderGrantPermitButton() {
    const { navigation, creditLine, intlActions } = this.props;

    const grantPermitLiteral = intlActions.getString("GRANT_PERMIT_LITERAL");

    const variant = "normal-reverse";

    return (
      <Button
        label={grantPermitLiteral}
        accessibilityLabel="GrantPermit"
        variant={variant}
        onPress={() => {
          navigation.navigate("GrantConversionPermit", {
            creditLine: creditLine,
          });
        }}
      />
    );
  }

  renderSetUpConversionProfileButton() {
    const {
      navigation,
      creditLine,
      creditLineActions,
      intlActions,
    } = this.props;

    const setUpConversionProfileLiteral = intlActions.getString(
      "GRANT_PERMIT_LITERAL"
    );

    const variant = "normal-reverse";

    return (
      <Button
        label={setUpConversionProfileLiteral}
        accessibilityLabel="SetUpConversionProfile"
        variant={variant}
        onPress={() => {
          // creditLineActions.setCreditLineId(creditLine.id);
          navigation.navigate("SetUpConversionProfile", {
            creditLine: creditLine,
          });
        }}
      />
    );
  }

  renderCreditLineData() {
    const { creditLine, intlActions, navigation } = this.props;

    const conversionEnabled = creditLine.conversion_enabled;
    const futureSettlements = creditLine.ious;
    const interest = parseFloat(creditLine.interest);
    const oneTimeFee = parseFloat(creditLine.one_time_fee);
    const totalAmount = creditLine.amount_formatted;
    const usedAmount = creditLine.total_used_formatted;
    const availableAmount = creditLine.available_formatted;
    const target = creditLine.target;

    var grantedPermits,
      globalMax,
      singleMax,
      usedConversion,
      availableConversion;

    if (!creditLine.crediting_line && conversionEnabled) {
      grantedPermits = creditLine.permits.length;
      globalMax = creditLine.global_max_formatted;
      singleMax = creditLine.single_max_formatted;
      usedConversion = creditLine.used_conversion_formatted;
      availableConversion = creditLine.available_conversion_credit_formatted;
    }

    const totalLiteral = intlActions.getString("TOTAL_LITERAL");
    const usedLiteral = intlActions.getString("USED_LITERAL");
    const availableLiteral = intlActions.getString("AVAILABLE_LITERAL");
    const daysLiteral = intlActions.getString("DAYS_LITERAL");
    const interestLiteral = intlActions.getString("INTEREST_LITERAL");
    const oneTimeFeeLiteral = intlActions.getString("ONE_TIME_FEE_LITERAL");
    //
    const noConversionLiteral = intlActions.getString("NO_CONVERSION_LABEL");

    const conversionLiteral = intlActions.getString("CONVERSION_LITERAL");
    const globalMaxLiteral = intlActions.getString("GLOBAL_MAX_LITERAL");
    const singleMaxLiteral = intlActions.getString(
      "DEFAULT_SINGLE_MAX_LITERAL"
    );
    const settlementsLiteral = intlActions.getString("SETTLEMENTS_LITERAL");
    const permitsLiteral = intlActions.getString("CONVERSION_PERMITS_LITERAL");

    const labelSelector = (
      <View style={styles.touchableContainer}>
        <TouchableWithoutFeedback
          activeOpacity={1}
          onPress={() => {
            this.setState({ show: "ious" });
          }}
        >
          <Text
            style={
              this.state.show === "ious"
                ? styles.selectedLabel
                : styles.touchableLabel
            }
          >
            {settlementsLiteral}
          </Text>
        </TouchableWithoutFeedback>
        {!creditLine.crediting_line && creditLine.conversion_enabled ? (
          <TouchableWithoutFeedback
            activeOpacity={1}
            onPress={() => {
              this.setState({ show: "permits" });
            }}
          >
            <Text
              style={
                this.state.show === "permits"
                  ? styles.selectedLabel
                  : styles.touchableLabel
              }
            >
              {permitsLiteral}
            </Text>
          </TouchableWithoutFeedback>
        ) : null}
      </View>
    );

    return (
      <View>
        <View style={styles.container}>
          <View style={styles.regularComponents}>
            <View style={styles.row}>
              <Text style={[styles.leftComponent, styles.heading1]}>
                {totalAmount}{" "}
              </Text>
              <Text style={[styles.rightComponent, styles.heading1]}>
                {target} {daysLiteral}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={[styles.leftComponent, styles.heading2]}>
                {usedLiteral} {usedAmount}{" "}
              </Text>
              <Text style={[styles.rightComponent, styles.heading2]}>
                {interestLiteral} {interest}% p.a.{" "}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={[styles.leftComponent, styles.heading2]}>
                {availableLiteral} {availableAmount}{" "}
              </Text>
              <Text style={[styles.rightComponent, styles.heading2]}>
                {oneTimeFeeLiteral} {oneTimeFee}%{" "}
              </Text>
            </View>
          </View>

          {!creditLine.crediting_line ? (
            <View style={styles.debtorComponents}>
              {conversionEnabled ? (
                <Text style={styles.conversionLabel}>{conversionLiteral}</Text>
              ) : (
                <Text style={styles.noConversion}>{noConversionLiteral}</Text>
              )}
              {conversionEnabled ? (
                <View>
                  <View style={styles.row}>
                    <Text>
                      {usedLiteral} {usedConversion}
                    </Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={[styles.leftComponent, styles.heading3]}>
                      {singleMaxLiteral} {singleMax}
                    </Text>
                    <Text style={[styles.rightComponent, styles.heading3]}>
                      {globalMaxLiteral} {globalMax}
                    </Text>
                  </View>
                </View>
              ) : null}
            </View>
          ) : null}
        </View>
        {labelSelector}
        {this.state.show === "permits" ? (
          <ConversionPermitsComponent
            creditLine={creditLine}
            permits={creditLine.permits}
            hideLabel={true}
          />
        ) : (
          <FutureSettlementsComponent
            futureSettlements={futureSettlements}
            hideLabel={true}
            navigation={navigation}
            showAll={true}
          />
        )}
      </View>
    );
  }

  renderCreditLineConditions() {
    const { creditLine, intlActions } = this.props;

    const amount = creditLine.amount_formatted;
    const { target } = creditLine;
    const interestFee = creditLine.interest;
    const oneTimeFee = creditLine.one_time_fee;

    const proposedConditionsLiteral = intlActions.getString(
      "PROPOSED_CONDITIONS_LITERAL"
    );
    const amountLiteral = intlActions.getString("AMOUNT_LITERAL");
    const targetLiteral = intlActions.getString("TIME_TARGET_LITERAL");
    const daysLiteral = intlActions.getString("DAYS_LITERAL").toLowerCase();
    const interestLiteral = intlActions.getString("INTEREST_LITERAL");
    const oneTimeFeeLiteral = intlActions.getString("ONE_TIME_FEE_LITERAL");

    return (
      <View>
        <Text
          style={{
            fontSize: 20,
            marginTop: 30,
            marginLeft: 5,
            alignSelf: "center",
            textAlign: "center",
          }}
        >
          {proposedConditionsLiteral}
        </Text>
        <Text style={{ fontSize: 18, marginLeft: 5 }}>
          {amountLiteral}: {amount}
        </Text>
        <Text style={{ fontSize: 18, marginLeft: 5 }}>
          {targetLiteral}: {target} {daysLiteral}
        </Text>
        <Text style={{ fontSize: 18, marginLeft: 5 }}>
          {interestLiteral}: {interestFee}% p.a.
        </Text>
        <Text style={{ fontSize: 18, marginLeft: 5 }}>
          {oneTimeFeeLiteral}: {oneTimeFee}%
        </Text>
      </View>
    );
  }

  /** Render creditline-status-dependent components */

  renderCreditingActiveCreditLine() {
    const creditLineData = this.renderCreditLineData();

    return (
      <View>
        {creditLineData}
        <View style={styles.buttonContainer}>
          {this.renderFreezeButton()}
          {this.state.hideCancelButton ? null : this.renderCancelButton()}
        </View>
      </View>
    );
  }

  renderDebtingActiveCreditLine() {
    const { creditLine, intlActions } = this.props;
    const creditLineData = this.renderCreditLineData();

    return (
      <View>
        {creditLineData}
        <View style={styles.buttonContainer}>
          {/* <View style={styles.buttonContainer}> */}
          {creditLine.conversion_enabled
            ? this.renderGrantPermitButton()
            : this.renderSetUpConversionProfileButton()}
          {this.state.hideCancelButton ? null : this.renderCancelButton()}
        </View>
        {/* </View> */}
      </View>
    );
  }

  renderQR() {
    const { creditLineId } = this.props;
    return generateQRComponent(qrTypes.creditLineId, creditLineId, {
      size: QR_SIZE,
    });
  }

  renderCreditingPendingCreditLine() {
    const creditLineConditions = this.renderCreditLineConditions();

    return (
      <View>
        {creditLineConditions}
        <View style={styles.qrContainer}>
          <Text style={{ alignSelf: "center" }}>
            Show QR to user to find credit line easier.
          </Text>
          <View style={{ marginTop: "5%", marginBottom: "10%" }}>
            {this.renderQR()}
          </View>
        </View>
        {this.renderCancelButton()}
        {/* </View> */}
      </View>
    );
  }

  renderDebtingPendingCreditLine() {
    const creditLineConditions = this.renderCreditLineConditions();

    return (
      <View>
        {creditLineConditions}
        <View style={styles.buttonContainer}>
          {this.renderAcceptButton()}
          {this.renderRejectButton()}
        </View>
      </View>
    );
  }

  renderCreditingFrozenCreditLine() {
    const creditLineData = this.renderCreditLineData();
    return (
      <View>
        {creditLineData}
        <View style={styles.buttonContainer}>
          {this.renderUnfreezeButton()}
          {this.renderCancelButton()}
        </View>
      </View>
    );
  }

  renderDebtingFrozenCreditLine() {
    const creditLineData = this.renderCreditLineData();

    return <View>{creditLineData}</View>;
  }

  renderCanceledCreditLine() {
    return <View />;
  }

  renderCreditLineStatusDependentContent() {
    const { creditLine, intlActions } = this.props;

    const creditLineStatus = creditLine.status;
    const isCrediting = creditLine.crediting_line;

    switch (creditLineStatus) {
      case "ACTIVE":
        return isCrediting
          ? this.renderCreditingActiveCreditLine()
          : this.renderDebtingActiveCreditLine();
      case "PENDING":
        return isCrediting
          ? this.renderCreditingPendingCreditLine()
          : this.renderDebtingPendingCreditLine();
      case "FROZEN":
        return isCrediting
          ? this.renderCreditingFrozenCreditLine()
          : this.renderDebtingFrozenCreditLine();
      case "CANCELLED":
        return this.renderCanceledCreditLine();
    }
  }

  renderContent() {
    const {
      creditLineErrorMessage,
      creditLine,
      isCreditLineLoading,
      isCreditLineRefreshing,
      isCreditLineLoadedSuccess,
      intlActions,
    } = this.props;

    if (isCreditLineLoadedSuccess) {
      const creditLineLiteral = intlActions.getString("CREDIT_LINE_LITERAL");
      // const w =
      const word = intlActions.getString(
        (creditLine.crediting_line ? "TO" : "FROM") + "_LITERAL"
      );
      const grantedLiteral = intlActions
        .getString("GRANTED_LITERAL")
        .toLowerCase();

      /** Title component */
      const titleComponent = (
        <View>
          <Text style={styles.title}>
            {creditLineLiteral} {grantedLiteral} {word} {creditLine.other_user}
          </Text>
          <Text
            style={{
              color: Theme.colors.darkgrey,
              alignSelf: "flex-end",
              paddingRight: 5,
            }}
          >
            {intlActions.getString(creditLine.status)}
          </Text>
          {}
        </View>
      );

      return (
        <View>
          {titleComponent}
          {this.renderCreditLineStatusDependentContent()}
        </View>
      );
    }
  }

  render() {
    const { isCreditLineRefreshing, isCreditLineLoading } = this.props;

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          style={styles.scrollView}
          refreshControl={
            <RefreshControl
              refreshing={isCreditLineRefreshing}
              onRefresh={() => this.refresh(this.props)}
            />
          }
        >
          <BackArrow />
          <View>
            {isCreditLineLoading ? <LoadingIndicator /> : this.renderContent()}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => ({
  login: state.login,
  //
  creditLineId: creditline.getInspectCreditLineId(state),
  // //
  creditLineErrorMessage: creditline.singleCreditLineErrorMessage(state),
  isCreditLineLoading: creditline.isSingleCreditLineLoading(state),
  isCreditLineLoadedSuccess: creditline.isSingleCreditLineLoadedSuccess(state),
  isCreditLineRefreshing: creditline.isSingleCreditLineRefreshing(state),
  creditLine: creditline.getCreditLine(state),
  // //
  acceptCreditLineStatus: creditline.getAcceptCreditLineStatus(state),
  rejectCreditLineStatus: creditline.getRejectCreditLineStatus(state),
  cancelCreditLineStatus: creditline.getCancelCreditLineStatus(state),
  freezeCreditLineStatus: creditline.getFreezeCreditLineStatus(state),
  unfreezeCreditLineStatus: creditline.getUnfreezeCreditLineStatus(state),
});

const mapDispatchToProps = (dispatch) => ({
  creditLineActions: bindActionCreators(creditline.actions, dispatch),
  intlActions: bindActionCreators(intl.actions, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InspectCreditLineScreen);
