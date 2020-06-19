// ///////////////////////////////////////
// Account Settings module
import api from "../../api";

import * as cryptographyModule from "./cryptography";

export const ChangePasswordState = {
  CHANGING_PASSWORD: "Changing password",
  WAITING_TX_RESPONSE: "Waiting TX response",
  CHANGING_PASSWORD_SUCCESS: "Changing password success",
  CHANGING_PASSWORD_FAILED: "Changing password failed",
};

export const InitiateChangePasswordState = {
  INITIATING_PASSWORD_CHANGE: "Initiating password change",
  WAITING_TX_RESPONSE: "Waiting TX response",
  INITIATING_PASSWORD_CHANGE_SUCCESS: "Initiating password change success",
  INITIATING_PASSWORD_CHANGE_FAILED: "Initiating password change failed",
};

export const ResendChangePasswordCodeState = {
  RESENDING: "Resending change password code",
  RESEND_SUCCESS: "Change password code resend successful",
  RESEND_FAILED: "Change password code resend failed",
};

export const TxStatus = {
  FAILED: 0,
  SUCCESS: 1,
};

// ///////////////////////////////////////
// Actions

// initiate password change
// params
const SET_USERNAME = "sikoba/changepassword/SET_USERNAME";

// operational
const INITIATE_PASSWORD_CHANGE_BEGIN =
  "sikoba/changepassword/INITIATE_PASSWORD_CHANGE_BEGIN";
const INITIATE_PASSWORD_CHANGE_WAITING_TX_RESPONSE =
  "sikoba/creditline/INITIATE_PASSWORD_CHANGE_WAITING_TX_RESPONSE";
const INITIATE_PASSWORD_CHANGE_SUCCESS =
  "sikoba/changepassword/INITIATE_PASSWORD_CHANGE_SUCCESS";
const INITIATE_PASSWORD_CHANGE_FAILURE =
  "sikoba/changepassword/INITIATE_PASSWORD_CHANGE_FAILURE";
const INITIATE_PASSWORD_CHANGE_RESET =
  "sikoba/changepassword/INITIATE_PASSWORD_CHANGE_RESET";

// resend change password
const RESEND_CHANGE_PASSWORD_CODE_BEGIN =
  "sikoba/verification/RESEND_CHANGE_PASSWORD_CODE_BEGIN";
const RESEND_CHANGE_PASSWORD_CODE_SUCCESS =
  "sikoba/verification/RESEND_CHANGE_PASSWORD_CODE_SUCCESS";
const RESEND_CHANGE_PASSWORD_CODE_FAILED =
  "sikoba/verification/RESEND_CHANGE_PASSWORD_CODE_FAILURE";

// changing password
// params
const SET_NEW_PASSWORD = "sikoba/changepassword/SET_NEW_PASSWORD";
const SET_CODE = "sikoba/changepassword/SET_CODE";

// operational
const CHANGE_PASSWORD_BEGIN = "sikoba/changepassword/CHANGE_PASSWORD_BEGIN";
const CHANGE_PASSWORD_WAITING_TX_RESPONSE =
  "sikoba/creditline/CHANGE_PASSWORD_WAITING_TX_RESPONSE";
const CHANGE_PASSWORD_SUCCESS = "sikoba/changepassword/CHANGE_PASSWORD_SUCCESS";
const CHANGE_PASSWORD_FAILURE = "sikoba/changepassword/CHANGE_PASSWORD_FAILURE";
const CHANGE_PASSWORD_RESET = "sikoba/changepassword/CHANGE_PASSWORD_RESET";
const CHANGE_PASSWORD_STATUS_RESET =
  "sikoba/changepassword/CHANGE_PASSWORD_STATUS_RESET";

// ///////////////////////////////////////
// Reducer

const initialState = {
  changePassword: {
    password: null,
    code: null,

    status: null,
    errorMessage: null,
    tx: null,
  },
  initiatePasswordChange: {
    username: null,

    status: null,
    errorMessage: null,
    tx: null,
  },
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    // initiate password change
    // params
    case SET_USERNAME:
      return {
        ...state,
        initiatePasswordChange: {
          ...state.initiatePasswordChange,
          username: action.payload.username,
        },
      };

    // operational
    case INITIATE_PASSWORD_CHANGE_BEGIN:
      return {
        ...state,
        initiatePasswordChange: {
          ...state.initiatePasswordChange,
          status: InitiateChangePasswordState.INITIATING_PASSWORD_CHANGE,
          tx: null,
        },
      };

    case INITIATE_PASSWORD_CHANGE_WAITING_TX_RESPONSE:
      return {
        ...state,
        initiatePasswordChange: {
          ...state.initiatePasswordChange,
          status: InitiateChangePasswordState.WAITING_TX_RESPONSE,
          tx: {
            ...state.initiatePasswordChange.tx,
            id: action.payload.txId,
            remainingAttempts: action.payload.remainingAttempts,
          },
        },
      };

    case INITIATE_PASSWORD_CHANGE_SUCCESS:
      return {
        ...state,
        initiatePasswordChange: {
          ...state.initiatePasswordChange,
          status:
            InitiateChangePasswordState.INITIATING_PASSWORD_CHANGE_SUCCESS,
          tx: { ...state.initiatePasswordChange.tx, status: TxStatus.SUCCESS },
        },
      };

    case INITIATE_PASSWORD_CHANGE_FAILURE:
      return {
        ...state,
        initiatePasswordChange: {
          ...state.initiatePasswordChange,
          errorMessage: action.payload.error,
          status: InitiateChangePasswordState.INITIATING_PASSWORD_CHANGE_FAILED,
        },
      };

    case INITIATE_PASSWORD_CHANGE_RESET:
      return {
        ...state,
        initiatePasswordChange: {
          username: null,

          status: null,
          errorMessage: null,
          tx: null,
        },
      };

    // change phone number
    // params
    case SET_NEW_PASSWORD:
      return {
        ...state,
        changePassword: {
          ...state.changePassword,
          password: action.payload.password,
        },
      };

    case SET_CODE:
      return {
        ...state,
        changePassword: { ...state.changePassword, code: action.payload.code },
      };

    // operational
    case CHANGE_PASSWORD_BEGIN:
      return {
        ...state,
        changePassword: {
          ...state.changePassword,
          status: ChangePasswordState.CHANGING_PASSWORD,
          errorMessage: null,
          tx: null,
        },
      };

    case CHANGE_PASSWORD_WAITING_TX_RESPONSE:
      return {
        ...state,
        changePassword: {
          ...state.changePassword,
          tx: {
            ...state.changePassword.tx,
            id: action.payload.txId,
            remainingAttempts: action.payload.remainingAttempts,
          },
          status: ChangePasswordState.WAITING_TX_RESPONSE,
        },
      };

    case CHANGE_PASSWORD_SUCCESS:
      return {
        ...state,
        changePassword: {
          ...state.changePassword,
          status: ChangePasswordState.CHANGING_PASSWORD_SUCCESS,
          tx: { ...state.changePassword.tx, status: TxStatus.SUCCESS },
        },
      };

    case CHANGE_PASSWORD_FAILURE:
      return {
        ...state,
        changePassword: {
          ...state.changePassword,
          status: ChangePasswordState.CHANGING_PASSWORD_FAILED,
          errorMessage: action.payload.error,
        },
      };

    case CHANGE_PASSWORD_STATUS_RESET:
      return {
        ...state,
        changePassword: {
          ...state.changePassword,
          status: null,
          tx: null,
          errorMessage: null,
        },
      };

    case CHANGE_PASSWORD_RESET:
      return {
        ...state,
        changePassword: {
          password: null,
          code: null,

          status: null,
          tx: null,
          errorMessage: null,
        },
        initiatePasswordChange: {
          username: null,

          status: null,
          errorMessage: null,
          tx: null,
        },
      };

    default:
      return state;
  }
}

// ///////////////////////////////////////
// Action Creators

// initiate password change
// params
export const setUsername = (username) => ({
  type: SET_USERNAME,
  payload: { username },
});

// operational
export const initiatePasswordChangeBegin = () => ({
  type: INITIATE_PASSWORD_CHANGE_BEGIN,
});

export const initiatePasswordChangeWaitingTXResponse = ({
  txId,
  remainingAttempts,
}) => ({
  type: INITIATE_PASSWORD_CHANGE_WAITING_TX_RESPONSE,
  payload: { txId, remainingAttempts },
});

export const initiatePasswordChangeSuccess = (data) => ({
  type: INITIATE_PASSWORD_CHANGE_SUCCESS,
  payload: { data },
});

export const initiatePasswordChangeFailed = (error) => ({
  type: INITIATE_PASSWORD_CHANGE_FAILURE,
  type: { error },
});

export const initiatePasswordChangeReset = () => ({
  type: INITIATE_PASSWORD_CHANGE_RESET,
});

// change password
// params
export const setPassword = (password) => ({
  type: SET_NEW_PASSWORD,
  payload: { password },
});

export const setCode = (code) => ({
  type: SET_CODE,
  payload: { code },
});

// operational
export const changePasswordBegin = () => ({
  type: CHANGE_PASSWORD_BEGIN,
});

export const changePasswordWaitingTXResponse = ({
  txId,
  remainingAttempts,
}) => ({
  type: CHANGE_PASSWORD_WAITING_TX_RESPONSE,
  payload: { txId, remainingAttempts },
});

export const changePasswordSuccess = (data) => ({
  type: CHANGE_PASSWORD_SUCCESS,
  payload: { data },
});

export const changePasswordFailed = (error) => ({
  type: CHANGE_PASSWORD_FAILURE,
  payload: { error },
});

export const changePasswordReset = () => ({
  type: CHANGE_PASSWORD_RESET,
});

export const changePasswordStatusReset = () => ({
  type: CHANGE_PASSWORD_STATUS_RESET,
});

// resend change password code
export const resendChangePasswordCodeBegin = () => ({
  type: RESEND_CHANGE_PASSWORD_CODE_BEGIN,
});

export const resendChangePasswordCodeSuccess = () => ({
  type: RESEND_CHANGE_PASSWORD_CODE_SUCCESS,
});

export const resendChangePasswordCodeFailure = (error) => ({
  type: RESEND_CHANGE_PASSWORD_CODE_FAILED,
  payload: { error },
});

// ///////////////////////////////////////
// Selectors

// initiate password change
export const getInitiatePasswordChangeStatus = (state) =>
  state.changepassword.initiatePasswordChange.status;
export const getUsername = (state) =>
  state.changepassword.initiatePasswordChange.username;
export const getInitiatePasswordChangeErrorMessage = (state) =>
  state.changepassword.initiatePasswordChange.errorMessage;

// password change
export const getPasswordChangeStatus = (state) =>
  state.changepassword.changePassword.status;
export const getPassword = (state) =>
  state.changepassword.changePassword.password;
export const getCode = (state) => state.changepassword.changePassword.code;
export const getChangePasswordErrorMessage = (state) =>
  state.changepassword.changePassword.errorMessage;

// ///////////////////////////////////////
// pseudo-Action Creators

const getChangePhoneNumberTxStatus = (txId, remainingAttempts = 4) => async (
  dispatch
) => {
  const response = await api.getTxStatus(txId);

  if (!response.ok && remainingAttempts > 0) {
    dispatch(changePasswordWaitingTXResponse(txId, remainingAttempts - 1));
    setTimeout(() => {
      dispatch(getChangePhoneNumberTxStatus(txId, remainingAttempts - 1));
    }, 5000);
    return;
  }

  if (!response.ok) {
    dispatch(changePasswordFailed(response.error));
    return;
  }

  const json = await response.json();
  dispatch(changePasswordSuccess(json.status));
};

// change password
export const changePassword = (data) => async (dispatch) => {
  dispatch(changePasswordBegin());

  const { username, password, code } = data;
  const toSign = JSON.stringify({ username, password, code });

  dispatch(
    cryptographyModule.signMessage(username, toSign, {
      onSigned: async (signature, publicKey) => {
        const response = await api.changePassword(
          username,
          password,
          code,
          signature,
          publicKey
        );
        const json = await response.json();

        if (!response.ok) {
          dispatch(changePasswordFailed(json.error));
          return;
        }

        dispatch(getChangePhoneNumberTxStatus(json.tx_id));
      },
    })
  );
};

// initiate password change
const getInitiatePasswordChangeTxStatus = (
  txId,
  remainingAttempts = 4
) => async (dispatch) => {
  const response = await api.getTxStatus(txId);

  if (!response.ok && remainingAttempts > 0) {
    dispatch(
      initiatePasswordChangeWaitingTXResponse(txId, remainingAttempts - 1)
    );
    setTimeout(() => {
      dispatch(getInitiatePasswordChangeTxStatus(txId, remainingAttempts - 1));
    }, 5000);
    return;
  }

  if (!response.ok) {
    dispatch(initiatePasswordChangeFailed(response.error));
    return;
  }

  const json = await response.json();
  dispatch(initiatePasswordChangeSuccess(json.status));
};

export const initiatePasswordChange = (username) => async (
  dispatch,
  getState
) => {
  dispatch(initiatePasswordChangeBegin());

  const response = await api.initiatePasswordChange(username);

  if (!response.ok) {
    dispatch(initiatePasswordChangeFailed(response.statusText));
    return;
  }

  const json = await response.json();
  dispatch(getInitiatePasswordChangeTxStatus(json.tx_id));
};

export const resendChangePasswordCode = (
  username,
  onSuccess,
  onFailed
) => async (dispatch) => {
  dispatch(resendChangePasswordCodeBegin());

  const response = await api.resendChangePasswordCode(username);

  if (!response.ok) {
    const json = await response.json();
    dispatch(resendChangePasswordCodeFailure(json.error));
    if (onFailed && typeof onFailed === "function") onFailed(json.error);
    return;
  }

  // const json = await response.json(); // probably not needed
  dispatch(resendChangePasswordCodeSuccess());
  if (onSuccess && typeof onSuccess === "function") onSuccess();
};
