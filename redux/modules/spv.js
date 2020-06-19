// ///////////////////////////////////////
// Connection module

import every from "lodash/every";
import some from "lodash/some";
import isNumber from "lodash/isNumber";
import isString from "lodash/isString";
import isEmpty from "lodash/isEmpty";
import api from "../../api";
import { STORE_INIT } from "./common";

// request sks tokens
export const RequestSKSTokenState = {
  REQUESTING: 0,
  WAITING_TX_RESPONSE: 1,
  REQUEST_SUCCESS: 2,
  REQUEST_FAILED: 3
};

export const TxStatus = {
  FAILED: 0,
  SUCCESS: 1
};

// ///////////////////////////////////////
// Actions
const REQUEST_TOKENS_BEGIN = "sikoba/connection/REQUEST_TOKENS_BEGIN";
const REQUEST_TOKENS_WAITING_TX_RESPONSE =
  "sikoba/connection/REQUEST_TOKENS_WAITING_TX_RESPONSE";
const REQUEST_TOKENS_SUCCESS = "sikoba/connection/REQUEST_TOKENS_SUCCESS";
const REQUEST_TOKENS_FAILURE = "sikoba/connection/REQUEST_TOKENS_FAILURE";
const REQUEST_TOKENS_RESET = "sikoba/connection/REQUEST_TOKENS_RESET";
const REQUEST_TOKENS_RESET_STATUS =
  "sikoba/connection/REQUEST_TOKENS_RESET_STATUS";

// ///////////////////////////////////////
// Reducer

const initialState = {
  requestSKSTokens: { status: null, tx: null, errorMessage: null }
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case REQUEST_TOKENS_BEGIN:
      return {
        ...state,
        requestSKSTokens: {
          ...state.requestSKSTokens,
          status: RequestSKSTokenState.REQUESTING
        }
      };
    case REQUEST_TOKENS_WAITING_TX_RESPONSE:
      return {
        ...state,
        requestSKSTokens: {
          ...state.requestSKSTokens,
          status: RequestSKSTokenState.WAITING_TX_RESPONSE,
          tx: {
            ...state.requestSKSTokens.tx,
            id: action.payload.txId,
            remainingAttempts: action.payload.remainingAttempts
          }
        }
      };
    case REQUEST_TOKENS_SUCCESS:
      return {
        ...state,
        requestSKSTokens: {
          ...state.requestSKSTokens,
          status: RequestSKSTokenState.REQUEST_SUCCESS,
          tx: { ...state.requestSKSTokens.tx, status: TxStatus.SUCCESS }
        }
      };
    case REQUEST_TOKENS_FAILURE:
      return {
        ...state,
        requestSKSTokens: {
          ...state.requestSKSTokens,
          status: RequestSKSTokenState.REQUEST_FAILED,
          tx: { ...state.requestSKSTokens.tx, status: TxStatus.FAILED }
        }
      };
    case REQUEST_TOKENS_RESET_STATUS:
      return {
        ...state,
        requestSKSTokens: { ...state.requestSKSTokens, status: null, tx: null }
      };
    case REQUEST_TOKENS_RESET:
      return initialState;

    case STORE_INIT:
      return initialState;
    default:
      return state;
  }
}

// ///////////////////////////////////////
// Action Creators

// send sks request
export const requestSKSTokensBegin = () => ({
  type: REQUEST_TOKENS_BEGIN
});

export const requestSKSTokensWaitingTXResponse = (txId, remainingAttempts) => ({
  type: REQUEST_TOKENS_WAITING_TX_RESPONSE,
  payload: { txId, remainingAttempts }
});

export const requestSKSTokensSuccess = () => ({
  type: REQUEST_TOKENS_SUCCESS
});

export const requestSKSTokensFailure = error => ({
  type: REQUEST_TOKENS_FAILURE,
  payload: { error }
});

// ///////////////////////////////////////
// Selectors

export const requestSKSTokensStatus = state =>
  state.spv.requestSKSTokens.status;

// ///////////////////////////////////////
// pseudo-Action Creators

const getRequestSKSTokensTxStatus = (
  txId,
  remainingAttempts = 4
) => async dispatch => {
  const response = await api.get(`/transactions/${txId}`);

  if (!response.ok && remainingAttempts > 0) {
    dispatch(requestSKSTokensWaitingTXResponse(txId, remainingAttempts - 1));
    setTimeout(() => {
      dispatch(getRequestSKSTokensTxStatus(txId, remainingAttempts - 1));
    }, 5000);
    return;
  }

  if (!response.ok) {
    dispatch(requestSKSTokensFailure(response.error));
    return;
  }

  const json = await response.json();
  dispatch(requestSKSTokensSuccess(json.status));
};

const requestSKSTokens = () => async dispatch => {
  dispatch(requestSKSTokensBegin());

  const response = await api.post("/request_sks");

  if (!response.ok) {
    dispatch(requestSKSTokensFailure(response.error));
    return;
  }

  console.log();
  const json = await response.json();
  dispatch(requestSKSTokensSuccess(json));
};

export const actions = {
  requestSKSTokens
};
