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
    marginBottom: 5,
  },
  disclaimer: {
    ...Theme.fonts.regular,
    color: Theme.colors.darkgrey,
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

class ConversionPermitConversionFeeScreen extends React.Component {
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
      value: 0,
    };
  }

  render() {
    const { creditLineActions, navigation, intlActions } = this.props;
    const { creditLine } = navigation.state.params;

    const { value } = this.state;

    const updateValue = (number) => {
      this.setState({
        conversionFeeTooHigh: number > 50,
        value: Math.min(number, 50),
      });
    };

    const conversionFeeLiteral = intlActions.getString(
      "CONVERSION_FEE_LITERAL"
    );
    const howMuchConversionFee = intlActions.getString(
      "HOW_MUCH_CONVERSION_FEE"
    );
    const nextLiteral = intlActions.getString("NEXT_LITERAL");
    const optionalLiteral = intlActions.getString("THIS_IS_OPTIONAL_LITERAL");
    const conversionFeeLimitLiteral = intlActions.getString(
      "CONVERSION_FEE_LIMIT_LITERAL"
    );

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <TopBarBackHome screen="InspectCreditLine" />
          <View style={styles.innerContainer}>
            <Text style={styles.title}>{conversionFeeLiteral}</Text>

            <Text style={styles.label}>{howMuchConversionFee}</Text>
            <Text style={styles.disclaimer}>{optionalLiteral}.</Text>

            <TextInputBorder
              style={styles.textInputBorder}
              styleInput={styles.textInput}
              styleSuffix={styles.textSuffix}
              suffix="%"
              value={value}
              placeholder={"0"}
              accessibilityLabel="OneTimeFee"
              isNumeric
              onChangeValue={updateValue}
            />

            {this.state.conversionFeeTooHigh ? (
              <Text style={styles.hintStyle}>
                {conversionFeeLimitLiteral + " - " + "50%"}
              </Text>
            ) : null}

            {/* {value !== null && value !== undefined ? ( */}
            {true ? (
              <Button
                label={nextLiteral}
                accessibilityLabel="FeeNext"
                onPress={() => {
                  creditLineActions.setConversionFee(value);
                  creditLineActions.grantConversionPermitResetStatus();
                  navigation.navigate("ConversionPermitConfirm", {
                    creditLine: creditLine,
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

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
  creditLineActions: bindActionCreators(creditLineModule, dispatch),
  intlActions: bindActionCreators(intl.actions, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConversionPermitConversionFeeScreen);
