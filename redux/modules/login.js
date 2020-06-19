// ///////////////////////////////////////
// Login module

import api from "../../api";
import { storeInit } from "./common";

// ///////////////////////////////////////
// Actions

const LOGIN_INIT = "sikoba/login/LOGIN_INIT";
const LOGIN_BEGIN = "sikoba/login/LOGIN_BEGIN";
const LOGIN_SUCCESS = "sikoba/login/LOGIN_SUCCESS";
const LOGIN_FAILURE = "sikoba/login/LOGIN_FAILURE";

// ///////////////////////////////////////
// Reducer

const initialState = {
  username: null,
  error: null,
  initialized: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN_INIT:
      return {
        ...state,
        username: action.payload.username,
        initialized: true,
      };
    case LOGIN_BEGIN:
      return {
        ...state,
        username: null,
        error: null,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        username: action.payload.username,
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        error: action.payload.error,
      };
    default:
      return state;
  }
}

// ///////////////////////////////////////
// Selectors

export const getHandle = (state) => state.login.username;

// ///////////////////////////////////////
// Action Creators

export const loginInit = ({ username }) => ({
  type: LOGIN_INIT,
  payload: {
    username,
  },
});

export const loginBegin = () => ({
  type: LOGIN_BEGIN,
});

export const loginSuccess = ({ username }) => ({
  type: LOGIN_SUCCESS,
  payload: {
    username,
  },
});

export const loginFailure = (error) => ({
  type: LOGIN_FAILURE,
  payload: { error },
});

// ///////////////////////////////////////
// pseudo-Action Creators

const login = (
  username,
  password,
  publicKey,
  signature,
  { onSuccess, onFailed }
) => async (dispatch) => {
  dispatch(loginBegin());

  await api.authLogin(username, password, publicKey, signature, {
    onSuccess: (authInfo) => {
      dispatch(loginSuccess(authInfo));
      if (onSuccess && typeof onSuccess === "function") {
        onSuccess(authInfo);
      }
    },
    onFailed: (message, errorCode) => {
      dispatch(loginFailure(message));
      if (onFailed && typeof onFailed === "function") {
        onFailed(errorCode);
      }
    },
  });
};

const init = () => async (dispatch) => {
  const userInfo = await api.authInit();
  dispatch(loginInit(userInfo));
};

const logout = (callback) => async (dispatch) => {
  const userInfo = await api.authLogout();
  dispatch(storeInit());
  dispatch(loginInit(userInfo));

  if (callback) {
    callback();
  }

  dispatch({ type: "USER_LOGOUT" });
};

export const actions = {
  login,
  init,
  logout,
};
