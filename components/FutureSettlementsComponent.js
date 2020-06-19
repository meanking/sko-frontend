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

import ConnectionView from "./ConnectionView";
import Theme from "../assets/Theme";

import { SettlementType } from "../lib/types";

import * as balance from "../redux/modules/balance";
import * as intl from "../redux/modules/internationalization";
import * as iouModule from "../redux/modules/iou";

import { formatDueDate } from "../lib/format";

const styles = StyleSheet.create({
  positiveAmount: {
    color: Theme.colors.green,
  },
  negativeAmount: {
    color: Theme.colors.red,
  },
  list: {
    marginTop: 12,
    marginLeft: 16,
  },
  listTitle: {
    ...Theme.fonts.regular,
    fontSize: 16,
    color: Theme.colors.grey,
    marginBottom: 8,
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
});

class FutureSettlementsComponent extends React.Component {
  static propTypes = {
    futureSettlements: PropTypes.arrayOf(SettlementType).isRequired,
  };

  static defaultProps = {
    futureSettlements: null,
  };

  renderSettlements() {
    const {
      futureSettlements,
      intlActions,
      hideLabel,
      navigation,
      iouActions,
      showAll,
    } = this.props;

    const sortedSettlements = futureSettlements.sort(function(a, b) {
      var keyA = new Date(a.due_date);
      var keyB = new Date(b.due_date);

      if (keyA < keyB) return -1;
      if (keyA > keyB) return 1;
      return 0;
    });

    const items = sortedSettlements.map((settlement) => {
      const {
        id,
        other_user,
        status,
        due_date: dueDate,
        direction,
      } = settlement;
      const amount_formatted = settlement.amount_formatted;
      const extraStyle = direction
        ? styles.positiveAmount
        : styles.negativeAmount;

      return (
        <ConnectionView
          key={id}
          connection={{ username: other_user, status: status }}
          onPressConnection={() => {
            iouActions.inspectIOU(id);
            iouActions.loadSingleIOU();
            navigation.navigate("InspectIOU");
          }}
        >
          <Text style={[styles.dueAmount, extraStyle]}>{amount_formatted}</Text>
          <Text style={[styles.dueDate, extraStyle]}>
            {formatDueDate(dueDate, intlActions.getString)}
          </Text>
        </ConnectionView>
      );
    });

    const settlementLabel = showAll
      ? items.length > 0
        ? "SETTLEMENTS_LITERAL"
        : "NO_SETTLEMENTS_LITERAL"
      : items.length > 0
      ? "NEXT_SETTLEMENTS_LITERAL"
      : "NO_SETTLEMENTS_LITERAL";

    return (
      <View style={styles.list}>
        {hideLabel ? null : (
          <Text style={styles.listTitle}>
            {intlActions.getString(settlementLabel)}
          </Text>
        )}
        {items.length > 0 ? (
          <View style={styles.listItems}>{items}</View>
        ) : hideLabel ? (
          <View>
            <Text style={styles.noEntries}>
              {intlActions.getString("NO_SETTLEMENTS_LITERAL")}
            </Text>
          </View>
        ) : null}
      </View>
    );
  }

  render() {
    return this.renderSettlements();
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(balance.actions, dispatch),
  iouActions: bindActionCreators(iouModule.actions, dispatch),
  intlActions: bindActionCreators(intl.actions, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FutureSettlementsComponent);
