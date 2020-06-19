import React, { Fragment } from "react";
import PropTypes from "prop-types";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Button,
} from "react-native";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import ConversionPermitView from "./ConversionPermitView";
import FailureView from "./FailureView";
import LoadingIndicator from "./LoadingIndicator";
import Assets from "../assets";
import Theme from "../assets/Theme";
import { formatAmount, formatDueDate } from "../lib/format";
import { ActionsType, PermitType } from "../lib/types";
import * as balance from "../redux/modules/balance";
import * as intl from "../redux/modules/internationalization";
import BalanceSlider from "./BalanceSlider";
import { ConversionPermit } from "../lib/types";

const styles = StyleSheet.create({
  positiveAmount: {
    color: Theme.colors.green,
  },
  negativeAmount: {
    color: Theme.colors.red,
  },
  list: {
    marginTop: 16,
    marginLeft: 16,
  },
  listTitle: {
    ...Theme.fonts.regular,
    fontSize: 16,
    color: Theme.colors.grey,
    marginBottom: 24,
  },
  listItems: {
    flexDirection: "column",
  },
  dueDate: {
    ...Theme.fonts.regular,
    fontSize: 12,
    color: Theme.colors.black,
    marginTop: 4,
  },
  dueAmount: {
    ...Theme.fonts.semiBold,
    fontSize: 16,
    color: Theme.colors.black,
  },
  noEntries: { color: Theme.colors.grey, fontSize: 18 },
  rightComponent: {
    textAlign: "right",
  },
  leftComponent: {
    textAlign: "left",
  },
});

class ConversionPermitsComponent extends React.Component {
  static propTypes = {
    permits: PropTypes.arrayOf(ConversionPermit).isRequired,
  };

  static defaultProps = {
    permits: null,
  };

  renderPermits() {
    const { creditLine, permits, intlActions, hideLabel } = this.props;

    const permitForLiteral = intlActions.getString("PERMIT_FOR_LITERAL");
    const conversionFeeLiteral = intlActions
      .getString("CONVERSION_FEE_LITERAL")
      .toLowerCase();

    const items = permits.map((permit) => {
      const {
        id,
        credit_line_id,
        grantee,
        max_amount_formatted,
        conversion_fee,
        used_conversion_credit_formatted,
      } = permit;

      console.log(permit);

      const currentlyUsed = used_conversion_credit_formatted;
      const available = max_amount_formatted;

      return (
        <ConversionPermitView
          key={id}
          permit={permit}
          creditLine={creditLine}
          //   onPressConnection={() => navigation.navigate("InspectIOU")} // TODO fix after screens implemented
        >
          <View>
            <Text>
              {permitForLiteral} {grantee}
            </Text>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
                width: null,
              }}
            >
              <Text style={[styles.dueAmount, styles.leftComponent]}>
                {currentlyUsed} / {available}
              </Text>
              <Text style={[styles.dueAmount, styles.rightComponent]}>
                {conversion_fee}% {conversionFeeLiteral}
              </Text>
            </View>
          </View>
        </ConversionPermitView>
      );
    });

    const permitsLabel =
      items.length > 0
        ? "CONVERSION_PERMITS_LITERAL"
        : "NO_CONVERSION_PERMITS_LITERAL";

    return (
      <View style={styles.list}>
        {hideLabel ? null : (
          <Text style={styles.listTitle}>
            {intlActions.getString(permitsLabel)}
          </Text>
        )}

        {items.length > 0 ? (
          <View style={styles.listItems}>{items}</View>
        ) : hideLabel ? (
          <View>
            <Text style={styles.noEntries}>
              {intlActions.getString("NO_CONVERSION_PERMITS_LITERAL")}
            </Text>
          </View>
        ) : null}
      </View>
    );
  }

  render() {
    return this.renderPermits();
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(balance.actions, dispatch),
  intlActions: bindActionCreators(intl.actions, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConversionPermitsComponent);
