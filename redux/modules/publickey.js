// ///////////////////////////////////////
// Account Settings module
import api from "../../api";
import { AsyncStorage } from "react-native";

import * as cryptographyModule from "./cryptography";

export const AddPublicKeyState = {
  ADDING: "Adding public key",
  WAITING_TX_RESPONSE: "Waiting Tx response",
  ADD_SUCCESS: "Add public key success",
  ADD_FAILED: "Add public key failed",
};

export const DisablePublicKeyState = {
  DISABLING: "Disabling public key",
  WAITING_TX_RESPONSE: "Waiting Tx response",
  DISABLE_SUCCESS: "Disabl public key success",
  DISABLE_FAILED: "Disabl public key failed",
};

export const TxStatus = {
  FAILED: 0,
  SUCCESS: 1,
};

// ///////////////////////////////////////
// Actions

// add public key
// params
const SET_KEY_TO_ADD = "sikoba/cryptography/SET_KEY_TO_ADD";
// operational
const ADD_PUBLIC_KEY_BEGIN = "sikoba/cryptography/ADD_PUBLIC_KEY_BEGIN";
const ADD_PUBLIC_KEY_WAITING_TX_RESPONSE =
  "sikoba/cryptography/ADD_PUBLIC_KEY_WAITING_TX_RESPONSE";
const ADD_PUBLIC_KEY_SUCCESS = "sikoba/cryptography/ADD_PUBLIC_KEY_SUCCESS";
const ADD_PUBLIC_KEY_FAILURE = "sikoba/cryptography/ADD_PUBLIC_KEY_FAILURE";
const ADD_PUBLIC_KEY_RESET = "sikoba/cryptography/ADD_PUBLIC_KEY_RESET";
const ADD_PUBLIC_KEY_RESET_STATUS =
  "sikoba/cryptography/ADD_PUBLIC_KEY_RESET_STATUS";

// disable public key
// params
const SET_KEY_TO_DISABLE = "sikoba/cryptography/SET_KEY_TO_DISABLE";
// operational
const DISABLE_PUBLIC_KEY_BEGIN = "sikoba/cryptography/DISABLE_PUBLIC_KEY_BEGIN";
const DISABLE_PUBLIC_KEY_WAITING_TX_RESPONSE =
  "sikoba/cryptography/DISABLE_PUBLIC_KEY_WAITING_TX_RESPONSE";
const DISABLE_PUBLIC_KEY_SUCCESS =
  "sikoba/cryptography/DISABLE_PUBLIC_KEY_SUCCESS";
const DISABLE_PUBLIC_KEY_FAILURE =
  "sikoba/cryptography/DISABLE_PUBLIC_KEY_FAILURE";
const DISABLE_PUBLIC_KEY_RESET = "sikoba/cryptography/DISABLE_PUBLIC_KEY_RESET";
const DISABLE_PUBLIC_KEY_RESET_STATUS =
  "sikoba/cryptography/DISABLE_PUBLIC_KEY_RESET_STATUS";

// ///////////////////////////////////////
// Reducer

const initialState = {
  addPublicKey: {
    status: null,
    tx: null,
    errorMessage: null,
  },
  disablePublicKey: {
    status: null,
    tx: null,
    errorMessage: null,
  },
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    // add public key
    case ADD_PUBLIC_KEY_BEGIN: {
      return {
        ...state,
        addPublicKey: {
          ...state.addPublicKey,
          tx: null,
          status: AddPublicKeyState.ADDING,
        },
      };
    }
    case ADD_PUBLIC_KEY_WAITING_TX_RESPONSE: {
      const { txId, remainingAttempts } = action.payload;

      return {
        ...state,
        addPublicKey: {
          ...state.addPublicKey,
          tx: {
            ...state.addPublicKey.tx,
            txId,
            remainingAttempts,
          },
          status: AddPublicKeyState.WAITING_TX_RESPONSE,
        },
      };
    }
    case ADD_PUBLIC_KEY_SUCCESS: {
      return {
        ...state,
        addPublicKey: {
          ...state.addPublicKey,
          tx: { ...state.addPublicKey.tx, status: TxStatus.SUCCESS },
          status: AddPublicKeyState.ADD_SUCCESS,
        },
      };
    }
    case ADD_PUBLIC_KEY_FAILURE: {
      return {
        ...state,
        addPublicKey: {
          ...state.addPublicKey,
          status: AddPublicKeyState.ADD_FAILED,
          errorMessage: action.payload.error,
        },
      };
    }
    case ADD_PUBLIC_KEY_RESET: {
      return {
        ...state,
        addPublicKey: {
          keyToAdd: null,
          status: null,
          tx: null,
          errorMessage: null,
        },
      };
    }
    case ADD_PUBLIC_KEY_RESET_STATUS: {
      return {
        ...state,
        addPublicKey: { ...state.addPublicKey, status: null },
      };
    }

    // disable public key
    case DISABLE_PUBLIC_KEY_BEGIN: {
      return {
        ...state,
        disablePublicKey: {
          ...state.disablePublicKey,
          tx: null,
          status: DisablePublicKeyState.DISABLING,
        },
      };
    }
    case DISABLE_PUBLIC_KEY_WAITING_TX_RESPONSE: {
      const { txId, remainingAttempts } = action.payload;

      return {
        ...state,
        disablePublicKey: {
          ...state.disablePublicKey,
          tx: {
            ...state.disablePublicKey.tx,
            txId,
            remainingAttempts,
          },
          status: DisablePublicKeyState.WAITING_TX_RESPONSE,
        },
      };
    }
    case DISABLE_PUBLIC_KEY_SUCCESS: {
      return {
        ...state,
        disablePublicKey: {
          ...state.disablePublicKey,
          tx: { ...state.disablePublicKey.tx, status: TxStatus.SUCCESS },
          status: DisablePublicKeyState.DISABLE_SUCCESS,
        },
      };
    }
    case DISABLE_PUBLIC_KEY_FAILURE: {
      return {
        ...state,
        disablePublicKey: {
          ...state.disablePublicKey,
          status: DisablePublicKeyState.DISABLE_FAILED,
          errorMessage: action.payload.error,
        },
      };
    }
    case DISABLE_PUBLIC_KEY_RESET: {
      return {
        ...state,
        disablePublicKey: {
          keyToDisable: null,
          status: null,
          tx: null,
          errorMessage: null,
        },
      };
    }
    case DISABLE_PUBLIC_KEY_RESET_STATUS: {
      return {
        ...state,
        disablePublicKey: { ...state.disablePublicKey, status: null },
      };
    }

    default:
      return state;
  }
}

// ///////////////////////////////////////
// Action Creators

// operaitonal
// add public key
export const addPublicKeyBegin = () => ({
  type: ADD_PUBLIC_KEY_BEGIN,
});

export const addPublicKeyWaitingTXResponse = (txId, remainingAttempts) => ({
  type: ADD_PUBLIC_KEY_WAITING_TX_RESPONSE,
  payload: { txId, remainingAttempts },
});

export const addPublicKeySuccess = (status) => ({
  type: ADD_PUBLIC_KEY_SUCCESS,
  payload: { status },
});

export const addPublicKeyFailure = (error) => ({
  type: ADD_PUBLIC_KEY_FAILURE,
  payload: { error },
});

// disable public key
export const disablePublicKeyBegin = () => ({
  type: DISABLE_PUBLIC_KEY_BEGIN,
});

export const disablePublicKeyWaitingTXResponse = (txId, remainingAttempts) => ({
  type: DISABLE_PUBLIC_KEY_WAITING_TX_RESPONSE,
  payload: { txId, remainingAttempts },
});

export const disablePublicKeySuccess = (status) => ({
  type: DISABLE_PUBLIC_KEY_SUCCESS,
  payload: { status },
});

export const disablePublicKeyFailure = (error) => ({
  type: DISABLE_PUBLIC_KEY_FAILURE,
  payload: { error },
});

// ///////////////////////////////////////
// Selectors

// add public key
export const getAddPublicKeyStatus = (state) =>
  state.publickey.addPublicKey.status;

export const getAddPublicKeyErrorMessage = (state) =>
  state.publickey.addPublicKey.errorMessage;

// disable public key
export const getDisablePublicKeyStatus = (state) =>
  state.publickey.disablePublicKey.status;

export const getDisablePublicKeyErrorMessage = (state) =>
  state.publickey.disablePublicKey.errorMessage;

// ///////////////////////////////////////
// pseudo-Action Creators

export const addPublicKey = (username, newPublicKey, scheme) => async (
  dispatch,
  getState
) => {
  dispatch(addPublicKeyBegin());

  const toSign = JSON.stringify({
    user: username,
    new_public_key: newPublicKey,
    scheme: scheme,
  });

  dispatch(
    cryptographyModule.signMessage(username, toSign, {
      onSigned: async (signature, publicKey) => {
        const response = await api.post("/public_key/add", {
          body: {
            user: username,
            new_public_key: newPublicKey,
            scheme: scheme,
            signature,
            public_key: publicKey,
          },
        });

        if (!response.ok) {
          dispatch(addPublicKeyFailure(reponse.statusText));
          return;
        }

        const json = await response.json();
        dispatch(getAddPublicKeyTxStatus(json.tx_id));
      },
    })
  );
};

const getAddPublicKeyTxStatus = (txId, remainingAttempts = 4) => async (
  dispatch
) => {
  const response = await api.get(`/transactions/${txId}`);

  if (!response.ok && remainingAttempts > 0) {
    dispatch(addPublicKeyWaitingTXResponse(txId, remainingAttempts - 1));
    setTimeout(() => {
      dispatch(getAddPublicKeyTxStatus(txId, remainingAttempts - 1));
    }, 5000);
    return;
  }

  if (!response.ok) {
    dispatch(addPublicKeyFailure(response.error));
    return;
  }

  const json = await response.json();
  dispatch(addPublicKeySuccess(json.status));
};

export const disablePublicKey = (
  username,
  keyToDisable,
  { onSuccess }
) => async (dispatch, getState) => {
  dispatch(disablePublicKeyBegin());

  const toSign = JSON.stringify({
    user: username,
    key_to_disable: keyToDisable,
  });

  dispatch(
    cryptographyModule.signMessage(username, toSign, {
      onSigned: async (signature, publicKey) => {
        const response = await api.post("/public_key/disable", {
          body: {
            user: username,
            key_to_disable: keyToDisable,
            signature,
            public_key: publicKey,
          },
        });

        if (!response.ok) {
          dispatch(disablePublicKeyFailure(reponse.statusText));
          return;
        }

        const json = await response.json();
        dispatch(getDisablePublicKeyTxStatus(json.tx_id, onSuccess));
      },
    })
  );
};

const getDisablePublicKeyTxStatus = (
  txId,
  onSuccess,
  remainingAttempts = 4
) => async (dispatch) => {
  const response = await api.get(`/transactions/${txId}`);

  if (!response.ok && remainingAttempts > 0) {
    dispatch(disablePublicKeyWaitingTXResponse(txId, remainingAttempts - 1));
    setTimeout(() => {
      dispatch(
        getDisablePublicKeyTxStatus(txId, onSuccess, remainingAttempts - 1)
      );
    }, 5000);
    return;
  }

  if (!response.ok) {
    dispatch(disablePublicKeyFailure(response.error));
    return;
  }

  const json = await response.json();
  dispatch(disablePublicKeySuccess(json.status));
  if (onSuccess && typeof onSuccess === "function") onSuccess();
};
