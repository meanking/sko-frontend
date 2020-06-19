// ///////////////////////////////////////
// Account Settings module
import api from "../../api";
import { AsyncStorage } from "react-native";

import * as keygen from "../../lib/keygen";
import { Buffer } from "buffer";

// Used to enable storage of multiple keys, each per user.
const PUBLIC_KEY_STORAGE = (user) => "sikoba.pubKey." + user;

// ///////////////////////////////////////
// Actions

const SET_PUBLIC_KEY = "sikoba/cryptography/SET_PUBLIC_KEY";
// ///////////////////////////////////////
// Reducer

const initialState = {
  publicKey: null,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_PUBLIC_KEY: {
      const { username, publicKey } = action.payload;

      AsyncStorage.setItem(
        PUBLIC_KEY_STORAGE(username),
        JSON.stringify(publicKey)
      );

      return {
        ...state,
        publicKey,
      };
    }

    default:
      return state;
  }
}

// ///////////////////////////////////////
// Action Creators

export const setPublicKey = (username, publicKey) => ({
  type: SET_PUBLIC_KEY,
  payload: { username, publicKey },
});

// ///////////////////////////////////////
// Selectors

export const getPubKey = (state) => state.cryptography.publicKey;

export const getScheme = () => "secp256r1";

// ///////////////////////////////////////
// pseudo-Action Creators

export const signMessage = (username, message, { onSigned }) => async (
  dispatch,
  getState
) => {
  dispatch(
    getPublicKey(username, {
      onKeyRead: (publicKey) => {
        keygen.sign(message, publicKey, (signature) => {
          if (onSigned && typeof onSigned === "function")
            onSigned(
              signature.toString("hex"), // returns hex string
              new Buffer(publicKey).toString("hex") // returns hex string
            );
        });
      },
      // if a key wasnt found, a new one will be created
      // TODO PRODUCTION fix this
      onKeyNotFound: () => {
        dispatch(
          createKey(username, (key) => {
            dispatch(signMessage(username, message, { onSigned }));
          })
        );
      },
    })
  );
};

export const getPublicKey = (user, { onKeyRead, onKeyNotFound }) => async (
  dispatch,
  getState
) => {
  const state = getState();
  const username = user || state.login.username;

  // // try variable from module state
  const statePublicKey = state.cryptography.publicKey;
  if (statePublicKey) {
    if (onKeyRead && typeof onKeyRead === "function") onKeyRead(statePublicKey);
    return;
  }

  // try reading from store
  const fromStore = await AsyncStorage.getItem(PUBLIC_KEY_STORAGE(username));
  const storagePublicKey = await JSON.parse(fromStore);
  if (storagePublicKey !== null && storagePublicKey !== undefined) {
    dispatch(setPublicKey(username, storagePublicKey));
    if (onKeyRead && typeof onKeyRead === "function")
      onKeyRead(storagePublicKey);
    return;
  }

  // if it gets here, no public key was found
  if (onKeyNotFound && typeof onKeyNotFound === "function") {
    console.log("No public key was found.");
    onKeyNotFound();
  }
};

export const createKey = (username, onSuccess) => async (
  dispatch,
  getState
) => {
  keygen.createKey((pubKey) => {
    dispatch(setPublicKey(username, pubKey));
    if (onSuccess && typeof onSuccess === "function") onSuccess(pubKey);
  });
};
