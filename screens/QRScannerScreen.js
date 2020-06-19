import React, { Component } from "react";

import { SafeAreaView, Text, TouchableOpacity } from "react-native";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import QRCodeScanner from "react-native-qrcode-scanner";
import { qrTypes, decodeQR } from "../lib/qr";

import BackArrow from "../components/BackArrow";

import * as connectionModule from "../redux/modules/connection";
import * as creditline from "../redux/modules/creditline";
import * as iouModule from "../redux/modules/iou";
import * as paymentModule from "../redux/modules/payment";
import * as userSearchModule from "../redux/modules/userSearch";
import * as intl from "../redux/modules/internationalization";

class QRScannerScreen extends Component {
  processData = (data) => {
    const qrData = data.data;
    const {
      navigation,
      connectionActions,
      creditLineActions,
      iouActions,
      paymentActions,
      userSearchActions,
    } = this.props;

    const { type, payload } = decodeQR(qrData);

    switch (type) {
      case qrTypes.connectionId:
        {
          connectionActions.inspectConnection(payload.connectionId);
          connectionActions.loadConnection();
          navigation.navigate("InspectConnection");
        }
        break;
      case qrTypes.creditLineId:
        {
          creditLineActions.inspectCreditLine(payload.creditLineId);
          creditLineActions.loadCreditLine();
          navigation.navigate("InspectCreditLine");
        }
        break;
      case qrTypes.iouId:
        {
          iouActions.inspectIOU(payload.iouId);
          iouActions.loadSingleIOU();
          navigation.navigate("InspectIOU");
        }
        break;
      case qrTypes.requestPayment:
        {
          const payee = payload.creditorUsername;
          const { amount, currency, timeTarget } = payload;

          // search user
          userSearchActions.searchUser(payee, {
            onSuccess: () => {
              paymentActions.setNewPaymentRecipient(payee);
              paymentActions.setNewPaymentCurrency({
                id: currency,
              });
              paymentActions.setNewPaymentAmount(amount);
              paymentActions.setNewPaymentTimeTarget(timeTarget);
              paymentActions.loadPaymentOptions();
              navigation.navigate("PaymentOptions");
            },
          });
        }
        break;
      case qrTypes.username:
        {
          connectionActions.setNewConnectionReceiver(payload.user);
          navigation.navigate("ConnectionConfirm");
        }
        break;
      case qrTypes.registerDevice: {
        const { username, publicKey } = payload;

        navigation.navigate("RegisterDeviceConfirm", { username, publicKey });
      }
    }
  };

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <BackArrow />
        <QRCodeScanner
          onRead={(data) => {
            this.processData(data);
          }}
          // flashMode={QRCodeScanner.Constants.FlashMode.torch}
          topContent={<Text />}
        />
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
  paymentActions: bindActionCreators(paymentModule, dispatch),
  connectionActions: bindActionCreators(connectionModule.actions, dispatch),
  creditLineActions: bindActionCreators(creditline.actions, dispatch),
  iouActions: bindActionCreators(iouModule.actions, dispatch),
  intlActions: bindActionCreators(intl.actions, dispatch),
  userSearchActions: bindActionCreators(userSearchModule, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QRScannerScreen);
