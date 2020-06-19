import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { StyleSheet, Text, View } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Button from "./Button";
import ButtonLoading from "./ButtonLoading";
import ConnectionView from "./ConnectionView";
import FailureView from "./FailureView";
import LoadingIndicator from "./LoadingIndicator";
import Assets from "../assets";
import Theme from "../assets/Theme";
import { formatAmount, formatDueDate } from "../lib/format";
import { ActionsType, SettlementType } from "../lib/types";
import * as balance from "../redux/modules/balance";
import * as intl from "../redux/modules/internationalization";
import * as spvModule from "../redux/modules/spv";
import BalanceSlider from "./BalanceSlider";

import * as qr from "../lib/qr";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.white
  },
  title: {
    ...Theme.fonts.regular,
    fontSize: 24,
    color: Theme.colors.black,
    marginTop: 24,
    marginLeft: 16
  },
  sks: {
    ...Theme.fonts.regular,
    fontSize: 16,
    marginRight: 14,
    alignSelf: "flex-end"
  }
});

class ShowAvatarComponent extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    styles: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = { showQR: false };
  }

  toggleQR = () => this.setState({ showQR: !this.state.showQR });

  render() {
    const { name, isVerified, styles, intlActions } = this.props;

    const showQRLiteral = intlActions.getString("SHOW_QR_LITERAL");
    const hideQRLiteral = intlActions.getString("HIDE_QR_LITERAL");

    return (
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 40,
          marginTop: 20,
          marginLeft: 120,
          marginRight: 120
        }}
      >
        <View style={styles.avatarContainer}>
          {!this.state.showQR ? (
            <View style={styles.imageContainer} />
          ) : (
            <View style={styles.qrContainer}>
              {qr.generateQRComponent(qr.qrTypes.username, name, {
                size: styles.qrContainer.width
              })}
            </View>
          )}
        </View>

        <Text style={{ fontSize: 16, textAlign: "center", marginTop: 7 }}>
          {name}
        </Text>
        <Text
          style={{
            fontSize: 16,
            textAlign: "center",
            marginTop: 7,
            color: Theme.colors.red
          }}
        >
          {isVerified ? null : "NOT VERIFIED"}
        </Text>
        <Button
          label={this.state.showQR ? hideQRLiteral : showQRLiteral}
          onPress={() => {
            this.toggleQR();
          }}
        ></Button>
      </View>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  intlActions: bindActionCreators(intl.actions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ShowAvatarComponent);
