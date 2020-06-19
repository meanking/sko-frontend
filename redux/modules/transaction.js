// ///////////////////////////////////////
// Transaction module

import api from '../../api';
import { STORE_INIT } from './common';

export const TransactionState = {
  LOADING_TRANSACTIONS: 'Loading transactions',
  LOADING_TRANSACTIONS_SUCCESS: 'Loading transactions success',
  LOADING_TRANSACTIONS_FAILED: 'Loading transactions failed',
  REFRESHING_TRANSACTIONS: 'Refreshing transactions',
  UPDATING_TRANSACTIONS: 'Updating transactions',
};

// ///////////////////////////////////////
// Actions

const LOAD_BEGIN = 'sikoba/transaction/LOAD_BEGIN';
const LOAD_SUCCESS = 'sikoba/transaction/LOAD_SUCCESS';
const LOAD_FAILURE = 'sikoba/transaction/LOAD_FAILURE';
const REFRESH_BEGIN = 'sikoba/transaction/REFFRESH_BEGIN';
const UPDATE_TRANSACTIONS = 'sikoba/transaction/UPDATE_TRANSACTIONS';

// ///////////////////////////////////////
// Reducer

const initialState = {
  status: null,
  transactions: null,
  errorMessage: null,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_BEGIN:
      return {
        ...state,
        status: TransactionState.LOADING_TRANSACTIONS,
      };
    case LOAD_SUCCESS:
      return {
        ...state,
        status: TransactionState.LOADING_TRANSACTIONS_SUCCESS,
        transactions: action.payload.transactions,
      };
    case LOAD_FAILURE:
      return {
        ...state,
        status: TransactionState.LOADING_TRANSACTIONS_FAILED,
        errorMessage: action.payload.error,
      };
    case REFRESH_BEGIN:
      return {
        ...state,
        status: TransactionState.REFRESHING_TRANSACTIONS,
      };
    case UPDATE_TRANSACTIONS:
      return {
        ...state,
        status: TransactionState.UPDATING_TRANSACTIONS,
      };
    case STORE_INIT:
      return initialState;
    default:
      return state;
  }
}

// ///////////////////////////////////////
// Action Creators

const loadBegin = () => ({
  type: LOAD_BEGIN,
});

const loadSuccess = transactions => ({
  type: LOAD_SUCCESS,
  payload: transactions,
});

const loadFailure = error => ({
  type: LOAD_FAILURE,
  payload: { error },
});

const refreshBegin = () => ({
  type: REFRESH_BEGIN,
});

const updateBegin = () => ({
  type: UPDATE_TRANSACTIONS,
});

// ///////////////////////////////////////
// Selectors

export const isLoading = state => (
  state.transaction.status === TransactionState.LOADING_TRANSACTIONS
);
export const isLoadedSuccess = state => (
  Array.isArray(state.transaction.transactions)
);
export const getTransactions = state => state.transaction.transactions;
export const isRefreshing = state => (
  state.transaction.status === TransactionState.REFRESHING_BALANCE
);
const isUpdating = state => (
  state.transaction.status === TransactionState.UPDATING_BALANCE
);
export const errorMessage = state => (
  state.transaction.errorMessage
);

// ///////////////////////////////////////
// pseudo-Action Creators

const queryTransactions = () => async (dispatch, getState) => {
  try {
    const response = await api.get('/ious/cleared/list');

    if (!response.ok) {
      throw new Error(response.statusText || 'Error loading transactions');
    }

    const json = await response.json();
    dispatch(loadSuccess(json));
  } catch (e) {
    if (!isUpdating(getState())) {
      dispatch(loadFailure(e.message || 'Network error'));
    }
  }
};

const loadTransactions = () => async (dispatch, getState) => {
  dispatch(loadBegin());
  const state = getState();
  if (!isUpdating(state) && !isRefreshing(state)) {
    dispatch(queryTransactions());
  }
};

const updateTransactions = () => async (dispatch, getState) => {
  const state = getState();
  if (!isRefreshing(state) && !isLoading(state)) {
    dispatch(queryTransactions());
    dispatch(updateBegin());
  }
};

const refreshTransactions = () => (dispatch, getState) => {
  const state = getState();
  if (!isUpdating(getState()) && !isLoading(state)) {
    dispatch(queryTransactions());
  }
  dispatch(refreshBegin());
};

export const actions = {
  loadTransactions,
  updateTransactions,
  refreshTransactions,
};
