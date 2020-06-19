// ///////////////////////////////////////
// Payment module
import api from "../../api";

import * as cryptographyModule from "./cryptography";

// create payment
export const CreatePaymentState = {
  CREATING: "Creating payment",
  WAITING_TX_RESPONSE: "Waiting Tx response",
  CREATE_SUCCESS: "Create payment success",
  CREATE_FAILED: "Create payment failed",
};

export const TxStatus = {
  FAILED: 0,
  SUCCESS: 1,
};

// load payment options
export const PaymentOptionsState = {
  LOADING_PAYMENT_OPTIONS: "Loading payment options",
  LOADING_PAYMENT_OPTIONS_SUCCESS: "Loading payment options success",
  LOADING_PAYMENT_OPTIONS_FAILED: "Loading payment options failed",
  REFRESHING_PAYMENT_OPTIONS: "Refreshing payment options",
  UPDATING_PAYMENT_OPTIONS: "Updating payment options",
};

// load payment capacity
export const PaymentCapacityState = {
  LOADING_PAYMENT_CAPACITY: "Loading payment capacity",
  LOADING_PAYMENT_CAPACITY_SUCCESS: "Loading payment capacity success",
  LOADING_PAYMENT_CAPACITY_FAILED: "Loading payment capacity failed",
  REFRESHING_PAYMENT_CAPACITY: "Refreshing payment capacity",
  UPDATING_PAYMENT_CAPACITY: "Updating payment capacity",
};

// ///////////////////////////////////////
// Actions

// create payment
// set params
const SET_RECIPIENT = "sikoba/payment/SET_RECIPIENT";
const SET_CURRENCY = "sikoba/payment/SET_CURRENCY";
const SET_AMOUNT = "sikoba/payment/SET_AMOUNT";
const SET_TIME_TARGET = "sikoba/payment/SET_TIME_TARGET";
const SET_PAYMENT_OPTION = "sikoba/payment/SET_PAYMENT_OPTION";

// operational
const CREATE_PAYMENT_BEGIN = "sikoba/payment/CREATE_PAYMENT_BEGIN";
const CREATE_PAYMENT_WAITING_TX_RESPONSE =
  "sikoba/payment/CREATE_PAYMENT_WAITING_TX_RESPONSE";
const CREATE_PAYMENT_SUCCESS = "sikoba/payment/CREATE_PAYMENT_SUCCESS";
const CREATE_PAYMENT_FAILURE = "sikoba/payment/CREATE_PAYMENT_FAILURE";
const CREATE_PAYMENT_RESET = "sikoba/payment/CREATE_PAYMENT_RESET";
const CREATE_PAYMENT_RESET_STATUS =
  "sikoba/payment/CREATE_PAYMENT_RESET_STATUS";

// Load payment options
const LOAD_PAYMENT_OPTIONS_BEGIN = "sikoba/payment/LOAD_PAYMENT_OPTIONS_BEGIN";
const LOAD_PAYMENT_OPTIONS_SUCCESS =
  "sikoba/payment/LOAD_PAYMENT_OPTIONS_SUCCESS";
const LOAD_PAYMENT_OPTIONS_FAILURE =
  "sikoba/payment/LOAD_PAYMENT_OPTIONS_FAILURE";
const REFRESH_PAYMENT_OPTIONS_BEGIN =
  "sikoba/payment/REFRESH_PAYMENT_OPTIONS_BEGIN";
const UPDATE_PAYMENT_OPTIONS = "sikoba/payment/UPDATE_PAYMENT_OPTIONS";

// Load payment capacity
const LOAD_PAYMENT_CAPACITY_BEGIN =
  "sikoba/payment/LOAD_PAYMENT_CAPACITY_BEGIN";
const LOAD_PAYMENT_CAPACITY_SUCCESS =
  "sikoba/payment/LOAD_PAYMENT_CAPACITY_SUCCESS";
const LOAD_PAYMENT_CAPACITY_FAILURE =
  "sikoba/payment/LOAD_PAYMENT_CAPACITY_FAILURE";
const REFRESH_PAYMENT_CAPACITY_BEGIN =
  "sikoba/payment/REFRESH_PAYMENT_CAPACITY_BEGIN";
const UPDATE_PAYMENT_CAPACITY = "sikoba/payment/UPDATE_PAYMENT_CAPACITY";

// ///////////////////////////////////////
// Reducer

const initialState = {
  createPayment: {
    params: {
      recipient: null,
      currency: { id: null, isoCode: null, symbol: null, fullName: null },
      amount: null,
      timeTarget: null,
      paymentOption: null,
    },
    status: null,
    tx: null,
    errorMessage: null,
  },
  loadPaymentOptions: {
    paymentOptions: null,
    errorMessage: null,
    status: null,
  },
  loadPaymentCapacity: {
    paymentCapacity: null,
    errorMessage: null,
    status: null,
  },
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    // create payment
    // setting params
    case SET_RECIPIENT:
      return {
        ...state,
        createPayment: {
          ...state.createPayment,
          params: {
            ...state.createPayment.params,
            recipient: action.payload.recipient,
          },
        },
      };
    case SET_CURRENCY:
      const { currency } = action.payload;
      return {
        ...state,
        createPayment: {
          ...state.createPayment,
          params: {
            ...state.createPayment.params,
            currency: {
              id: currency.id,
              isoCode: currency.iso_code,
              fullName: currency.full_name,
              symbol: currency.symbol,
            },
          },
        },
      };
    case SET_AMOUNT:
      return {
        ...state,
        createPayment: {
          ...state.createPayment,
          params: {
            ...state.createPayment.params,
            amount: action.payload.amount,
          },
        },
      };
    case SET_TIME_TARGET:
      return {
        ...state,
        createPayment: {
          ...state.createPayment,
          params: {
            ...state.createPayment.params,
            timeTarget: action.payload.timeTarget,
          },
        },
      };
    case SET_PAYMENT_OPTION:
      const { paymentOption } = action.payload;

      return {
        ...state,
        createPayment: {
          ...state.createPayment,
          params: {
            ...state.createPayment.params,
            paymentOption: paymentOption,
          },
        },
      };

    // operational
    case CREATE_PAYMENT_BEGIN:
      return {
        ...state,
        createPayment: {
          ...state.createPayment,
          tx: null,
          status: CreatePaymentState.CREATING,
        },
      };

    case CREATE_PAYMENT_WAITING_TX_RESPONSE:
      return {
        ...state,
        createPayment: {
          ...state.createPayment,
          tx: {
            ...state.createPayment.tx,
            id: action.payload.txId,
            remainingAttempts: action.payload.remainingAttempts,
          },
          status: CreatePaymentState.WAITING_TX_RESPONSE,
        },
      };

    case CREATE_PAYMENT_SUCCESS:
      return {
        ...state,
        createPayment: {
          ...state.createPayment,
          tx: {
            ...state.createPayment.tx,
            status: TxStatus.SUCCESS,
          },
          status: CreatePaymentState.CREATE_SUCCESS,
          newPayment: action.payload.newPayment,
        },
      };

    case CREATE_PAYMENT_FAILURE:
      return {
        ...state,
        createPayment: {
          ...state.createPayment,
          status: CreatePaymentState.CREATE_FAILED,
          errorMessage: action.payload.error,
        },
      };

    // Load payment paths
    case LOAD_PAYMENT_OPTIONS_BEGIN:
      return {
        ...state,
        loadPaymentOptions: {
          ...state.loadPaymentOptions,
          status: PaymentOptionsState.LOADING_PAYMENT_OPTIONS,
        },
      };
    case LOAD_PAYMENT_OPTIONS_SUCCESS:
      const keysFormattedFn = (obj) => {
        return {
          amountFormatted: obj.amount_formatted,
          amountFormattedNoSymbol: obj.amount_formatted_no_symbol,
          conversionFeesFormatted: obj.conversion_fees_formatted,
          currency: {
            currencyId: obj.currencyId,
            currencyIso: obj.currency_iso,
          },
          direct: obj.direct,
          feesFormatted: obj.fees_formatted,
          maxAmountFormatted: obj.max_amount_formatted,
          oneTimeFeesFormatted: obj.one_time_fee_formatted,
          path: obj.path,
          refundableFeeFormatted: obj.refundable_fee_formatted,
          target: obj.target,
          through: obj.through,
        };
      };

      const formattedKeysPayload = action.payload.paymentOptions.map((option) =>
        keysFormattedFn(option)
      );

      return {
        ...state,
        loadPaymentOptions: {
          ...state.loadPaymentOptions,
          status: PaymentOptionsState.LOADING_PAYMENT_OPTIONS_SUCCESS,
          paymentOptions: formattedKeysPayload,
        },
      };
    case LOAD_PAYMENT_OPTIONS_FAILURE:
      return {
        ...state,
        loadPaymentOptions: {
          ...state.loadPaymentOptions,
          status: PaymentOptionsState.LOADING_PAYMENT_OPTIONS_FAILED,
          error: action.payload.error,
        },
      };

    case REFRESH_PAYMENT_OPTIONS_BEGIN:
      return {
        ...state,
        loadPaymentOptions: {
          ...state.loadPaymentOptions,
          status: PaymentOptionsState.REFRESHING_PAYMENT_OPTIONS,
        },
      };

    case UPDATE_PAYMENT_OPTIONS:
      return {
        ...state,
        loadPaymentOptions: {
          ...state.loadPaymentOptions,
          status: PaymentOptionsState.UPDATING_PAYMENT_OPTIONS,
        },
      };

    // Load payment capacity
    case LOAD_PAYMENT_CAPACITY_BEGIN:
      return {
        ...state,
        loadPaymentCapacity: {
          ...state.loadPaymentCapacity,
          status: PaymentCapacityState.LOADING_PAYMENT_CAPACITY,
        },
      };
    case LOAD_PAYMENT_CAPACITY_SUCCESS:
      return {
        ...state,
        loadPaymentCapacity: {
          ...state.loadPaymentCapacity,
          status: PaymentCapacityState.LOADING_PAYMENT_CAPACITY_SUCCESS,
          paymentCapacity: action.payload.paymentCapacity,
        },
      };
    case LOAD_PAYMENT_CAPACITY_FAILURE:
      return {
        ...state,
        loadPaymentCapacity: {
          ...state.loadPaymentCapacity,
          status: PaymentCapacityState.LOADING_PAYMENT_CAPACITY_FAILED,
          error: action.payload.error,
        },
      };

    case REFRESH_PAYMENT_CAPACITY_BEGIN:
      return {
        ...state,
        loadPaymentCapacity: {
          ...state.loadPaymentCapacity,
          status: PaymentCapacityState.REFRESHING_PAYMENT_CAPACITY,
        },
      };

    case UPDATE_PAYMENT_CAPACITY:
      return {
        ...state,
        loadPaymentCapacity: {
          ...state.loadPaymentCapacity,
          status: PaymentCapacityState.UPDATING_PAYMENT_CAPACITY,
        },
      };

    case CREATE_PAYMENT_RESET:
      return initialState;

    case CREATE_PAYMENT_RESET_STATUS:
      return {
        ...state,
        status: null,
      };
    default:
      return state;
  }
}

// ///////////////////////////////////////
// Action Creators

// create payment
// set params
export const setNewPaymentRecipient = (recipient) => ({
  type: SET_RECIPIENT,
  payload: { recipient },
});

export const setNewPaymentCurrency = (currency) => ({
  type: SET_CURRENCY,
  payload: { currency },
});

export const setNewPaymentAmount = (amount) => ({
  type: SET_AMOUNT,
  payload: { amount },
});

export const setNewPaymentTimeTarget = (timeTarget) => ({
  type: SET_TIME_TARGET,
  payload: { timeTarget },
});

export const selectPaymentOption = (paymentOption) => ({
  type: SET_PAYMENT_OPTION,
  payload: { paymentOption },
});

// operational
export const createPaymentBegin = () => ({
  type: CREATE_PAYMENT_BEGIN,
});

export const createPaymentWaitingTXResponse = (txId, remainingAttempts) => ({
  type: CREATE_PAYMENT_WAITING_TX_RESPONSE,
  payload: { txId, remainingAttempts },
});

export const createPaymentSuccess = (status, newPayment) => ({
  type: CREATE_PAYMENT_SUCCESS,
  payload: { status, newPayment },
});

export const createPaymentFailure = (error) => ({
  type: CREATE_PAYMENT_FAILURE,
  payload: { error },
});

export const resetCreatePayment = () => ({
  type: CREATE_PAYMENT_RESET,
});

export const resetCreatePaymentStatus = () => ({
  type: CREATE_PAYMENT_RESET_STATUS,
});

// load payment options
export const loadPaymentOptionsBegin = () => ({
  type: LOAD_PAYMENT_OPTIONS_BEGIN,
});

export const loadPaymentOptionsSuccess = (paymentOptions) => ({
  type: LOAD_PAYMENT_OPTIONS_SUCCESS,
  payload: { paymentOptions },
});

export const loadPaymentOptionsFailed = (error) => ({
  type: LOAD_PAYMENT_OPTIONS_FAILURE,
  payload: { error },
});

const refreshPaymentOptionsBegin = () => ({
  type: REFRESH_PAYMENT_OPTIONS_BEGIN,
});

// load payment capacity
export const loadPaymentCapacityBegin = () => ({
  type: LOAD_PAYMENT_CAPACITY_BEGIN,
});

export const loadPaymentCapacitySuccess = (paymentCapacity) => ({
  type: LOAD_PAYMENT_CAPACITY_SUCCESS,
  payload: { paymentCapacity },
});

export const loadPaymentCapacityFailed = (error) => ({
  type: LOAD_PAYMENT_CAPACITY_FAILURE,
  payload: { error },
});

//////////////////////////////////////////
// Selectors

export const getPaymentRecipient = (state) =>
  state.payment.createPayment.params.recipient;

export const getPaymentCurrency = (state) =>
  state.payment.createPayment.params.currency;

export const getPaymentAmount = (state) =>
  state.payment.createPayment.params.amount;

export const getPaymentTimeTarget = (state) =>
  state.payment.createPayment.params.timeTarget;

export const getSelectedPaymentOption = (state) =>
  state.payment.createPayment.params.paymentOption;

export const getCreatePaymentStatus = (state) =>
  state.payment.createPayment.status;

// loading payment options
export const arePaymentOptionsLoading = (state) =>
  state.payment.loadPaymentOptions.status ===
  PaymentOptionsState.LOADING_PAYMENT_OPTIONS;

export const arePaymentOptionsLoadedSuccess = (state) =>
  typeof state.payment.loadPaymentOptions.paymentOptions === "object" &&
  typeof state.payment.loadPaymentOptions.paymentOptions !== null &&
  typeof state.payment.loadPaymentOptions.paymentOptions !== undefined;

export const arePaymentOptionsUpdating = (state) =>
  state.payment.loadPaymentOptions.status ===
  PaymentOptionsState.UPDATING_PAYMENT_OPTIONS;

export const arePaymentOptionsRefreshing = (state) =>
  state.payment.loadPaymentOptions.status ===
  PaymentOptionsState.REFRESHING_PAYMENT_OPTIONS;

export const getPaymentOptions = (state) =>
  state.payment.loadPaymentOptions.paymentOptions;

export const getLoadingPaymentOptionsStatus = (state) =>
  state.payment.loadPaymentOptions.status;

// load payment capacitty
export const isPaymentCapacityLoading = (state) =>
  state.payment.loadPaymentCapacity.status ===
  PaymentCapacityState.LOADING_PAYMENT_CAPACITY;

export const arePaymentCapacityLoadedSuccess = (state) =>
  typeof state.payment.loadPaymentCapacity.paymentCapacity === "object" &&
  typeof state.payment.loadPaymentCapacity.paymentCapacity !== null &&
  typeof state.payment.loadPaymentCapacity.paymentCapacity !== undefined;

export const isPaymentCapacityUpdating = (state) =>
  state.payment.loadPaymentCapacity.status ===
  PaymentCapacityState.UPDATING_PAYMENT_CAPACITY;

export const isPaymentCapacityRefreshing = (state) =>
  state.payment.loadPaymentCapacity.status ===
  PaymentCapacityState.REFRESHING_PAYMENT_CAPACITY;

export const getPaymentCapacity = (state) =>
  state.payment.loadPaymentCapacity.paymentCapacity;

export const getLoadingPaymentCapacityStatus = (state) =>
  state.payment.loadPaymentCapacity.status;

// ///////////////////////////////////////
// pseudo-Action Creators

const getTxStatus = (txId, remainingAttempts = 4) => async (dispatch) => {
  const response = await api.get(`/transactions/${txId}`);

  if (!response.ok && remainingAttempts > 0) {
    dispatch(createPaymentWaitingTXResponse(txId, remainingAttempts - 1));
    setTimeout(() => {
      dispatch(getTxStatus(txId, remainingAttempts - 1));
    }, 5000);
    return;
  }

  if (!response.ok) {
    dispatch(createPaymentFailure(response.error));
    return;
  }

  const json = await response.json();
  dispatch(createPaymentSuccess(json.status, json.newPayment));
};

export const createPayment = (payment) => async (dispatch) => {
  dispatch(createPaymentBegin());

  const { payer, recipient, amount, target, path } = payment;

  const toSign = JSON.stringify({
    payer: payer,
    payee: recipient,
    amount: amount,
    target: target,
    path: path,
  });

  dispatch(
    cryptographyModule.signMessage(payer, toSign, {
      onSigned: async (signature, publicKey) => {
        const response = await api.post("/create_payment", {
          body: {
            payer: payer,
            payee: recipient,
            amount: amount,
            target: target,
            path: path,
            signature,
            public_key: publicKey,
          },
        });

        if (!response.ok) {
          dispatch(createPaymentFailure(response.statusText));
          return;
        }

        const json = await response.json();
        dispatch(getTxStatus(json.tx_id));
      },
    })
  );
};

// load payment options
export const loadPaymentOptions = () => async (dispatch, getState) => {
  dispatch(loadPaymentOptionsBegin());
  const state = getState();

  try {
    const response = await api.post("/payment_options", {
      body: {
        payee: getPaymentRecipient(state),
        target: getPaymentTimeTarget(state),
        amount: getPaymentAmount(state),
        currency_id: getPaymentCurrency(state).id,
      },
    });

    if (!response.ok) {
      throw new Error(response.statusText || "Error loading credit lines.");
    }

    const json = await response.json();
    dispatch(loadPaymentOptionsSuccess(json.payment_options));
  } catch (e) {
    if (!arePaymentOptionsUpdating(state)) {
      dispatch(loadPaymentOptionsFailed(e.message || "Network error"));
    }
  }
};

export const loadPaymentCapacity = (username) => async (dispatch, getState) => {
  dispatch(loadPaymentCapacityBegin());
  const state = getState();

  try {
    const response = await api.get(`/payment_capacity/${username}`);

    if (!response.ok) {
      dispatch(loadPaymentCapacityFailed(response.error));
    }

    const json = await response.json();
    dispatch(loadPaymentCapacitySuccess(json.payment_capacity));
  } catch (e) {
    if (!isPaymentCapacityUpdating(state)) {
      dispatch(loadPaymentCapacityFailed(e.message || "Network error"));
    }
  }
};

export const actions = {};
