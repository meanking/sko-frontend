// ///////////////////////////////////////
// Login module

import api from "../../api";

export const SignupState = {
  SIGNING_UP: "Signing up user",
  WAITING_TX_RESPONSE: "Waiting Tx response",
  SIGNING_UP_SUCCESS: "Signing up user success",
  SIGNING_UP_FAILED: "Signing up user failed",
};

export const TxStatus = {
  FAILED: 0,
  SUCCESS: 1,
};

// ///////////////////////////////////////
// Actions

const SIGNUP_BEGIN = "sikoba/signup/SIGNUP_BEGIN";
const SIGNUP_WAITING_TX_RESPONSE = "sikoba/signup/SIGNUP_WAITING_TX_RESPONSE";
const SIGNUP_SUCCESS = "sikoba/signup/SIGNUP_SUCCESS";
const SIGNUP_FAILURE = "sikoba/signup/SIGNUP_FAILURE";

// ///////////////////////////////////////
// Reducer

const initialState = {
  username: null,
  error: null,
  status: null,
  tx: null,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SIGNUP_BEGIN:
      return {
        ...state,
        username: null,
        error: null,
        status: SignupState.SIGNING_UP,
        tx: null,
      };
    case SIGNUP_WAITING_TX_RESPONSE:
      return {
        ...state,
        status: SignupState.WAITING_TX_RESPONSE,
        tx: {
          ...state.tx,
          id: action.payload.txId,
          remainingAttempts: action.payload.remainingAttempts,
        },
      };
    case SIGNUP_SUCCESS:
      return {
        ...state,
        tx: {
          ...state.tx,
          status: TxStatus.SUCCESS,
        },
        username: action.payload.username,
        error: null,
        status: SignupState.SIGNING_UP_SUCCESS,
      };
    case SIGNUP_FAILURE:
      return {
        ...state,
        error: action.payload.error,
        status: SignupState.SIGNING_UP_FAILED,
      };
    default:
      return state;
  }
}

// ///////////////////////////////////////
// Action Creators

export const signupBegin = () => ({
  type: SIGNUP_BEGIN,
});

export const signupWaitingTXResponse = (txId, remainingAttempts) => ({
  type: SIGNUP_WAITING_TX_RESPONSE,
  payload: { txId, remainingAttempts },
});

export const signupSuccess = (username) => ({
  type: SIGNUP_SUCCESS,
  payload: {
    username,
  },
});

export const signupFailure = (error) => ({
  type: SIGNUP_FAILURE,
  payload: { error },
});

// ///////////////////////////////////////
// Selectors

export const isProcessing = (state) =>
  state.signup.status === SignupState.SIGNING_UP ||
  state.signup.status === SignupState.WAITING_TX_RESPONSE;
export const getErrorMessage = (state) => state.signup.error;

// ///////////////////////////////////////
// pseudo-Action Creators

const getTxStatus = (
  token,
  { onSuccess, onFailed },
  remainingAttempts = 4
) => async (dispatch) => {
  const response = await api.authFetchSignupTx(token);

  if (!response.ok && remainingAttempts > 0) {
    dispatch(signupWaitingTXResponse(token, remainingAttempts - 1));
    setTimeout(() => {
      dispatch(
        getTxStatus(token, { onSuccess, onFailed }, remainingAttempts - 1)
      );
    }, api.TX_POLL_TIMEOUT);
    return;
  }

  if (!response.ok) {
    dispatch(signupFailure(response.error));
    if (onFailed && typeof onFailed === "function") {
      onFailed();
    }
    return;
  }

  const json = await response.json();
  dispatch(signupSuccess(json.status, json.newPayment));
  if (onSuccess && typeof onSuccess === "function") {
    onSuccess();
  }
};

const signup = (
  username,
  password,
  phoneNumber,
  publicKey,
  { onSuccess, onFailed }
) => async (dispatch) => {
  dispatch(signupBegin());

  const response = await api.authSignup(
    username,
    password,
    phoneNumber,
    publicKey,
    scheme
  );

  if (!response.ok) {
    let message = response.statusText;
    if (response.status === 400) {
      const json = await response.json();
      message = json.error;
    }
    dispatch(signupFailure(message));
    if (onFailed && typeof onFailed === "function") {
      onFailed();
    }
    return;
  }

  const json = await response.json();
  dispatch(getTxStatus(json.signup_token, { onSuccess, onFailed }));
};

const signupBeta = (
  username,
  password,
  phoneNumber,
  publicKey,
  scheme,
  betaKey,
  { onSuccess, onFailed }
) => async (dispatch) => {
  dispatch(signupBegin());

  const response = await api.authSignupBeta(
    username,
    password,
    phoneNumber,
    publicKey,
    scheme,
    betaKey
  );

  if (!response.ok) {
    let message = response.statusText;
    if (response.status === 400) {
      const json = await response.json();
      message = json.error;
    }
    dispatch(signupFailure(message));
    if (onFailed && typeof onFailed === "function") {
      onFailed();
    }
    return;
  }

  const json = await response.json();
  dispatch(getTxStatus(json.signup_token, { onSuccess, onFailed }));
};

export const actions = {
  signup,
  signupBeta,
};
