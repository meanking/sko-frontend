import api from "../../api";
import { STORE_INIT } from "./common";
import { TxStatus } from "./creditline";

import * as cryptographyModule from "./cryptography";

// load single iou
export const LoadSingleIOUState = {
  LOADING_SINGLE_IOU: "Loading single iou",
  LOADING_SINGLE_IOU_SUCCESS: "Loading single iou success",
  LOADING_SINGLE_IOU_FAILED: "Loading single iou failed",
  REFRESHING_SINGLE_IOU: "Refreshing single iou",
  UPDATING_SINGLE_IOU: "Updating single iou",
};

// full settle
export const FullSettleIOUState = {
  SETTLING: 0,
  WAITING_TX_RESPONSE: 1,
  SETTLE_SUCCESS: 2,
  SETTLE_FAILED: 3,
};

// partial settle
export const PartialSettleIOUState = {
  SETTLING: 0,
  WAITING_TX_RESPONSE: 1,
  SETTLE_SUCCESS: 2,
  SETTLE_FAILED: 3,
};

// amount settle
export const AmountSettleState = {
  SETTLING: 0,
  WAITING_TX_RESPONSE: 1,
  SETTLE_SUCCESS: 2,
  SETTLE_FAILED: 3,
};

//////////
// Actions

// load single iou
const LOAD_SINGLE_IOU_BEGIN = "sikoba/ious/LOAD_SINGLE_IOU_BEGIN";
const LOAD_SINGLE_IOU_SUCCESS = "sikoba/ious/LOAD_SINGLE_IOU_SUCCESS";
const LOAD_SINGLE_IOU_FAILURE = "sikoba/ious/LOAD_SINGLE_IOU_FAILURE";
const REFRESH_SINGLE_IOU_BEGIN = "sikoba/ious/REFRESH_SINGLE_IOU_BEGIN";
const UPDATE_SINGLE_IOU = "sikoba/ious/UPDATE_SINGLE_IOU";
const INSPECT_IOU = "sikoba/ious/INSPECT_IOU";
const CLEAR_INSPECT_IOU = "sikoba/ious/CLEAR_INSPECT_IOU";

// full settle
const FULL_SETTLE_IOU_BEGIN = "sikoba/ious/FULL_SETTLE_IOU_BEGIN";
const FULL_SETTLE_IOU_WAITING_TX_RESPONSE =
  "sikoba/ious/FULL_SETTLE_IOU_WAITING_TX_RESPONSE";
const FULL_SETTLE_IOU_SUCCESS = "sikoba/ious/FULL_SETTLE_IOU_SUCCESS";
const FULL_SETTLE_IOU_FAILURE = "sikoba/ious/FULL_SETTLE_IOU_FAILURE";

// partial settle
const PARTIAL_SETTLE_IOU_BEGIN = "sikoba/ious/PARTIAL_SETTLE_IOU_BEGIN";
const PARTIAL_SETTLE_IOU_WAITING_TX_RESPONSE =
  "sikoba/ious/PARTIAL_SETTLE_IOU_WAITING_TX_RESPONSE";
const PARTIAL_SETTLE_IOU_SUCCESS = "sikoba/ious/PARTIAL_SETTLE_IOU_SUCCESS";
const PARTIAL_SETTLE_IOU_FAILURE = "sikoba/ious/PARTIAL_SETTLE_IOU_FAILURE";
const PARTIAL_SETTLE_IOU_SET_AMOUNT =
  "sikoba/ious/PARTIAL_SETTLE_IOU_SET_AMOUNT";
const PARTIAL_SETTLE_IOU_RESET = "sikoba/ious/PARTIAL_SETTLE_IOU_RESET";
const PARTIAL_SETTLE_IOU_STATUS_RESET =
  "sikoba/ious/PARTIAL_SETTLE_IOU_STATUS_RESET";

// amount settle
const AMOUNT_SETTLE_BEGIN = "sikoba/ious/AMOUNT_SETTLE_BEGIN";
const AMOUNT_SETTLE_WAITING_TX_RESPONSE =
  "sikoba/ious/AMOUNT_SETTLE_WAITING_TX_RESPONSE";
const AMOUNT_SETTLE_SUCCESS = "sikoba/ious/AMOUNT_SETTLE_SUCCESS";
const AMOUNT_SETTLE_FAILURE = "sikoba/ious/AMOUNT_SETTLE_FAILURE";
const AMOUNT_SETTLE_SET_AMOUNT = "sikoba/ious/AMOUNT_SETTLE_SET_AMOUNT";
const AMOUNT_SETTLE_SET_DEBTOR = "sikoba/ious/AMOUNT_SETTLE_SET_DEBTOR";
const AMOUNT_SETTLE_SET_CURRENCY = "sikoba/ious/AMOUNT_SETTLE_SET_CURRENCY";

//////////
// Reducer

const initialState = {
  //
  loadSingleIOU: { status: null, iou: null, errorMessage: null },
  inspectIOUId: null,
  //
  fullSettleIOU: { status: null, tx: null, errorMessage: null },
  partialSettleIOU: {
    status: null,
    tx: null,
    errorMessage: null,
    params: { amount: null },
  },
  amountSettle: {
    status: null,
    tx: null,
    errorMessage: null,
    params: { amount: null, debtor: null, currency: null },
  },
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    // load single iou
    case LOAD_SINGLE_IOU_BEGIN:
      return {
        ...state,
        loadSingleIOU: {
          ...state.loadSingleIOU,
          status: LoadSingleIOUState.LOADING_SINGLE_IOU,
        },
      };
    case LOAD_SINGLE_IOU_SUCCESS:
      const { iou } = action.payload;

      const formattedIOU = {
        otherUser: iou.other_user,
        creditLineId: iou.credit_line_id,
        amountFormatted: iou.amount_formatted,
        amountFormattedNoSymbol: iou.amount_formatted_no_symbol,
        amountRefundable: iou.amount_today_formatted,
        feesFormatted: iou.fees_formatted,
        dueIn: iou.due_in,
        dueDate: iou.due_date,
        direction: iou.direction,
        id: iou.id,
        status: iou.status,
        type: iou.type,
        origin: iou.origin,
        target: iou.target,
        currency: iou.currency,
      };

      return {
        ...state,
        loadSingleIOU: {
          ...state.loadSingleIOU,
          status: LoadSingleIOUState.LOADING_SINGLE_IOU_SUCCESS,
          iou: formattedIOU,
          errorMessage: null,
        },
      };
    case LOAD_SINGLE_IOU_FAILURE:
      return {
        ...state,
        loadSingleIOU: {
          ...state.loadSingleIOU,
          status: LoadSingleIOUState.LOADING_SINGLE_IOU_FAILED,
          errorMessage: action.payload.error,
        },
      };
    case REFRESH_SINGLE_IOU_BEGIN:
      return {
        ...state,
        loadSingleIOU: {
          ...state.loadSingleIOU,
          status: LoadSingleIOUState.REFRESHING_SINGLE_IOU,
        },
      };
    case UPDATE_SINGLE_IOU:
      return {
        ...state,
        loadSingleIOU: {
          ...state.loadSingleIOU,
          status: LoadSingleIOUState.UPDATING_SINGLE_IOU,
        },
      };
    case INSPECT_IOU:
      const { iouId } = action.payload;
      return { ...state, inspectIOUId: iouId };
    case CLEAR_INSPECT_IOU:
      return {
        ...state,
        inspectIOUId: null,
        loadSingleIOU: { iou: null, status: null, errorMessage: null },
      };

    // full settle iou
    case FULL_SETTLE_IOU_BEGIN:
      return {
        ...state,
        fullSettleIOU: {
          ...state.fullSettleIOU,
          status: FullSettleIOUState.SETTLING,
        },
      };
    case FULL_SETTLE_IOU_WAITING_TX_RESPONSE:
      return {
        ...state,
        fullSettleIOU: {
          ...state.fullSettleIOU,
          tx: {
            ...state.fullSettleIOU.tx,
            id: action.payload.txId,
            remainingAttempts: action.payload.remainingAttempts,
          },
        },
      };
    case FULL_SETTLE_IOU_SUCCESS:
      return {
        ...state,
        fullSettleIOU: {
          ...state.fullSettleIOU,
          status: FullSettleIOUState.SETTLE_SUCCESS,
          tx: { ...state.fullSettleIOU.tx, status: TxStatus.SUCCESS },
        },
      };
    case FULL_SETTLE_IOU_FAILURE:
      return {
        ...state,
        fullSettleIOU: {
          ...state.fullSettleIOU,
          errorMessage: action.payload.error,
          status: FullSettleIOUState.SETTLE_FAILED,
        },
      };

    // partial settle iou
    // params
    // operational
    case PARTIAL_SETTLE_IOU_BEGIN:
      return {
        ...state,
        partialSettleIOU: {
          ...state.partialSettleIOU,
          status: PartialSettleIOUState.SETTLING,
        },
      };
    case PARTIAL_SETTLE_IOU_WAITING_TX_RESPONSE:
      return {
        ...state,
        partialSettleIOU: {
          ...state.partialSettleIOU,
          tx: {
            ...state.partialSettleIOU.tx,
            id: action.payload.txId,
            remainingAttempts: action.payload.remainingAttempts,
          },
        },
      };
    case PARTIAL_SETTLE_IOU_SUCCESS:
      return {
        ...state,
        partialSettleIOU: {
          ...state.partialSettleIOU,
          status: PartialSettleIOUState.SETTLE_SUCCESS,
          tx: { ...state.partialSettleIOU.tx, status: TxStatus.SUCCESS },
        },
      };
    case PARTIAL_SETTLE_IOU_FAILURE:
      return {
        ...state,
        partialSettleIOU: {
          ...state.partialSettleIOU,
          errorMessage: action.payload.error,
          status: PartialSettleIOUState.SETTLE_FAILED,
        },
      };
    case PARTIAL_SETTLE_IOU_SET_AMOUNT:
      return {
        ...state,
        partialSettleIOU: {
          ...state.partialSettleIOU,
          params: {
            ...state.partialSettleIOU.params,
            amount: action.payload.amount,
          },
        },
      };
    case PARTIAL_SETTLE_IOU_RESET:
      return {
        ...state,
        partialSettleIOU: {
          status: null,
          tx: null,
          errorMessage: null,
          params: { amount: null },
        },
      };
    case PARTIAL_SETTLE_IOU_STATUS_RESET:
      return {
        ...state,
        partialSettleIOU: { ...state.partialSettleIOU, status: null },
      };

    // amount settle
    // params
    // operational
    case AMOUNT_SETTLE_BEGIN:
      return {
        ...state,
        amountSettle: {
          ...state.amountSettle,
          status: AmountSettleState.SETTLING,
        },
      };
    case AMOUNT_SETTLE_WAITING_TX_RESPONSE:
      return {
        ...state,
        amountSettle: {
          ...state.amountSettle,
          tx: {
            ...state.amountSettle.tx,
            id: action.payload.txId,
            remainingAttempts: action.payload.remainingAttempts,
          },
        },
      };
    case AMOUNT_SETTLE_SUCCESS:
      return {
        ...state,
        amountSettle: {
          ...state.amountSettle,
          status: AmountSettleState.SETTLE_SUCCESS,
          tx: { ...state.amountSettle.tx, status: TxStatus.SUCCESS },
        },
      };
    case AMOUNT_SETTLE_FAILURE:
      return {
        ...state,
        amountSettle: {
          ...state.amountSettle,
          errorMessage: action.payload.error,
          status: AmountSettleState.SETTLE_FAILED,
        },
      };
    case AMOUNT_SETTLE_SET_AMOUNT:
      return {
        ...state,
        amountSettle: {
          ...state.amountSettle,
          params: {
            ...state.amountSettle.params,
            amount: action.payload.amount,
          },
        },
      };
    case AMOUNT_SETTLE_SET_CURRENCY:
      return {
        ...state,
        amountSettle: {
          ...state.amountSettle,
          params: {
            ...state.amountSettle.params,
            currency: action.payload.currency,
          },
        },
      };
    case AMOUNT_SETTLE_SET_DEBTOR:
      return {
        ...state,
        amountSettle: {
          ...state.amountSettle,
          params: {
            ...state.amountSettle.params,
            debtor: action.payload.debtor,
          },
        },
      };

    case STORE_INIT:
      return initialState;
    default:
      return state;
  }
}

////////////
// Selectors

// load single iou
export const isSingleIOULoading = (state) =>
  state.iou.loadSingleIOU.status === LoadSingleIOUState.LOADING_SINGLE_IOU;

export const isSingleIOULoaded = (state) =>
  state.iou.loadSingleIOU.iou !== null;

export const isSingleIOURefreshing = (state) =>
  state.iou.loadSingleIOU.status === LoadSingleIOUState.REFRESHING_SINGLE_IOU;

export const isSingleIOUUpdating = (state) =>
  state.iou.loadSingleIOU.status === LoadSingleIOUState.UPDATING_SINGLE_IOU;

export const getIOU = (state) => state.iou.loadSingleIOU.iou;

export const getLoadSingleIOUStatus = (state) =>
  state.iou.loadSingleIOU.errorMessage;

export const getInspectIOUId = (state) => state.iou.inspectIOUId;

// full settle iou
export const getFullSettleIOUStatus = (state) => state.iou.fullSettleIOU.status;
export const getFullSettleIOUErrorMessage = (state) =>
  state.iou.fullSettleIOU.errorMessage;

// partial settle iou
export const getPartialSettleIOUStatus = (state) =>
  state.iou.partialSettleIOU.status;
export const getPartialSettleIOUErrorMessage = (state) =>
  state.iou.partialSettleIOU.errorMessage;
export const getPartialSettleIOUAmount = (state) =>
  state.iou.partialSettleIOU.params.amount;

// amount settle
export const getAmountSettleStatus = (state) => state.iou.amountSettle.status;
export const getAmountSettleErrorMessage = (state) =>
  state.iou.amountSettle.errorMessage;

///////////////////
// Action Creators

// load single iou
const loadSingleIOUBegin = () => ({
  type: LOAD_SINGLE_IOU_BEGIN,
});

const loadSingleIOUSuccess = (iouData) => ({
  type: LOAD_SINGLE_IOU_SUCCESS,
  payload: iouData,
});

const loadSingleIOUFailure = (error) => ({
  type: LOAD_SINGLE_IOU_FAILURE,
  payload: { error },
});

const refreshSingleIOUBegin = () => ({
  type: REFRESH_SINGLE_IOU_BEGIN,
});

const updateSingleIOUBegin = () => ({
  type: UPDATE_SINGLE_IOU,
});

const setInspectIOU = (iouId) => ({
  type: INSPECT_IOU,
  payload: { iouId },
});

const clearInspectIOU = () => ({
  type: CLEAR_INSPECT_IOU,
});

// full settle iou
export const fullSettleIOUBegin = () => ({
  type: FULL_SETTLE_IOU_BEGIN,
});

export const fullSettleWaitingTXResponse = (txId, remainingAttempts) => ({
  type: FULL_SETTLE_IOU_WAITING_TX_RESPONSE,
  payload: { txId, remainingAttempts },
});

export const fullSettleIOUSuccess = (status) => ({
  type: FULL_SETTLE_IOU_SUCCESS,
  payload: { status },
});

export const fullSettleIOUFailure = (error) => ({
  type: FULL_SETTLE_IOU_FAILURE,
  payload: { error },
});

// partial settle iou
export const partialSettleIOUBegin = () => ({
  type: PARTIAL_SETTLE_IOU_BEGIN,
});

export const partialSettleWaitingTXResponse = (txId, remainingAttempts) => ({
  type: PARTIAL_SETTLE_IOU_WAITING_TX_RESPONSE,
  payload: { txId, remainingAttempts },
});

export const partialSettleIOUSuccess = (status) => ({
  type: PARTIAL_SETTLE_IOU_SUCCESS,
  payload: { status },
});

export const partialSettleIOUFailure = (error) => ({
  type: PARTIAL_SETTLE_IOU_FAILURE,
  payload: { error },
});

export const partialSettleIOUSetAmount = (amount) => ({
  type: PARTIAL_SETTLE_IOU_SET_AMOUNT,
  payload: { amount },
});

export const resetPartialSettleIOU = () => ({
  type: PARTIAL_SETTLE_IOU_RESET,
});
export const resetPartialSettleIOUStatus = () => ({
  type: PARTIAL_SETTLE_IOU_STATUS_RESET,
});

// amount settle iou
export const amountSettleBegin = () => ({
  type: AMOUNT_SETTLE_BEGIN,
});

export const amountSettleWaitingTXResponse = (txId, remainingAttempts) => ({
  type: AMOUNT_SETTLE_WAITING_TX_RESPONSE,
  payload: { txId, remainingAttempts },
});

export const amountSettleSuccess = (status) => ({
  type: AMOUNT_SETTLE_SUCCESS,
  payload: { status },
});

export const amountSettleFailure = (error) => ({
  type: AMOUNT_SETTLE_FAILURE,
  payload: { error },
});

export const amountSettleSetAmount = (amount) => ({
  type: AMOUNT_SETTLE_SET_AMOUNT,
  payload: { amount },
});

export const amountSettleSetCurrency = (currency) => ({
  type: AMOUNT_SETTLE_SET_CURRENCY,
  payload: { currency },
});

export const amountSettleSetDebtor = (debtor) => ({
  type: AMOUNT_SETTLE_SET_DEBTOR,
  payload: { debtor },
});

/////////////////////////
// pseudo Action-Creators

// load single iou
const queryIOU = (iouId) => async (dispatch, getState) => {
  const state = getState();
  if (iouId !== null && iouId !== undefined) {
    try {
      const response = await api.get(`/iou/${iouId}`);

      if (!response.ok) {
        throw new error(response.statusText || "Error loading single IOU.");
      }

      const json = await response.json();
      dispatch(loadSingleIOUSuccess(json));
    } catch (e) {
      if (!isSingleIOUUpdating(state)) {
        dispatch(loadSingleIOUFailure(e.message || "Network error"));
      }
    }
  } else {
    dispatch(loadSingleIOUFailure("IOU ID not assigned."));
  }
};

const loadSingleIOU = () => async (dispatch, getState) => {
  dispatch(loadSingleIOUBegin());
  const state = getState();
  if (!isSingleIOUUpdating(state) && !isSingleIOURefreshing(state)) {
    dispatch(queryIOU(state.iou.inspectIOUId));
  }
};

const updateSingleIOU = () => async (dispatch, getState) => {
  const state = getState();
  if (!isSingleIOURefreshing(state) && !isSingleIOULoading(state)) {
    dispatch(queryIOU(state.iou.inspectIOUId));
    dispatch(updateSingleIOUBegin());
  }
};

const refreshSingleIOU = () => async (dispatch, getState) => {
  const state = getState();
  if (!isSingleIOUUpdating(state) && !isSingleIOULoading(state)) {
    dispatch(queryIOU(state.iou.inspectIOUId));
  }
  dispatch(refreshSingleIOUBegin());
};

// inspect iou
const inspectIOU = (iouId) => async (dispatch, getState) => {
  dispatch(clearInspectIOU());
  dispatch(setInspectIOU(iouId));
};

// full settle iou
const getFullSettleIOUTxStatus = (txId, remainingAttempts = 4) => async (
  dispatch
) => {
  const response = await api.get(`/transactions/${txId}`);

  if (!response.ok && remainingAttempts > 0) {
    dispatch(fullSettleWaitingTXResponse(txId, remainingAttempts - 1));
    setTimeout(() => {
      dispatch(getFullSettleIOUTxStatus(txId, remainingAttempts - 1));
    }, 5000);
    return;
  }

  if (!response.ok) {
    dispatch(fullSettleIOUFailure(response.error));
    return;
  }

  const json = await response.json();
  dispatch(fullSettleIOUSuccess(json.status));
};

const fullSettleIOU = (settleIOU) => async (dispatch) => {
  const { settler, iouId } = settleIOU;
  dispatch(fullSettleIOUBegin());

  const toSign = JSON.stringify({ settler: settler, iou_id: iouId });
  dispatch(
    cryptographyModule.signMessage(settler, toSign, {
      onSigned: async (signature, publicKey) => {
        const response = await api.post("/full_settle_iou", {
          body: {
            settler: settler,
            iou_id: iouId,
            signature,
            public_key: publicKey,
          },
        });

        if (!response.ok) {
          dispatch(fullSettleIOUFailure(response.statusText));
          return;
        }

        const json = await response.json();
        dispatch(getFullSettleIOUTxStatus(json.tx_id));
      },
    })
  );
};

// partial settle iou
const getPartialSettleIOUTxStatus = (txId, remainingAttempts = 4) => async (
  dispatch
) => {
  const response = await api.get(`/transactions/${txId}`);

  if (!response.ok && remainingAttempts > 0) {
    dispatch(partialSettleWaitingTXResponse(txId, remainingAttempts - 1));
    setTimeout(() => {
      dispatch(getPartialSettleIOUTxStatus(txId, remainingAttempts - 1));
    }, 5000);
    return;
  }

  if (!response.ok) {
    dispatch(partialSettleIOUFailure(response.error));
    return;
  }

  const json = await response.json();
  dispatch(partialSettleIOUSuccess(json.status));
};

const partialSettleIOU = (settleIOU) => async (dispatch) => {
  const { settler, iouId, amount } = settleIOU;
  dispatch(partialSettleIOUBegin());

  const toSign = JSON.stringify({
    settler: settler,
    iou_id: iouId,
    amount: amount,
  });

  dispatch(
    cryptographyModule.signMessage(settler, toSign, {
      onSigned: async (signature, publicKey) => {
        const response = await api.post("/partial_settle_iou", {
          body: {
            settler: settler,
            iou_id: iouId,
            amount: amount,
            signature,
            public_key: publicKey,
          },
        });

        if (!response.ok) {
          dispatch(partialSettleIOUFailure(response.statusText));
          return;
        }

        const json = await response.json();
        dispatch(getPartialSettleIOUTxStatus(json.tx_id));
      },
    })
  );
};

// amount settle iou
const getAmountSettleTxStatus = (txId, remainingAttempts = 4) => async (
  dispatch
) => {
  const response = await api.get(`/transactions/${txId}`);

  if (!response.ok && remainingAttempts > 0) {
    dispatch(amountSettleWaitingTXResponse(txId, remainingAttempts - 1));
    setTimeout(() => {
      dispatch(getAmountSettleTxStatus(txId, remainingAttempts - 1));
    }, 5000);
    return;
  }

  if (!response.ok) {
    dispatch(amountSettleFailure(response.error));
    return;
  }

  const json = await response.json();
  dispatch(amountSettleSuccess(json.status));
};

const amountSettle = (amountSettle) => async (dispatch) => {
  const { settler, debtor, amount, currency } = amountSettle;
  dispatch(amountSettleBegin());

  const toSign = JSON.stringify({
    settler: settler,
    settlee: debtor,
    currency_id: currency.id,
    amount: amount,
  });

  dispatch(
    cryptographyModule.signMessage(settler, toSign, {
      onSigned: async (signature, publicKey) => {
        const response = await api.post("/amount_settle", {
          body: {
            settler: settler,
            settlee: debtor,
            currency_id: currency.id,
            amount: amount,
            signature,
            public_key: publicKey,
          },
        });

        if (!response.ok) {
          dispatch(amountSettleFailure(response.statusText));
          return;
        }

        const json = await response.json();
        dispatch(getAmountSettleTxStatus(json.tx_id));
      },
    })
  );
};

export const actions = {
  loadSingleIOU,
  updateSingleIOU,
  refreshSingleIOU,
  inspectIOU,
  fullSettleIOU,
  partialSettleIOU,
  resetPartialSettleIOU,
  resetPartialSettleIOUStatus,
  amountSettle,
};
