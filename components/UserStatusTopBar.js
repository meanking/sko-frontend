import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import * as intl from "../redux/modules/internationalization";
import * as settings from "../redux/modules/settings";

import Theme from "../assets/Theme";

const Colors = Theme.colors;

const styles = StyleSheet.create({
  container: {
    textAlign: "center",
    backgroundColor: Colors.overlay
  },
  label: { textAlign: "center", color: Colors.red, fontSize: 18 }
});

class UserStatusTopBar extends React.Component {
  constructor(props) {
    super(props);

    const language = this.props.actions.getLanguage();
    this.state = { language: language };
  }

  render() {
    const { actions, onPress } = this.props;

    const notVerifiedLiteral = actions
      .getString("NOT_VERIFIED_LITERAL")
      .toUpperCase();
    const clickToVerifyLiteral = actions
      .getString("CLICK_TO_VERIFY_LITERAL")
      .toLowerCase();

    return (
      <View style={styles.container}>
        <Text
          style={styles.label}
          onPress={() => {
            onPress();
          }}
        >
          {notVerifiedLiteral + " - " + clickToVerifyLiteral}
        </Text>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  accountData: settings.getAccountData(state)
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(intl.actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(UserStatusTopBar);
