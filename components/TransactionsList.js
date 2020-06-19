import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  SectionList,
  Text,
} from 'react-native';

import groupBy from 'lodash/groupBy';
import map from 'lodash/map';
import { formatMonth } from '../lib/format';

import { TransactionType } from '../lib/types';
import TransactionView from './TransactionView';
import Theme from '../assets/Theme';

const styles = StyleSheet.create({
  sectionTitle: {
    ...Theme.fonts.regular,
    color: Theme.colors.darkgrey,
    fontSize: 16,
    paddingTop: 16,
    marginLeft: 16,
    paddingBottom: 8,
  },
});

// eslint-disable-next-line react/prop-types
const renderSectionHeader = ({ section: { title } }) => (
  <Text style={styles.sectionTitle}>{title}</Text>
);

// eslint-disable-next-line react/prop-types
const renderItem = ({ item: transaction }) => (
  <TransactionView
    transaction={transaction}
  />
);

const TransactionsList = (props) => {
  const {
    transactions,
    style,
    refreshing,
    onRefresh,
  } = props;

  const keyExtractor = ({ id }) => id;

  const transactionsByDate = map(
    groupBy(transactions, transaction => formatMonth(transaction.createdAt)),
    (data, title) => ({ title, data }),
  );

  return (
    <SectionList
      style={style}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
      sections={transactionsByDate}
      keyExtractor={keyExtractor}
      refreshing={refreshing}
      onRefresh={onRefresh}
    />
  );
};

TransactionsList.propTypes = {
  transactions: PropTypes.arrayOf(TransactionType).isRequired,
  style: PropTypes.any,
  refreshing: PropTypes.bool,
  onRefresh: PropTypes.func,
};

TransactionsList.defaultProps = {
  style: null,
  refreshing: false,
  onRefresh: null,
};

export default TransactionsList;
