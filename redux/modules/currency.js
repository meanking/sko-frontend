// ///////////////////////////////////////
// Currency module
import api from "../../api";

import { STORE_INIT } from "./common";

// currency loading
export const CurrencyState = {
  LOADING_CURRENCIES: "Loading currencies",
  LOADING_CURRENCIES_SUCCESS: "Loading currencies success",
  LOADING_CURRENCIES_FAILED: "Loading currencies failed",
  REFRESHING_CURRENCIES: "Refreshing currencies",
  UPDATING_CURRENCIES: "Updating currencies",
};

// ///////////////////////////////////////
// Actions

// currency loading
const LOAD_BEGIN = "sikoba/currency/LOAD_BEGIN";
const LOAD_SUCCESS = "sikoba/currency/LOAD_SUCCESS";
const LOAD_FAILURE = "sikoba/currency/LOAD_FAILURE";
const REFRESH_BEGIN = "sikoba/currency/REFRESH_BEGIN";
const UPDATE_CURRENCIES = "sikoba/currency/UPDATE_CURRENCIES";

// ///////////////////////////////////////
// Reducer

const initialState = {
  status: null,
  currencies: null,
  errorMessage: null,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    // load currencies
    case LOAD_BEGIN:
      return {
        ...state,
        status: CurrencyState.LOADING_CURRENCIES,
      };
    case LOAD_SUCCESS:
      return {
        ...state,
        status: CurrencyState.LOADING_CURRENCIES_SUCCESS,
        currencies: action.payload.currencies,
      };
    case LOAD_FAILURE:
      return {
        ...state,
        status: CurrencyState.LOADING_CURRENCIES_FAILED,
        errorMessage: action.payload.error,
      };
    case REFRESH_BEGIN:
      return {
        ...state,
        status: CurrencyState.REFRESHING_CURRENCIES,
      };
    case UPDATE_CURRENCIES:
      return {
        ...state,
        status: CurrencyState.UPDATING_CURRENCIES,
      };
    case STORE_INIT:
      return initialState;
    default:
      return state;
  }
}

// ///////////////////////////////////////
// Action Creators

// load currencies

const loadBegin = () => ({
  type: LOAD_BEGIN,
});

const loadSuccess = (currencies) => ({
  type: LOAD_SUCCESS,
  payload: currencies,
});

const loadFailure = (error) => ({
  type: LOAD_FAILURE,
  payload: { error },
});

const refreshBegin = () => ({
  type: REFRESH_BEGIN,
});

const updateBegin = () => ({
  type: UPDATE_CURRENCIES,
});

//////////////////////////////////////////
// Selectors
export const isLoading = (state) =>
  state.currency.status === CurrencyState.LOADING_CURRENCIES;

export const isLoadedSuccess = (state) =>
  typeof state.currency.currencies === "object" &&
  state.currency.currencies !== null;

export const getCurrencies = (state) => state.currency.currencies;

export const isRefreshing = (state) =>
  state.currency.status === CurrencyState.REFRESHING_CURRENCIES;

const isUpdating = (state) =>
  state.currency.status === CurrencyState.UPDATING_CURRENCIES;

export const errorMessage = (state) => {
  return state.currency.errorMessage;
};

// ///////////////////////////////////////
// pseudo-Action Creators

// load currencies
const queryCurrencies = () => async (dispatch, getState) => {
  try {
    const response = await api.get("/currencies");

    if (!response.ok) {
      throw new Error(response.statusText || "Error loading currencies.");
    }

    const json = await response.json();
    dispatch(loadSuccess(json));
  } catch (e) {
    if (!isUpdating(getState())) {
      dispatch(loadFailure(e.message || "Network error"));
    }
  }
};

const loadCurrencies = () => async (dispatch, getState) => {
  dispatch(loadBegin());
  const state = getState();
  if (!isUpdating(state) && !isRefreshing(state)) {
    dispatch(queryCurrencies());
  }
};

const updateCurrencies = () => async (dispatch, getState) => {
  const state = getState();
  if (!isRefreshing(state) && !isLoading(state)) {
    dispatch(queryCurrencies());
    dispatch(updateBegin());
  }
};

const refreshCurrencies = () => (dispatch, getState) => {
  const state = getState();
  if (!isUpdating(getState()) && !isLoading(state)) {
    dispatch(queryCurrencies());
  }
  dispatch(refreshBegin());
};

export const actions = {
  loadCurrencies,
  updateCurrencies,
  refreshCurrencies,
};
