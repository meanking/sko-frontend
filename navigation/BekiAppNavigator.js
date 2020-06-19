// Basic imports
import { createStackNavigator } from "react-navigation-stack";
import { createSwitchNavigator, createAppContainer } from "react-navigation";
import React from "react";
import PropTypes from "prop-types";
import UpdateStore from "../components/UpdateStore";

// Primary screens
import LoadingScreen from "../screens/LoadingScreen";
import SignUpScreen from "../screens/SignUpScreen";
import SignInScreen from "../screens/SignInScreen";
import SignUpBetaScreen from "../screens/SignUpBetaScreen";

// Main screens
import DrawerScreen from "../screens/DrawerScreen";
import BekiBalanceScreen from "../screens/beki/BekiBalanceScreen";
import ConnectionsScreen from "../screens/ConnectionsScreen";
import CreditLinesScreen from "../screens/CreditLinesScreen";
import TransactionsScreen from "../screens/TransactionsScreen";
import SettingsScreen from "../screens/SettingsScreen";

// Account verification screens
import PhoneNumberVerificationScreen from "../screens/PhoneNumberVerificationScreen";

// Password change screens
import ChangePasswordDisclaimerScreen from "../screens/ChangePasswordDisclaimerScreen";
import ChangePasswordInputScreen from "../screens/ChangePasswordInputScreen";
import ChangePasswordCodeScreen from "../screens/ChangePasswordCodeScreen";

// Connections screens
import ConnectionReceiverScreen from "../screens/ConnectionReceiverScreen";
import ConnectionConfirmScreen from "../screens/ConnectionConfirmScreen";

// Payment Screens
import PaymentRecipientScreen from "../screens/PaymentRecipientScreen";
import PaymentCurrencyScreen from "../screens/PaymentCurrencyScreen";
import PaymentAmountScreen from "../screens/PaymentAmountScreen";
import PaymentTimeTargetScreen from "../screens/PaymentTimeTargetScreen";
import PaymentOptionsScreen from "../screens/PaymentOptionsScreen";
import PaymentConfirmScreen from "../screens/PaymentConfirmScreen";

// Request payment screens
import RequestPaymentAmountScreen from "../screens/RequestPaymentAmountScreen";
import RequestPaymentConfirmScreen from "../screens/RequestPaymentConfirmScreen";

// Settlement screens
import PartialSettleAmountScreen from "../screens/PartialSettleAmountScreen";
import PartialSettleConfirmScreen from "../screens/PartialSettleConfirmScreen";

// Credit Line Screens
import CreditLineRecipientScreen from "../screens/CreditLineRecipientScreen";
import CreditLineCurrencyScreen from "../screens/CreditLineCurrencyScreen";
import CreditLineAmountScreen from "../screens/CreditLineAmountScreen";
import CreditLineTimeTargetScreen from "../screens/CreditLineTimeTargetScreen";
import CreditLineInterestScreen from "../screens/CreditLineInterestScreen";
import CreditLineOneTimeFeeScreen from "../screens/CreditLineOneTimeFeeScreen";
import CreditLineConfirmScreen from "../screens/CreditLineConfirmScreen";
//
// conversion permits
import ConversionPermitGranteeScreen from "../screens/ConversionPermitGranteeScreen.js";
import ConversionPermitSingleMaxScreen from "../screens/ConversionPermitSingleMaxScreen.js";
import ConversionPermitConversionFeeScreen from "../screens/ConversionPermitConversionFeeScreen.js";
import ConversionPermitConfirmScreen from "../screens/ConversionPermitConfirmScreen.js";
//
// setup conversion profile
import SetUpConversionProfileGlobalMaxScreen from "../screens/SetUpConversionProfileGlobalMaxScreen.js";
import SetUpConversionProfileSingleMaxScreen from "../screens/SetUpConversionProfileSingleMaxScreen.js";
import SetUpConversionProfileConfirmScreen from "../screens/SetUpConversionProfileConfirmScreen.js";
//
import InspectCreditLineScreen from "../screens/InspectCreditLineScreen";
import InspectIOUScreen from "../screens/InspectIOUScreen";
import InspectConnectionScreen from "../screens/InspectConnectionScreen";
//
import QRScannerScreen from "../screens/QRScannerScreen";

import Theme from "../assets/Theme";
import ChangePhoneNumberDisclaimerScreen from "../screens/ChangePhoneNumberDisclaimerScreen";
import ChangePhoneNumberInputScreen from "../screens/ChangePhoneNumberInputScreen";
import ChangePhoneNumberPasswordScreen from "../screens/ChangePhoneNumberPasswordScreen";
import ChangePhoneNumberConfirmScreen from "../screens/ChangePhoneNumberConfirmScreen";
import SetUpConversionProfileDisclaimerScreen from "../screens/SetUpConversionProfileDisclaimerScreen";

const fade = (props) => {
  const { position, scene } = props;
  const { index } = scene;

  const translateX = 0;
  const translateY = 0;

  const opacity = position.interpolate({
    inputRange: [index - 1, index],
    outputRange: [0, 1],
  });

  return {
    opacity,
    transform: [{ translateX }, { translateY }],
  };
};

const ChangePasswordStack = createStackNavigator(
  {
    ChangePasswordDisclaimer: ChangePasswordDisclaimerScreen,
    ChangePasswordInput: ChangePasswordInputScreen,
    ChangePasswordCode: ChangePasswordCodeScreen,
  },
  { headerMode: "none" }
);

const AuthStack = createStackNavigator(
  {
    SignIn: SignInScreen,
    // SignUp: SignUpScreen, // TODO_PRODUCTION change
    SignUp: SignUpBetaScreen,
    ChangePassword: ChangePasswordStack,
  },
  { headerMode: "none" }
);

const CreateConnection = createStackNavigator(
  {
    ConnectionReceiver: ConnectionReceiverScreen,
    ConnectionConfirm: ConnectionConfirmScreen,
  },
  { headerMode: "none" }
);

const CreateCreditLine = createStackNavigator(
  {
    CreditLineRecipient: CreditLineRecipientScreen,
    CreditLineCurrency: CreditLineCurrencyScreen,
    CreditLineAmount: CreditLineAmountScreen,
    CreditLineTimeTarget: CreditLineTimeTargetScreen,
    CreditLineInterest: CreditLineInterestScreen,
    CreditLineOneTimeFee: CreditLineOneTimeFeeScreen,
    CreditLineConfirm: CreditLineConfirmScreen,
  },
  {
    headerMode: "none",
  }
);

const GrantConversionPermit = createStackNavigator(
  {
    ConversionPermitGrantee: ConversionPermitGranteeScreen,
    ConversionPermitSingleMax: ConversionPermitSingleMaxScreen,
    ConversionPermitConversionFee: ConversionPermitConversionFeeScreen,
    ConversionPermitConfirm: ConversionPermitConfirmScreen,
  },
  { headerMode: "none" }
);

const SetUpConversionProfile = createStackNavigator(
  {
    SetUpConversionProfileDisclaimer: SetUpConversionProfileDisclaimerScreen,
    SetUpConversionProfileGlobalMax: SetUpConversionProfileGlobalMaxScreen,
    SetUpConversionProfileSingleMax: SetUpConversionProfileSingleMaxScreen,
    SetUpConversionProfileConfirm: SetUpConversionProfileConfirmScreen,
  },
  {
    headerMode: "none",
  }
);

const Payment = createStackNavigator(
  {
    PaymentRecipient: PaymentRecipientScreen,
    PaymentCurrency: PaymentCurrencyScreen,
    PaymentAmount: PaymentAmountScreen,
    PaymentTimeTarget: PaymentTimeTargetScreen,
    PaymentOptions: PaymentOptionsScreen,
    PaymentConfirm: PaymentConfirmScreen,
  },
  {
    headerMode: "none",
  }
);

const Connections = createStackNavigator(
  {
    Connections: ConnectionsScreen,
    InspectConnection: InspectConnectionScreen,
    InspectIOU: InspectIOUScreen,
  },
  {
    headerMode: "none",
  }
);

const CreditLines = createStackNavigator(
  {
    CreditLines: CreditLinesScreen,
    InspectCreditLine: InspectCreditLineScreen,
    InspectIOU: InspectIOUScreen,
  },
  {
    headerMode: "none",
  }
);

const AccountVerificationStack = createStackNavigator(
  {
    PhoneNumberVerification: PhoneNumberVerificationScreen,
  },
  { headerMode: "none" }
);

const ChangePhoneNumberStack = createStackNavigator(
  {
    ChangePhoneNumberDisclaimer: ChangePhoneNumberDisclaimerScreen,
    ChangePhoneNumberInput: ChangePhoneNumberInputScreen,
    ChangePhoneNumberPassword: ChangePhoneNumberPasswordScreen,
    ChangePhoneNumberConfirm: ChangePhoneNumberConfirmScreen,
  },
  { headerMode: "none" }
);

const Balance = createStackNavigator(
  {
    Balance: BekiBalanceScreen,
    RequestPaymentAmount: RequestPaymentAmountScreen,
    RequestPaymentConfirm: RequestPaymentConfirmScreen,
    InspectIOU: InspectIOUScreen,
    PartialSettleAmount: PartialSettleAmountScreen,
    PartialSettleConfirm: PartialSettleConfirmScreen,
    QRScanner: QRScannerScreen,
    AccountVerification: AccountVerificationStack,
  },
  {
    headerMode: "none",
  }
);

const SettingsStack = createStackNavigator(
  {
    Settings: SettingsScreen,
    ChangePhoneNumber: ChangePhoneNumberStack,
  },
  { headerMode: "none" }
);

const Dashboard = createSwitchNavigator({
  Balance: Balance,
  Connections: Connections,
  CreditLines: CreditLines,
  Transactions: TransactionsScreen,
  Settings: SettingsStack,
});

const DashboardWithDrawer = createStackNavigator(
  {
    Dashboard,
    Drawer: DrawerScreen,
  },
  {
    mode: "modal",
    headerMode: "none",
    cardStyle: {
      backgroundColor: Theme.colors.overlay,
    },
    navigationOptions: {
      gesturesEnabled: false,
    },
    transitionConfig: () => ({ screenInterpolator: fade }),
  }
);

const AppStack = createStackNavigator(
  {
    DashboardWithDrawer,
    CreateConnection,
    CreateCreditLine,
    GrantConversionPermit,
    SetUpConversionProfile,
    Payment,
  },
  {
    mode: "modal",
    headerMode: "none",
    initialRouteName: "DashboardWithDrawer",
    cardStyle: {
      backgroundColor: Theme.colors.overlay,
    },
  }
);

class AuthenticatedApp extends React.Component {
  static router = AppStack.router;

  static propTypes = {
    navigation: PropTypes.any.isRequired,
  };

  render() {
    const { navigation } = this.props;

    return (
      <UpdateStore>
        <AppStack navigation={navigation} />
      </UpdateStore>
    );
  }
}

// export default createSwitchNavigator(
const sikobaRootNavigator = createSwitchNavigator(
  {
    Loading: LoadingScreen,
    Auth: AuthStack,
    Main: AuthenticatedApp,
  },
  {
    initialRouteName: "Loading",
  }
);

const BekiAppNavigator = createAppContainer(sikobaRootNavigator);

export default BekiAppNavigator;
