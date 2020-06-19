// ///////////////////////////////////////
// Navigation module

// ///////////////////////////////////////
// Actions

const DASHBOARD_SWITCH_TO = "sikoba/navigation/DASHBOARD_SWITCH_TO";

// ///////////////////////////////////////
// Reducer

const initialState = {
  dashboardScreen: "Balance",
};

export default function reducer(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case DASHBOARD_SWITCH_TO:
      return {
        ...state,
        dashboardScreen: payload.screen,
      };
    default:
      return state;
  }
}

// ///////////////////////////////////////
// Action Creators

export const dashboardSwitchTo = (screen) => ({
  type: DASHBOARD_SWITCH_TO,
  payload: { screen },
});
