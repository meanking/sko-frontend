import { AsyncStorage } from "react-native";
import Config from "react-native-config";

const { BASE_URL } = Config;
if (!BASE_URL) {
  throw new Error("BASE_URL not defined in configuration.");
}

const STORE_AUTH_KEY = "auth.credentials";
const TX_POLL_TIMEOUT = 5000;

const saveCredentials = async ({ username, token }) => {
  const credentials = { username, token };
  await AsyncStorage.setItem(STORE_AUTH_KEY, JSON.stringify(credentials));
  return credentials;
};

/**
 * Removes any stored credentials from internal storage.
 */
const clearCredentials = async () => {
  AsyncStorage.removeItem(STORE_AUTH_KEY);
};

/**
 * Retrieves stored credentials from the internal storage, if any.
 */
const fetchCredentials = async () => {
  const value = await AsyncStorage.getItem(STORE_AUTH_KEY);
  try {
    return JSON.parse(value);
  } catch (e) {
    // credentials could not be deserialized; assume not authenticated
  }
  return null;
};

/**
 * Returns the authentication token stored on the device, if any.
 */
const fetchToken = async () => {
  const credentials = await fetchCredentials();
  return credentials ? credentials.token : null;
};

/**
 * Sends a request to the provided path with the provided parameters.
 * @param {*} path describes the url of the request
 * @param {*} params holds the parameters of the request
 */
const apiFetch = async (path, params) => {
  let options = { ...params };

  const token = await fetchToken();

  if (token === null || token === undefined) {
    throw new Error("session not authenticated");
  }

  if (options && options.body) {
    options.body = JSON.stringify(options.body);
  }

  options = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  };
  return fetch(`${BASE_URL}${path}`, options);
};

const emptyAuthInfo = { username: null };

const authInfoFromCredentials = (credentials) => {
  if (credentials) {
    return { username: credentials.username };
  }
  return emptyAuthInfo;
};

/**
 * Attempts to authenticate the user with provided username and password.
 * @param {String} username claimed username of the user
 * @param {String} password claimed password of the user
 */
const authLogin = async (
  username,
  password,
  publicKey,
  signature,
  { onSuccess, onFailed }
) => {
  const response = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username,
      password,
      public_key: publicKey,
      public_key_signature: signature,
    }),
  });

  const json = await response.json();

  if (!response.ok) {
    const { error, errorCode } = json;

    if (onFailed && typeof onFailed === "function") onFailed(error, errorCode);
  } else {
    const credentials = await saveCredentials({
      username: json.username,
      token: json.token,
    });

    if (onSuccess && typeof onSuccess === "function")
      onSuccess(authInfoFromCredentials(credentials));
  }
};

/**
 * Clears all authentication credentials from the device.
 */
const authLogout = async () => {
  await clearCredentials();
  return emptyAuthInfo;
};

const authInit = async () => {
  const credentials = await fetchCredentials();
  return authInfoFromCredentials(credentials);
};

/**
 * Attempts to create a new user in the system.
 * @param {String} username username for the new user
 * @param {String} password password of the new user
 * @param {String} phone_number phone number of the new user
 */
const authSignup = async (
  username,
  password,
  phone_number,
  signup_public_key,
  scheme
) =>
  fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username,
      password,
      phone_number,
      signup_public_key,
      scheme,
    }),
  });

/**
 * Attempts to create a new user in the system.
 * Only to be used during beta testing.
 * @param {String} username
 * @param {String} password
 * @param {String} phone_number
 * @param {String} beta_key
 */
const authSignupBeta = async (
  username,
  password,
  phone_number,
  signup_public_key,
  scheme,
  beta_key
) =>
  fetch(`${BASE_URL}/signup_beta`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username,
      password,
      phone_number,
      signup_public_key,
      scheme,
      beta_key,
    }),
  });

const authFetchSignupTx = async (token) =>
  fetch(`${BASE_URL}/transactions/signup/${token}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

const userSearch = async (username) =>
  fetch(`${BASE_URL}/users/check/?find_user=${username}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

/**
 * Starts the password change process for a user.
 * @param {String} username username of the user
 */
const initiatePasswordChange = async (username) =>
  fetch(`${BASE_URL}/initiate_change_password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username }),
  });

/**
 * Changes the password of a user.
 * @param {String} username username of the user
 * @param {String} password new password of the user
 * @param {String} code code received via SMS
 */
const changePassword = async (username, password, code, signature, publicKey) =>
  fetch(`${BASE_URL}/change_password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: username,
      new_password: password,
      re_new_password: password,
      code: code,
      signature: signature,
      public_key: publicKey,
    }),
  });

/**
 * Resends the password change code to the user.
 * @param {String} username username of the user
 */
const resendChangePasswordCode = async (username) =>
  fetch(`${BASE_URL}/resend_password_change_code`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user: username,
    }),
  });

const getTxStatus = async (txId) =>
  fetch(`${BASE_URL}/transactions/${txId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

export default {
  authLogin,
  authLogout,
  authInit,
  authSignup,
  authSignupBeta,
  userSearch,
  initiatePasswordChange,
  changePassword,
  resendChangePasswordCode,
  getTxStatus,
  authFetchSignupTx,
  post: (path, options) =>
    apiFetch(path, {
      ...options,
      method: "POST",
    }),
  get: (path, params, options) => {
    let uri = path;

    if (params) {
      const queryString = Object.keys(params)
        .map((key) => `${key}=${params[key]}`)
        .join("&");
      uri = `${uri}/?${queryString}`;
    }

    return apiFetch(uri, {
      ...options,
      method: "GET",
    });
  },
  TX_POLL_TIMEOUT,
};
