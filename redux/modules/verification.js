///////////////////////
// Verification module
//
// Used to handle SMS codes used for account verification, password recovery, etc.

import api from "../../api";

import * as cryptographyModule from "./cryptography";

export const VerifyAccountState = {
  VERIFYING: "Verifying account",
  WAITING_TX_RESPONSE: "Waiting Tx response",
  VERIFY_SUCCESS: "Verify account success",
  VERIFY_FAILED: "Verify account failed",
};

export const TxStatus = { FAILED: 0, SUCCESS: 1 };

export const ResendPhoneNumberCodeState = {
  RESENDING: "Resending phone number code",
  RESEND_SUCCESS: "Phone number code resend successful",
  RESEND_FAILED: "Phone number code resend failed",
};

///////////////////////
// Actions

// verify phone number
// params
const SET_CODE = "sikoba/verification/SET_CODE";

// operational
const VERIFY_PHONE_NUMBER_BEGIN =
  "sikoba/verification/VERIFY_PHONE_NUMBER_BEGIN";
const VERIFY_PHONE_NUMBER_WAITING_TX_RESPONSE =
  "sikoba/verification/VERIFY_PHONE_NUMBER_WAITING_TX_RESPONSE";
const VERIFY_PHONE_NUMBER_SUCCESS =
  "sikoba/verification/VERIFY_PHONE_NUMBER_SUCCESS";
const VERIFY_PHONE_NUMBER_FAILURE =
  "sikoba/verification/VERIFY_PHONE_NUMBER_FAILURE";
const VERIFY_PHONE_NUMBER_RESET =
  "sikoba/verification/VERIFY_PHONE_NUMBER_RESET";
const VERIFY_PHONE_NUMBER_RESET_STATUS =
  "sikoba/verification/VERIFY_PHONE_NUMBER_RESET_STATUS";

// resend phone number
const RESEND_PHONE_NUMBER_CODE_BEGIN =
  "sikoba/verification/RESEND_PHONE_NUMBER_CODE_BEGIN";
const RESEND_PHONE_NUMBER_CODE_SUCCESS =
  "sikoba/verification/RESEND_PHONE_NUMBER_CODE_SUCCESS";
const RESEND_PHONE_NUMBER_CODE_FAILED =
  "sikoba/verification/RESEND_PHONE_NUMBER_CODE_FAILURE";

///////////////////////
// Reducer
const initialState = {
  verifyAccount: {
    code: null,
    status: null,
    tx: null,
    errorMessage: null,
  },
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    // verify phone number
    // params
    case SET_CODE:
      return {
        ...state,
        verifyAccount: { ...state.verifyAccount, code: action.payload.code },
      };

    // operational
    case VERIFY_PHONE_NUMBER_BEGIN:
      return {
        ...state,
        verifyAccount: {
          ...state.verifyAccount,
          status: VerifyAccountState.VERIFYING,
        },
      };
    case VERIFY_PHONE_NUMBER_WAITING_TX_RESPONSE:
      return {
        ...state,
        verifyAccount: {
          ...state.verifyAccount,
          tx: {
            ...state.verifyAccount.tx,
            id: action.payload.txId,
            remainingAttempts: action.payload.remainingAttempts,
          },
          status: VerifyAccountState.WAITING_TX_RESPONSE,
        },
      };
    case VERIFY_PHONE_NUMBER_SUCCESS:
      return {
        ...state,
        verifyAccount: {
          ...state.verifyAccount,
          tx: { ...state.verifyAccount.tx, status: TxStatus.SUCCESS },
          status: VerifyAccountState.VERIFY_SUCCESS,
        },
      };
    case VERIFY_PHONE_NUMBER_FAILURE:
      const { error } = action.payload;
      return {
        ...state,
        verifyAccount: {
          ...state.verifyAccount,
          status: VerifyAccountState.VERIFY_FAILED,
          errorMessage: error,
        },
      };
    case VERIFY_PHONE_NUMBER_RESET:
      return {
        ...state,
        verifyAccount: { status: null, errorMessage: null },
      };

    default:
      return state;
  }
}

/////////////////////
// Action Creators

// verify phone number
// params
export const setVerifyPhoneNumberCode = (code) => ({
  type: SET_CODE,
  payload: { code },
});

// operational
export const verifyPhoneNumberBegin = () => ({
  type: VERIFY_PHONE_NUMBER_BEGIN,
});

export const verifyPhoneNumberWaitingTXResponse = (
  txId,
  remainingAttempts
) => ({
  type: VERIFY_PHONE_NUMBER_WAITING_TX_RESPONSE,
  payload: { txId, remainingAttempts },
});

export const verifyPhoneNumberSuccess = () => ({
  type: VERIFY_PHONE_NUMBER_SUCCESS,
});

export const verifyPhoneNumberFailure = (error) => ({
  type: VERIFY_PHONE_NUMBER_FAILURE,
  payload: { error },
});

export const verifyPhoneNumberReset = () => ({
  type: VERIFY_PHONE_NUMBER_RESET,
});

// resend phone number code
export const resendPhoneNumberCodeBegin = () => ({
  type: RESEND_PHONE_NUMBER_CODE_BEGIN,
});

export const resendPhoneNumberCodeSuccess = () => ({
  type: RESEND_PHONE_NUMBER_CODE_SUCCESS,
});

export const resendPhoneNumberCodeFailure = (error) => ({
  type: RESEND_PHONE_NUMBER_CODE_FAILED,
  payload: { error },
});

//////////////////////////
// Selectors

// verify phone number
export const getVerifyPhoneNumberCode = (state) =>
  state.verification.verifyAccount.code;
export const getVerifyPhoneNumberStatus = (state) =>
  state.verification.verifyAccount.status;
export const getVerifyPhoneNumberErrorMessage = (state) =>
  state.verification.verifyAccount.errorMessage;

// resend phone number code
export const getUpdatePhoneNumberCodeStatus = (state) =>
  state.verification.resendPhoneNumberCode.status;
export const getUpdatePhoneNumberCodeErrorMessage = (state) =>
  state.verification.resendPhoneNumberCode.errorMessage;

//////////////////////////////
// Pseudo-action creators

const getTxStatus = (txId, remainingAttempts = 4) => async (dispatch) => {
  const response = await api.get(`/transactions/${txId}`);

  if (!response.ok && remainingAttempts > 0) {
    dispatch(verifyPhoneNumberWaitingTXResponse(txId, remainingAttempts - 1));
    setTimeout(() => {
      dispatch(getTxStatus(txId, remainingAttempts - 1));
    }, 5000);
    return;
  }

  if (!response.ok) {
    dispatch(verifyPhoneNumberFailure(response.error));
    return;
  }

  const json = await response.json();
  dispatch(verifyPhoneNumberSuccess(json.status));
};

const verifyPhoneNumber = (username, code) => async (dispatch) => {
  dispatch(verifyPhoneNumberBegin());

  const toSign = JSON.stringify({ username, code });
  dispatch(
    cryptographyModule.signMessage(username, toSign, {
      onSigned: async (signature, publicKey) => {
        const response = await api.post("/verification/verify_phone_number", {
          body: {
            validator: username,
            code: code,
            signature,
            public_key: publicKey,
          },
        });

        if (!response.ok) {
          const { status } = response;
          var errorMessage;
          if (status === 404) errorMessage = "Wrong verification code";
          dispatch(verifyPhoneNumberFailure(errorMessage));
          return;
        }

        const json = await response.json();
        dispatch(getTxStatus(json.tx_id));
      },
    })
  );
};

const resendPhoneNumberCode = (username, onSuccess, onFailed) => async (
  dispatch
) => {
  dispatch(resendPhoneNumberCodeBegin());

  const toSign = JSON.stringify({ user: username });

  dispatch(
    cryptographyModule.signMessage(username, toSign, {
      onSigned: async (signature, publicKey) => {
        const response = await api.post(
          "/verification/resend_phone_number_code",
          {
            body: { user: username, signature, public_key: publicKey },
          }
        );

        if (!response.ok) {
          const json = await response.json();
          dispatch(resendPhoneNumberCodeFailure(json.error));
          if (onFailed && typeof onFailed === "function") onFailed(json.error);
          return;
        }

        // const json = await response.json(); // probably not needed
        dispatch(resendPhoneNumberCodeSuccess());
        if (onSuccess && typeof onSuccess === "function") onSuccess();
      },
    })
  );
};

const resetVerificationProcess = () => async (dispatch) => {
  dispatch(verifyPhoneNumberReset());
};

export const actions = {
  verifyPhoneNumber,
  resendPhoneNumberCode,
  resetVerificationProcess,
};
