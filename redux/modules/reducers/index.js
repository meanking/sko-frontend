import balance from "../balance";
import connection from "../connection";
import creditline from "../creditline";
import loginReducer from "../login";
import payment from "../payment";
import navigation from "../navigation";
import signup from "../signup";
import settings from "../settings";
import transaction from "../transaction";
import userSearch from "../userSearch";
import internationalization from "../internationalization";
import currency from "../currency";
import spv from "../spv";
import iou from "../iou";
import verification from "../verification";
import changepassword from "../changepassword";
import notifications from "../notifications";
import context from "../context";
import cryptography from "../cryptography";
import publickey from "../publickey";

export default {
  balance,
  connection,
  creditline,
  login: loginReducer,
  payment,
  navigation,
  settings,
  signup,
  transaction,
  userSearch,
  currency,
  spv,
  internationalization,
  iou,
  verification,
  changepassword,
  notifications,
  context,
  cryptography,
  publickey,
};
