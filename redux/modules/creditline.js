// ///////////////////////////////////////
// Credit Line module

import every from "lodash/every";
import some from "lodash/some";
import isNumber from "lodash/isNumber";
import isString from "lodash/isString";
import isEmpty from "lodash/isEmpty";
import { CreditLineType } from "../../lib/types";
import api from "../../api";

import { STORE_INIT } from "./common";

import * as cryptographyModule from "./cryptography";

// credit line creation
export const CreateCreditLineState = {
  CREATING: 0,
  WAITING_TX_RESPONSE: 1,
  CREATE_SUCCESS: 2,
  CREATE_FAILED: 3,
};

export const TxStatus = {
  FAILED: 0,
  SUCCESS: 1,
};

// accept credit line
export const AcceptCreditLineState = {
  ACCEPTING: 0,
  WAITING_TX_RESPONSE: 1,
  ACCEPT_SUCCESS: 2,
  ACCEPT_FAILED: 3,
};

// reject credit line
export const RejectCreditLineState = {
  REJECTING: 0,
  WAITING_TX_RESPONSE: 1,
  REJECT_SUCCESS: 2,
  REJECT_FAILED: 3,
};

// cancel credit line
export const CancelCreditLineState = {
  CANCELING: 0,
  WAITING_TX_RESPONSE: 1,
  CANCEL_SUCCESS: 2,
  CANCEL_FAILED: 3,
};

// freeze credit line
export const FreezeCreditLineState = {
  FREEZING: 0,
  WAITING_TX_RESPONSE: 1,
  FREEZE_SUCCESS: 2,
  FREEZE_FAILED: 3,
};

// unfreeze credit line
export const UnfreezeCreditLineState = {
  UNFREEZING: 0,
  WAITING_TX_RESPONSE: 1,
  UNFREEZE_SUCCESS: 2,
  UNFREEZE_FAILED: 3,
};

// set up conversion profile
export const SetUpConversionProfileState = {
  SETTING: 0,
  WAITING_TX_RESPONSE: 1,
  SET_SUCCESS: 2,
  SET_FAILED: 3,
};

// granting permit
export const GrantConversionPermitState = {
  GRANTING: 0,
  WAITING_TX_RESPONSE: 1,
  GRANT_SUCCESS: 2,
  GRANT_FAILED: 3,
};

// revoking permit
export const RevokeConversionPermitState = {
  REVOKING: 0,
  WAITING_TX_RESPONSE: 1,
  REVOKE_SUCCESS: 2,
  REVOKE_FAILED: 3,
};

// all credit lines loading
export const CreditLineState = {
  LOADING_CREDIT_LINES: "Loading credit lines",
  LOADING_CREDIT_LINES_SUCCESS: "Loading credit lines success",
  LOADING_CREDIT_LINES_FAILED: "Loading credit lines failed",
  REFRESHING_CREDIT_LINES: "Refreshing credit lines",
  UPDATING_CREDIT_LINES: "Updating credit lines",
};

// single credit line loading
export const SingleCreditLineState = {
  LOADING_SINGLE_CREDIT_LINE: "Loading single credit line",
  LOADING_SINGLE_CREDIT_LINE_SUCCESS: "Loading single credit line success",
  LOADING_SINGLE_CREDIT_LINE_FAILED: "Loading single credit line failed",
  REFRESHING_SINGLE_CREDIT_LINE: "Refreshing single credit line",
  UPDATING_SINGLE_CREDIT_LINE: "Updating single credit line",
};

// ///////////////////////////////////////
// Actions

// credit line creation
// setting various data during creation
const SET_RECIPIENT = "sikoba/credit_line/SET_RECIPIENT";
const SET_CURRENCY = "sikoba/credit_line/SET_CURRENCY";
const SET_AMOUNT = "sikoba/credit_line/SET_AMOUNT";
const SET_TIME_TARGET = "sikoba/credit_line/SET_TIME_TARGET";
const SET_ONE_TIME_FEE = "sikoba/credit_line/SET_ONE_TIME_FEE";
const SET_INTEREST = "sikoba/credit_line/SET_INTEREST";

const CREATE_CREDIT_LINE_BEGIN = "sikoba/credit_line/CREATE_CREDIT_LINE_BEGIN";
const CREATE_CREDIT_LINE_WAITING_TX_RESPONSE =
  "sikoba/credit_line/CREATE_CREDIT_LINE_WAITING_TX_RESPONSE";
const CREATE_CREDIT_LINE_SUCCESS =
  "sikoba/credit_line/CREATE_CREDIT_LINE_SUCCESS";
const CREATE_CREDIT_LINE_FAILURE =
  "sikoba/credit_line/CREATE_CREDIT_LINE_FAILURE";
const CREATE_CREDIT_LINE_RESET = "sikoba/credit_line/CREATE_CREDIT_LINE_RESET";
const CREATE_CREDIT_LINE_RESET_STATUS =
  "sikoba/credit_line/CREATE_CREDIT_LINE_RESET_STATUS";

// accept credit line
const ACCEPT_CREDIT_LINE_BEGIN = "sikoba/credit_line/ACCEPT_CREDIT_LINE_BEGIN";
const ACCEPT_CREDIT_LINE_WAITING_TX_RESPONSE =
  "sikoba/credit_line/ACCEPT_CREDIT_LINE_WAITING_TX_RESPONSE";
const ACCEPT_CREDIT_LINE_SUCCESS =
  "sikoba/credit_line/ACCEPT_CREDIT_LINE_SUCCESS";
const ACCEPT_CREDIT_LINE_FAILURE =
  "sikoba/credit_line/ACCEPT_CREDIT_LINE_FAILURE";

// reject credit line
const REJECT_CREDIT_LINE_BEGIN = "sikoba/credit_line/REJECT_CREDIT_LINE_BEGIN";
const REJECT_CREDIT_LINE_WAITING_TX_RESPONSE =
  "sikoba/credit_line/REJECT_CREDIT_LINE_WAITING_TX_RESPONSE";
const REJECT_CREDIT_LINE_SUCCESS =
  "sikoba/credit_line/REJECT_CREDIT_LINE_SUCCESS";
const REJECT_CREDIT_LINE_FAILURE =
  "sikoba/credit_line/REJECT_CREDIT_LINE_FAILURE";

// cancel credit line
const CANCEL_CREDIT_LINE_BEGIN = "sikoba/credit_line/CANCEL_CREDIT_LINE_BEGIN";
const CANCEL_CREDIT_LINE_WAITING_TX_RESPONSE =
  "sikoba/credit_line/CANCEL_CREDIT_LINE_WAITING_TX_RESPONSE";
const CANCEL_CREDIT_LINE_SUCCESS =
  "sikoba/credit_line/CANCEL_CREDIT_LINE_SUCCESS";
const CANCEL_CREDIT_LINE_FAILURE =
  "sikoba/credit_line/CANCEL_CREDIT_LINE_FAILURE";

// freeze credit line
const FREEZE_CREDIT_LINE_BEGIN = "sikoba/credit_line/FREEZE_CREDIT_LINE_BEGIN";
const FREEZE_CREDIT_LINE_WAITING_TX_RESPONSE =
  "sikoba/credit_line/FREEZE_CREDIT_LINE_WAITING_TX_RESPONSE";
const FREEZE_CREDIT_LINE_SUCCESS =
  "sikoba/credit_line/FREEZE_CREDIT_LINE_SUCCESS";
const FREEZE_CREDIT_LINE_FAILURE =
  "sikoba/credit_line/FREEZE_CREDIT_LINE_FAILURE";

// unfreeze credit line
const UNFREEZE_CREDIT_LINE_BEGIN =
  "sikoba/credit_line/UNFREEZE_CREDIT_LINE_BEGIN";
const UNFREEZE_CREDIT_LINE_WAITING_TX_RESPONSE =
  "sikoba/credit_line/UNFREEZE_CREDIT_LINE_WAITING_TX_RESPONSE";
const UNFREEZE_CREDIT_LINE_SUCCESS =
  "sikoba/credit_line/UNFREEZE_CREDIT_LINE_SUCCESS";
const UNFREEZE_CREDIT_LINE_FAILURE =
  "sikoba/credit_line/UNFREEZE_CREDIT_LINE_FAILURE";

// set up conversion profile
const SET_UP_CONVERSION_PROFILE_GLOBAL_MAX =
  "sikoba/credit_line/SET_UP_CONVERSION_PROFILE_GLOBAL_MAX";
const SET_UP_CONVERSION_PROFILE_SINGLE_MAX =
  "sikoba/credit_line/SET_UP_CONVERSION_PROFILE_SINGLE_MAX";

// operational
const SET_UP_CONVERSION_PROFILE_BEGIN =
  "sikoba/credit_line/SET_UP_CONVERSION_PROFILE_BEGIN";
const SET_UP_CONVERSION_PROFILE_WAITING_TX_RESPONSE =
  "sikoba/credit_line/SET_UP_CONVERSION_PROFILE_WAITING_TX_RESPONSE";
const SET_UP_CONVERSION_PROFILE_SUCCESS =
  "sikoba/credit_line/SET_UP_CONVERSION_PROFILE_SUCCESS";
const SET_UP_CONVERSION_PROFILE_FAILURE =
  "sikoba/credit_line/SET_UP_CONVERSION_PROFILE_FAILURE";

// grant conversion permit
// set params
const SET_GRANTEE = "sikoba/credit_line/SET_GRANTEE";
const SET_SINGLE_MAX = "sikoba/credit_line/SET_SINGLE_MAX";
const SET_CREDIT_LINE_ID = "sikoba/credit_line/SET_CREDIT_LINE_ID";
const SET_CONVERSION_FEE = "sikoba/credit_line/SET_CONVERSION_FEE";

// operational
const GRANT_CONVERSION_PERMIT_BEGIN =
  "sikoba/credit_line/GRANT_CONVERSION_PERMIT_BEGIN";
const GRANT_CONVERSION_PERMIT_WAITING_TX_RESPONSE =
  "sikoba/credit_line/GRANT_CONVERSION_PERMIT_WAITING_TX_RESPONSE";
const GRANT_CONVERSION_PERMIT_SUCCESS =
  "sikoba/credit_line/GRANT_CONVERSION_PERMIT_SUCCESS";
const GRANT_CONVERSION_PERMIT_FAILURE =
  "sikoba/credit_line/GRANT_CONVERSION_PERMIT_FAILURE";
const GRANT_CONVERSION_PERMIT_RESET_STATUS =
  "sikoba/credit_line/GRANT_CONVERSION_PERMIT_RESET_STATUS";

// revoke conversion permit
const REVOKE_CONVERSION_PERMIT_BEGIN =
  "sikoba/credit_line/REVOKE_CONVERSION_PERMIT_BEGIN";
const REVOKE_CONVERSION_PERMIT_WAITING_TX_RESPONSE =
  "sikoba/credit_line/REVOKE_CONVERSION_PERMIT_WAITING_TX_RESPONSE";
const REVOKE_CONVERSION_PERMIT_SUCCESS =
  "sikoba/credit_line/REVOKE_CONVERSION_PERMIT_SUCCESS";
const REVOKE_CONVERSION_PERMIT_FAILURE =
  "sikoba/credit_line/REVOKE_CONVERSION_PERMIT_FAILURE";

// all credit lines loading
const LOAD_BEGIN = "sikoba/credit_line/LOAD_BEGIN";
const LOAD_SUCCESS = "sikoba/credit_line/LOAD_SUCCESS";
const LOAD_FAILURE = "sikoba/credit_line/LOAD_FAILURE";
const REFRESH_BEGIN = "sikoba/credit_line/REFRESH_BEGIN";
const UPDATE_CREDIT_LINES = "sikoba/credit_line/UPDATE_CREDIT_LINES";

// single credit line loading
const LOAD_SINGLE_CREDIT_LINE_BEGIN =
  "sikoba/credit_line/LOAD_SINGLE_CREDIT_LINE_BEGIN";
const LOAD_SINGLE_CREDIT_LINE_SUCCESS =
  "sikoba/credit_line/LOAD_SINGLE_CREDIT_LINE_SUCCESS";
const LOAD_SINGLE_CREDIT_LINE_FAILURE =
  "sikoba/credit_line/LOAD_SINGLE_CREDIT_LINE_FAILURE";
const REFRESH_SINGLE_CREDIT_LINE_BEGIN =
  "sikoba/credit_line/REFRESH_SINGLE_CREDIT_LINE_BEGIN";
const UPDATE_SINGLE_CREDIT_LINE =
  "sikoba/credit_line/UPDATE_SINGLE_CREDIT_LINE";

// inspecting credit line
const INSPECT_CREDIT_LINE = "sikoba/credit_line/INSPECT_CREDIT_LINE";
const CLEAR_INSPECT_CREDIT_LINE =
  "sikoba/credit_line/CLEAR_INSPECT_CREDIT_LINE";

// ///////////////////////////////////////
// Reducer

const initialState = {
  recipient: null,
  currency: { id: null, isoCode: null, symbol: null, fullName: null },
  amount: null,
  timeTarget: null,
  oneTimeFee: null,
  interest: null,
  tx: null,
  status: null,
  errorMessage: null,
  //
  acceptCreditLine: { status: null, tx: null, errorMessage: null },
  rejectCreditLine: { status: null, tx: null, errorMessage: null },
  cancelCreditLine: { status: null, tx: null, errorMessage: null },
  freezeCreditLine: { status: null, tx: null, errorMessage: null },
  unfreezeCreditLine: { status: null, tx: null, errorMessage: null },
  setUpConversionProfile: {
    params: { globalMax: null, singleMax: null },
    status: null,
    tx: null,
    errorMessage: null,
  },
  grantConversionPermit: {
    params: {
      grantee: null,
      singleMax: null,
      conversionFee: null,
      creditLineId: null,
    },
    status: null,
    tx: null,
    errorMessage: null,
  },
  revokeConversionPermit: { status: null, tx: null, errorMessage: null },
  //
  creditLinesStatus: null,
  creditlines: null,
  creditLinesErrorMessage: null,
  //
  inspectCreditLineId: null,
  singleCreditLine: { status: null, creditLine: null, errorMessage: null },
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_RECIPIENT:
      return {
        ...state,
        recipient: action.payload.recipient,
      };
    case SET_CURRENCY:
      const currency = action.payload.currency;
      return {
        ...state,
        currency: {
          id: currency.id,
          isoCode: currency.iso_code,
          fullName: currency.full_name,
          symbol: currency.symbol,
        },
      };
    case SET_AMOUNT:
      return {
        ...state,
        amount: action.payload.amount,
      };
    case SET_TIME_TARGET:
      return {
        ...state,
        timeTarget: action.payload.timeTarget,
      };
    case SET_ONE_TIME_FEE:
      return {
        ...state,
        oneTimeFee: action.payload.oneTimeFee,
      };
    case SET_INTEREST:
      return { ...state, interest: action.payload.interest };

    case CREATE_CREDIT_LINE_BEGIN:
      return {
        ...state,
        status: CreateCreditLineState.CREATING,
        tx: null,
      };
    case CREATE_CREDIT_LINE_WAITING_TX_RESPONSE:
      return {
        ...state,
        status: CreateCreditLineState.WAITING_TX_RESPONSE,
        tx: {
          ...state.tx,
          id: action.payload.txId,
          remainingAttempts: action.payload.remainingAttempts,
        },
      };
    case CREATE_CREDIT_LINE_SUCCESS:
      return {
        ...state,
        status: CreateCreditLineState.CREATE_SUCCESS,
        tx: {
          ...state.tx,
          status: TxStatus.SUCCESS,
        },
      };
    case CREATE_CREDIT_LINE_FAILURE:
      return {
        ...state,
        errorMessage: action.payload.error,
        status: CreateCreditLineState.CREATE_FAILED,
      };
    case CREATE_CREDIT_LINE_RESET_STATUS:
      return {
        ...state,
        status: null,
        tx: null,
      };
    case CREATE_CREDIT_LINE_RESET:
      return {
        ...state,
        recipient: null,
        currency: null,
        amount: null,
        timeTarget: null,
        interest: null,
        tx: null,
        status: null,
        errorMessage: null,
      };

    // accept credit line
    case ACCEPT_CREDIT_LINE_BEGIN:
      return {
        ...state,
        acceptCreditLine: {
          ...state.acceptCreditLine,
          status: AcceptCreditLineState.ACCEPTING,
          tx: null,
        },
      };
    case ACCEPT_CREDIT_LINE_WAITING_TX_RESPONSE:
      return {
        ...state,
        acceptCreditLine: {
          ...state.acceptCreditLine,
          status: AcceptCreditLineState.WAITING_TX_RESPONSE,
          tx: {
            ...state.acceptCreditLine.tx,
            id: action.payload.txId,
            remainingAttempts: action.payload.remainingAttempts,
          },
        },
      };
    case ACCEPT_CREDIT_LINE_SUCCESS:
      return {
        ...state,
        acceptCreditLine: {
          ...state.acceptCreditLine,
          status: AcceptCreditLineState.ACCEPT_SUCCESS,
          tx: {
            ...state.acceptCreditLine.tx,
            status: TxStatus.SUCCESS,
          },
        },
      };
    case ACCEPT_CREDIT_LINE_FAILURE:
      return {
        ...state,
        acceptCreditLine: {
          ...state.acceptCreditLine,
          errorMessage: action.payload.error,
          status: AcceptCreditLineState.ACCEPT_FAILED,
        },
      };

    // reject credit line
    case REJECT_CREDIT_LINE_BEGIN:
      return {
        ...state,
        rejectCreditLine: {
          ...state.rejectCreditLine,
          status: RejectCreditLineState.REJECTING,
          tx: null,
        },
      };
    case REJECT_CREDIT_LINE_WAITING_TX_RESPONSE:
      return {
        ...state,
        rejectCreditLine: {
          ...state.rejectCreditLine,
          status: RejectCreditLineState.WAITING_TX_RESPONSE,
          tx: {
            ...state.rejectCreditLine.tx,
            id: action.payload.txId,
            remainingAttempts: action.payload.remainingAttempts,
          },
        },
      };
    case REJECT_CREDIT_LINE_SUCCESS:
      return {
        ...state,
        rejectCreditLine: {
          ...state.rejectCreditLine,
          status: RejectCreditLineState.REJECT_SUCCESS,
          tx: {
            ...state.rejectCreditLine.tx,
            status: TxStatus.SUCCESS,
          },
        },
      };
    case REJECT_CREDIT_LINE_FAILURE:
      return {
        ...state,
        rejectCreditLine: {
          ...state.rejectCreditLine,
          errorMessage: action.payload.error,
          status: RejectCreditLineState.REJECT_FAILED,
        },
      };

    // cancel credit line
    case CANCEL_CREDIT_LINE_BEGIN:
      return {
        ...state,
        cancelCreditLine: {
          ...state.cancelCreditLine,
          status: CancelCreditLineState.CANCELING,
          tx: null,
        },
      };
    case CANCEL_CREDIT_LINE_WAITING_TX_RESPONSE:
      return {
        ...state,
        cancelCreditLine: {
          ...state.cancelCreditLine,
          status: CancelCreditLineState.WAITING_TX_RESPONSE,
          tx: {
            ...state.cancelCreditLine.tx,
            id: action.payload.txId,
            remainingAttempts: action.payload.remainingAttempts,
          },
        },
      };
    case CANCEL_CREDIT_LINE_SUCCESS:
      return {
        ...state,
        cancelCreditLine: {
          ...state.cancelCreditLine,
          status: CancelCreditLineState.CANCEL_SUCCESS,
          tx: {
            ...state.cancelCreditLine.tx,
            status: TxStatus.SUCCESS,
          },
        },
      };
    case CANCEL_CREDIT_LINE_FAILURE:
      return {
        ...state,
        cancelCreditLine: {
          ...state.cancelCreditLine,
          errorMessage: action.payload.error,
          status: CancelCreditLineState.CANCEL_FAILED,
        },
      };

    // freeze credit line
    case FREEZE_CREDIT_LINE_BEGIN:
      return {
        ...state,
        freezeCreditLine: {
          ...state.freezeCreditLine,
          status: FreezeCreditLineState.FREEZING,
          tx: null,
        },
      };
    case FREEZE_CREDIT_LINE_WAITING_TX_RESPONSE:
      return {
        ...state,
        freezeCreditLine: {
          ...state.freezeCreditLine,
          status: FreezeCreditLineState.WAITING_TX_RESPONSE,
          tx: {
            ...state.freezeCreditLine.tx,
            id: action.payload.txId,
            remainingAttempts: action.payload.remainingAttempts,
          },
        },
      };
    case FREEZE_CREDIT_LINE_SUCCESS:
      return {
        ...state,
        freezeCreditLine: {
          ...state.freezeCreditLine,
          status: FreezeCreditLineState.FREEZE_SUCCESS,
          tx: {
            ...state.freezeCreditLine.tx,
            status: TxStatus.SUCCESS,
          },
        },
      };
    case FREEZE_CREDIT_LINE_FAILURE:
      return {
        ...state,
        freezeCreditLine: {
          ...state.freezeCreditLine,
          errorMessage: action.payload.error,
          status: FreezeCreditLineState.FREEZE_FAILED,
        },
      };

    // unfreeze credit line
    case UNFREEZE_CREDIT_LINE_BEGIN:
      return {
        ...state,
        unfreezeCreditLine: {
          ...state.unfreezeCreditLine,
          status: UnfreezeCreditLineState.UNFREEZING,
          tx: null,
        },
      };
    case UNFREEZE_CREDIT_LINE_WAITING_TX_RESPONSE:
      return {
        ...state,
        unfreezeCreditLine: {
          ...state.unfreezeCreditLine,
          status: UnfreezeCreditLineState.WAITING_TX_RESPONSE,
          tx: {
            ...state.unfreezeCreditLine.tx,
            id: action.payload.txId,
            remainingAttempts: action.payload.remainingAttempts,
          },
        },
      };
    case UNFREEZE_CREDIT_LINE_SUCCESS:
      return {
        ...state,
        unfreezeCreditLine: {
          ...state.unfreezeCreditLine,
          status: UnfreezeCreditLineState.UNFREEZE_SUCCESS,
          tx: {
            ...state.unfreezeCreditLine.tx,
            status: TxStatus.SUCCESS,
          },
          freezeCreditLine: { status: null, tx: null },
        },
      };
    case UNFREEZE_CREDIT_LINE_FAILURE:
      return {
        ...state,
        unfreezeCreditLine: {
          ...state.unfreezeCreditLine,
          errorMessage: action.payload.error,
          status: UnfreezeCreditLineState.UNFREEZE_FAILED,
        },
      };

    // set up conversion profile
    case SET_UP_CONVERSION_PROFILE_GLOBAL_MAX:
      return {
        ...state,
        setUpConversionProfile: {
          ...state.setUpConversionProfile,
          params: {
            ...state.setUpConversionProfile.params,
            globalMax: action.payload.globalMax,
          },
        },
      };
    case SET_UP_CONVERSION_PROFILE_SINGLE_MAX:
      return {
        ...state,
        setUpConversionProfile: {
          ...state.setUpConversionProfile,
          params: {
            ...state.setUpConversionProfile.params,
            singleMax: action.payload.singleMax,
          },
        },
      };

    case SET_UP_CONVERSION_PROFILE_BEGIN:
      return {
        ...state,
        setUpConversionProfile: {
          ...state.setUpConversionProfile,
          status: SetUpConversionProfileState.SETTING,
          tx: null,
        },
      };
    case SET_UP_CONVERSION_PROFILE_WAITING_TX_RESPONSE:
      return {
        ...state,
        setUpConversionProfile: {
          ...state.setUpConversionProfile,
          status: SetUpConversionProfileState.WAITING_TX_RESPONSE,
          tx: {
            ...state.setUpConversionProfile.tx,
            id: action.payload.txId,
            remainingAttempts: action.payload.remainingAttempts,
          },
        },
      };
    case SET_UP_CONVERSION_PROFILE_SUCCESS:
      return {
        ...state,
        setUpConversionProfile: {
          ...state.setUpConversionProfile,
          status: SetUpConversionProfileState.SET_SUCCESS,
          tx: {
            ...state.setUpConversionProfile.tx,
            status: TxStatus.SUCCESS,
          },
          params: {
            ...state.setUpConversionProfile.params,
            status: null,
            tx: null,
          },
        },
      };
    case SET_UP_CONVERSION_PROFILE_FAILURE:
      return {
        ...state,
        setUpConversionProfile: {
          ...state.setUpConversionProfile,
          errorMessage: action.payload.error,
          status: SetUpConversionProfileState.SET_FAILED,
        },
      };

    // grant conversion permit
    // set params
    case SET_GRANTEE:
      return {
        ...state,
        grantConversionPermit: {
          ...state.grantConversionPermit,
          params: {
            ...state.grantConversionPermit.params,
            grantee: action.payload.grantee,
          },
        },
      };
    case SET_SINGLE_MAX:
      return {
        ...state,
        grantConversionPermit: {
          ...state.grantConversionPermit,
          params: {
            ...state.grantConversionPermit.params,
            singleMax: action.payload.singleMax,
          },
        },
      };
    case SET_CREDIT_LINE_ID: {
      return {
        ...state,
        grantConversionPermit: {
          ...state.grantConversionPermit,
          params: {
            ...state.grantConversionPermit.params,
            creditLineId: action.payload.creditLineId,
          },
        },
      };
    }
    case SET_CONVERSION_FEE: {
      return {
        ...state,
        grantConversionPermit: {
          ...state.grantConversionPermit,
          params: {
            ...state.grantConversionPermit.params,
            conversionFee: action.payload.conversionFee,
          },
        },
      };
    }
    case GRANT_CONVERSION_PERMIT_BEGIN:
      return {
        ...state,
        grantConversionPermit: {
          ...state.grantConversionPermit,
          status: GrantConversionPermitState.GRANTING,
          tx: null,
        },
      };
    case GRANT_CONVERSION_PERMIT_WAITING_TX_RESPONSE:
      return {
        ...state,
        grantConversionPermit: {
          ...state.grantConversionPermit,
          status: GrantConversionPermitState.WAITING_TX_RESPONSE,
          tx: {
            ...state.grantConversionPermit.tx,
            id: action.payload.txId,
            remainingAttempts: action.payload.remainingAttempts,
          },
        },
      };
    case GRANT_CONVERSION_PERMIT_SUCCESS:
      return {
        ...state,
        grantConversionPermit: {
          ...state.grantConversionPermit,
          status: GrantConversionPermitState.GRANT_SUCCESS,
          tx: {
            ...state.grantConversionPermit.tx,
            status: TxStatus.SUCCESS,
          },
          params: {
            ...state.grantConversionPermit.params,
            status: null,
            tx: null,
          },
        },
      };
    case GRANT_CONVERSION_PERMIT_FAILURE:
      return {
        ...state,
        grantConversionPermit: {
          ...state.grantConversionPermit,
          errorMessage: action.payload.error,
          status: GrantConversionPermitState.GRANT_FAILED,
        },
      };
    case GRANT_CONVERSION_PERMIT_RESET_STATUS:
      return {
        ...state,
        grantConversionPermit: {
          ...state.grantConversionPermit,
          status: null,
          tx: null,
          errorMessage: null,
        },
      };

    // revoke conversion permit
    case REVOKE_CONVERSION_PERMIT_BEGIN:
      return {
        ...state,
        revokeConversionPermit: {
          ...state.revokeConversionPermit,
          status: RevokeConversionPermitState.REVOKING,
          tx: null,
        },
      };
    case REVOKE_CONVERSION_PERMIT_WAITING_TX_RESPONSE:
      return {
        ...state,
        revokeConversionPermit: {
          ...state.revokeConversionPermit,
          status: RevokeConversionPermitState.WAITING_TX_RESPONSE,
          tx: {
            ...state.revokeConversionPermit.tx,
            id: action.payload.txId,
            remainingAttempts: action.payload.remainingAttempts,
          },
        },
      };
    case REVOKE_CONVERSION_PERMIT_SUCCESS:
      return {
        ...state,
        revokeConversionPermit: {
          ...state.revokeConversionPermit,
          status: RevokeConversionPermitState.REVOKE_SUCCESS,
          tx: {
            ...state.revokeConversionPermit.tx,
            status: TxStatus.SUCCESS,
          },
          params: {
            ...state.revokeConversionPermit.params,
            status: null,
            tx: null,
          },
        },
      };
    case REVOKE_CONVERSION_PERMIT_FAILURE:
      return {
        ...state,
        revokeConversionPermit: {
          ...state.revokeConversionPermit,
          errorMessage: action.payload.error,
          status: RevokeConversionPermitState.REVOKE_FAILED,
        },
      };

    case INSPECT_CREDIT_LINE:
      const { creditLineId } = action.payload;
      return { ...state, inspectCreditLineId: creditLineId };
    case CLEAR_INSPECT_CREDIT_LINE:
      return {
        ...state,
        inspectCreditLineId: null,
        singleCreditLine: {
          status: null,
          creditLine: null,
          errorMessage: null,
        },
      };

    // load credit lines
    case LOAD_BEGIN:
      return {
        ...state,
        creditLinesStatus: CreditLineState.LOADING_CREDIT_LINES,
      };
    case LOAD_SUCCESS:
      return {
        ...state,
        creditLinesStatus: CreditLineState.LOADING_CREDIT_LINES_SUCCESS,
        creditlines: action.payload.credit_lines,
      };
    case LOAD_FAILURE:
      return {
        ...state,
        creditLinesStatus: CreditLineState.LOADING_CREDIT_LINES_FAILED,
        creditLinesErrorMessage: action.payload.error,
      };
    case REFRESH_BEGIN:
      return {
        ...state,
        creditLinesStatus: CreditLineState.REFRESHING_CREDIT_LINES,
      };
    case UPDATE_CREDIT_LINES:
      return {
        ...state,
        creditLinesStatus: CreditLineState.UPDATING_CREDIT_LINES,
      };

    // load single credit line
    case LOAD_SINGLE_CREDIT_LINE_BEGIN:
      return {
        ...state,
        singleCreditLine: {
          ...state.singleCreditLine,
          status: SingleCreditLineState.LOADING_SINGLE_CREDIT_LINE,
        },
      };
    case LOAD_SINGLE_CREDIT_LINE_SUCCESS:
      const cl = action.payload.credit_line;
      return {
        ...state,
        singleCreditLine: {
          ...state.singleCreditLine,
          creditLine: cl,
          status: SingleCreditLineState.LOADING_SINGLE_CREDIT_LINE_SUCCESS,
        },
      };
    case LOAD_SINGLE_CREDIT_LINE_FAILURE:
      return {
        ...state,
        singleCreditLine: {
          ...state.singleCreditLine,
          status: SingleCreditLineState.LOADING_SINGLE_CREDIT_LINE_FAILED,
          errorMessage: action.payload.error,
        },
      };
    case REFRESH_SINGLE_CREDIT_LINE_BEGIN:
      return {
        ...state,
        singleCreditLine: {
          ...state.singleCreditLine,
          status: SingleCreditLineState.REFRESHING_SINGLE_CREDIT_LINE,
        },
      };
    case UPDATE_SINGLE_CREDIT_LINE:
      return {
        ...state,
        singleCreditLine: {
          ...state.singleCreditLine,
          status: SingleCreditLineState.UPDATING_SINGLE_CREDIT_LINE,
        },
      };
    //
    case STORE_INIT:
      return initialState;
    default:
      return state;
  }
}

// ///////////////////////////////////////
// Action Creators

// create credi line
export const setNewCreditLineRecipient = (recipient) => ({
  type: SET_RECIPIENT,
  payload: { recipient },
});

export const setNewCreditLineCurrency = (currency) => ({
  type: SET_CURRENCY,
  payload: { currency },
});

export const setNewCreditLineAmount = (amount) => ({
  type: SET_AMOUNT,
  payload: { amount },
});

export const setNewCreditLineTimeTarget = (timeTarget) => ({
  type: SET_TIME_TARGET,
  payload: { timeTarget },
});

export const setNewCreditLineOneTimeFee = (oneTimeFee) => ({
  type: SET_ONE_TIME_FEE,
  payload: { oneTimeFee },
});

export const setNewCreditLineInterest = (interest) => ({
  type: SET_INTEREST,
  payload: { interest },
});

export const createCreditLineBegin = () => ({
  type: CREATE_CREDIT_LINE_BEGIN,
});

export const createCreditLineWaitingTXResponse = (txId, remainingAttempts) => ({
  type: CREATE_CREDIT_LINE_WAITING_TX_RESPONSE,
  payload: { txId, remainingAttempts },
});

export const createCreditLineSuccess = (status) => ({
  type: CREATE_CREDIT_LINE_SUCCESS,
  payload: { status },
});

export const createCreditLineFailure = (error) => ({
  type: CREATE_CREDIT_LINE_FAILURE,
  payload: { error },
});

export const resetCreateCreditLine = () => ({
  type: CREATE_CREDIT_LINE_RESET,
});

export const resetCreateCreditLineStatus = () => ({
  type: CREATE_CREDIT_LINE_RESET_STATUS,
});

// accept credit line
export const acceptCreditLineBegin = () => ({
  type: ACCEPT_CREDIT_LINE_BEGIN,
});

export const acceptCreditLineWaitingTXResponse = (txId, remainingAttempts) => ({
  type: ACCEPT_CREDIT_LINE_WAITING_TX_RESPONSE,
  payload: { txId, remainingAttempts },
});

export const acceptCreditLineSuccess = (status) => ({
  type: ACCEPT_CREDIT_LINE_SUCCESS,
  payload: { status },
});

export const acceptCreditLineFailure = (error) => ({
  type: ACCEPT_CREDIT_LINE_FAILURE,
  payload: { error },
});

// reject credit line
export const rejectCreditLineBegin = () => ({
  type: REJECT_CREDIT_LINE_BEGIN,
});

export const rejectCreditLineWaitingTXResponse = (txId, remainingAttempts) => ({
  type: REJECT_CREDIT_LINE_WAITING_TX_RESPONSE,
  payload: { txId, remainingAttempts },
});

export const rejectCreditLineSuccess = (status) => ({
  type: REJECT_CREDIT_LINE_SUCCESS,
  payload: { status },
});

export const rejectCreditLineFailure = (error) => ({
  type: REJECT_CREDIT_LINE_FAILURE,
  payload: { error },
});

// cancel credit line
export const cancelCreditLineBegin = () => ({
  type: CANCEL_CREDIT_LINE_BEGIN,
});

export const cancelCreditLineWaitingTXResponse = (txId, remainingAttempts) => ({
  type: CANCEL_CREDIT_LINE_WAITING_TX_RESPONSE,
  payload: { txId, remainingAttempts },
});

export const cancelCreditLineSuccess = (status) => ({
  type: CANCEL_CREDIT_LINE_SUCCESS,
  payload: { status },
});

export const cancelCreditLineFailure = (error) => ({
  type: CANCEL_CREDIT_LINE_FAILURE,
  payload: { error },
});

// freeze credit line
export const freezeCreditLineBegin = () => ({
  type: FREEZE_CREDIT_LINE_BEGIN,
});

export const freezeCreditLineWaitingTXResponse = (txId, remainingAttempts) => ({
  type: FREEZE_CREDIT_LINE_WAITING_TX_RESPONSE,
  payload: { txId, remainingAttempts },
});

export const freezeCreditLineSuccess = (status) => ({
  type: FREEZE_CREDIT_LINE_SUCCESS,
  payload: { status },
});

export const freezeCreditLineFailure = (error) => ({
  type: FREEZE_CREDIT_LINE_FAILURE,
  payload: { error },
});

// unfreeze credit line
export const unfreezeCreditLineBegin = () => ({
  type: UNFREEZE_CREDIT_LINE_BEGIN,
});

export const unfreezeCreditLineWaitingTXResponse = (
  txId,
  remainingAttempts
) => ({
  type: UNFREEZE_CREDIT_LINE_WAITING_TX_RESPONSE,
  payload: { txId, remainingAttempts },
});

export const unfreezeCreditLineSuccess = (status) => ({
  type: UNFREEZE_CREDIT_LINE_SUCCESS,
  payload: { status },
});

export const unfreezeCreditLineFailure = (error) => ({
  type: UNFREEZE_CREDIT_LINE_FAILURE,
  payload: { error },
});

// set up conversion profile
// setting params
const setNewConversionProfileGlobalMax = (globalMax) => ({
  type: SET_UP_CONVERSION_PROFILE_GLOBAL_MAX,
  payload: { globalMax },
});

export const setNewConversionProfileSingleMax = (singleMax) => ({
  type: SET_UP_CONVERSION_PROFILE_SINGLE_MAX,
  payload: { singleMax },
});

// operational
export const setUpConversionProfileBegin = () => ({
  type: SET_UP_CONVERSION_PROFILE_BEGIN,
});

export const setUpConversionProfileWaitingTXResponse = (
  txId,
  remainingAttempts
) => ({
  type: SET_UP_CONVERSION_PROFILE_WAITING_TX_RESPONSE,
  payload: { txId, remainingAttempts },
});

export const setUpConversionProfileSuccess = (status) => ({
  type: SET_UP_CONVERSION_PROFILE_SUCCESS,
  payload: { status },
});

export const setUpConversionProfileFailure = (error) => ({
  type: SET_UP_CONVERSION_PROFILE_FAILURE,
  payload: { error },
});

// grant conversion permit
// setting params
export const setGrantee = (grantee) => ({
  type: SET_GRANTEE,
  payload: { grantee },
});

export const setSingleMax = (singleMax) => ({
  type: SET_SINGLE_MAX,
  payload: { singleMax },
});

export const setCreditLineId = (creditLineId) => ({
  type: SET_CREDIT_LINE_ID,
  payload: { creditLineId },
});

export const setConversionFee = (conversionFee) => ({
  type: SET_CONVERSION_FEE,
  payload: { conversionFee },
});

// operational
export const grantConversionPermitBegin = () => ({
  type: GRANT_CONVERSION_PERMIT_BEGIN,
});

export const grantConversionPermitWaitingTXResponse = (
  txId,
  remainingAttempts
) => ({
  type: GRANT_CONVERSION_PERMIT_WAITING_TX_RESPONSE,
  payload: { txId, remainingAttempts },
});

export const grantConversionPermitSuccess = (status) => ({
  type: GRANT_CONVERSION_PERMIT_SUCCESS,
  payload: { status },
});

export const grantConversionPermitFailure = (error) => ({
  type: GRANT_CONVERSION_PERMIT_FAILURE,
  payload: { error },
});

export const grantConversionPermitResetStatus = () => ({
  type: GRANT_CONVERSION_PERMIT_RESET_STATUS,
});

// revoke conversion permit
export const revokeConversionPermitBegin = () => ({
  type: REVOKE_CONVERSION_PERMIT_BEGIN,
});

export const revokeConversionPermitWaitingTXResponse = () => (
  txId,
  remainingAttempts
) => ({
  type: REVOKE_CONVERSION_PERMIT_WAITING_TX_RESPONSE,
  payload: { txId, remainingAttempts },
});

export const revokeConversionPermitSuccess = (status) => ({
  type: REVOKE_CONVERSION_PERMIT_SUCCESS,
  payload: { status },
});

export const revokeConversionPermitFailure = (error) => ({
  type: REVOKE_CONVERSION_PERMIT_FAILURE,
  payload: { error },
});

// load all credit lines
const loadBegin = () => ({
  type: LOAD_BEGIN,
});

const loadSuccess = (creditlines) => ({
  type: LOAD_SUCCESS,
  payload: creditlines,
});

const loadFailure = (error) => ({
  type: LOAD_FAILURE,
  payload: { error },
});

const refreshBegin = () => ({
  type: REFRESH_BEGIN,
});

const updateBegin = () => ({
  type: UPDATE_CREDIT_LINES,
});

// load single credit line
const loadSingleCreditLineBegin = () => ({
  type: LOAD_SINGLE_CREDIT_LINE_BEGIN,
});

const loadSingleCreditLineSuccess = (creditLine) => {
  return {
    type: LOAD_SINGLE_CREDIT_LINE_SUCCESS,
    payload: creditLine,
  };
};
const loadSingleCreditLineFailure = (error) => ({
  type: LOAD_SINGLE_CREDIT_LINE_FAILURE,
  payload: { error },
});

const refreshSingleCreditLineBegin = () => ({
  type: REFRESH_SINGLE_CREDIT_LINE_BEGIN,
});

const updateSingleCreditLineBegin = () => ({
  type: UPDATE_SINGLE_CREDIT_LINE,
});

// set inspect creditLine
const setInspectCreditLine = (creditLineId) => ({
  type: INSPECT_CREDIT_LINE,
  payload: creditLineId,
});

const clearInspectCreditLine = () => ({
  type: CLEAR_INSPECT_CREDIT_LINE,
});

//////////////////////////////////////////
// Selectors
// loading all credit lines
export const isLoading = (state) =>
  state.creditline.creditLinesStatus === CreditLineState.LOADING_CREDIT_LINES;

export const isLoadedSuccess = (state) =>
  Array.isArray(state.creditline.creditlines);

export const getCreditLines = (state) => state.creditline.creditlines;

export const isRefreshing = (state) =>
  state.creditline.creditLinesStatus ===
  CreditLineState.REFRESHING_CREDIT_LINES;

const isUpdating = (state) =>
  state.creditline.creditLinesStatus === CreditLineState.UPDATING_CREDIT_LINES;

export const errorMessage = (state) => {
  return state.creditline.creditLinesErrorMessage;
};

// loading single credit line
export const isSingleCreditLineLoading = (state) =>
  state.creditline.singleCreditLine.status ===
  SingleCreditLineState.LOADING_SINGLE_CREDIT_LINE;

export const isSingleCreditLineLoadedSuccess = (state) =>
  state.creditline.singleCreditLine.creditLine !== null &&
  state.creditline.singleCreditLine.creditLine !== undefined &&
  typeof state.creditline.singleCreditLine.creditLine === "object";

export const getCreditLine = (state) =>
  state.creditline.singleCreditLine.creditLine;

export const isSingleCreditLineRefreshing = (state) =>
  state.creditline.singleCreditLine.status ===
  SingleCreditLineState.REFRESHING_SINGLE_CREDIT_LINE;

export const isSingleCreditLineUpdating = (state) =>
  state.creditline.singleCreditLine.status ===
  SingleCreditLineState.UPDATING_SINGLE_CREDIT_LINE;

export const singleCreditLineErrorMessage = (state) =>
  state.creditline.singleCreditLine.errorMessage;
//
export const getInspectCreditLineId = (state) =>
  state.creditline.inspectCreditLineId;

// create new credit line
export const getErrorMessage = (state) => {
  return state.creditline.errorMessage;
};

export const getCurrency = (state) => {
  return state.creditline.currency;
};
export const getAmount = (state) => {
  return state.creditline.amount;
};

// accept credit line
export const getAcceptCreditLineErrorMessage = (state) =>
  state.creditline.acceptCreditLine.errorMessage;

export const getAcceptCreditLineStatus = (state) =>
  state.creditline.acceptCreditLine.status;

// reject credit Line
export const getRejectCreditLineErrorMessage = (state) =>
  state.creditline.rejectCreditLine.errorMessage;

export const getRejectCreditLineStatus = (state) =>
  state.creditline.rejectCreditLine.status;

// cancel credit Line
export const getCancelCreditLineErrorMessage = (state) =>
  state.creditline.cancelCreditLine.errorMessage;

export const getCancelCreditLineStatus = (state) =>
  state.creditline.cancelCreditLine.status;

// freeze credit line
export const getFreezeCreditLineErrorMessage = (state) =>
  state.creditline.freezeCreditLine.errorMessage;

export const getFreezeCreditLineStatus = (state) =>
  state.creditline.freezeCreditLine.status;

// unfreeze credit line
export const getUnfreezeCreditLineErrorMessage = (state) =>
  state.creditline.unfreezeCreditLine.errorMessage;

export const getUnfreezeCreditLineStatus = (state) =>
  state.creditline.unfreezeCreditLine.status;

// grant conversion permit
export const getGrantConversionPermitErrorMessage = (state) =>
  state.creditline.grantConversionPermit.errorMessage;

export const getGrantConversionPermitStatus = (state) =>
  state.creditline.grantConversionPermit.status;

// revoke conversion permit
export const getRevokeConversionPermitErrorMessage = (state) =>
  state.creditline.revokeConversionPermit.errorMessage;

export const getRevokeConversionPermitStatus = (state) =>
  state.creditline.revokeConversionPermit.status;

// set up conversion profile
export const getConversionProfileSingleMax = (state) =>
  state.creditline.setUpConversionProfile.params.singleMax;

export const getConversionProfileGlobalMax = (state) =>
  state.creditline.setUpConversionProfile.params.globalMax;

export const getSetUpConversionProfileStatus = (state) =>
  state.creditline.setUpConversionProfile.status;

// granting permit data
export const getSingleMax = (state) =>
  state.creditline.grantConversionPermit.params.singleMax;

export const getConversionFee = (state) =>
  state.creditline.grantConversionPermit.params.conversionFee;

export const getGrantee = (state) =>
  state.creditline.grantConversionPermit.params.grantee;

export const getGrantConversionProfileStatus = (state) =>
  state.creditline.grantConversionPermit.status;

// ///////////////////////////////////////
// pseudo-Action Creators

// create credit line
const isValid = (creditline) => {
  const { creditor, debtor, amount, target, one_time_fee } = creditline;

  const validTypes =
    every([creditor, debtor], isString) &&
    every([amount, target, one_time_fee], isNumber);

  const validValues =
    every([amount, target], (e) => e > 0) &&
    !some([creditor, debtor], isEmpty) &&
    creditor !== debtor;

  return validTypes && validValues;
};

const getCreateCreditLineTxStatus = (txId, remainingAttempts = 4) => async (
  dispatch
) => {
  const response = await api.get(`/transactions/${txId}`);

  if (!response.ok && remainingAttempts > 0) {
    dispatch(createCreditLineWaitingTXResponse(txId, remainingAttempts - 1));
    setTimeout(() => {
      dispatch(getCreateCreditLineTxStatus(txId, remainingAttempts - 1));
    }, 5000);
    return;
  }

  if (!response.ok) {
    dispatch(createCreditLineFailure(response.error));
    return;
  }

  const json = await response.json();
  dispatch(createCreditLineSuccess(json.status));
};

const getCreateMultiCreditLineTxStatus = (txId, remainingAttempts = 4) => async (
  dispatch
) => {
  const response = await api.get(`/transactions/${txId}`);

  if (!response.ok && remainingAttempts > 0) {
    setTimeout(() => {
      dispatch(getCreateMultiCreditLineTxStatus(txId, remainingAttempts - 1));
    }, 5000);
    return;
  }

  if (!response.ok) {
    return false;
  }
  return true;
};

export const createCreditLine = (creditline) => async (dispatch) => {
  const {
    creditor,
    debtor,
    amount,
    target,
    one_time_fee,
    interest,
    currency_id,
  } = creditline;
  dispatch(createCreditLineBegin());

  if (!isValid(creditline)) {
    dispatch(createCreditLineFailure("Invalid parameters"));
    return;
  }

  const toSign = JSON.stringify({
    creditor,
    debtor,
    amount,
    target,
    one_time_fee,
    currency_id,
    interest,
  });

  dispatch(
    cryptographyModule.signMessage(creditor, toSign, {
      onSigned: async (signature, publicKey) => {
        const response = await api.post("/creditline", {
          body: {
            creditor,
            debtor,
            amount,
            target,
            one_time_fee,
            currency_id,
            interest,
            signature,
            public_key: publicKey,
          },
        });

        if (!response.ok) {
          dispatch(createCreditLineFailure(response.statusText));
          return;
        }

        const json = await response.json();
        dispatch(getCreateCreditLineTxStatus(json.tx_id));
      },
    })
  );
};

export const createMultiCreditLine = (creditline) => async (dispatch) => {

  const {selectedUsers} = creditline;
  const usersLength = selectedUsers.length;

  let failureUsers = [];
  let successUsers = [];
  let failureMessage = '';

  if (selectedUsers !== undefined && usersLength > 0) {
    selectedUsers.forEach((debtor, index) => {
      {
        const {
          creditor,
          amount,
          target,
          one_time_fee,
          interest,
          currency_id,
        } = creditline;
        creditline.debtor = debtor;
        dispatch(createCreditLineBegin());
      
        if (!isValid(creditline)) {
          dispatch(createCreditLineFailure("Invalid parameters"));
          return;
        }
      
        const toSign = JSON.stringify({
          creditor,
          debtor,
          amount,
          target,
          one_time_fee,
          currency_id,
          interest,
        });
      
        dispatch(
          cryptographyModule.signMessage(creditor, toSign, {
            onSigned: async (signature, publicKey) => {
              const response = await api.post("/creditline", {
                body: {
                  creditor,
                  debtor,
                  amount,
                  target,
                  one_time_fee,
                  currency_id,
                  interest,
                  signature,
                  public_key: publicKey,
                },
              });
      
              if (!response.ok) {
                failureUsers.push(debtor);
                failureMessage += debtor + ': ' + response.statusText;
              } else {      
                const json = await response.json();

                if (dispatch(getCreateMultiCreditLineTxStatus(json.tx_id))) {
                  successUsers.push(debtor);
                } else {
                  failureUsers.push(debtor);
                  failureMessage += debtor + ': can not get transation status';
                }
              }
              
              if( index === usersLength - 1) {
                if (failureUsers.length > 0) {
                  dispatch(createCreditLineFailure("for " + failureMessage));
                } else {
                  dispatch(createCreditLineSuccess(1));
                }
              }
            },
          })
        );
      }
    });
  } else {
    return;
  }
};

// accept credit line
const getAcceptCreditLineTxStatus = (
  onSuccess,
  txId,
  remainingAttempts = 4
) => async (dispatch) => {
  const response = await api.get(`/transactions/${txId}`);

  if (!response.ok && remainingAttempts > 0) {
    dispatch(acceptCreditLineWaitingTXResponse(txId, remainingAttempts - 1));
    setTimeout(() => {
      dispatch(
        getAcceptCreditLineTxStatus(onSuccess, txId, remainingAttempts - 1)
      );
    }, 5000);
    return;
  }

  if (!response.ok) {
    dispatch(acceptCreditLineFailure(response.error));
    return;
  }

  const json = await response.json();
  dispatch(acceptCreditLineSuccess(json.status));
  if (onSuccess && typeof onSuccess === "function") onSuccess();
};

export const acceptCreditLine = (
  acceptCreditLine,
  onSuccess,
  onFailed
) => async (dispatch) => {
  const { acceptor, id } = acceptCreditLine;
  dispatch(acceptCreditLineBegin());

  const toSign = JSON.stringify({ acceptor, credit_line_id: id });
  dispatch(
    cryptographyModule.signMessage(acceptor, toSign, {
      onSigned: async (signature, publicKey) => {
        const response = await api.post("/accept_credit_line_offer", {
          body: {
            acceptor,
            credit_line_id: id,
            signature,
            public_key: publicKey,
          },
        });

        if (!response.ok) {
          dispatch(acceptCreditLineFailure(response.statusText));
          if (onFailed && typeof onFailed === "function") onFailed();
          return;
        }

        const json = await response.json();
        dispatch(getAcceptCreditLineTxStatus(onSuccess, json.tx_id));
      },
    })
  );
};

// reject credit line
const getRejectCreditLineTxStatus = (txId, remainingAttempts = 4) => async (
  dispatch
) => {
  const response = await api.get(`/transactions/${txId}`);

  if (!response.ok && remainingAttempts > 0) {
    dispatch(rejectCreditLineWaitingTXResponse(txId, remainingAttempts - 1));
    setTimeout(() => {
      dispatch(getRejectCreditLineTxStatus(txId, remainingAttempts - 1));
    }, 5000);
    return;
  }

  if (!response.ok) {
    dispatch(rejectCreditLineFailure(response.error));
    return;
  }

  const json = await response.json();
  dispatch(rejectCreditLineSuccess(json.status));
};

export const rejectCreditLine = (rejectCreditLine) => async (dispatch) => {
  const { rejector, id } = rejectCreditLine;
  dispatch(rejectCreditLineBegin());

  const toSign = JSON.stringify({ rejector, credit_line_id: id });
  dispatch(
    cryptographyModule.signMessage(rejector, toSign, {
      onSigned: async (signature, publicKey) => {
        const response = await api.post("/reject_credit_line_offer", {
          body: {
            rejector,
            credit_line_id: id,
            signature,
            public_key: publicKey,
          },
        });

        if (!response.ok) {
          dispatch(rejectCreditLineFailureresponse.statusText);
          return;
        }

        const json = await response.json();
        dispatch(getRejectCreditLineTxStatus(json.tx_id));
      },
    })
  );
};

// cancel credit line
const getCancelCreditLineTxStatus = (txId, remainingAttempts = 4) => async (
  dispatch
) => {
  const response = await api.get(`/transactions/${txId}`);

  if (!response.ok && remainingAttempts > 0) {
    dispatch(cancelCreditLineWaitingTXResponse(txId, remainingAttempts - 1));
    setTimeout(() => {
      dispatch(getCancelCreditLineTxStatus(txId, remainingAttempts - 1));
    }, 5000);
    return;
  }

  if (!response.ok) {
    dispatch(cancelCreditLineFailure(response.error));
    return;
  }

  const json = await response.json();
  dispatch(cancelCreditLineSuccess(json.status));
};

export const cancelCreditLine = (cancelCreditLine) => async (dispatch) => {
  const { canceller, id } = cancelCreditLine;
  dispatch(cancelCreditLineBegin());

  const toSign = JSON.stringify({ canceller, credit_line_id: id });
  dispatch(
    cryptographyModule.signMessage(canceller, toSign, {
      onSigned: async (signature, publicKey) => {
        const response = await api.post("/cancel_credit_line", {
          body: {
            canceller,
            credit_line_id: id,
            signature,
            public_key: publicKey,
          },
        });

        if (!response.ok) {
          dispatch(cancelCreditLineFailureresponse.statusText);
          return;
        }

        const json = await response.json();
        dispatch(getCancelCreditLineTxStatus(json.tx_id));
      },
    })
  );
};

// freeze credit line
const getFreezeCreditLineTxStatus = (txId, remainingAttempts = 4) => async (
  dispatch
) => {
  const response = await api.get(`/transactions/${txId}`);

  if (!response.ok && remainingAttempts > 0) {
    dispatch(freezeCreditLineWaitingTXResponse(txId, remainingAttempts - 1));
    setTimeout(() => {
      dispatch(getFreezeCreditLineTxStatus(txId, remainingAttempts - 1));
    }, 5000);
    return;
  }

  if (!response.ok) {
    dispatch(freezeCreditLineFailure(response.error));
    return;
  }

  const json = await response.json();
  dispatch(freezeCreditLineSuccess(json.status));
};

export const freezeCreditLine = (freezeCreditLine) => async (dispatch) => {
  const { freezer, id } = freezeCreditLine;
  dispatch(freezeCreditLineBegin());

  const toSign = JSON.stringify({ freezer, credit_line_id: id });
  dispatch(
    cryptographyModule.signMessage(freezer, toSign, {
      onSigned: async (signature, publicKey) => {
        const response = await api.post("/freeze_credit_line", {
          body: {
            freezer,
            credit_line_id: id,
            signature,
            public_key: publicKey,
          },
        });

        if (!response.ok) {
          dispatch(freezeCreditLineFailure(response.statusText));
          return;
        }

        const json = await response.json();
        dispatch(getFreezeCreditLineTxStatus(json.tx_id));
      },
    })
  );
};

// unfreeze credit line
const getUnfreezeCreditLineTxStatus = (txId, remainingAttempts = 4) => async (
  dispatch
) => {
  const response = await api.get(`/transactions/${txId}`);

  if (!response.ok && remainingAttempts > 0) {
    dispatch(unfreezeCreditLineWaitingTXResponse(txId, remainingAttempts - 1));
    setTimeout(() => {
      dispatch(getUnfreezeCreditLineTxStatus(txId, remainingAttempts - 1));
    }, 5000);
    return;
  }

  if (!response.ok) {
    dispatch(unfreezeCreditLineFailure(response.error));
    return;
  }

  const json = await response.json();
  dispatch(unfreezeCreditLineSuccess(json.status));
};

export const unfreezeCreditLine = (unfreezeCreditLine) => async (dispatch) => {
  const { unfreezer, id } = unfreezeCreditLine;
  dispatch(unfreezeCreditLineBegin());

  const toSign = JSON.stringify({ unfreezer, credit_line_id: id });
  dispatch(
    cryptographyModule.signMessage(unfreezer, toSign, {
      onSigned: async (signature, publicKey) => {
        const response = await api.post("/unfreeze_credit_line", {
          body: {
            unfreezer,
            credit_line_id: id,
            signature,
            public_key: publicKey,
          },
        });

        if (!response.ok) {
          dispatch(unfreezeCreditLineFailure(response.statusText));
          return;
        }

        const json = await response.json();
        dispatch(getUnfreezeCreditLineTxStatus(json.tx_id));
      },
    })
  );
};

// setup conversion profile
const getSetUpConversionProfileTxStatus = (
  txId,
  remainingAttempts = 4
) => async (dispatch) => {
  const response = await api.get(`/transactions/${txId}`);

  if (!response.ok && remainingAttempts > 0) {
    dispatch(
      setUpConversionProfileWaitingTXResponse(txId, remainingAttempts - 1)
    );
    setTimeout(() => {
      dispatch(getSetUpConversionProfileTxStatus(txId, remainingAttempts - 1));
    }, 5000);
    return;
  }

  if (!response.ok) {
    dispatch(setUpConversionProfileFailure(response.error));
    return;
  }

  const json = await response.json();
  dispatch(setUpConversionProfileSuccess(json.status));
};

export const setUpConversionProfile = (conversionProfile) => async (
  dispatch
) => {
  dispatch(setUpConversionProfileBegin());
  const { owner, creditLineId, globalMax, singleMax } = conversionProfile;

  const toSign = JSON.stringify({
    owner: owner,
    credit_line_id: creditLineId,
    conversion_global_max: globalMax,
    conversion_single_max: singleMax,
  });

  dispatch(
    cryptographyModule.signMessage(owner, toSign, {
      onSigned: async (signature, publicKey) => {
        const response = await api.post("/set_conversion_profile", {
          body: {
            owner: owner,
            credit_line_id: creditLineId,
            conversion_global_max: globalMax,
            conversion_single_max: singleMax,
            signature,
            public_key: publicKey,
          },
        });

        if (!response.ok) {
          dispatch(setUpConversionProfileFailure(response.statusText));
          return;
        }

        const json = await response.json();
        dispatch(getSetUpConversionProfileTxStatus(json.tx_id));
      },
    })
  );
};

// grant conversion permit
const getGrantConversionPermitTxStatus = (
  txId,
  remainingAttempts = 4
) => async (dispatch) => {
  const response = await api.get(`/transactions/${txId}`);

  if (!response.ok && remainingAttempts > 0) {
    dispatch(
      grantConversionPermitWaitingTXResponse(txId, remainingAttempts - 1)
    );
    setTimeout(() => {
      dispatch(getGrantConversionPermitTxStatus(txId, remainingAttempts - 1));
    }, 5000);
    return;
  }

  if (!response.ok) {
    dispatch(grantConversionPermitFailure(response.error));
    return;
  }

  const json = await response.json();
  dispatch(grantConversionPermitSuccess(json.status));
};

export const grantConversionPermit = (grantPermit) => async (dispatch) => {
  const {
    granter,
    grantee,
    creditLineId,
    singleMax,
    conversionFee,
  } = grantPermit;
  dispatch(grantConversionPermitBegin());

  const toSign = JSON.stringify({
    granter: granter,
    grantee: grantee,
    credit_line_id: creditLineId,
    max_conversion_amount: singleMax,
    conversion_fee: conversionFee,
  });

  dispatch(
    cryptographyModule.signMessage(granter, toSign, {
      onSigned: async (signature, publicKey) => {
        const response = await api.post("/grant_permit", {
          body: {
            granter: granter,
            grantee: grantee,
            credit_line_id: creditLineId,
            max_conversion_amount: singleMax,
            conversion_fee: conversionFee,
            signature,
            public_key: publicKey,
          },
        });

        if (!response.ok) {
          dispatch(grantConversionPermitFailure(response.statusText));
          return;
        }

        const json = await response.json();
        dispatch(getGrantConversionPermitTxStatus(json.tx_id));
      },
    })
  );
};

// revoke conversion permit
const getRevokeConversionPermitTxStatus = (
  txId,
  remainingAttempts = 4
) => async (dispatch) => {
  const response = await api.get(`/transactions/${txId}`);

  if (!response.ok && remainingAttempts > 0) {
    dispatch(
      revokeConversionPermitWaitingTXResponse(txId, remainingAttempts - 1)
    );
    setTimeout(() => {
      dispatch(getRevokeConversionPermitTxStatus(txId, remainingAttempts - 1));
    }, 5000);
    return;
  }

  if (!response.ok) {
    dispatch(revokeConversionPermitFailure(response.error));
    return;
  }

  const json = await response.json();
  dispatch(revokeConversionPermitSuccess(json.status));
};

export const revokeConversionPermit = (revokePermit) => async (dispatch) => {
  const { granter, permitId } = revokePermit;
  dispatch(revokeConversionPermitBegin());

  const toSign = JSON.stringify({
    granter: granter,
    permit_id: permitId,
  });

  dispatch(
    cryptographyModule.signMessage(granter, toSign, {
      onSigned: async (signature, publicKey) => {
        const response = await api.post("/revoke_permit", {
          body: {
            granter: granter,
            permit_id: permitId,
            signature,
            public_key: publicKey,
          },
        });

        if (!response.ok) {
          dispatch(revokeConversionPermitFailure(response.statusText));
          return;
        }

        const json = await response.json();
        dispatch(getRevokeConversionPermitTxStatus(json.tx_id));
      },
    })
  );
};

// load credit lines
const queryCreditLines = () => async (dispatch, getState) => {
  try {
    const response = await api.get("/credit_lines");

    if (!response.ok) {
      throw new Error(response.statusText || "Error loading credit lines.");
    }

    const json = await response.json();
    dispatch(loadSuccess(json));
  } catch (e) {
    if (!isUpdating(getState())) {
      dispatch(loadFailure(e.message || "Network error"));
    }
  }
};

const loadCreditLines = () => async (dispatch, getState) => {
  dispatch(loadBegin());
  const state = getState();
  if (!isUpdating(state) && !isRefreshing(state)) {
    dispatch(queryCreditLines());
  }
};

const updateCreditLines = () => async (dispatch, getState) => {
  const state = getState();
  if (!isRefreshing(state) && !isLoading(state)) {
    dispatch(queryCreditLines());
    dispatch(updateBegin());
  }
};

const refreshCreditLines = () => (dispatch, getState) => {
  const state = getState();
  if (!isUpdating(getState()) && !isLoading(state)) {
    dispatch(queryCreditLines());
  }
  dispatch(refreshBegin());
};

// single credit Line
const queryCreditLine = (creditLineId) => async (dispatch, getState) => {
  if (creditLineId !== null && creditLineId !== undefined) {
    try {
      const response = await api.get(`/credit_line/${creditLineId}`);

      if (!response.ok) {
        throw new error(
          response.statusText || "Error loading single credit line."
        );
      }

      const json = await response.json();
      dispatch(loadSingleCreditLineSuccess(json));
    } catch (e) {
      if (!isUpdating(getState())) {
        dispatch(loadSingleCreditLineFailure(e.message || "Network error"));
      }
    }
  } else {
    dispatch(loadSingleCreditLineFailure("Credit line ID not assigned."));
  }
};

const loadCreditLine = (creditLineId) => async (dispatch, getState) => {
  dispatch(loadSingleCreditLineBegin());
  const state = getState();
  if (
    !isSingleCreditLineUpdating(state) &&
    !isSingleCreditLineRefreshing(state)
  ) {
    dispatch(queryCreditLine(creditLineId));
  }
};

const updateCreditLine = () => async (dispatch, getState) => {
  const state = getState();
  if (
    !isSingleCreditLineRefreshing(state) &&
    !isSingleCreditLineLoading(state)
  ) {
    dispatch(queryCreditLine(state.creditline.inspectCreditLineId));
    dispatch(updateSingleCreditLineBegin());
  }
};

const refreshCreditLine = (creditLineId) => (dispatch, getState) => {
  const state = getState();
  if (!isSingleCreditLineUpdating(state) && !isLoading(state)) {
    dispatch(queryCreditLine(creditLineId));
  }
  dispatch(refreshSingleCreditLineBegin());
};

const inspectCreditLine = (creditLineId) => (dispatch, getState) => {
  dispatch(clearInspectCreditLine());
  dispatch(setInspectCreditLine({ creditLineId }));
};

export const actions = {
  loadCreditLines,
  updateCreditLines,
  refreshCreditLines,
  acceptCreditLine,
  rejectCreditLine,
  cancelCreditLine,
  freezeCreditLine,
  unfreezeCreditLine,
  loadCreditLine,
  updateCreditLine,
  refreshCreditLine,
  inspectCreditLine,
  setUpConversionProfile,
  grantConversionPermit,
  grantConversionPermitResetStatus,
  revokeConversionPermit,
  setNewConversionProfileGlobalMax,
  resetCreateCreditLine,
};
