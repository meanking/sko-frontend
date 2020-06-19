// ///////////////////////////////////////
// Balance module
// Contains data to display in the Balance Screen
// Ie. net balance amounts and next settlements

import api from "../../api";
import { STORE_INIT } from "./common";
import { AsyncStorage, PushNotificationIOS } from "react-native";

import * as intl from "./internationalization";
import * as connectionModule from "./connection";
import * as creditLineModule from "./creditline";
import * as balance from "./balance";
import * as login from "./login";

let PushNotification = require("react-native-push-notification");
PushNotification.configure({
  // (required) Called when a remote or local notification is opened or received
  onNotification: function(notification) {
    console.log("NOTIFICATION:", notification);

    // process the notification

    // required on iOS only (see fetchCompletionHandler docs: https://github.com/react-native-community/react-native-push-notification-ios)
    // notification.finish(PushNotificationIOS.FetchResult.NoData);
  },

  // ANDROID ONLY: GCM or FCM Sender ID (product_number) (optional - not required for local notifications, but is need to receive remote push notifications)
  // senderID: "YOUR GCM (OR FCM) SENDER ID",

  // IOS ONLY (optional): default: all - Permissions to register.
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },

  // Should the initial notification be popped automatically
  // default: true
  popInitialNotification: true,

  /**
   * (optional) default: true
   * - Specified if permissions (ios) and token (android and ios) will requested or not,
   * - if not, you must call PushNotificationsHandler.requestPermissions() later
   */
  requestPermissions: true,
});

const NOTIFICATIONS_CONNECTIONS = (username) => {
  return "state.notifications.connections." + username;
};

const NOTIFICATIONS_CREDIT_LINES = (username) => {
  return "state.notifications.creditlines." + username;
};

const NOTIFICATIONS_IOUS = (username) => {
  return "state.notifications.ious." + username;
};

// var PushNotification = require("react-native-push-notification");
// var PushNotification = require("react-native-push-notifications");
// import { Notifications } from "react-native-notifications";

//////////////////////////////////////////
// States

// ///////////////////////////////////////
// Actions
const ADD_NOTIFICATION = "sikoba/notifications/ADD_NOTIFICATION";
const REMOVE_NOTIFICATION = "sikoba/notifications/REMOVE_NOTIFICATION";
const LOAD_STATE_FROM_STORE = "sikoba/notifications/LOAD_STATE_FROM_STORE";
const STORE_STATE = "sikoba/notifications/STORE_STATE";
const UPDATE_CONNECTIONS = "sikoba/notifications/UPDATE_CONNECTIONS";
const UPDATE_CREDIT_LINES = "sikoba/notifications/UPDATE_CREDIT_LINES";
const UPDATE_IOUS = "sikoba/notifications/UPDATE_IOUS";

// ///////////////////////////////////////
// Reducer

const initialState = {
  queue: [],
  idCounter: 0,
  lastState: { connections: null, creditLines: null, ious: null },
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case ADD_NOTIFICATION:
      const { notification } = action.payload;
      const { title, message } = notification;

      // used to identify the current notification that is being created
      const oldId = state.idCounter;
      // will be used for the next notification
      const newId = oldId + 1;

      return {
        ...state,
        idCounter: newId,
        queue: [...state.queue, { id: oldId, title: title, message: message }],
      };

    case REMOVE_NOTIFICATION: {
      const { id } = action.payload;

      const oldQueue = state.queue;
      const newQueue = [];
      for (var i in oldQueue) {
        const e = oldQueue[i];

        if (e.id !== id) newQueue.push(e);
      }
      return { ...state, queue: newQueue };
    }

    case UPDATE_CONNECTIONS: {
      const { connections } = action.payload;

      return {
        ...state,
        lastState: {
          ...state.lastState,
          connections: connections,
        },
      };
    }

    case UPDATE_CREDIT_LINES: {
      const { creditLines } = action.payload;

      return {
        ...state,
        lastState: {
          ...state.lastState,
          creditLines: creditLines,
        },
      };
    }

    case UPDATE_IOUS: {
      const { ious } = action.payload;

      return {
        ...state,
        lastState: {
          ...state.lastState,
          ious: ious,
        },
      };
    }

    case STORE_INIT:
      return initialState;
    default:
      return state;
  }
}

// ///////////////////////////////////////
// Selectors

// ///////////////////////////////////////
// Action Creators
const addNotification = (notification) => ({
  type: ADD_NOTIFICATION,
  payload: { notification },
});

const removeNotification = (id) => ({
  type: REMOVE_NOTIFICATION,
  payload: { id },
});

const updateLastState = (state) => ({
  type: UPDATE_LAST_STATE,
  payload: { state },
});

const updateConnections = (connections) => ({
  type: UPDATE_CONNECTIONS,
  payload: { connections },
});

const updateCreditLines = (creditLines) => ({
  type: UPDATE_CREDIT_LINES,
  payload: { creditLines },
});

const updateIOUs = (ious) => ({
  type: UPDATE_IOUS,
  payload: { ious },
});

// ///////////////////////////////////////
// pseudo-Action Creators

const checkConnections = () => async (dispatch, getState) => {
  const state = getState();
  const lastStateConnections = state.notifications.lastState.connections;
  const currentUser = state.login.username;

  var oldConnections, newConnections;

  if (lastStateConnections === null || lastStateConnections === undefined) {
    // attempt loading from store
    const connectionsFromStore = await loadConnectionsFromStore(
      currentUser,
      state
    );

    // The following section is used during the first load of data,
    // when there's still no data written in the Redux store.
    if (connectionsFromStore === null) {
      oldConnections = connectionModule.getConnections(state);
    } else {
      oldConnections = connectionsFromStore;
    }
  } else {
    oldConnections = lastStateConnections;
  }

  if (oldConnections === null || oldConnections === undefined) return;

  newConnections = connectionModule.getConnections(state) || oldConnections;

  // check listeners
  for (var i in connectionListeners) {
    const listener = connectionListeners[i];
    listener(currentUser, oldConnections, newConnections, dispatch, getState);
  }

  // update latest connection state
  dispatch(updateConnections(newConnections));

  // write latest state to device
  storeState(currentUser, { connections: newConnections });
};

const checkCreditLines = () => async (dispatch, getState) => {
  const state = getState();
  const lastStateCreditLines = state.notifications.lastState.creditLines;
  const currentUser = state.login.username;

  var oldCreditLines, newCreditLines;

  if (lastStateCreditLines === null || lastStateCreditLines === undefined) {
    // attempt loading from store
    const creditLinesFromStore = await loadCreditLinesFromStore(
      currentUser,
      state
    );

    // The following section is used during the first load of data,
    // when there's still no data written in the Redux store.
    if (creditLinesFromStore === null) {
      oldCreditLines = creditLineModule.getCreditLines(state);
    } else {
      oldCreditLines = creditLinesFromStore;
    }
  } else {
    oldCreditLines = lastStateCreditLines;
  }

  if (oldCreditLines === null || oldCreditLines === undefined) return;

  newCreditLines = creditLineModule.getCreditLines(state) || oldCreditLines;

  // check listeners
  for (var i in creditLineListeners) {
    const listener = creditLineListeners[i];
    listener(currentUser, oldCreditLines, newCreditLines, dispatch, getState);
  }

  // update latest credit line state
  dispatch(updateCreditLines(newCreditLines));

  // write latest state to device
  storeState(currentUser, { creditLines: newCreditLines });
};

const checkIOUs = () => async (dispatch, getState) => {
  const state = getState();
  const lastStateIOUs = state.notifications.lastState.ious;
  const currentUser = state.login.username;

  var oldIOUs, newIOUs;

  if (lastStateIOUs === null || lastStateIOUs === undefined) {
    // attempt loading from store
    const iousFromStore = await loadIOUsFromStore(currentUser, state);

    // The following section is used during the first load of data,
    // when there's still no data written in the Redux store.
    if (iousFromStore === null) {
      oldIOUs = balance.getIOUs(state);
    } else {
      oldIOUs = iousFromStore;
    }
  } else {
    oldIOUs = lastStateIOUs;
  }

  if (oldIOUs === null || oldIOUs === undefined) return;

  newIOUs = balance.getIOUs(state) || oldIOUs;

  // check listeners
  for (var i in iouListeners) {
    const listener = iouListeners[i];
    listener(currentUser, oldIOUs, newIOUs, dispatch, getState);
  }

  // update latest iou state
  dispatch(updateIOUs(newIOUs));

  // write latest state to device
  storeState(currentUser, { ious: newIOUs });
};

export const checkNotifications = () => async (dispatch, getState) => {
  const state = getState();
  dispatch(checkConnections(getState));
  dispatch(checkCreditLines(dispatch, getState));
  dispatch(checkIOUs(dispatch, getState));

  // run notifications from queue
  const queue = state.notifications.queue;
  const toRemove = [];
  for (var i in queue) {
    const notif = queue[i];

    PushNotification.localNotification({
      title: notif.title,
      message: notif.message,
    });

    // add for removal
    toRemove.push(notif.id);
  }

  // remove from queue
  for (var i in toRemove) {
    const id = toRemove[i];
    dispatch(removeNotification(id));
  }
};

const storeState = async (user, toStore) => {
  const { connections, creditLines, ious } = toStore;

  if (connections) {
    await AsyncStorage.setItem(
      NOTIFICATIONS_CONNECTIONS(user),
      JSON.stringify(connections)
    );
  }

  if (creditLines) {
    await AsyncStorage.setItem(
      NOTIFICATIONS_CREDIT_LINES(user),
      JSON.stringify(creditLines)
    );
  }

  if (ious) {
    await AsyncStorage.setItem(NOTIFICATIONS_IOUS(user), JSON.stringify(ious));
  }
};

const loadConnectionsFromStore = async (user, state) => {
  const value = await AsyncStorage.getItem(NOTIFICATIONS_CONNECTIONS(user));
  var toReturn;
  try {
    toReturn = JSON.parse(value);
  } catch (e) {
    // placeholder
    toReturn = null;
  }

  return toReturn;
};

const loadCreditLinesFromStore = async (user, state) => {
  const value = await AsyncStorage.getItem(NOTIFICATIONS_CREDIT_LINES(user));
  var toReturn;
  try {
    toReturn = JSON.parse(value);
  } catch (e) {
    toReturn = null;
  }
  return toReturn;
};

const loadIOUsFromStore = async (user, state) => {
  const value = await AsyncStorage.getItem(NOTIFICATIONS_IOUS(user));
  var toReturn;
  try {
    toReturn = JSON.parse(value);
  } catch (e) {
    toReturn = null;
  }
  return toReturn;
};

//////////////////////////////////////////
// Listeners

// Connection listeners
const ReceivedConnectionListener = (
  currentUser,
  oldConnections,
  newConnections,
  dispatch,
  getState
) => {
  for (var i in newConnections) {
    const newConn = newConnections[i];

    // only checking for received connections
    if (newConn.direction === false) {
      const isNew = () => {
        var oldConn;
        for (var j in oldConnections) {
          oldConn = oldConnections[j];

          if (newConn.id === oldConn.id) return false;
        }
        return true;
      };
      if (isNew()) {
        const notif = ReceivedConnectionNotification(
          newConn.username,
          getState()
        );
        dispatch(addNotification(notif));
      }
    }
  }
};

const AcceptedConnectionRequestListener = (
  currentUser,
  oldConnections,
  newConnections,
  dispatch,
  getState
) => {
  for (var i in newConnections) {
    const newConn = newConnections[i];

    // only checking for sent connections
    if (newConn.direction) {
      for (var j in oldConnections) {
        var oldConn = oldConnections[j];

        if (newConn.id === oldConn.id) {
          if (oldConn.status === "PENDING" && newConn.status === "ACTIVE") {
            const notif = AcceptedConnectionNotification(
              newConn.username,
              getState()
            );
            dispatch(addNotification(notif));
          }
        }
      }
    }
  }
};

// Primary connections-related listeners
const connectionListeners = [
  ReceivedConnectionListener,
  AcceptedConnectionRequestListener,
];

// Credit line listeners
const ReceivedCreditLineListener = (
  currentUser,
  oldCreditLines,
  newCreditLines,
  dispatch,
  getState
) => {
  for (var i in newCreditLines) {
    const newCreditLine = newCreditLines[i];

    // only checking for debting credit lines
    if (!newCreditLine.crediting_line) {
      const isNew = () => {
        var oldCreditLine;
        for (var j in oldCreditLines) {
          oldCreditLine = oldCreditLines[j];

          if (newCreditLine.id === oldCreditLine.id) return false;
        }
        return true;
      };

      if (isNew()) {
        const notif = ReceivedCreditLineNotification(
          newCreditLine.creditor,
          getState()
        );
        dispatch(addNotification(notif));
      }
    }
  }
};

const AcceptedCreditLineListener = (
  currentUser,
  oldCreditLines,
  newCreditLines,
  dispatch,
  getState
) => {
  for (var i in newCreditLines) {
    const newCreditLine = newCreditLines[i];

    // only check for crediting lines
    if (newCreditLine.crediting_line) {
      for (var j in oldCreditLines) {
        var oldCreditLine = oldCreditLines[j];

        if (newCreditLine.id === oldCreditLine.id) {
          if (
            oldCreditLine.status === "PENDING" &&
            newCreditLine.status === "ACTIVE"
          ) {
            const notif = AcceptedCreditLineNotification(
              newCreditLine.debtor,
              getState()
            );
            dispatch(addNotification(notif));
          }
        }
      }
    }
  }
};

const RejectedCreditLineListener = (
  currentUser,
  oldCreditLines,
  newCreditLines,
  dispatch,
  getState
) => {
  for (var i in newCreditLines) {
    const newCreditLine = newCreditLines[i];

    if (newCreditLine.crediting_line) {
      for (var j in oldCreditLines) {
        var oldCreditLine = oldCreditLines[j];

        if (newCreditLine.id === oldCreditLine.id) {
          if (
            oldCreditLine.status === "PENDING" &&
            newCreditLine.status === "CANCELLED"
          ) {
            const notif = RejectedCreditLineNotification(
              newCreditLine.debtor,
              getState()
            );
            dispatch(addNotification(notif));
          }
        }
      }
    }
  }
};

const FrozenCreditLineListener = (
  currentUser,
  oldCreditLines,
  newCreditLines,
  dispatch,
  getState
) => {
  for (var i in newCreditLines) {
    const newCreditLine = newCreditLines[i];

    if (!newCreditLine.crediting_line) {
      for (var j in oldCreditLines) {
        var oldCreditLine = oldCreditLines[j];

        if (newCreditLine.id === oldCreditLine.id) {
          if (
            oldCreditLine.status === "ACTIVE" &&
            newCreditLine.status === "FROZEN"
          ) {
            const notif = FrozenCreditLineNotification(
              newCreditLine.creditor,
              getState()
            );
            dispatch(addNotification(notif));
          }
        }
      }
    }
  }
};

const UnfrozenCreditLineListener = (
  currentUser,
  oldCreditLines,
  newCreditLines,
  dispatch,
  getState
) => {
  for (var i in newCreditLines) {
    const newCreditLine = newCreditLines[i];

    if (newCreditLine.crediting_line) {
      for (var j in oldCreditLines) {
        var oldCreditLine = oldCreditLines[j];

        if (newCreditLine.id === oldCreditLine.id) {
          if (
            oldCreditLine.status === "FROZEN" &&
            newCreditLine.status === "ACTIVE"
          ) {
            const notif = UnfrozenCreditLineNotification(
              newCreditLine.creditor,
              getState()
            );
            dispatch(addNotification(notif));
          }
        }
      }
    }
  }
};

const creditLineListeners = [
  ReceivedCreditLineListener,
  AcceptedCreditLineListener,
  RejectedCreditLineListener,
  FrozenCreditLineListener,
  UnfrozenCreditLineListener,
];

// IOU listeners
const ReceivedPaymentListener = (
  currentUser,
  oldIOUs,
  newIOUs,
  dispatch,
  getState
) => {
  for (var i in newIOUs) {
    const newIOU = newIOUs[i];

    if (newIOU.direction) {
      const isNew = () => {
        var oldIOU;

        for (var j in oldIOUs) {
          oldIOU = oldIOUs[j];

          if (newIOU.id === oldIOU.id) return false;
        }
        return true;
      };

      if (isNew() && newIOU.origin === "PAYMENT") {
        const notif = ReceivedPaymentNotification(
          newIOU.other_user,
          newIOU.amount_formatted,
          getState()
        );
        dispatch(addNotification(notif));
      }
    }
  }
};

const IOUSettlementListener = (
  currentUser,
  oldIOUs,
  newIOUs,
  dispatch,
  getState
) => {
  const settledIOUs = [];

  for (var i in oldIOUs) {
    const oldIOU = oldIOUs[i];

    if (oldIOU.direction === false && oldIOU.status === "RUNNING") {
      for (var j in newIOUs) {
        const newIOU = newIOUs[j];

        if (newIOU.id === oldIOU.id && newIOU.status === "SETTLED") {
          settledIOUs.push(oldIOU);
        }
      }
    }
  }

  for (var i in settledIOUs) {
    const iou = settledIOUs[i];
    const currencySymbol = iou.currency.symbol;
    var settledAmount = iou.amount_formatted_no_symbol;

    for (var j in newIOUs) {
      const newIOU = newIOUs[j];

      if (
        newIOU.origin === "PARTIAL_SETTLEMENT" &&
        newIOU.origin_iou_id === iou.id
      ) {
        settledAmount -= parseFloat(newIOU.amount_formatted_no_symbol);
      }
    }

    const notif = IOUSettlementNotification(
      iou.other_user,
      settledAmount,
      currencySymbol,
      getState()
    );

    dispatch(addNotification(notif));
  }
};

const IOUClearingListener = (
  currentUser,
  oldIOUs,
  newIOUs,
  dispatch,
  getState
) => {
  // function groupBy(list, keyGetter) {
  //   const map = new Map();
  //   list.forEach(item => {
  //     const key = keyGetter(item);
  //     const collection = map.get(key);
  //     if (!collection) {
  //       map.set(key, [item]);
  //     } else {
  //       collection.push(item);
  //     }
  //   });
  //   return map;
  // }
  // const groupedOldIOUs = groupBy(oldIOUs, x => x.currency.symbol);
  // const groupedNewIOUs = groupBy(newIOUs, x => x.currency.symbol);

  for (var i in newIOUs) {
    const newIOU = newIOUs[i];

    if (newIOU.status === "CLEARED") {
      for (var j in oldIOUs) {
        const oldIOU = oldIOUs[j];

        if (newIOU.id === oldIOU.id && oldIOU.status === "RUNNING") {
          const notif = IOUClearedNotification(getState());
          dispatch(addNotification(notif));
        }
      }
    }
  }
};

const iouListeners = [
  ReceivedPaymentListener,
  IOUSettlementListener,
  IOUClearingListener,
];

//////////////////////////////////////////
// Notification types

// Connections
const ReceivedConnectionNotification = (receivedFrom, state) => {
  const titleString = intl.getStringRedux(
    "RECEIVED_CONNECTION_NOTIFICATION_TITLE",
    state
  );

  const title = receivedFrom + " " + titleString;
  const message = "";

  return { title, message };
};

const AcceptedConnectionNotification = (acceptor, state) => {
  const titleString = intl.getStringRedux(
    "ACCEPTED_CONNECTION_NOTIFICATION_TITLE",
    state
  );

  const title = acceptor + " " + titleString;
  const message = "";

  return { title, message };
};

// Credit lines
const ReceivedCreditLineNotification = (receivedFrom, state) => {
  const titleString = intl.getStringRedux(
    "RECEIVED_CREDIT_LINE_NOTIFICATION_TITLE",
    state
  );

  const title = receivedFrom + " " + titleString;
  const message = "";

  return { title, message };
};

const AcceptedCreditLineNotification = (acceptor, state) => {
  const titleString = intl.getStringRedux(
    "ACCEPTED_CREDIT_LINE_NOTIFICATION_TITLE",
    state
  );

  const title = acceptor + " " + titleString;
  const message = "";

  return { title, message };
};

const RejectedCreditLineNotification = (rejector, state) => {
  const titleString = intl.getStringRedux(
    "REJECTED_CREDIT_LINE_NOTIFICATION_TITLE",
    state
  );

  const title = rejector + " " + titleString;
  const message = "";

  return { title, message };
};

const FrozenCreditLineNotification = (freezer, state) => {
  const titleString = intl.getStringRedux(
    "FROZEN_CREDIT_LINE_NOTIFICATION_TITLE",
    state
  );

  const title = freezer + " " + titleString;
  const message = "";

  return { title, message };
};

const UnfrozenCreditLineNotification = (unfreezer, state) => {
  const titleString = intl.getStringRedux(
    "UNFROZEN_CREDIT_LINE_NOTIFICATION_TITLE",
    state
  );

  const title = unfreezer + " " + titleString;
  const message = "";

  return { title, message };
};

// IOUs
const ReceivedPaymentNotification = (payee, amount, state) => {
  const titleString = intl.getStringRedux(
    "RECEIVED_PAYMENT_NOTIFICATION_TITLE",
    state
  );

  const title = amount + " " + titleString + " " + payee;
  const message = "";

  return { title, message };
};

const IOUSettlementNotification = (settler, amount, symbol, state) => {
  const titleString = intl.getStringRedux(
    "IOU_PARTIAL_SETTLE_NOTIFICATION_TITLE",
    state
  );

  const title = settler + " " + titleString + " " + symbol + Math.abs(amount);
  const message = "";

  return { title, message };
};

const IOUClearedNotification = (state) => {
  const titleString = intl.getStringRedux(
    "IOU_CLEARED_NOTIFICATION_TITLE",
    state
  );

  const title = titleString;
  const message = "";

  return { title, message };
};
