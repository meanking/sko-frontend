import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { formatAmount, formatTxDate } from '../lib/format';
import { TransactionType } from '../lib/types';
import Theme from '../assets/Theme';

const styles = StyleSheet.create({
  border: {
    borderBottomColor: Theme.colors.lightgrey,
    borderBottomWidth: 1,
  },
  row: {
    marginTop: 15,
    marginBottom: 9,
    marginLeft: 16,
    marginRight: 16,
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  data: {
    ...Theme.fonts.regular,
    fontSize: 16,
    color: Theme.colors.black,
    marginLeft: 3,
    marginRight: 3,
  },
  createdAt: {
    width: 60,
  },
  user: {
    textAlign: 'left',
  },
  amount: {
    fontWeight: '600',
    textAlign: 'right',
    flex: 1,
    alignSelf: 'flex-end',
  },
  asRecipient: {
    color: Theme.colors.green,
  },
});

const TransactionView = ({ transaction }) => {
  const {
    date,
    amount,
    user,
  } = transaction;
  const recipientColor = transaction.amount > 0 ? styles.asRecipient : null;

  return (
    <View style={styles.border}>
      <View style={[styles.row]}>
        <Text style={[styles.data, styles.createdAt, recipientColor]}>
          {formatTxDate(date)}
        </Text>
        <Text style={[styles.data, styles.user, recipientColor]}>
          {user.name}
        </Text>
        <Text style={[styles.data, styles.amount, recipientColor]}>
          {formatAmount(amount)}
        </Text>
      </View>
    </View>
  );
};

TransactionView.propTypes = {
  transaction: TransactionType.isRequired,
};

export default TransactionView;
