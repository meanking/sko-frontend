// ///////////////////////////////////////
// Account Settings module

import api from "../../api";

import * as cryptographyModule from "./cryptography";

export const LoadSettingsState = {
  LOADING_SETTINGS: "Loading user settings",
  LOADING_SETTINGS_SUCCESS: "Loading user settings success",
  LOADING_SETTINGS_FAILED: "Loading user settings failed",
  REFRESHING_SETTINGS: "Refreshing settings",
};

export const UpdateSettingsState = {
  UPDATING_SETTINGS: "Updating account settings in progress",
  WAITING_TX_RESPONSE: "Updating account settings in progress",
  UPDATING_SETTINGS_SUCCESS: "Updating settings success",
  UPDATING_SETTINGS_FAILED: "Updating settings failed",
};

export const ChangePhoneNumberState = {
  CHANGING_PHONE_NUMBER: "Changing phone number",
  WAITING_TX_RESPONSE: "Waiting TX response",
  CHANGING_PHONE_NUMBER_SUCCESS: "Changing phone number success",
  CHANGING_PHONE_NUMBER_FAILED: "Changing phone number failed",
};

export const CheckCredentialsState = {
  CHECKING_CREDENTIALS: "Checking credentials",
  CHECKING_CREDENTIALS_SUCCESS: "Checking credentials success",
  CHECKING_CREDENTIALS_FAILED: "Checking credentials failed",
};

export const TxStatus = {
  FAILED: 0,
  SUCCESS: 1,
};
export const flexibility = {
  MIN_VALUE: 5,
  MAX_VALUE: 30,
};

export const paymentTarget = {
  MIN_VALUE: 1,
  MAX_VALUE: 365,
};

// ///////////////////////////////////////
// Actions

// loading settings
const LOAD_SETTINGS_BEGIN = "sikoba/settings/LOAD_BEGIN";
const LOAD_SETTINGS_SUCCESS = "sikoba/settings/LOAD_SUCCESS";
const LOAD_SETTINGS_FAILURE = "sikoba/settings/LOAD_FAILURE";
const REFRESH_SETTINGS = "sikoba/setetings/REFRESH_SETTINGS";

// updating settings
const UPDATE_SETTINGS_BEGIN = "sikoba/settings/UPDATE_SETTINGS_BEGIN";
const UPDATE_SETTINGS_WAITING_TX_RESPONSE =
  "sikoba/creditline/UPDATE_SETTINGS_WAITING_TX_RESPONSE";
const UPDATE_SETTINGS_SUCCESS = "sikoba/settings/UPDATE_SETTINGS_SUCCESS";
const UPDATE_SETTINGS_FAILURE = "sikoba/settings/UPDATE_SETTINGS_FAILURE";

// changing phone number
// params
const SET_NEW_PHONE_NUMBER = "sikoba/settings/SET_NEW_PHONE_NUMBER";
const SET_PASSWORD = "sikoba/settings/SET_PASSWORD";
// operational
const CHANGE_PHONE_NUMBER_BEGIN = "sikoba/settings/CHANGE_PHONE_NUMBER_BEGIN";
const CHANGE_PHONE_NUMBER_WAITING_TX_RESPONSE =
  "sikoba/creditline/CHANGE_PHONE_NUMBER_WAITING_TX_RESPONSE";
const CHANGE_PHONE_NUMBER_SUCCESS =
  "sikoba/settings/CHANGE_PHONE_NUMBER_SUCCESS";
const CHANGE_PHONE_NUMBER_FAILURE =
  "sikoba/settings/CHANGE_PHONE_NUMBER_FAILURE";
const CHANGE_PHONE_NUMBER_RESET = "sikoba/settings/CHANGE_PHONE_NUMBER_RESET";

// check credentials
const CHECK_CREDENTIALS_BEGIN = "sikoba/settings/CHECK_CREDENTIALS_BEGIN";
const CHECK_CREDENTIALS_SUCCESS = "sikoba/settings/CHECK_CREDENTIALS_SUCCESS";
const CHECK_CREDENTIALS_FAILURE = "sikoba/settings/CHECK_CREDENTIALS_FAILURE";
const CHECK_CREDENTIALS_RESET = "sikoba/settings/CHECK_CREDENTIALS_RESET";

// ///////////////////////////////////////
// Reducer

const initialState = {
  loadAccountSettings: {
    status: null,
    errorMessage: null,
    data: {
      displayName: null,
      preferredPaymentTarget: null,
      clearingFlexibility: null,
      currencyISO: null,
      currencySymbol: null,
      currencyId: null,
    },
    account: { isVerified: null, phoneNumber: null },
  },
  updateAccountSettings: {
    status: null,
    errorMessage: null,
    tx: null,
    params: {
      displayName: null,
      preferredPaymentTarget: null,
      clearingFlexibility: null,
      defaultCurrency: {
        id: null,
        isoCode: null,
        fullName: null,
        symbol: null,
      },
    },
  },
  changePhoneNumber: {
    status: null,
    errorMessage: null,
    tx: null,
    newPhoneNumber: null,
    password: null,
  },
  checkCredentials: {
    validCredentials: null,
    status: null,
    errorMessage: null,
  },
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_SETTINGS_BEGIN: {
      return {
        ...state,
        loadAccountSettings: {
          ...state.loadAccountSettings,
          status: LoadSettingsState.LOADING_SETTINGS,
        },
      };
    }

    case LOAD_SETTINGS_SUCCESS:
      const { data } = action.payload;
      const { settings, account } = data;

      return {
        ...state,
        loadAccountSettings: {
          ...state.loadAccountSettings,
          status: LoadSettingsState.LOADING_SETTINGS_SUCCESS,
          data: {
            ...state.loadAccountSettings.data,
            displayName: settings.displayName,
            preferredPaymentTarget: settings.preferredPaymentTarget,
            clearingFlexibility: settings.clearingFlexibility,
            currencyISO: settings.currencyISO,
            currencySymbol: settings.currencySymbol,
            currencyId: settings.currencyId,
          },
          account: {
            ...state.loadAccountSettings.account,
            isVerified: account.isVerified,
            phoneNumber: account.phoneNumber,
          },
        },
      };

    case LOAD_SETTINGS_FAILURE:
      return {
        ...state,
        loadAccountSettings: {
          ...state.loadAccountSettings,
          status: LoadSettingsState.LOADING_SETTINGS_FAILED,
          errorMessage: action.payload.error,
        },
      };

    case REFRESH_SETTINGS:
      return {
        ...state,
        loadAccountSettings: {
          ...state.loadAccountSettings,
          status: LoadSettingsState.REFRESHING_SETTINGS,
        },
      };

    case UPDATE_SETTINGS_BEGIN:
      return {
        ...state,
        updateAccountSettings: {
          ...state.updateAccountSettings,
          status: UpdateSettingsState.UPDATING_SETTINGS,
        },
      };

    case UPDATE_SETTINGS_WAITING_TX_RESPONSE:
      return {
        ...state,
        updateAccountSettings: {
          ...state.updateAccountSettings,
          tx: {
            ...state.updateAccountSettings.tx,
            id: action.payload.txId,
            remainingAttempts: action.payload.remainingAttempts,
          },
          status: UpdateSettingsState.WAITING_TX_RESPONSE,
        },
      };

    case UPDATE_SETTINGS_SUCCESS:
      return {
        ...state,
        updateAccountSettings: {
          ...state.updateAccountSettings,
          status: UpdateSettingsState.UPDATING_SETTINGS_SUCCESS,
          tx: { ...state.updateAccountSettings.tx, status: TxStatus.SUCCESS },
        },
      };

    case UPDATE_SETTINGS_FAILURE:
      return {
        ...state,
        updateAccountSettings: {
          ...state.updateAccountSettings,
          status: UpdateSettingsState.UPDATING_SETTINGS_FAILED,
          errorMessage: action.payload.error,
        },
      };

    // change phone number
    // params
    case SET_NEW_PHONE_NUMBER:
      return {
        ...state,
        changePhoneNumber: {
          ...state.changePhoneNumber,
          newPhoneNumber: action.payload.newPhoneNumber,
        },
      };
    case SET_PASSWORD:
      return {
        ...state,
        changePhoneNumber: {
          ...state.changePhoneNumber,
          password: action.payload.password,
        },
      };

    // operational
    case CHANGE_PHONE_NUMBER_BEGIN:
      return {
        ...state,
        changePhoneNumber: {
          ...state.changePhoneNumber,
          status: ChangePhoneNumberState.CHANGING_PHONE_NUMBER,
        },
      };
    case CHANGE_PHONE_NUMBER_WAITING_TX_RESPONSE:
      return {
        ...state,
        changePhoneNumber: {
          ...state.changePhoneNumber,
          tx: {
            ...state.changePhoneNumber.tx,
            id: action.payload.txId,
            remainingAttempts: action.payload.remainingAttempts,
          },
          status: ChangePhoneNumberState.WAITING_TX_RESPONSE,
        },
      };
    case CHANGE_PHONE_NUMBER_SUCCESS:
      return {
        ...state,
        changePhoneNumber: {
          ...state.changePhoneNumber,
          status: ChangePhoneNumberState.CHANGING_PHONE_NUMBER_SUCCESS,
          tx: { ...state.changePhoneNumber.tx, status: TxStatus.SUCCESS },
        },
      };
    case CHANGE_PHONE_NUMBER_FAILURE:
      return {
        ...state,
        changePhoneNumber: {
          ...state.changePhoneNumber,
          status: ChangePhoneNumberState.CHANGING_PHONE_NUMBER_FAILED,
          errorMessage: action.payload.error,
        },
      };
    case CHANGE_PHONE_NUMBER_RESET:
      return {
        ...state,
        changePhoneNumber: {
          status: null,
          errorMessage: null,
          tx: null,
          newPhoneNumber: "",
          password: null,
        },
      };

    // checking credentials
    case CHECK_CREDENTIALS_BEGIN:
      return {
        ...state,
        checkCredentials: {
          ...state.checkCredentials,
          status: CheckCredentialsState.CHECKING_CREDENTIALS,
        },
      };

    case CHECK_CREDENTIALS_SUCCESS:
      return {
        ...state,
        checkCredentials: {
          ...state.checkCredentials,
          status: CheckCredentialsState.CHECKING_CREDENTIALS_SUCCESS,
          validCredentials: action.payload.validCredentials,
        },
      };

    case CHECK_CREDENTIALS_FAILURE:
      return {
        ...state,
        checkCredentials: {
          ...state.checkCredentials,
          errorMessage: action.payload.errorMessage,
          validCredentials: false,
        },
      };

    case CHECK_CREDENTIALS_RESET:
      return {
        ...state,
        checkCredentials: {
          status: null,
          validTransactions: null,
          errorMessage: null,
        },
      };

    default:
      return state;
  }
}

// ///////////////////////////////////////
// Action Creators

export const updateAccountSettingsBegin = () => ({
  type: UPDATE_SETTINGS_BEGIN,
});

export const updateAccountSettingsWaitingTXResponse = (
  txId,
  remainingAttempts
) => ({
  type: UPDATE_SETTINGS_WAITING_TX_RESPONSE,
  payload: { txId, remainingAttempts },
});

export const updateAccountSettingsSuccess = (status) => ({
  type: UPDATE_SETTINGS_SUCCESS,
  payload: { status },
});

export const updateAccountSettingsFailed = (error) => ({
  type: UPDATE_SETTINGS_FAILURE,
  payload: { error },
});

// load settings

const loadSettingsBegin = () => ({
  type: LOAD_SETTINGS_BEGIN,
});

const loadSettingsSuccess = (data) => ({
  type: LOAD_SETTINGS_SUCCESS,
  payload: { data },
});

const loadSettingsFailed = (error) => ({
  type: LOAD_SETTINGS_FAILURE,
  payload: { error },
});

// change phone number
// params
const setNewPhoneNumber = (newPhoneNumber) => ({
  type: SET_NEW_PHONE_NUMBER,
  payload: { newPhoneNumber },
});

const setPassword = (password) => ({
  type: SET_PASSWORD,
  payload: { password },
});

// operational
const changePhoneNumberBegin = () => ({
  type: CHANGE_PHONE_NUMBER_BEGIN,
});

const changePhoneNumberWaitingTXResponse = ({ txId, remainingAttempts }) => ({
  type: CHANGE_PHONE_NUMBER_WAITING_TX_RESPONSE,
  payload: { txId, remainingAttempts },
});

const changePhoneNumberSuccess = (data) => ({
  type: CHANGE_PHONE_NUMBER_SUCCESS,
  payload: { data },
});

const changePhoneNumberFailed = (error) => ({
  type: CHANGE_PHONE_NUMBER_FAILURE,
  payload: { error },
});

const changePhoneNumberReset = () => ({
  type: CHANGE_PHONE_NUMBER_RESET,
});

// check credentials
const checkCredentialsBegin = () => ({
  type: CHECK_CREDENTIALS_BEGIN,
});

const checkCredentialsSuccess = (data) => ({
  type: CHECK_CREDENTIALS_SUCCESS,
  payload: { validCredentials: data.status === 200 ? true : false },
});

const checkCredentialsFailed = (error) => ({
  type: CHECK_CREDENTIALS_FAILURE,
  payload: { error },
});

const checkCredentialsReset = () => ({
  type: CHECK_CREDENTIALS_RESET,
});

// ///////////////////////////////////////
// Selectors

export const areSettingsLoading = (state) =>
  state.settings.loadAccountSettings.status ===
  LoadSettingsState.LOADING_SETTINGS;

export const areSettingsLoadedSuccess = (state) => {
  const {
    displayName,
    currencyId,
    preferredPaymentTarget,
    clearingFlexibility,
  } = state.settings.loadAccountSettings.data;

  return (
    displayName !== null &&
    currencyId !== null &&
    preferredPaymentTarget !== null &&
    clearingFlexibility !== null
  );
};

export const getAccountSettings = (state) =>
  state.settings.loadAccountSettings.data;
export const getAccountData = (state) =>
  state.settings.loadAccountSettings.account;

export const isVerified = (state) =>
  state.settings.loadAccountSettings.account.isVerified;

export const getLoadSettingsErrorMessage = (state) =>
  state.settings.loadAccountSettings.errorMessage;

// data selectors
export const getDisplayName = (state) =>
  state.settings.loadAccountSettings.data.displayName || state.login.username;

export const getCurrency = (state) =>
  state.settings.loadAccountSettings.data.defaultCurrency;

export const getPreferredPaymentTarget = (state) =>
  state.settings.loadAccountSettings.data.preferredPaymentTarget;

export const getClearingFlexibility = (state) =>
  state.settings.loadAccountSettings.data.clearingFlexibility;

export const getLoadSettingsStatus = (state) =>
  state.settings.loadAccountSettings.status;

export const areSettingsRefreshing = (state) =>
  state.settings.loadAccountSettings.status ===
  LoadSettingsState.REFRESHING_SETTINGS;

// update data operational
export const areAccountSettingsUpdating = (state) =>
  state.settings.updateAccountSettings.status ===
  UpdateSettingsState.UPDATING_SETTINGS;

// get update data selectors
export const getNewDisplayName = (state) =>
  state.settings.updateAccountSettings.params.displayName;

export const getNewCurrency = (state) =>
  state.settings.updateAccountSettings.params.defaultCurrency;

export const getNewPreferredPaymentTarget = (state) =>
  state.settings.updateAccountSettings.params.preferredPaymentTarget;

export const getNewClearingFlexibility = (state) =>
  state.settings.updateAccountSettings.params.clearingFlexibility;

export const getUpdateSettingsErrorMessage = (state) =>
  state.settings.updateAccountSettings.errorMessage;

export const getUpdateSettingsStatus = (state) =>
  state.settings.updateAccountSettings.status;

// change phone number
// params
export const getNewPhoneNumber = (state) =>
  state.settings.changePhoneNumber.newPhoneNumber;

export const getPassword = (state) => state.settings.changePhoneNumber.password;

// operational
export const getChangePhoneNumberStatus = (state) =>
  state.settings.changePhoneNumber.status;
export const getChangePhoneNumberErrorMessage = (state) =>
  state.settings.changePhoneNumber.errorMessage;

// check credentials
export const getCheckCredentialsStatus = (state) =>
  state.settings.checkCredentials.status;
export const getCheckCredentialsErrorMessage = (state) =>
  state.settings.checkCredentials.errorMessage;
export const areCredentialsValid = (state) =>
  state.settings.checkCredentials.validCredentials;

// ///////////////////////////////////////
// pseudo-Action Creators

const getTxStatus = (txId, remainingAttempts = 4) => async (dispatch) => {
  const response = await api.get(`/transactions/${txId}`);

  if (!response.ok && remainingAttempts > 0) {
    dispatch(
      updateAccountSettingsWaitingTXResponse(txId, remainingAttempts - 1)
    );
    setTimeout(() => {
      dispatch(getTxStatus(txId, remainingAttempts - 1));
    }, 5000);
    return;
  }

  if (!response.ok) {
    dispatch(updateAccountSettingsFailed(response.error));
    return;
  }

  const json = await response.json();
  dispatch(updateAccountSettingsSuccess(json.status));
  dispatch(loadAccountSettings());
};

const updateAccountSettings = (settings) => async (dispatch, getState) => {
  dispatch(updateAccountSettingsBegin());

  const { username } = getState().login;

  const {
    displayName,
    preferredPaymentTarget,
    defaultCurrency,
    clearingFlexibility,
  } = settings;

  const toSign = JSON.stringify({
    display_name: displayName,
    preferred_target: preferredPaymentTarget,
    currency_id: defaultCurrency,
    clearing_flexibility: clearingFlexibility,
  });

  dispatch(
    cryptographyModule.signMessage(username, toSign, {
      onSigned: async (signature, publicKey) => {
        const response = await api.post("/user/settings", {
          body: {
            display_name: displayName,
            preferred_target: preferredPaymentTarget,
            currency_id: defaultCurrency,
            clearing_flexibility: clearingFlexibility,
            signature,
            public_key: publicKey,
          },
        });

        if (!response.ok) {
          dispatch(updateAccountSettingsFailed(response.statusText));
          return;
        }

        const json = await response.json();
        dispatch(getTxStatus(json.tx_id));
      },
    })
  );
};

const getChangePhoneNumberTxStatus = (txId, remainingAttempts = 4) => async (
  dispatch
) => {
  const response = await api.get(`/transactions/${txId}`);

  if (!response.ok && remainingAttempts > 0) {
    dispatch(changePhoneNumberWaitingTXResponse(txId, remainingAttempts - 1));
    setTimeout(() => {
      dispatch(getChangePhoneNumberTxStatus(txId, remainingAttempts - 1));
    }, 5000);
    return;
  }

  if (!response.ok) {
    dispatch(changePhoneNumberFailed(response.error));
    return;
  }

  const json = await response.json();
  dispatch(changePhoneNumberSuccess(json.status));
  dispatch(loadAccountSettings());
};

const changePhoneNumber = (data) => async (dispatch) => {
  dispatch(changePhoneNumberBegin());

  const { username, newPhoneNumber, password } = data;

  const toSign = JSON.stringify({
    username: username,
    new_phone_number: newPhoneNumber,
    password: password,
  });

  dispatch(
    cryptographyModule.signMessage(username, toSign, {
      onSigned: async (signature, publicKey) => {
        const response = await api.post("/user/change_phone_number", {
          body: {
            username: username,
            new_phone_number: newPhoneNumber,
            password: password,
            signature,
            public_key: publicKey,
          },
        });

        if (!response.ok) {
          dispatch(changePhoneNumberFailed(response.statusText));
          return;
        }

        const json = await response.json();
        dispatch(getChangePhoneNumberTxStatus(json.tx_id));
      },
    })
  );
};

const checkCredentials = (username, password) => async (dispatch, getState) => {
  dispatch(checkCredentialsReset());
  try {
    dispatch(checkCredentialsBegin());

    const response = await api.post("/check_credentials", {
      body: { username, password },
    });

    if (!response.ok) {
      throw new Error(response.statusText || "Error checking credentials");
    }

    const json = await response.json();
    dispatch(checkCredentialsSuccess(json));
  } catch (e) {
    dispatch(checkCredentialsFailed(e.message || "Network error"));
  }
};

const resetCredentialsCheck = () => async (dispatch, getState) => {
  dispatch(checkCredentialsReset());
};

export const loadAccountSettings = () => async (dispatch, getState) => {
  dispatch(loadSettingsBegin());
  const state = getState();

  if (!areAccountSettingsUpdating(state) && !areSettingsRefreshing(state)) {
    dispatch(queryAccountSettings());
  }
};

const queryAccountSettings = () => async (dispatch, getState) => {
  try {
    const response = await api.get("/user/account");

    if (!response.ok) {
      throw new Error(response.statusText || "Error loading account settings");
    }

    const json = await response.json();
    dispatch(loadSettingsSuccess(json));
  } catch (e) {
    if (!areAccountSettingsUpdating(getState())) {
      dispatch(loadSettingsFailed(e.message || "Network error"));
    }
  }
};

const resetPhoneNumberChange = () => async (dispatch, getState) => {
  dispatch(resetCredentialsCheck());
  dispatch(changePhoneNumberReset());
};

export const actions = {
  updateAccountSettings,
  loadAccountSettings,
  changePhoneNumber,
  setNewPhoneNumber,
  setPassword,
  checkCredentials,
  resetCredentialsCheck,
  resetPhoneNumberChange,
};
