import React from "react";
import PropTypes from "prop-types";
import { Text, SafeAreaView, StyleSheet, View } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import TextInputBorder from "../components/TextInputBorder";
import Button from "../components/Button";

import TopBarBackHome from "../components/TopBarBackHome";

import * as creditLineModule from "../redux/modules/creditline";
import * as intl from "../redux/modules/internationalization";
import * as settingsModule from "../redux/modules/settings";

import Theme from "../assets/Theme";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.white,
    paddingTop: 16
  },
  innerContainer: {
    paddingLeft: 16,
    paddingRight: 16
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
    fontSize: 46,
    textAlign: "right"
  },
  textSuffix: {
    fontSize: 30,
    color: Theme.colors.darkgrey
  }
});

class CreditLineTimeTargetScreen extends React.Component {
  static navigationOptions = {
    title: null
  };

  static propTypes = {
    creditLineActions: PropTypes.objectOf(PropTypes.func).isRequired,
    navigation: PropTypes.any.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      timeTarget: null
    };
  }

  render() {
    const {
      creditLineActions,
      navigation,
      intlActions,
      preferredTimeTarget
    } = this.props;

    var { timeTarget } = this.state;
    if (timeTarget === null) timeTarget = preferredTimeTarget;

    const updateTimeTarget = number => this.setState({ timeTarget: number });

    const timeTargetLiteral = intlActions.getString("TIME_TARGET_LITERAL");
    const howManyDays = intlActions.getString("HOW_MANY_DAYS");
    const nextLiteral = intlActions.getString("NEXT_LITERAL");
    const daysLiteral = intlActions.getString("DAYS_LITERAL").toLowerCase();

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <TopBarBackHome screen="CreditLines"></TopBarBackHome>
          <View style={styles.innerContainer}>
            <Text style={styles.title}>{timeTargetLiteral}</Text>

            <Text style={styles.label}>{howManyDays}</Text>

            <TextInputBorder
              style={styles.textInputBorder}
              styleInput={styles.textInput}
              styleSuffix={styles.textSuffix}
              suffix={daysLiteral}
              value={timeTarget}
              accessibilityLabel="Target"
              isNumeric
              onChangeValue={updateTimeTarget}
            />

            {timeTarget ? (
              <Button
                label={nextLiteral}
                accessibilityLabel="TargetNext"
                onPress={() => {
                  creditLineActions.setNewCreditLineTimeTarget(timeTarget);
                  navigation.navigate("CreditLineInterest");
                }}
              />
            ) : null}
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  preferredTimeTarget: settingsModule.getPreferredPaymentTarget(state)
});

const mapDispatchToProps = dispatch => ({
  creditLineActions: bindActionCreators(creditLineModule, dispatch),
  intlActions: bindActionCreators(intl.actions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreditLineTimeTargetScreen);
