import React from "react";
import PropTypes from "prop-types";
import { Text, SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Button from "../components/Button";
import ButtonLoading from "../components/ButtonLoading";
import TextInputBorder from "../components/TextInputBorder";
import SuccessView from "../components/SuccessView";
import FailureView from "../components/FailureView";

import TopBarBackHome from "../components/TopBarBackHome";
import { formatAmount } from "../lib/format";
import * as creditLineModule from "../redux/modules/creditline";
import Theme from "../assets/Theme";
import Assets from "../assets";

import * as intl from "../redux/modules/internationalization";

const { GrantConversionPermitState } = creditLineModule;
const Colors = Theme.colors;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    paddingTop: 15,
    marginBottom: 15,
    backgroundColor: Colors.white
  },
  innerContainer: {
    paddingLeft: 16,
    paddingRight: 16
  },
  title: {
    ...Theme.fonts.regular,
    color: Colors.black,
    fontSize: 22,
    marginBottom: 19
  },
  label: {
    ...Theme.fonts.regular,
    color: Colors.black,
    fontSize: 16,
    marginBottom: 23
  },
  icon: {
    width: 197,
    height: 308,
    resizeMode: "contain",
    marginBottom: 15
  },
  input: {
    marginBottom: 7
  }
});

const DimmableContainer = props => {
  const { isDimmed, children, style } = props;

  return (
    <View style={style}>
      {children}

      {isDimmed ? (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "#FFFFFFBF"
          }}
        />
      ) : null}
    </View>
  );
};

DimmableContainer.propTypes = {
  isDimmed: PropTypes.bool,
  children: PropTypes.arrayOf(PropTypes.element),
  style: PropTypes.any
};

DimmableContainer.defaultProps = {
  isDimmed: false,
  children: null,
  style: null
};

class SetUpConversionProfileConfirmScreen extends React.Component {
  static navigationOptions = {
    title: null
  };

  static propTypes = {
    login: PropTypes.shape({
      username: PropTypes.string
    }).isRequired,
    creditLine: PropTypes.any.isRequired,
    creditLineActions: PropTypes.objectOf(PropTypes.func).isRequired,
    navigation: PropTypes.any.isRequired
  };

  render() {
    const {
      creditLineActions,
      singleMax,
      globalMax,
      navigation,
      status,
      login,
      intlActions
    } = this.props;

    const { creditLine } = navigation.state.params;
    const creditLineId = creditLine.id;
    const creditLineAmount = creditLine.amount_formatted;

    const conversionProfileSuccessfullySetup = intlActions.getString(
      "CONVERSION_PROFILE_SET_UP_SUCCESS"
    );
    const conversionPermitGrantedFailed = intlActions.getString(
      "CONVERSION_PROFILE_SET_UP_FAILED"
    );

    const isProcessing =
      status === GrantConversionPermitState.GRANTING ||
      status === GrantConversionPermitState.WAITING_TX_RESPONSE;

    if (status === GrantConversionPermitState.GRANT_SUCCESS) {
      return (
        <SuccessView
          text={conversionProfileSuccessfullySetup}
          onTimeOut={() => {
            navigation.navigate("GrantConversionPermit", {
              creditLineId: creditLineId
            });
          }}
          icon={Assets.confirmCreditLineIcon}
          iconStyle={styles.icon}
        />
      );
    }

    if (status === GrantConversionPermitState.GRANT_FAILED) {
      return (
        <FailureView
          text={conversionPermitGrantedFailed}
          label={intlActions.getString("RETRY_LITERAL")}
          onCancel={() => navigation.dismiss()}
          onPress={() => creditLineActions.resetCreateCreditLineStatus()}
        />
      );
    }

    const confirmConversionProfileString = intlActions.getString(
      "CONFIRM_CONVERSION_PROFILE_LITERAL"
    );
    const reviewBeforeConfirmationLiteral = intlActions.getString(
      "REVIEW_BEFORE_CONFIRMATION_LITERAL"
    );
    const creditLineAmountLiteral = intlActions.getString(
      "CREDIT_LINE_AMOUNT_LITERAL"
    );
    const singleMaxLiteral = intlActions.getString("SINGLE_MAX_LITERAL");
    const globalMaxLiteral = intlActions.getString("GLOBAL_MAX_LITERAL");
    const processingConversionPermit = intlActions.getString(
      "PROCESSING_YOUR_REQUEST_LITERAL"
    );
    const confirmLiteral = intlActions.getString("CONFIRM_LITERAL");

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView style={styles.container}>
          <TopBarBackHome screen="InspectCreditLine" />
          <DimmableContainer
            style={styles.innerContainer}
            isDimmed={isProcessing}
          >
            <Text style={styles.title}>{confirmConversionProfileString}</Text>

            <Text style={styles.label}>{reviewBeforeConfirmationLiteral}</Text>

            <TextInputBorder
              style={styles.input}
              styleLabel={{ color: Colors.darkgrey }}
              styleInput={{ color: Colors.darkgrey }}
              borderTitle={creditLineAmountLiteral}
              value={creditLineAmount}
              editable={false}
            />

            <TextInputBorder
              style={styles.input}
              styleLabel={{ color: Colors.darkgrey }}
              styleInput={{ color: Colors.darkgrey }}
              borderTitle={globalMaxLiteral}
              value={creditLine.currency_symbol + globalMax}
              editable={false}
            />

            <TextInputBorder
              style={styles.input}
              styleLabel={{ color: Colors.darkgrey }}
              styleInput={{ color: Colors.darkgrey }}
              borderTitle={singleMaxLiteral}
              value={creditLine.currency_symbol + singleMax}
              editable={false}
            />
          </DimmableContainer>

          {isProcessing ? (
            <View>
              <ButtonLoading
                style={{ marginBotton: 20 }}
                label={processingConversionPermit}
              />
            </View>
          ) : (
            <Button
              label={confirmLiteral}
              accessibilityLabel="Confirm"
              onPress={() => {
                creditLineActions.setUpConversionProfile({
                  owner: login.username,
                  creditLineId: creditLineId,
                  globalMax: globalMax,
                  singleMax: singleMax
                });
              }}
            />
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  login: state.login,
  singleMax: creditLineModule.getConversionProfileSingleMax(state),
  globalMax: creditLineModule.getConversionProfileGlobalMax(state),
  status: creditLineModule.getSetUpConversionProfileStatus(state),
  errorMessage: creditLineModule.getErrorMessage(state)
});

const mapDispatchToProps = dispatch => ({
  creditLineActions: bindActionCreators(creditLineModule, dispatch),
  intlActions: bindActionCreators(intl.actions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SetUpConversionProfileConfirmScreen);
