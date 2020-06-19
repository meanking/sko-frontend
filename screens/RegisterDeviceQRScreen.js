import React from "react";
import PropTypes from "prop-types";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import Theme from "../assets/Theme";
import Button from "../components/Button";
import BackArrow from "../components/BackArrow.js";

import { qrTypes, generateQRComponent, QR_SIZE } from "../lib/qr.js";

import * as cryptographyModule from "../redux/modules/cryptography";
import * as intl from "../redux/modules/internationalization";

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.colors.white,
    flex: 1,
    flexDirection: "column",
    alignItems: "stretch",
  },
  qrContainer: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    marginTop: "10%",
  },
  title: { fontSize: 20, marginBottom: "10%" },
});

class RegisterDeviceQRScreen extends React.Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor(props) {
    super(props);
  }

  renderQR() {
    const { username, publicKey } = this.props.navigation.state.params;

    return generateQRComponent(
      qrTypes.registerDevice,
      { username, publicKey },
      {
        size: QR_SIZE / 0.75,
      }
    );
  }

  renderContent = () => {
    const { navigation, intlActions } = this.props;

    const registerDeviceLiteral = intlActions.getString(
      "REGISTER_DEVICE_LITERAL"
    );
    const scanWithRegisteredDeviceMessage = intlActions.getString(
      "SCAN_WITH_REGISTERED_DEVICE"
    );
    const doneLiteral = intlActions.getString("DONE_LITERAL");

    return (
      <View style={styles.qrContainer}>
        <Text style={styles.title}>{registerDeviceLiteral}</Text>
        <Text style={{ alignSelf: "center" }}>
          {scanWithRegisteredDeviceMessage}
        </Text>
        <View style={{ marginTop: "5%" }}>{this.renderQR()}</View>
        <Button
          variant="fancy"
          label={doneLiteral}
          onPress={() => navigation.navigate("SignIn")}
        />
      </View>
    );
  };

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <BackArrow />
        <View style={styles.container}>{this.renderContent()}</View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
  intlActions: bindActionCreators(intl.actions, dispatch),
  cryptographyActions: bindActionCreators(cryptographyModule, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RegisterDeviceQRScreen);
