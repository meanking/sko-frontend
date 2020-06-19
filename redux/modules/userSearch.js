// ///////////////////////////////////////
// UserSearch module

import api from "../../api";

export const SearchUserState = {
  IDLE: -1,
  NOT_FOUND: 0,
  FOUND: 1,
  SEARCHING: 2
};

// ///////////////////////////////////////
// Actions

const SEARCH_USER_BEGIN = "sikoba/userSearch/SEARCH_USER_BEGIN";
const SEARCH_USER_SUCCESS = "sikoba/userSearch/SEARCH_USER_SUCCESS";
const SEARCH_USER_FAILURE = "sikoba/userSearch/SEARCH_USER_FAILURE";
const SEARCH_USER_RESET = "sikoba/userSearch/SEARCH_USER_RESET";

// ///////////////////////////////////////
// Reducer

const initialState = {
  state: SearchUserState.IDLE,
  user: null
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SEARCH_USER_BEGIN:
      return {
        ...state,
        state: SearchUserState.SEARCHING,
        user: null
      };
    case SEARCH_USER_SUCCESS:
      return {
        ...state,
        state: SearchUserState.FOUND,
        user: action.payload.user
      };
    case SEARCH_USER_FAILURE:
      return {
        ...state,
        state: SearchUserState.NOT_FOUND,
        user: null
      };
    case SEARCH_USER_RESET:
      return {
        ...state,
        state: SearchUserState.IDLE,
        user: null
      };
    default:
      return state;
  }
}

// ///////////////////////////////////////
// Action Creators

export const searchUserBegin = () => ({
  type: SEARCH_USER_BEGIN
});

export const searchUserSuccess = user => ({
  type: SEARCH_USER_SUCCESS,
  payload: { user }
});

export const searchUserFailure = error => ({
  type: SEARCH_USER_FAILURE,
  payload: { error }
});

export const resetUserSearch = () => ({
  type: SEARCH_USER_RESET
});

// ///////////////////////////////////////
// pseudo-Action Creators
export const searchUserNonAuth = (
  username,
  { onSuccess, onFailed }
) => async dispatch => {
  dispatch(searchUserBegin());

  const response = await api.userSearch(username);

  if (!response.ok) {
    dispatch(searchUserFailure(response.statusText));
    if (onFailed && typeof onFailed === "function") {
      onFailed();
    }
    return;
  }

  let stringed = JSON.stringify(await response.json());
  let parsed = JSON.parse(stringed);
  dispatch(searchUserSuccess(parsed.user));
  if (onSuccess && typeof onSuccess === "function") {
    onSuccess();
  }
};

export const searchUser = (
  user_data,
  { onSuccess, onFailed }
) => async dispatch => {
  dispatch(searchUserBegin());

  const response = await api.get(`/users/?find_user=${user_data}`); // TODO rename api endpoint

  if (!response.ok) {
    dispatch(searchUserFailure(response.statusText));
    if (onFailed && typeof onFailed === "function") {
      onFailed();
    }
    return;
  }

  let stringed = JSON.stringify(await response.json());
  let parsed = JSON.parse(stringed);
  dispatch(searchUserSuccess(parsed.user));
  if (onSuccess && typeof onSuccess === "function") {
    onSuccess();
  }
};
