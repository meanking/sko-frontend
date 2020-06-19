import React from "react";
import PropTypes from "prop-types";
import { Text, SafeAreaView, StyleSheet, View } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import TextInputBorder from "../components/TextInputBorder";

import TopBarBackHome from "../components/TopBarBackHome";
import Button from "../components/Button";

import * as settings from "../redux/modules/settings";
import * as intl from "../redux/modules/internationalization";

import Theme from "../assets/Theme";

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.colors.white,
    flex: 1,
    paddingTop: 16
  },
  innerContainer: {
    paddingLeft: 16,
    paddingRight: 16,
    flex: 1
  },
  title: {
    ...Theme.fonts.regular,
    color: Theme.colors.black,
    fontSize: 22,
    marginBottom: 19
  },
  label: {
    ...Theme.fonts.regular,
    color: Theme.colors.black,
    fontSize: 16,
    marginBottom: 15
  },
  textInputBorder: {
    height: 112,
    borderColor: Theme.colors.green
  },
  textInput: {
    fontSize: 46
  },
  textPrefix: {
    fontSize: 46,
    color: Theme.colors.darkgrey
  }
});

class SetUpConversionProfileDisclaimerScreen extends React.Component {
  static navigationOptions = {
    title: null
  };

  static propTypes = {
    creditLineActions: PropTypes.objectOf(PropTypes.func).isRequired,
    navigation: PropTypes.any.isRequired
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { intlActions, navigation, settingsActions } = this.props;

    const { creditLine } = navigation.state.params;

    const setUpConversionProfileLiteral = intlActions.getString(
      "SET_UP_CONVERSION_PROFILE_LITERAL"
    );
    const setUpConversionProfileDisclaimer = intlActions.getString(
      "SET_UP_CONVERSION_PROFILE_DISCLAIMER"
    );
    const continueLiteral = intlActions.getString("CONTINUE_LITERAL");
    const cancelLiteral = intlActions.getString("CANCEL_LITERAL");

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <TopBarBackHome
            screen="InspectCreditLine"
            onBack={() => {
              navigation.navigate("InspectCreditLine");
            }}
          ></TopBarBackHome>
          <View style={styles.innerContainer}>
            <Text style={styles.title}>{setUpConversionProfileLiteral}</Text>
            <Text style={styles.label}>{setUpConversionProfileDisclaimer}</Text>

            <Button
              label={continueLiteral}
              accessibilityLabel="Continue"
              onPress={() =>
                navigation.navigate("SetUpConversionProfileGlobalMax", {
                  creditLine: creditLine
                })
              }
            ></Button>

            <Button
              label={cancelLiteral}
              accessibilityLabel="Cancel"
              onPress={() => {
                navigation.dismiss();
                // settingsActions.resetCredentialsCheck(); // TODO call a resetting action
              }}
            ></Button>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  settingsActions: bindActionCreators(settings.actions, dispatch),
  intlActions: bindActionCreators(intl.actions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SetUpConversionProfileDisclaimerScreen);
