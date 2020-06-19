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

import Theme from "../assets/Theme";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
    backgroundColor: Theme.colors.white,
  },
  innerContainer: {
    paddingLeft: 16,
    paddingRight: 16,
  },
  title: {
    ...Theme.fonts.regular,
    color: Theme.colors.black,
    fontSize: 22,
    marginBottom: 19,
  },
  label: {
    ...Theme.fonts.regular,
    color: Theme.colors.black,
    fontSize: 16,
    marginBottom: 15,
  },
  textInputBorder: {
    height: 112,
    borderColor: Theme.colors.green,
  },
  textInput: {
    fontSize: 46,
    textAlign: "right",
  },
  textSuffix: {
    fontSize: 30,
    color: Theme.colors.darkgrey,
  },
  hintStyle: {
    textAlign: "center",
    color: Theme.colors.darkgrey,
    marginBottom: "2%",
  },
});

class CreditLineInterestScreen extends React.Component {
  static navigationOptions = {
    title: null,
  };

  static propTypes = {
    creditLineActions: PropTypes.objectOf(PropTypes.func).isRequired,
    navigation: PropTypes.any.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      value: null,
    };
  }

  render() {
    const { creditLineActions, navigation, intlActions } = this.props;

    const { value } = this.state;

    const updateValue = (number) => {
      this.setState({
        interestTooHigh: number > 50,
        value: Math.min(number, 50),
      });
    };

    const interestLiteral = intlActions.getString("INTEREST_LITERAL");
    const howMuchInterest = intlActions.getString("HOW_MUCH_INTEREST");
    const nextLiteral = intlActions.getString("NEXT_LITERAL");
    const interestLimitLiteral = intlActions.getString(
      "INTEREST_LIMIT_LITERAL"
    );

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <TopBarBackHome screen="CreditLines" />
          <View style={styles.innerContainer}>
            <Text style={styles.title}>{interestLiteral}</Text>

            <Text style={styles.label}>{howMuchInterest}</Text>

            <TextInputBorder
              style={styles.textInputBorder}
              styleInput={styles.textInput}
              styleSuffix={styles.textSuffix}
              suffix="%"
              value={value}
              accessibilityLabel="Interest"
              isNumeric
              onChangeValue={updateValue}
            />

            {this.state.interestTooHigh ? (
              <Text style={styles.hintStyle}>
                {interestLimitLiteral + " - " + "50%"}
              </Text>
            ) : null}

            {value !== null && value !== undefined ? (
              <Button
                label={nextLiteral}
                accessibilityLabel="InterestNext"
                onPress={() => {
                  creditLineActions.setNewCreditLineInterest(value);
                  navigation.navigate("CreditLineOneTimeFee");
                }}
              />
            ) : null}
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
  creditLineActions: bindActionCreators(creditLineModule, dispatch),
  intlActions: bindActionCreators(intl.actions, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreditLineInterestScreen);
