import React, { Component } from "react";

import {
  AppRegistry,
  StyleSheet,
  Text,
  TouchableOpacity,
  Linking,
  View
} from "react-native";

import Button from "./Button";

class QRScannerLauncher extends Component {
  render() {
    const { navigation, onSuccess } = this.props;

    return (
      <Button
        variant="fancy"
        label="Scan QR code"
        onPress={() => {
          navigation.navigate("QRScanner", { onSuccess: onSuccess });
        }}
      ></Button>
    );
  }
}

export default QRScannerLauncher;
