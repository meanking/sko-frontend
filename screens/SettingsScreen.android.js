import React from "react";
import PropTypes from "prop-types";
import {
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  View,
  BackHandler,
} from "react-native";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { NavigationEvents } from "react-navigation";

import isEmpty from "lodash/isEmpty";

import Button from "../components/Button";
import BottomAppBar from "../components/BottomAppBar";
import CustomSlider from "../components/CustomSlider";
import DashboardScreen from "./DashboardScreen";
import TextInputBorder from "../components/TextInputBorder";
import LoadingIndicator from "../components/LoadingIndicator";
import AppLanguagePicker from "../components/AppLanguagePicker";
import ShowAvatarComponent from "../components/ShowAvatarComponent";
import * as Alerts from "../components/AlertBox.js";
import CurrencyPicker from "../components/CurrencyPicker";
import ButtonLoading from "../components/ButtonLoading";

import * as login from "../redux/modules/login";
import * as settings from "../redux/modules/settings";
import * as intl from "../redux/modules/internationalization";
import * as publickeyModule from "../redux/modules/publickey";
import * as cryptographyModule from "../redux/modules/cryptography";

import { Buffer } from "buffer";

import { UpdateSettingsState } from "../redux/modules/settings";

import Theme from "../assets/Theme";
const Colors = Theme.colors;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: Colors.white,
    paddingLeft: 16,
    paddingRight: 16,
  },
  bottom: {
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: 36,
  },
  input: {
    height: 56,
    color: Colors.black,
    fontSize: 16,
  },
  imageContainer: {
    backgroundColor: Theme.colors.grey,
    borderRadius: 60,
    width: 120,
    height: 120,
    alignItems: "center",
  },
  qrContainer: {
    width: 240,
    height: 240,
    alignItems: "center",
  },
  text: {
    ...Theme.fonts.light,
    fontSize: 24,
    padding: 10,
    textAlign: "center",
  },

  title: {
    color: Colors.black,
    fontSize: 22,
    fontWeight: "normal",
    marginBottom: 16,
  },
  textPrefix: {
    fontSize: 16,
    color: Colors.black,
  },
  avatarContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  avatarContainerItem: {
    flex: 0.5,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: "2%",
  },
  titleView: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  leftComponent: { alignSelf: "flex-start", flex: 0.9 },
  rightComponent: { alignSelf: "flex-end", flex: 0.1 },
});

const computeDisplayName = (value) => {
  if (isEmpty(value)) {
    return {
      input: {
        style: [styles.input, { borderColor: Colors.red }],
      },
      hint: {
        style: { color: Colors.red, marginBottom: 1 },
        text: "Please type your display name",
      },
    };
  }
  return {
    input: {
      style: styles.input,
    },
    hint: {
      style: { marginBottom: 1 },
      text: "",
    },
  };
};

class SettingsScreen extends React.Component {
  static navigationOptions = {
    headerShown: false,
  };

  static propTypes = {
    actions: PropTypes.objectOf(PropTypes.func).isRequired,
    errorMessage: PropTypes.string,
    loginActions: PropTypes.objectOf(PropTypes.func).isRequired,
    isLoadedFailed: PropTypes.bool.isRequired,
    isLoadedSuccess: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    navigation: PropTypes.any.isRequired,
    settings: PropTypes.shape({
      clearingFlexibility: PropTypes.number,
      displayName: PropTypes.string,
      preferredPaymentTarget: PropTypes.number,
      currencyId: PropTypes.number,
      currencyISO: PropTypes.string,
      currencySymbol: PropTypes.string,
    }),
    username: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      editing: false,
      firstLoad: true,
    };

    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  componentDidMount() {
    const { actions, isLoadedSuccess } = this.props;
    if (!isLoadedSuccess) {
      actions.loadAccountSettings();
    }

    this.keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      this.keyboardDidShow
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      this.keyboardDidHide
    );

    BackHandler.addEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();

    BackHandler.removeEventListener(
      "hardwareBackPress",
      this.handleBackButtonClick
    );
  }

  handleBackButtonClick() {
    this.props.navigation.navigate("Balance");
    return true;
  }

  logout = () => {
    const { loginActions, navigation } = this.props;
    loginActions.logout(() => navigation.navigate("Auth"));
  };

  keyboardDidShow = () => {
    this.setState({ editing: true });
  };

  keyboardDidHide = () => {
    this.setState({ editing: false });
  };

  refresh = () => {
    const { loginActions, isLoading } = this.props;
    if (!isLoading) {
      loginActions.loadAccountSettings();
      this.setState({ firstLoad: true });
    }
  };

  copySettingsPropsToState = () => {
    const {
      displayName,
      preferredPaymentTarget,
      clearingFlexibility,
      currencyISO,
      currencySymbol,
      currencyId,
    } = this.props.settings;

    this.setState({
      displayName,
      preferredPaymentTarget,
      clearingFlexibility,
      currencyISO,
      currencySymbol,
      currencyId,
    });
  };

  cancelEditing = () => {
    this.copySettingsPropsToState();

    this.setState({
      canceled: true,
    });
  };

  resetCancel = () => this.setState({ canceled: false });

  settingsChanged = () => {
    const {
      displayName,
      clearingFlexibility,
      preferredPaymentTarget,
      currencyISO,
    } = this.props.settings;

    return (
      this.state.displayName !== displayName ||
      this.state.clearingFlexibility !== clearingFlexibility ||
      this.state.preferredPaymentTarget !== preferredPaymentTarget ||
      this.state.currencyISO !== currencyISO
    );
  };

  isProcessing = () => {
    const status = this.props.updateAccountSettingsStatus;

    return (
      status === UpdateSettingsState.UPDATING_SETTINGS ||
      status === UpdateSettingsState.WAITING_TX_RESPONSE
    );
  };

  selectCurrency = (currency) => {
    this.setState({
      currencyISO: currency.iso_code,
      currencySymbol: currency.symbol,
      currencyId: currency.id,
    });
  };

  renderContent() {
    const {
      errorMessage,
      isLoadedSuccess,
      navigation,
      intlActions,
      username,
      actions,
      accountData,
    } = this.props;

    const { isVerified } = accountData;

    // if (!isLoadedSuccess) {
    //   return (
    //     <FailureView
    //       title={intlActions.getString("SETTINGS_LOADING_ERROR")}
    //       helper={errorMessage}
    //       label={intlActions.getString("RETRY_LITERAL")}
    //       onPress={this.refresh}
    //     />
    //   );
    // }

    // if first load, copy props to local state
    if (this.state.firstLoad && isLoadedSuccess) {
      this.copySettingsPropsToState();
      this.setState({ firstLoad: false });
    }

    const {
      displayName,
      preferredPaymentTarget,
      clearingFlexibility,
      currencyISO,
    } = this.state;

    const { phoneNumber } = accountData;

    const { input, hint } = computeDisplayName(displayName);

    const updateDisplayName = (text) => this.setState({ displayName: text });

    const updateClearingFlexibility = (number) =>
      this.setState({ clearingFlexibility: number });

    const submitLiteral = intlActions.getString("SUBMIT_LITERAL");
    const cancelLiteral = intlActions.getString("CANCEL_LITERAL");
    const displayNameLiteral = intlActions.getString("DISPLAY_NAME_LITERAL");
    const phoneNumberLiteral = intlActions.getString("PHONE_NUMBER_LITERAL");
    const changePhoneNumberLiteral = intlActions.getString(
      "CHANGE_PHONE_NUMBER_LITERAL"
    );
    const defaultCurrencyLiteral = intlActions.getString(
      "DEFAULT_CURRENCY_LITERAL"
    );

    const deregisterDeviceLiteral = intlActions.getString(
      "DEREGISTER_DEVICE_LITERAL"
    );
    const deregisterDeviceMessage = intlActions.getString(
      "DEREGISTER_DEVICE_MESSAGE"
    );
    const confirmLiteral = intlActions.getString("CONFIRM_LITERAL");
    const dismissLiteral = intlActions.getString("DISMISS_LITERAL");

    return (
      <View>
        <View style={styles.titleView}>
          <Text style={[styles.title, styles.leftComponent]}>
            {intlActions.getString("SETTINGS_LITERAL")}
          </Text>
          {/* <View>
            <Text>Security</Text>
            <Image
              style={styles.rightComponent}
              source={Assets.rightArrowIcon}
            />
          </View> */}
          {/* <Button style={styles.rightComponent} label={"Security"} /> */}
        </View>
        <ShowAvatarComponent
          name={username}
          isVerified={accountData.isVerified}
          styles={styles}
        />
        {this.isProcessing() ? (
          <ButtonLoading variant="fancy" label="Processing" />
        ) : this.settingsChanged() ? (
          <View style={styles.buttonContainer}>
            <Button
              variant="fancy"
              label={submitLiteral}
              onPress={() => {
                actions.updateAccountSettings({
                  displayName: this.state.displayName,
                  preferredPaymentTarget: this.state.preferredPaymentTarget,
                  defaultCurrency: this.state.currencyId,
                  clearingFlexibility: this.state.clearingFlexibility,
                });
              }}
            />
            <Button
              variant="danger"
              label={cancelLiteral}
              onPress={this.cancelEditing}
            />
          </View>
        ) : null}

        <TextInputBorder
          styleLabel={{ color: Colors.darkgrey }}
          style={input.style}
          styleHint={hint.style}
          placeholder={displayNameLiteral}
          value={displayName}
          hint={hint.text}
          borderTitle={displayNameLiteral}
          onChangeValue={updateDisplayName}
          editable={isVerified}
        />

        <TextInputBorder
          styleLabel={{ color: Colors.darkgrey }}
          style={(input.style, { marginBottom: 0 })}
          styleHint={hint.style}
          placeholder={phoneNumberLiteral}
          value={phoneNumber}
          hint={hint.text}
          borderTitle={phoneNumberLiteral}
          editable={false}
        />

        <Button
          label={changePhoneNumberLiteral}
          onPress={() => {
            navigation.navigate("ChangePhoneNumber");
          }}
        />

        <Text style={{ color: Theme.colors.darkgrey, marginTop: "5%" }}>
          {defaultCurrencyLiteral}
        </Text>
        <CurrencyPicker
          style={styles.avatarContainerItem}
          toSelect={currencyISO}
          onSelectCallback={(currency) => {
            this.selectCurrency(currency);
          }}
          disabled={!isVerified}
        />

        <CustomSlider
          title={intlActions.getString("PREFERRED_PAYMENT_TARGET_LITERAL")}
          step={1}
          minimumValue={settings.paymentTarget.MIN_VALUE}
          maximumValue={settings.paymentTarget.MAX_VALUE}
          value={preferredPaymentTarget}
          onSlidingComplete={(number) =>
            this.setState({ preferredPaymentTarget: number })
          }
          daysString={intlActions.getString("DAYS_LITERAL")}
          shouldReset={this.state.canceled}
          callback={this.resetCancel}
          disabled={!isVerified}
        />

        <CustomSlider
          title={intlActions.getString("CLEARING_FLEXIBILITY_LITERAL")}
          step={1}
          minimumValue={settings.flexibility.MIN_VALUE}
          maximumValue={settings.flexibility.MAX_VALUE}
          prefix="± "
          value={clearingFlexibility}
          onSlidingComplete={updateClearingFlexibility}
          daysString={intlActions.getString("DAYS_LITERAL")}
          shouldReset={this.state.canceled}
          callback={this.resetCancel}
          disabled={!isVerified}
        />

        <AppLanguagePicker />

        <Button
          variant={"danger"}
          label={deregisterDeviceLiteral}
          accessibilityLabel="DisableKey"
          onPress={() => {
            const { publicKeyActions, cryptographyActions, login } = this.props;
            const { username } = login;

            Alerts.showChoiceAlert({
              title: deregisterDeviceLiteral,
              message: deregisterDeviceMessage,
              confirmText: confirmLiteral,
              cancelText: dismissLiteral,
              confirmAction: () => {
                cryptographyActions.getPublicKey(username, {
                  onKeyRead: (pKey) => {
                    const publicKey = new Buffer(pKey).toString("hex");
                    publicKeyActions.disablePublicKey(username, publicKey, {
                      onSuccess: () => {
                        this.logout();
                        cryptographyActions.createKey(username);
                      },
                    });
                  },
                  onKeyNotFound: () => {
                    console.log("not found");
                  },
                });
              },
              cancelAction: () => {},
            });
          }}
        />

        <Button
          label={intlActions.getString("LOGOUT_LITERAL")}
          accessibilityLabel="Logout"
          onPress={this.logout}
        />
      </View>
    );
  }

  render() {
    const { isLoading, navigation } = this.props;
    const { editing } = this.state;

    return (
      <DashboardScreen screen="Settings" navigation={navigation}>
        <NavigationEvents onDidBlur={this.didBlur} />
        <ScrollView style={styles.container}>
          {isLoading ? <LoadingIndicator /> : this.renderContent()}
          <View style={{ height: 80 }} />
        </ScrollView>
        {!editing ? <BottomAppBar /> : null}
      </DashboardScreen>
    );
  }
}

const mapStateToProps = (state) => ({
  login: state.login,
  errorMessage: settings.getLoadSettingsErrorMessage(state),
  updateAccountSettingsStatus: settings.getUpdateSettingsStatus(state),
  isLoadedSuccess: settings.areSettingsLoadedSuccess(state),
  isLoading: settings.areSettingsLoading(state),
  settings: settings.getAccountSettings(state),
  accountData: settings.getAccountData(state),
  username: state.login.username || "(Anonymous)",
  currentLanguage: state.internationalization.currentLanguage,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(settings.actions, dispatch),
  loginActions: bindActionCreators(login.actions, dispatch),
  publicKeyActions: bindActionCreators(publickeyModule, dispatch),
  cryptographyActions: bindActionCreators(cryptographyModule, dispatch),
  intlActions: bindActionCreators(intl.actions, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsScreen);
