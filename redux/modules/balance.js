// ///////////////////////////////////////
// Balance module
// Contains data to display in the Balance Screen
// Ie. net balance amounts and next settlements

import api from "../../api";
import { STORE_INIT } from "./common";

// total balance
export const BalanceState = {
  LOADING_BALANCE: "Loading user balance",
  LOADING_BALANCE_SUCCESS: "Loading user balance success",
  LOADING_BALANCE_FAILED: "Loading user balance failed",
  UPDATE_ACCOUNT: "Account balance updated",
  REFRESHING_BALANCE: "Refreshing balance",
  UPDATING_BALANCE: "Updating balance"
};

// single balance
export const SingleBalanceState = {
  LOADING_SINGLE_BALANCE: "Loading single user balance",
  LOADING_SINGLE_BALANCE_SUCCESS: "Loading single user balance success",
  LOADING_SINGLE_BALANCE_FAILED: "Loading single user balance failed",
  UPDATE_ACCOUNT: "Account balance updated",
  REFRESHING_SINGLE_BALANCE: "Refreshing single balance",
  UPDATING_SINGLE_BALANCE: "Updating single balance"
};

// ///////////////////////////////////////
// Actions

// total balance
const LOAD_BEGIN = "sikoba/balance/LOAD_BEGIN";
const LOAD_SUCCESS = "sikoba/balance/LOAD_SUCCESS";
const LOAD_FAILURE = "sikoba/balance/LOAD_FAILURE";
const REFRESH_BEGIN = "sikoba/balance/REFRESH_BEGIN";
const UPDATE_BALANCE = "sikoba/balance/UPDATE_BALANCE";

// single balance
const LOAD_SINGLE_BALANCE_BEGIN = "sikoba/balance/LOAD_SINGLE_BALANCE_BEGIN";
const LOAD_SINGLE_BALANCE_SUCCESS =
  "sikoba/balance/LOAD_SINGLE_BALANCE_SUCCESS";
const LOAD_SINGLE_BALANCE_FAILURE =
  "sikoba/balance/LOAD_SINGLE_BALANCE_FAILURE";
const REFRESH_SINGLE_BALANCE_BEGIN =
  "sikoba/balance/REFRESH_SINGLE_BALANCE_BEGIN";
const UPDATE_SINGLE_BALANCE = "sikoba/balance/UPDATE_SINGLE_BALANCE";

// ///////////////////////////////////////
// Reducer

const initialState = {
  status: null,
  balance: null,
  ious: null,
  errorMessage: null,
  singleBalance: { status: null, balance: null, errorMessage: null }
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_BEGIN:
      return {
        ...state,
        status: BalanceState.LOADING_BALANCE
      };
    case LOAD_SUCCESS: {
      const balance = action.payload;
      const futureSettlements = action.payload.future_settlements;
      const ious = action.payload.ious;

      return {
        ...state,
        status: BalanceState.LOADING_BALANCE_SUCCESS,
        balance,
        futureSettlements,
        ious,
        errorMessage: null
      };
    }
    case LOAD_FAILURE:
      return {
        ...state,
        status: BalanceState.LOADING_BALANCE_FAILED,
        errorMessage: action.payload.error
      };
    case REFRESH_BEGIN:
      return {
        ...state,
        status: BalanceState.REFRESHING_BALANCE
      };
    case UPDATE_BALANCE:
      return {
        ...state,
        status: BalanceState.UPDATING_BALANCE
      };
    case LOAD_SINGLE_BALANCE_BEGIN:
      return {
        ...state,
        singleBalance: { status: SingleBalanceState.LOADING_SINGLE_BALANCE }
      };
    case LOAD_SINGLE_BALANCE_SUCCESS:
      return {
        ...state,
        singleBalance: {
          status: SingleBalanceState.LOADING_SINGLE_BALANCE_SUCCESS,
          balance: action.payload,
          singleFutureSettlements: action.payload.future_settlements,
          errorMessage: null
        }
      };
    case LOAD_SINGLE_BALANCE_FAILURE:
      return {
        ...state,
        singleBalance: {
          status: SingleBalanceState.LOADING_SINGLE_BALANCE_FAILED,
          errorMessage: action.payload.error
        }
      };
    case REFRESH_SINGLE_BALANCE_BEGIN:
      return {
        ...state,
        singleBalance: {
          status: SingleBalanceState.REFRESHING_SINGLE_BALANCE
        }
      };
    case UPDATE_SINGLE_BALANCE:
      return {
        ...state,
        singleBalance: {
          status: SingleBalanceState.UPDATING_SINGLE_BALANCE
        }
      };

    case STORE_INIT:
      return initialState;
    default:
      return state;
  }
}

// ///////////////////////////////////////
// Selectors

// total balance
export const isLoading = state =>
  state.balance.status === BalanceState.LOADING_BALANCE;

export const isLoaded = state => state.balance.balance !== null;

export const getBalance = state =>
  isLoaded(state) ? state.balance.balance : null;

export const getFutureSettlements = state => state.balance.futureSettlements;

export const getIOUs = state => state.balance.ious;

export const getErrorMessage = state => state.balance.errorMessage;

export const isRefreshing = state =>
  state.balance.status === BalanceState.REFRESHING_BALANCE;

const isUpdating = state =>
  state.balance.status === BalanceState.UPDATING_BALANCE;

// single user balance
export const isSingleBalanceLoading = state =>
  state.balance.singleBalance.status ===
  SingleBalanceState.LOADING_SINGLE_BALANCE;

export const isSingleBalanceLoaded = state => {
  return (
    state.balance.singleBalance.status ===
    SingleBalanceState.LOADING_SINGLE_BALANCE_SUCCESS
  );
};

export const getSingleBalance = state => {
  return isSingleBalanceLoaded(state)
    ? state.balance.singleBalance.balance
    : null;
};

export const getSingleFutureSettlements = state =>
  state.balance.singleBalance.singleFutureSettlements;

export const getSingleBalanceErrorMessage = state =>
  state.balance.singleBalance.errorMessage;

export const isSingleBalanceRefreshing = state =>
  state.balance.singleBalance.status ===
  SingleBalanceState.REFRESHING_SINGLE_BALANCE;

export const isSingleBalanceUpdating = state =>
  state.balance.singleBalance.status ===
  SingleBalanceState.UPDATING_SINGLE_BALANCE;
// ///////////////////////////////////////
// Action Creators

// total balance
const loadBegin = () => ({
  type: LOAD_BEGIN
});
const loadSuccess = balanceData => ({
  type: LOAD_SUCCESS,
  payload: balanceData
});
const loadFailure = error => ({
  type: LOAD_FAILURE,
  payload: { error }
});
const refreshBegin = () => ({
  type: REFRESH_BEGIN
});
const updateBegin = () => ({
  type: UPDATE_BALANCE
});

// single user balance
const loadSingleBalanceBegin = () => ({
  type: LOAD_SINGLE_BALANCE_BEGIN
});
const loadSingleBalanceSuccess = singleBalanceData => {
  return { type: LOAD_SINGLE_BALANCE_SUCCESS, payload: singleBalanceData };
};
const loadSingleBalanceFailure = error => ({
  type: LOAD_SINGLE_BALANCE_FAILURE,
  payload: { error }
});
const refreshSingleBalanceBegin = () => ({
  type: REFRESH_SINGLE_BALANCE_BEGIN
});
const updateSingleBalanceBegin = () => ({
  type: UPDATE_SINGLE_BALANCE
});

// ///////////////////////////////////////
// pseudo-Action Creators

// total balance
const queryBalance = () => async (dispatch, getState) => {
  try {
    const response = await api.get("/balance");

    if (!response.ok) {
      throw new Error(response.statusText || "Error loading balance");
    }

    const json = await response.json();
    dispatch(loadSuccess(json));
  } catch (e) {
    if (!isUpdating(getState())) {
      dispatch(loadFailure(e.message || "Network error"));
    }
  }
};

const loadBalance = () => async (dispatch, getState) => {
  dispatch(loadBegin());
  const state = getState();
  if (!isUpdating(state) && !isRefreshing(state)) {
    dispatch(queryBalance());
  }
};

const updateBalance = () => async (dispatch, getState) => {
  const state = getState();
  if (!isRefreshing(state) && !isLoading(state)) {
    dispatch(queryBalance());
    dispatch(updateBegin());
  }
};

const refreshBalance = () => (dispatch, getState) => {
  const state = getState();
  if (!isUpdating(state) && !isLoading(state)) {
    dispatch(queryBalance());
  }
  dispatch(refreshBegin());
};

// single user balance
const querySingleBalance = username => async (dispatch, getState) => {
  try {
    const response = await api.get(`/balances/${username}`);

    if (!response.ok) {
      throw new Error(response.statusText || "Error loading single balance");
    }

    const json = await response.json();
    dispatch(loadSingleBalanceSuccess(json));
  } catch (e) {
    if (!isSingleBalanceUpdating(getState())) {
      dispatch(loadSingleBalanceFailure(e.message || "Network error"));
    }
  }
};

const loadSingleBalance = username => async (dispatch, getState) => {
  dispatch(loadSingleBalanceBegin());
  const state = getState();
  if (!isSingleBalanceUpdating(state) && !isSingleBalanceRefreshing(state)) {
    dispatch(querySingleBalance(username));
  }
};

const updateSingleBalance = username => async (dispatch, getState) => {
  const state = getState();
  if (!isSingleBalanceRefreshing(state) && !isSingleBalanceLoading(state)) {
    dispatch(querySingleBalance(username));
    dispatch(updateSingleBalanceBegin());
  }
};

const refreshSingleBalance = username => (dispatch, getState) => {
  const state = getState();
  if (!isSingleBalanceUpdating(getState()) && !isSingleBalanceLoading(state)) {
    dispatch(querySingleBalance(username));
  }
  dispatch(refreshSingleBalanceBegin());
};

export const actions = {
  loadBalance,
  updateBalance,
  refreshBalance,
  loadSingleBalance,
  updateSingleBalance,
  refreshSingleBalance
};
