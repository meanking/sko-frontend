import React from "react";
import PropTypes from "prop-types";
import { StyleSheet, SectionList, Text } from "react-native";

import groupBy from "lodash/groupBy";
import sortBy from "lodash/sortBy";
import map from "lodash/map";
import deburr from "lodash/deburr";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import CreditLineView from "./CreditLineView";
import Theme from "../assets/Theme";

import * as intl from "../redux/modules/internationalization";

const styles = StyleSheet.create({
  sectionTitle: {
    color: Theme.colors.darkgrey,
    fontSize: 16,
    paddingTop: 16,
    paddingBottom: 16
  }
});

const sortCreditLines = creditLines =>
  creditLines.sort((cl1, cl2) =>
    cl1.other_user
      .toLocaleLowerCase()
      .localeCompare(cl2.other_user.toLocaleLowerCase(), "en", {
        sensitivity: "case"
      })
  );

const groupCreditLines = (creditLines, intlActions) => {
  const getWord = (crediting_line, intlActions) => {
    const w = crediting_line ? "TO" : "FROM";
    const word = intlActions.getString("CREDIT_LINE_" + w + "_MESSAGE");
    return word;
  };

  const a = groupBy(creditLines, ({ crediting_line, other_user }) =>
    crediting_line
      ? other_user + " " + getWord(crediting_line, intlActions)
      : getWord(crediting_line, intlActions) + " " + other_user
  );

  return a;
};

const creditLinesByInitial = (creditLines, intlActions) => {
  const a = sortBy(
    map(
      groupCreditLines(sortCreditLines(creditLines), intlActions),
      (data, title) => ({
        title,
        data
      })
    ),
    "title"
  );

  return a;
};

const CreditLinesList = props => {
  const {
    creditLines,
    groupByInitial,
    onPressCreditLine,
    style,
    refreshing,
    onRefresh,
    intlActions
  } = props;

  // eslint-disable-next-line react/prop-types
  const renderSectionHeader = ({ section: { title } }) => (
    <Text style={styles.sectionTitle}>{title}</Text>
  );

  // eslint-disable-next-line react/prop-types
  const renderItem = ({ item: creditLine }) => (
    <CreditLineView
      creditLine={creditLine}
      onPressCreditLine={onPressCreditLine}
    />
  );

  const keyExtractor = ({ id }) => id;

  return groupByInitial ? (
    <SectionList
      style={style}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
      sections={creditLinesByInitial(creditLines, intlActions)}
      keyExtractor={keyExtractor}
      refreshing={refreshing}
      onRefresh={onRefresh}
    />
  ) : (
    <SectionList
      style={style}
      renderItem={renderItem}
      sections={[
        {
          title: "CreditLines",
          data: sortCreditLines(creditLines)
        }
      ]}
      keyExtractor={keyExtractor}
      refreshing={refreshing}
      onRefresh={onRefresh}
    />
  );
};

CreditLinesList.propTypes = {
  onPressCreditLine: PropTypes.func,
  // creditLines: PropTypes.arrayOf(DisplayUserType).isRequired,
  groupByInitial: PropTypes.bool,
  style: PropTypes.any,
  refreshing: PropTypes.bool,
  onRefresh: PropTypes.func
};

CreditLinesList.defaultProps = {
  onPressCreditLine: null,
  groupByInitial: false,
  style: null,
  refreshing: false,
  onRefresh: null
};

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  intlActions: bindActionCreators(intl.actions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreditLinesList);
