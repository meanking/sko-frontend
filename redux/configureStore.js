import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import reducers from "./modules/reducers";

const rootReducer = (state, action) => {
  if (action.type === "USER_LOGOUT") {
    state = undefined;
  }

  return appReducer(state, action);
};
const appReducer = combineReducers(reducers);
let middleware = applyMiddleware(thunk);

/* eslint-disable no-underscore-dangle */
const compose = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
if (compose) {
  middleware = compose(middleware);
}
export default function configureStore(initialState) {
  return createStore(rootReducer, initialState, middleware);
}
/* eslint-enable */
