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
    backgroundColor: Theme.colors.white
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
    marginBottom: 5
  },
  disclaimer: {
    ...Theme.fonts.regular,
    color: Theme.colors.darkgrey,
    fontSize: 16,
    marginBottom: 15
  },
  textInputBorder: {
    height: 112,
    borderColor: Theme.colors.green
  },
  textInput: {
    fontSize: 36,
    textAlign: "right"
  },
  textSuffix: {
    fontSize: 30,
    color: Theme.colors.darkgrey
  },
  textPrefix: {
    fontSize: 30,
    color: Theme.colors.darkgrey
  }
});

class SetUpConversionProfileSingleMaxScreen extends React.Component {
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
      value: 0
    };
  }

  render() {
    const {
      creditLineActions,
      navigation,
      intlActions,
      globalMax
    } = this.props;

    const { value } = this.state;

    const creditLine = navigation.state.params.creditLine;
    const currencySymbol = creditLine.currency_symbol;

    const updateValue = number => {
      const actNum = Math.min(number, globalMax);

      if (number >= globalMax) this.setState({ showHint: true });
      else this.setState({ showHint: false });
      this.setState({ value: actNum });
    };

    const nextLiteral = intlActions.getString("NEXT_LITERAL");
    const globalMaxLiteral = intlActions.getString("SINGLE_MAX_LITERAL");
    const howMuchSingle = intlActions.getString("HOW_MUCH_SINGLE_MAX");

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <TopBarBackHome screen="InspectCreditLine"></TopBarBackHome>
          <View style={styles.innerContainer}>
            <Text style={styles.title}>{globalMaxLiteral}</Text>

            <Text style={styles.label}>{howMuchSingle}</Text>

            <TextInputBorder
              style={styles.textInputBorder}
              styleInput={styles.textInput}
              stylePrefix={styles.textPrefix}
              styleSuffix={styles.textSuffix}
              prefix={currencySymbol}
              suffix={"/" + currencySymbol + globalMax}
              value={value}
              accessibilityLabel="SingleConversionMax"
              isNumeric
              placeholder={"0"}
              onChangeValue={updateValue}
              hint={
                this.state.showHint
                  ? "Single max. can't exceed global max."
                  : null
              }
            />

            {value !== null && value !== undefined ? (
              <Button
                label={nextLiteral}
                accessibilityLabel="SingleMaxNext"
                onPress={() => {
                  creditLineActions.setNewConversionProfileSingleMax(value);
                  navigation.navigate("SetUpConversionProfileConfirm", {
                    creditLine: creditLine
                  });
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
  currency: creditLineModule.getCurrency(state),
  amount: creditLineModule.getAmount(state),
  globalMax: creditLineModule.getConversionProfileGlobalMax(state)
});

const mapDispatchToProps = dispatch => ({
  creditLineActions: bindActionCreators(creditLineModule, dispatch),
  intlActions: bindActionCreators(intl.actions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SetUpConversionProfileSingleMaxScreen);
