// ///////////////////////////////////////
// Contexts module
// Contains data to display in the Balance Screen
// Ie. net context amounts and next settlements

import api from "../../api";
import { STORE_INIT } from "./common";
import { AsyncStorage } from "react-native";
import { ContextType } from "../../lib/types";

const STORE_CONTEXT_KEY = "context.selected";

// Define contexts
export const SikobaContext = { displayName: "Sikoba", idName: "sikoba" };
export const BekiContext = { displayName: "e-Beki", idName: "beki" };

export const getContexts = () => ({
  SikobaContext,
  BekiContext,
});

// ///////////////////////////////////////
// Actions

// load contexts
const CHANGE_CONTEXT = "sikoba/context/CHANGE_CONTEXT";

// ///////////////////////////////////////
// Reducer

/**
 * By default, the app should start in the sikobaPay context,
 * unless a different context is written in internal storage.
 */
const initialState = {
  currentContext: SikobaContext,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_CONTEXT:
      const { newContext } = action.payload;

      AsyncStorage.setItem(STORE_CONTEXT_KEY, JSON.stringify(newContext));

      return { ...state, currentContext: newContext };

    case STORE_INIT:
      return initialState;
    default:
      return state;
  }
}

// ///////////////////////////////////////
// Selectors

// load contexts
// export const areContextsLoading = (state) =>
//   state.context.contexts.status === LoadContextsState.LOADING_CONTEXTS;

// ///////////////////////////////////////
// Action Creators

// change context
export const changeContext = (newContext) => {
  return {
    type: CHANGE_CONTEXT,
    payload: { newContext },
  };
};

// ///////////////////////////////////////
// pseudo-Action Creators

const loadContext = () => async (dispatch, getState) => {
  const data = await AsyncStorage.getItem(STORE_CONTEXT_KEY);
  try {
    const ctx = JSON.parse(data);
    if (ctx) dispatch(changeContext(ctx));
  } catch (e) {
    console.log(e);
  }
  return null;
};

export const actions = {
  loadContext,
};
