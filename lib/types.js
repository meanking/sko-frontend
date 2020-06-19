import PropTypes from "prop-types";

export const DisplayUserType = PropTypes.shape({
  name: PropTypes.string.isRequired,
  handle: PropTypes.string.isRequired,
});

export const SettlementType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  user: DisplayUserType.isRequired,
  amount: PropTypes.number.isRequired,
  due_date: PropTypes.string.isRequired,
});

export const TransactionType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  date: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
  user: DisplayUserType.isRequired,
});

export const BalanceType = PropTypes.shape({
  currency_iso: PropTypes.string.isRequired,
  formatted: PropTypes.string.isRequired,
});

export const CurrencyType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  iso_code: PropTypes.string.isRequired,
  full_name: PropTypes.string.isRequired,
  symbol: PropTypes.string.isRequired,
});

export const CreditLineType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  creditor: PropTypes.string,
  debtor: PropTypes.string,
  ious: PropTypes.array.isRequired,
  other_user: PropTypes.string.isRequired,
});

export const ConversionPermit = PropTypes.shape({
  id: PropTypes.number.isRequired,
  creditLine: CreditLineType,
  grantee: PropTypes.string.isRequired,
  amountFormatted: PropTypes.string.isRequired,
  conversionFee: PropTypes.string.isRequired,
  usedCredit: PropTypes.string.isRequired,
});

export const ContextType = PropTypes.shape({
  displayName: PropTypes.string.isRequired,
  idName: PropTypes.string.isRequired,
});

export const ActionsType = PropTypes.objectOf(PropTypes.func);
