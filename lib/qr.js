import QRCode from "react-native-qrcode-svg";

import React from "react";
import PropTypes from "prop-types";

const usernamePayload = (username) => ({ user: username });
const creditLinePayload = (creditLineId) => ({ creditLineId: creditLineId });
const connectionPayload = (connectionId) => ({ connectionId: connectionId });
const iouPayload = (iouId) => ({ iouId: iouId });
const requestPaymentPayload = (requestPayment) => ({
  amount: requestPayment.amount,
  timeTarget: requestPayment.timeTarget,
  creditorUsername: requestPayment.creditorUsername,
  currency: requestPayment.currency,
});
const registerDevicePayload = (data) => ({
  username: data.username,
  publicKey: data.publicKey,
});

export const QR_SIZE = 240;

export function generateQRComponent(type, object, params) {
  return <QRCode {...params} value={qrEncode(type, object)} />;
}

const username = "USERNAME";
const creditLineId = "CREDIT_LINE_ID";
const iouId = "IOU_ID";
const connectionId = "CONNECTION_ID";
const requestPayment = "REQUEST_PAYMENT";
const registerDevice = "REGISTER_DEVICE";

export const decodeQR = (qrString) => {
  const json = JSON.parse(qrString);

  const { type, payload } = json;
  var typedPayload;

  switch (type) {
    case username:
      {
        typedPayload = usernamePayload(payload);
      }
      break;
    case creditLineId:
      {
        typedPayload = creditLinePayload(payload);
      }
      break;
    case iouId:
      {
        typedPayload = iouPayload(payload);
      }
      break;
    case connectionId:
      {
        typedPayload = connectionPayload(payload);
      }
      break;
    case requestPayment:
      {
        typedPayload = requestPaymentPayload(payload);
      }
      break;
    case registerDevice:
      {
        typedPayload = registerDevicePayload(payload);
      }
      break;
  }

  return { type, payload: typedPayload };
};

function qrEncode(type, object) {
  return JSON.stringify({ type: type, payload: object });
}

export const qrTypes = {
  username,
  creditLineId,
  iouId,
  connectionId,
  requestPayment,
  registerDevice,
};
