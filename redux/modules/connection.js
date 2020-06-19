// ///////////////////////////////////////
// Connection module

import every from "lodash/every";
import some from "lodash/some";
import isNumber from "lodash/isNumber";
import isString from "lodash/isString";
import isEmpty from "lodash/isEmpty";
import api from "../../api";
import { STORE_INIT } from "./common";

import * as cryptographyModule from "./cryptography";

// send connection request
export const CreateConnectionState = {
  CREATING: 0,
  WAITING_TX_RESPONSE: 1,
  CREATE_SUCCESS: 2,
  CREATE_FAILED: 3,
};

export const TxStatus = {
  FAILED: 0,
  SUCCESS: 1,
};

// accept connection
export const AcceptConnectionState = {
  ACCEPTING: 0,
  WAITING_TX_RESPONSE: 1,
  ACCEPT_SUCCESS: 2,
  ACCEPT_FAILED: 3,
};

// reject connect
export const RejectConnectionState = {
  REJECTING: 0,
  WAITING_TX_RESPONSE: 1,
  REJECT_SUCCESS: 2,
  REJECT_FAILED: 3,
};

// cancel connection
export const CancelConnectionState = {
  CANCELING: 0,
  WAITING_TX_RESPONSE: 1,
  CANCEL_SUCCESS: 2,
  CANCEL_FAILED: 3,
};

// reactivate connection
export const ReactivateConnectionState = {
  REACTIVATING: 0,
  WAITING_TX_RESPONSE: 1,
  REACTIVATE_SUCCESS: 2,
  REACTIVATE_FAILED: 3,
};

// all connections
export const ConnectionState = {
  LOADING_CONNECTIONS: "Loading connections",
  LOADING_CONNECTIONS_SUCCESS: "Loading connections success",
  LOADING_CONNECTIONS_FAILED: "Loading connections failed",
  REFRESHING_CONNECTIONS: "Refreshing connections",
  UPDATING_CONNECTIONS: "Updating connections",
};

// get single connection
export const SingleConnectionState = {
  LOADING_SINGLE_CONNECTION: "Loading single connection",
  LOADING_SINGLE_CONNECTION_SUCCESS: "Loading single connection success",
  LOADING_SINGLE_CONNECTION_FAILED: "Loading single connection failed",
  REFRESHING_SINGLE_CONNECTION: "Refreshing single connection",
  UPDATING_SINGLE_CONNECTION: "Updating single connection",
};

// ///////////////////////////////////////
// Actions

// create connection request
const SET_RECEIVER = "sikoba/connection/SET_RECEIVER";

const CREATE_CONNECTION_BEGIN = "sikoba/connection/CREATE_CONNECTION_BEGIN";
const CREATE_CONNECTION_WAITING_TX_RESPONSE =
  "sikoba/connection/CREATE_CONNECTION_WAITING_TX_RESPONSE";
const CREATE_CONNECTION_SUCCESS = "sikoba/connection/CREATE_CONNECTION_SUCCESS";
const CREATE_CONNECTION_FAILURE = "sikoba/connection/CREATE_CONNECTION_FAILURE";
const CREATE_CONNECTION_RESET = "sikoba/connection/CREATE_CONNECTION_RESET";
const CREATE_CONNECTION_RESET_STATUS =
  "sikoba/connection/CREATE_CONNECTION_RESET_STATUS";

// accept connection
const ACCEPT_CONNECTION_BEGIN = "sikoba/connection/ACCEPT_CONNECTION_BEGIN";
const ACCEPT_CONNECTION_WAITING_TX_RESPONSE =
  "sikoba/connection/ACCEPT_CONNECTION_WAITING_TX_RESPONSE";
const ACCEPT_CONNECTION_SUCCESS = "sikoba/connection/ACCEPT_CONNECTION_SUCCESS";
const ACCEPT_CONNECTION_FAILURE = "sikoba/connection/ACCEPT_CONNECTION_FAILURE";

// reject connection
const REJECT_CONNECTION_BEGIN = "sikoba/connection/REJECT_CONNECTION_BEGIN";
const REJECT_CONNECTION_WAITING_TX_RESPONSE =
  "sikoba/connection/REJECT_CONNECTION_WAITING_TX_RESPONSE";
const REJECT_CONNECTION_SUCCESS = "sikoba/connection/REJECT_CONNECTION_SUCCESS";
const REJECT_CONNECTION_FAILURE = "sikoba/connection/REJECT_CONNECTION_FAILURE";

// cancel connection
const CANCEL_CONNECTION_BEGIN = "sikoba/connection/CANCEL_CONNECTION_BEGIN";
const CANCEL_CONNECTION_WAITING_TX_RESPONSE =
  "sikoba/connection/CANCEL_CONNECTION_WAITING_TX_RESPONSE";
const CANCEL_CONNECTION_SUCCESS = "sikoba/connection/CANCEL_CONNECTION_SUCCESS";
const CANCEL_CONNECTION_FAILURE = "sikoba/connection/CANCEL_CONNECTION_FAILURE";

// reactivate connection
const REACTIVATE_CONNECTION_BEGIN =
  "sikoba/connection/REACTIVATE_CONNECTION_BEGIN";
const REACTIVATE_CONNECTION_WAITING_TX_RESPONSE =
  "sikoba/connection/REACTIVATE_CONNECTION_WAITING_TX_RESPONSE";
const REACTIVATE_CONNECTION_SUCCESS =
  "sikoba/connection/REACTIVATE_CONNECTION_SUCCESS";
const REACTIVATE_CONNECTION_FAILURE =
  "sikoba/connection/REACTIVATE_CONNECTION_FAILURE";

// multiple select user for creating a credit line  
const ADD_SELECTED_USER =
  "sikoba/connection/ADD_SELECTED_USER"; 
const REMOVE_SELECTED_USER =
  "sikoba/connection/REMOVE_SELECTED_USER";
const CHANGE_SELECT_OPTION =
  "sikoba/connection/CHANGE_SELECT_OPTION";

// all connections
const LOAD_BEGIN = "sikoba/connection/LOAD_BEGIN";
const LOAD_SUCCESS = "sikoba/connection/LOAD_SUCCESS";
const LOAD_FAILURE = "sikoba/connection/LOAD_FAILURE";
const REFRESH_BEGIN = "sikoba/connection/REFRESH_BEGIN";
const UPDATE_CONNECTIONS = "sikoba/connection/UPDATE_CONNECTIONS";

// single connection
const LOAD_SINGLE_CONNECTION_BEGIN =
  "sikoba/connection/LOAD_SINGLE_CONNECTION_BEGIN";
const LOAD_SINGLE_CONNECTION_SUCCESS =
  "sikoba/connection/LOAD_SINGLE_CONNECTION_SUCCESS";
const LOAD_SINGLE_CONNECTION_FAILURE =
  "sikoba/connection/LOAD_SINGLE_CONNECTION_FAILURE";
const REFRESH_SINGLE_CONNECTION_BEGIN =
  "sikoba/connection/REFRESH_SINGLE_CONNECTION_BEGIN";
const UPDATE_SINGLE_CONNECTION = "sikoba/connection/UPDATE_SINGLE_CONNECTION";
//
const INSPECT_CONNECTION = "sikoba/connection/INSPECT_CONNECTION";
const CLEAR_INSPECT_CONNECTION = "sikoba/connection/CLEAR_INSPECT_CONNECTION";

// ///////////////////////////////////////
// Reducer

const initialState = {
  newConnection: { receiver: null, status: null, tx: null, errorMessage: null },
  acceptConnection: { status: null, tx: null, errorMessage: null },
  rejectConnection: { status: null, tx: null, errorMessage: null },
  cancelConnection: { status: null, tx: null, errorMessage: null },
  reactivateConnection: { status: null, tx: null, errorMessage: null },
  status: null,
  connections: null,
  errorMessage: null,
  singleConnection: { status: null, connection: null, errorMessage: null },
  inspectConnectionId: null,
  selectedUsers: [],
  selectOption: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_BEGIN:
      return {
        ...state,
        status: ConnectionState.LOADING_CONNECTIONS,
      };
    case LOAD_SUCCESS:
      return {
        ...state,
        status: ConnectionState.LOADING_CONNECTIONS_SUCCESS,
        connections: action.payload.connections,
      };
    case LOAD_FAILURE:
      return {
        ...state,
        status: ConnectionState.LOADING_CONNECTIONS_FAILED,
        errorMessage: action.payload.error,
      };
    case REFRESH_BEGIN:
      return {
        ...state,
        status: ConnectionState.REFRESHING_CONNECTIONS,
      };
    case UPDATE_CONNECTIONS:
      return {
        ...state,
        status: ConnectionState.UPDATING_CONNECTIONS,
      };

    // load single connection
    case LOAD_SINGLE_CONNECTION_BEGIN:
      return {
        ...state,
        singleConnection: {
          status: SingleConnectionState.LOADING_SINGLE_CONNECTION,
          connection: null,
        },
      };
    case LOAD_SINGLE_CONNECTION_SUCCESS:
      return {
        ...state,
        singleConnection: {
          connection: action.payload.connection,
          status: SingleConnectionState.LOADING_SINGLE_CONNECTION_SUCCESS,
        },
      };
    case LOAD_SINGLE_CONNECTION_FAILURE:
      return {
        ...state,
        singleConnection: {
          status: SingleConnectionState.LOADING_SINGLE_CONNECTION_FAILED,
          errorMessage: action.payload.error,
        },
      };
    case REFRESH_SINGLE_CONNECTION_BEGIN:
      return {
        ...state,
        singleConnection: {
          status: SingleConnectionState.REFRESHING_SINGLE_CONNECTION,
        },
      };
    case UPDATE_SINGLE_CONNECTION:
      return {
        ...state,
        singleConnection: {
          status: SingleConnectionState.UPDATING_SINGLE_CONNECTION,
        },
      };
    //
    case INSPECT_CONNECTION:
      const { connectionId } = action.payload;
      return {
        ...state,
        inspectConnectionId: connectionId,
      };
    case CLEAR_INSPECT_CONNECTION:
      return {
        ...state,
        inspectConnectionId: null,
        singleConnection: {
          connection: null,
          status: null,
          errorMessage: null,
        },
      };
    // create new connection
    case SET_RECEIVER:
      return {
        ...state,
        newConnection: { receiver: action.payload.receiver },
      };
    case CREATE_CONNECTION_BEGIN:
      return {
        ...state,
        newConnection: {
          status: CreateConnectionState.CREATING,
          tx: null,
        },
      };
    case CREATE_CONNECTION_WAITING_TX_RESPONSE:
      return {
        ...state,
        newConnection: {
          status: CreateConnectionState.WAITING_TX_RESPONSE,
          tx: {
            ...state.tx,
            id: action.payload.txId,
            remainingAttempts: action.payload.remainingAttempts,
          },
        },
      };
    case CREATE_CONNECTION_SUCCESS:
      return {
        ...state,
        newConnection: {
          status: CreateConnectionState.CREATE_SUCCESS,
          tx: {
            ...state.tx,
            status: TxStatus.SUCCESS,
          },
        },
      };
    case CREATE_CONNECTION_FAILURE:
      return {
        ...state,
        newConnection: {
          errorMessage: action.payload.error,
          status: CreateConnectionState.CREATE_FAILED,
        },
      };
    case CREATE_CONNECTION_RESET_STATUS:
      return {
        ...state,
        newConnection: {
          status: null,
          tx: null,
        },
      };
    case CREATE_CONNECTION_RESET:
      return initialState;

    // accept connection
    case ACCEPT_CONNECTION_BEGIN:
      return {
        ...state,
        acceptConnection: { status: AcceptConnectionState.ACCEPTING, tx: null },
      };
    case ACCEPT_CONNECTION_WAITING_TX_RESPONSE:
      return {
        ...state,
        acceptConnection: {
          status: AcceptConnectionState.WAITING_TX_RESPONSE,
          tx: {
            ...state.tx,
            id: action.payload.txId,
            remainingAttempts: action.payload.remainingAttempts,
          },
        },
      };
    case ACCEPT_CONNECTION_SUCCESS:
      return {
        ...state,
        acceptConnection: {
          status: AcceptConnectionState.ACCEPT_SUCCESS,
          tx: {
            ...state.tx,
            status: TxStatus.SUCCCESS,
          },
        },
      };
    case ACCEPT_CONNECTION_FAILURE:
      return {
        ...state,
        acceptConnection: {
          errorMessage: action.payload.error,
          status: AcceptConnectionState.CREATE_FAILED,
        },
      };

    // reject connection
    case REJECT_CONNECTION_BEGIN:
      return {
        ...state,
        rejectConnection: { status: RejectConnectionState.REJECTING, tx: null },
      };
    case REJECT_CONNECTION_WAITING_TX_RESPONSE:
      return {
        ...state,
        rejectConnection: {
          status: RejectConnectionState.WAITING_TX_RESPONSE,
          tx: {
            ...state.tx,
            id: action.payload.txId,
            remainingAttempts: action.payload.remainingAttempts,
          },
        },
      };
    case REJECT_CONNECTION_SUCCESS:
      return {
        ...state,
        rejectConnection: {
          status: RejectConnectionState.REJECT_SUCCESS,
          tx: {
            ...state.tx,
            status: TxStatus.SUCCCESS,
          },
        },
      };
    case REJECT_CONNECTION_FAILURE:
      return {
        ...state,
        rejectConnection: {
          errorMessage: action.payload.error,
          status: RejectConnectionState.CREATE_FAILED,
        },
      };

    // cancel connection
    case CANCEL_CONNECTION_BEGIN:
      return {
        ...state,
        cancelConnection: { status: CancelConnectionState.CANCELING, tx: null },
      };
    case CANCEL_CONNECTION_WAITING_TX_RESPONSE:
      return {
        ...state,
        cancelConnection: {
          status: CancelConnectionState.WAITING_TX_RESPONSE,
          tx: {
            ...state.tx,
            id: action.payload.txId,
            remainingAttempts: action.payload.remainingAttempts,
          },
        },
      };
    case CANCEL_CONNECTION_SUCCESS:
      return {
        ...state,
        cancelConnection: {
          status: CancelConnectionState.CANCEL_SUCCESS,
          tx: {
            ...state.tx,
            status: TxStatus.SUCCCESS,
          },
        },
      };
    case CANCEL_CONNECTION_FAILURE:
      return {
        ...state,
        cancelConnection: {
          errorMessage: action.payload.error,
          status: CancelConnectionState.CREATE_FAILED,
        },
      };

    // reactivate connection
    case REACTIVATE_CONNECTION_BEGIN:
      return {
        ...state,
        reactivateConnection: {
          status: ReactivateConnectionState.REACTIVATING,
          tx: null,
        },
      };
    case REACTIVATE_CONNECTION_WAITING_TX_RESPONSE:
      return {
        ...state,
        reactivateConnection: {
          status: ReactivateConnectionState.WAITING_TX_RESPONSE,
          tx: {
            ...state.tx,
            id: action.payload.txId,
            remainingAttempts: action.payload.remainingAttempts,
          },
        },
      };
    case REACTIVATE_CONNECTION_SUCCESS:
      return {
        ...state,
        reactivateConnection: {
          status: ReactivateConnectionState.REACTIVATE_SUCCESS,
          tx: {
            ...state.tx,
            status: TxStatus.SUCCCESS,
          },
        },
      };
    case REACTIVATE_CONNECTION_FAILURE:
      return {
        ...state,
        reactivateConnection: {
          errorMessage: action.payload.error,
          status: ReactivateConnectionState.CREATE_FAILED,
        },
      };
    case ADD_SELECTED_USER:
      return {
        ...state,
        selectedUsers: [...state.selectedUsers, action.payload],
      };
    case REMOVE_SELECTED_USER:
      return {
        ...state,
        selectedUsers: [...state.selectedUsers.slice(0, action.payload), ...state.selectedUsers.slice(action.payload + 1)],
      };      
    case CHANGE_SELECT_OPTION:
      return {
        ...state,
        selectOption: action.payload,
      };

    case STORE_INIT:
      return initialState;
    default:
      return state;
  }
}

// ///////////////////////////////////////
// Action Creators

// create connection
export const setNewConnectionReceiver = (receiver) => ({
  type: SET_RECEIVER,
  payload: { receiver },
});

export const createConnectionBegin = () => ({
  type: CREATE_CONNECTION_BEGIN,
});

export const createConnectionWaitingTXResponse = (txId, remainingAttempts) => ({
  type: CREATE_CONNECTION_WAITING_TX_RESPONSE,
  payload: { txId, remainingAttempts },
});

export const createConnectionSuccess = (status) => ({
  type: CREATE_CONNECTION_SUCCESS,
  payload: { status },
});

export const createConnectionFailure = (error) => ({
  type: CREATE_CONNECTION_FAILURE,
  payload: { error },
});

export const resetCreateConnection = () => ({
  type: CREATE_CONNECTION_RESET,
});

export const resetCreateConnectionStatus = () => ({
  type: CREATE_CONNECTION_RESET_STATUS,
});

// accept connection
export const acceptConnectionBegin = () => ({
  type: ACCEPT_CONNECTION_BEGIN,
});

export const acceptConnectionWaitingTXResponse = (txId, remainingAttempts) => ({
  type: ACCEPT_CONNECTION_WAITING_TX_RESPONSE,
  payload: { txId, remainingAttempts },
});

export const acceptConnectionSuccess = (status) => ({
  type: ACCEPT_CONNECTION_SUCCESS,
  payload: { status },
});

export const acceptConnectionFailure = (error) => ({
  type: ACCEPT_CONNECTION_FAILURE,
  payload: { error },
});

// reject connection
export const rejectConnectionBegin = () => ({
  type: REJECT_CONNECTION_BEGIN,
});

export const rejectConnectionWaitingTXResponse = (txId, remainingAttempts) => ({
  type: REJECT_CONNECTION_WAITING_TX_RESPONSE,
  payload: { txId, remainingAttempts },
});

export const rejectConnectionSuccess = (status) => ({
  type: REJECT_CONNECTION_SUCCESS,
  payload: { status },
});

export const rejectConnectionFailure = (error) => ({
  type: REJECT_CONNECTION_FAILURE,
  payload: { error },
});

// cancel connection
export const cancelConnectionBegin = () => ({
  type: CANCEL_CONNECTION_BEGIN,
});

export const cancelConnectionWaitingTXResponse = (txId, remainingAttempts) => ({
  type: CANCEL_CONNECTION_WAITING_TX_RESPONSE,
  payload: { txId, remainingAttempts },
});

export const cancelConnectionSuccess = (status) => ({
  type: CANCEL_CONNECTION_SUCCESS,
  payload: { status },
});

export const cancelConnectionFailure = (error) => ({
  type: CANCEL_CONNECTION_FAILURE,
  payload: { error },
});

// reactivate connection
export const reactivateConnectionBegin = () => ({
  type: REACTIVATE_CONNECTION_BEGIN,
});

export const reactivateConnectionWaitingTXResponse = (
  txId,
  remainingAttempts
) => ({
  type: REACTIVATE_CONNECTION_WAITING_TX_RESPONSE,
  payload: { txId, remainingAttempts },
});

export const reactivateConnectionSuccess = (status) => ({
  type: REACTIVATE_CONNECTION_SUCCESS,
  payload: { status },
});

export const reactivateConnectionFailure = (error) => ({
  type: REACTIVATE_CONNECTION_FAILURE,
  payload: { error },
});

// change selectedUsers state
export const addSelectedUser = (connectionUsername) => ({
  type: ADD_SELECTED_USER,
  payload: connectionUsername
});

export const removeSelectedUser = (connectionPosition) => ({
  type: REMOVE_SELECTED_USER,
  payload: connectionPosition
});

export const changeSeletOption = (selectOption) => ({
  type: CHANGE_SELECT_OPTION,
  payload: selectOption
});

// all connections
const loadBegin = () => ({
  type: LOAD_BEGIN,
});

const loadSuccess = (connections) => ({
  type: LOAD_SUCCESS,
  payload: connections,
});

const loadFailure = (error) => ({
  type: LOAD_FAILURE,
  payload: { error },
});

const refreshBegin = () => ({
  type: REFRESH_BEGIN,
});

const updateBegin = () => ({
  type: UPDATE_CONNECTIONS,
});

// single connection
const loadSingleConnectionBegin = () => ({
  type: LOAD_SINGLE_CONNECTION_BEGIN,
});

const loadSingleConnectionSuccess = (connection) => {
  return {
    type: LOAD_SINGLE_CONNECTION_SUCCESS,
    payload: connection,
  };
};
const loadSingleConnectionFailure = (error) => ({
  type: LOAD_SINGLE_CONNECTION_FAILURE,
  payload: { error },
});

const refreshSingleConnectionBegin = () => ({
  type: REFRESH_SINGLE_CONNECTION_BEGIN,
});

const updateSingleConnectionBegin = () => ({
  type: UPDATE_SINGLE_CONNECTION,
});

// set inspect connection
const setInspectConnection = (connectionId) => ({
  type: INSPECT_CONNECTION,
  payload: connectionId,
});

const clearInspectConnection = () => ({
  type: CLEAR_INSPECT_CONNECTION,
});

// ///////////////////////////////////////
// Selectors

// create new connection
export const getNewConnectionErrorMessage = (state) =>
  state.connection.newConnection.errorMessage;

// accept connection
export const getAcceptConnectionErrorMessage = (state) =>
  state.connection.acceptConnection.errorMessage;

export const getAcceptConnectionStatus = (state) =>
  state.connection.acceptConnection.status;

// reject connection
export const getRejectConnectionErrorMessage = (state) =>
  state.connection.rejectConnection.errorMessage;

export const getRejectConnectionStatus = (state) =>
  state.connection.rejectConnection.status;

// cancel connection
export const getCancelConnectionErrorMessage = (state) =>
  state.connection.cancelConnection.errorMessage;

export const getCancelConnectionStatus = (state) =>
  state.connection.cancelConnection.status;

// reactivate connection
export const getReactivateConnectionErrorMessage = (state) =>
  state.connection.reactivateConnection.errorMessage;

export const getReactivateConnectionStatus = (state) =>
  state.connection.reactivateConnection.status;

// load all connections
export const isLoading = (state) =>
  state.connection.status === ConnectionState.LOADING_CONNECTIONS;

export const isLoadedSuccess = (state) =>
  Array.isArray(state.connection.connections);

export const getConnections = (state) => state.connection.connections;

export const getSelectedUsers = (state) => state.connection.selectedUsers;

export const getSelectOption = (state) => state.connection.selectOption;

export const isRefreshing = (state) =>
  state.connection.status === ConnectionState.REFRESHING_CONNECTIONS;

const isUpdating = (state) =>
  state.connection.status === ConnectionState.UPDATING_BALANCE;

export const errorMessage = (state) => state.connection.errorMessage;

// load single connection
export const isSingleConnectionLoading = (state) =>
  state.connection.singleConnection.status ===
  SingleConnectionState.LOADING_SINGLE_CONNECTION;

export const isSingleConnectionLoadedSuccess = (state) => {
  return (
    typeof state.connection.singleConnection.connection === "object" &&
    state.connection.singleConnection.connection !== null
  );
};

export const getConnection = (state) =>
  state.connection.singleConnection.connection;

export const isSingleConnectionRefreshing = (state) =>
  state.connection.singleConnection.status ===
  SingleConnectionState.REFRESHING_SINGLE_CONNECTION;

export const isSingleConnectionUpdating = (state) =>
  state.connection.singleConnection.status ===
  SingleConnectionState.UPDATING_SINGLE_CONNECTION;

export const singleConnectionErrorMessage = (state) =>
  state.connection.singleConnection.errorMessage;
//
export const getInspectConnectionId = (state) =>
  state.connection.inspectConnectionId;
// ///////////////////////////////////////
// pseudo-Action Creators

// create connection
const isValid = (connection) => {
  const { sender, receiver } = connection;

  const validTypes = every([sender, receiver], isString);
  const validValues = !some([sender, receiver], isEmpty) && sender !== receiver;

  return validTypes && validValues;
};

const getCreateConnectionTxStatus = (txId, remainingAttempts = 4) => async (
  dispatch
) => {
  const response = await api.get(`/transactions/${txId}`);

  if (!response.ok && remainingAttempts > 0) {
    dispatch(createConnectionWaitingTXResponse(txId, remainingAttempts - 1));
    setTimeout(() => {
      dispatch(getCreateConnectionTxStatus(txId, remainingAttempts - 1));
    }, 5000);
    return;
  }

  if (!response.ok) {
    dispatch(createConnectionFailure(response.error));
    return;
  }

  const json = await response.json();
  dispatch(createConnectionSuccess(json.status));
};

export const createConnection = (connection) => async (dispatch) => {
  const { sender, receiver } = connection;
  dispatch(createConnectionBegin());

  if (!isValid(connection)) {
    dispatch(createConnectionFailure("Invalid parameters"));
    return;
  }

  const toSign = JSON.stringify({ sender, receiver });
  dispatch(
    cryptographyModule.signMessage(sender, toSign, {
      onSigned: async (signature, publicKey) => {
        const response = await api.post("/send_connection_request", {
          body: { sender, receiver, signature, public_key: publicKey },
        });

        if (!response.ok) {
          dispatch(createConnectionFailure(response.statusText));
          return;
        }

        const json = await response.json();
        dispatch(getCreateConnectionTxStatus(json.tx_id));
      },
    })
  );
};

// accept connection
const getAcceptConnectionTxStatus = (
  txId,
  onSuccess,
  remainingAttempts = 4
) => async (dispatch) => {
  const response = await api.get(`/transactions/${txId}`);

  if (!response.ok && remainingAttempts > 0) {
    dispatch(acceptConnectionWaitingTXResponse(txId, remainingAttempts - 1));
    setTimeout(() => {
      dispatch(
        getAcceptConnectionTxStatus(txId, onSuccess, remainingAttempts - 1)
      );
    }, 5000);
    return;
  }

  if (!response.ok) {
    dispatch(acceptConnectionFailure(response.error));
    return;
  }

  const json = await response.json();
  dispatch(acceptConnectionSuccess(json.status));

  if (onSuccess && typeof onSuccess === "function") onSuccess();
};

export const acceptConnection = (acceptConnection, onSuccess) => async (
  dispatch
) => {
  const { acceptor, id } = acceptConnection;
  dispatch(acceptConnectionBegin());

  const toSign = JSON.stringify({ acceptor, connection_id: id });
  dispatch(
    cryptographyModule.signMessage(acceptor, toSign, {
      onSigned: async (signature, publicKey) => {
        const response = await api.post("/accept_connection_request", {
          body: {
            acceptor,
            connection_id: id,
            signature,
            public_key: publicKey,
          },
        });

        if (!response.ok) {
          dispatch(acceptConnectionFailure(response.statusText));
          return;
        }

        const json = await response.json();
        dispatch(getAcceptConnectionTxStatus(json.tx_id, onSuccess));
      },
    })
  );
};

// reject connection
const getRejectConnectionTxStatus = (txId, remainingAttempts = 4) => async (
  dispatch
) => {
  const response = await api.get(`/transactions/${txId}`);

  if (!response.ok && remainingAttempts > 0) {
    dispatch(rejectConnectionWaitingTXResponse(txId, remainingAttempts - 1));
    setTimeout(() => {
      dispatch(getRejectConnectionTxStatus(txId, remainingAttempts - 1));
    }, 5000);
    return;
  }

  if (!response.ok) {
    dispatch(rejectConnectionFailure(response.error));
    return;
  }

  const json = await response.json();
  dispatch(rejectConnectionSuccess(json.status));
};

export const rejectConnection = (rejectConnection) => async (dispatch) => {
  const { rejector, id } = rejectConnection;
  dispatch(rejectConnectionBegin());

  const toSign = JSON.stringify({ rejector, connection_id: id });
  dispatch(
    cryptographyModule.signMessage(rejector, toSign, {
      onSigned: async (signature, publicKey) => {
        const response = await api.post("/reject_connection_request", {
          body: {
            rejector,
            connection_id: id,
            signature,
            public_key: publicKey,
          },
        });

        if (!response.ok) {
          dispatch(rejectConnectionFailureresponse.statusText);
          return;
        }

        const json = await response.json();
        dispatch(getRejectConnectionTxStatus(json.tx_id));
      },
    })
  );
};

// cancel connection
const getCancelConnectionTxStatus = (txId, remainingAttempts = 4) => async (
  dispatch
) => {
  const response = await api.get(`/transactions/${txId}`);

  if (!response.ok && remainingAttempts > 0) {
    dispatch(cancelConnectionWaitingTXResponse(txId, remainingAttempts - 1));
    setTimeout(() => {
      dispatch(getCancelConnectionTxStatus(txId, remainingAttempts - 1));
    }, 5000);
    return;
  }

  if (!response.ok) {
    dispatch(cancelConnectionFailure(response.error));
    return;
  }

  const json = await response.json();
  dispatch(cancelConnectionSuccess(json.status));
};

export const cancelConnection = (cancelConnection) => async (dispatch) => {
  const { canceller, id } = cancelConnection;
  dispatch(cancelConnectionBegin());

  const toSign = JSON.stringify({ canceller, connection_id: id });
  dispatch(
    cryptographyModule.signMessage(canceller, toSign, {
      onSigned: async (signature, publicKey) => {
        const response = await api.post("/cancel_connection", {
          body: {
            canceller,
            connection_id: id,
            signature,
            public_key: publicKey,
          },
        });

        if (!response.ok) {
          dispatch(cancelConnectionFailureresponse.statusText);
          return;
        }

        const json = await response.json();
        dispatch(getCancelConnectionTxStatus(json.tx_id));
      },
    })
  );
};

// reactivate connection
const getReactivateConnectionTxStatus = (txId, remainingAttempts = 4) => async (
  dispatch
) => {
  const response = await api.get(`/transactions/${txId}`);

  if (!response.ok && remainingAttempts > 0) {
    dispatch(
      reactivateConnectionWaitingTXResponse(txId, remainingAttempts - 1)
    );
    setTimeout(() => {
      dispatch(getReactivateConnectionTxStatus(txId, remainingAttempts - 1));
    }, 5000);
    return;
  }

  if (!response.ok) {
    dispatch(reactivateConnectionFailure(response.error));
    return;
  }

  const json = await response.json();
  dispatch(reactivateConnectionSuccess(json.status));
};

export const reactivateConnection = (reactivateConnection) => async (
  dispatch
) => {
  const { reactivator, id } = reactivateConnection;
  dispatch(reactivateConnectionBegin());

  const toSign = JSON.stringify({ reactivator, connection_id: id });
  dispatch(
    cryptographyModule.signMessage(reactivator, toSign, {
      onSigned: async (signature, publicKey) => {
        const response = await api.post("/reactivate_connection", {
          body: {
            reactivator,
            connection_id: id,
            signature,
            public_key: publicKey,
          },
        });

        if (!response.ok) {
          dispatch(reactivateConnectionFailureresponse.statusText);
          return;
        }

        const json = await response.json();
        dispatch(getReactivateConnectionTxStatus(json.tx_id));
      },
    })
  );
};

// all connections
const queryConnections = () => async (dispatch, getState) => {
  try {
    const response = await api.get("/connections");

    if (!response.ok) {
      throw new Error(response.statusText || "Error loading connections.");
    }

    const json = await response.json();
    dispatch(loadSuccess(json));
  } catch (e) {
    if (!isUpdating(getState())) {
      dispatch(loadFailure(e.message || "Network error"));
    }
  }
};

const loadConnections = () => async (dispatch, getState) => {
  dispatch(loadBegin());
  const state = getState();
  if (!isUpdating(state) && !isRefreshing(state)) {
    dispatch(queryConnections());
  }
};

const updateConnections = () => async (dispatch, getState) => {
  const state = getState();
  if (!isRefreshing(state) && !isLoading(state)) {
    dispatch(queryConnections());
    dispatch(updateBegin());
  }
};

const refreshConnections = () => (dispatch, getState) => {
  const state = getState();
  if (!isUpdating(getState()) && !isLoading(state)) {
    dispatch(queryConnections());
  }
  dispatch(refreshBegin());
};

// single connection
const queryConnection = (connectionId) => async (dispatch, getState) => {
  if (connectionId !== null && connectionId !== undefined) {
    try {
      const response = await api.get(`/connection/${connectionId}`);

      if (!response.ok) {
        throw new error(
          response.statusText || "Error loading single connection."
        );
      }

      const json = await response.json();
      dispatch(loadSingleConnectionSuccess(json));
    } catch (e) {
      if (!isUpdating(getState())) {
        dispatch(loadSingleConnectionFailure(e.message || "Network error"));
      }
    }
  } else {
    dispatch(loadSingleConnectionFailure("Connection ID not assigned."));
  }
};

const loadConnection = (connectionId) => async (dispatch, getState) => {
  dispatch(loadSingleConnectionBegin());
  const state = getState();
  if (
    !isSingleConnectionUpdating(state) &&
    !isSingleConnectionRefreshing(state)
  ) {
    dispatch(queryConnection(connectionId));
  }
};

const updateConnection = () => async (dispatch, getState) => {
  const state = getState();
  if (
    !isSingleConnectionRefreshing(state) &&
    !isSingleConnectionLoading(state)
  ) {
    dispatch(queryConnection(state.connection.inspectConnectionId));
    dispatch(updateSingleConnectionBegin());
  }
};

const refreshConnection = (connectionId) => (dispatch, getState) => {
  const state = getState();
  if (!isSingleConnectionUpdating(state) && !isSingleConnectionLoading(state)) {
    dispatch(queryConnection(connectionId));
  }
  dispatch(refreshSingleConnectionBegin());
};

const inspectConnection = (connectionId) => (dispatch, getState) => {
  dispatch(clearInspectConnection());
  dispatch(setInspectConnection({ connectionId }));
};

export const actions = {
  reactivateConnection,
  acceptConnection,
  rejectConnection,
  cancelConnection,
  loadConnections,
  updateConnections,
  refreshConnections,
  loadConnection,
  updateConnection,
  refreshConnection,
  inspectConnection,
  setNewConnectionReceiver,
  changeSeletOption,
};
