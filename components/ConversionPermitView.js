import React from "react";
import PropTypes from "prop-types";
import { Image, StyleSheet, Text, View } from "react-native";
import * as Progress from "react-native-progress";
import * as intl from "../redux/modules/internationalization";
import * as creditline from "../redux/modules/creditline";
import Button from "../components/Button";
import ButtonLoading from "../components/ButtonLoading";

import { ConversionPermit, CreditLineType } from "../lib/types";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import ArrowRow from "./ArrowRow";
import Theme from "../assets/Theme";
import Assets from "../assets";

const { RevokeConversionPermitState } = creditline;

const styles = StyleSheet.create({
  conversionPermitView: {
    flexDirection: "row",
    backgroundColor: Theme.colors.white,
    height: "auto"
  },
  border: {
    borderBottomColor: Theme.colors.lightgrey,
    borderBottomWidth: 1
  },
  conversionPermitName: {
    ...Theme.fonts.semiBold,
    fontSize: 16,
    color: Theme.colors.black,
    flex: 1
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginRight: 12
  },
  conversionPermitInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
    width: null
  },
  children: {
    flexDirection: "column",
    alignItems: "flex-end"
  },
  conversionLabel: {
    fontSize: 12,
    color: "rgb(24, 77, 237)"
  },
  noConversionLabel: {
    fontSize: 12,
    color: "rgb(247, 72, 2)"
  }
});

const renderRevokePermitButton = props => {
  const { permit, intlActions, status, creditLineActions, login } = props;

  const conversionPermitGrantedSuccess = intlActions.getString(
    "CONVERSION_PERMIT_GRANTED_SUCCESS"
  );
  const conversionPermitGrantedFailed = intlActions.getString(
    "CONVERSION_PERMIT_GRANTED_FAILED"
  );

  const isProcessing =
    status === RevokeConversionPermitState.REVOKING ||
    status === RevokeConversionPermitState.WAITING_TX_RESPONSE;

  const variant = "warning";
  const revokingPermitLiteral = intlActions.getString(
    "REVOKING_PERMIT_LITERAL"
  );
  const revokeLiteral = intlActions.getString("REVOKE_LITERAL");

  return isProcessing ? (
    <ButtonLoading variant={variant} label={revokingPermitLiteral + "..."} />
  ) : (
    <Button
      label={revokeLiteral}
      accessibilityLabel="Revoke"
      variant={variant}
      onPress={() => {
        creditLineActions.revokeConversionPermit({
          granter: login.username,
          permitId: permit.id
        });
      }}
    />
  );
};

const renderContent = props => {
  const { creditLine, permit, children } = props;

  return (
    <View style={styles.conversionPermitView}>
      <ArrowRow
        style={styles.border}
        // onPress={() => {
        //   creditLineActions.inspectCreditLine(creditLine.id),
        //     onPressCreditLine(creditLine);
        // }}
      >
        <View style={styles.leftComponent}>{children}</View>
        {renderRevokePermitButton(props)}
      </ArrowRow>
    </View>
  );
};

const ConversionPermitView = props => {
  return renderContent(props);
};

ConversionPermitView.propTypes = {
  permit: ConversionPermit.isRequired,
  creditLine: CreditLineType.isRequired,
  intlActions: PropTypes.object,
  status: PropTypes.object,
  login: PropTypes.object
};

ConversionPermitView.defaultProps = {
  children: null,
  style: null
};

const mapStateToProps = state => ({
  status: creditline.getRevokeConversionPermitStatus(state),
  login: state.login
});

const mapDispatchToProps = dispatch => ({
  creditLineActions: bindActionCreators(creditline.actions, dispatch),
  intlActions: bindActionCreators(intl.actions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConversionPermitView);
