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
import * as connectionModule from "../redux/modules/connection";
import Theme from "../assets/Theme";
import Assets from "../assets";

import * as intl from "../redux/modules/internationalization";

const { CreateConnectionState } = connectionModule;
const Colors = Theme.colors;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    marginBottom: 20,
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

class ConnectionConfirmScreen extends React.Component {
  static navigationOptions = {
    title: null
  };

  static propTypes = {
    login: PropTypes.shape({
      username: PropTypes.string
    }).isRequired,
    connection: PropTypes.any.isRequired,
    connectionActions: PropTypes.objectOf(PropTypes.func).isRequired,
    navigation: PropTypes.any.isRequired
  };

  render() {
    const {
      login,
      connection,
      connectionActions,
      navigation,
      errorMessage,
      intlActions
    } = this.props;

    const { receiver, status } = connection;

    const isProcessing =
      status === CreateConnectionState.CREATING ||
      status === CreateConnectionState.WAITING_TX_RESPONSE;

    const connectionRequestSuccess = intlActions.getString(
      "CONNECTION_REQUEST_SENT"
    );
    const confirmConnectionLiteral = intlActions.getString(
      "CONFIRM_CONNECTION_LITERAL"
    );
    const reviewBeforeConfirmationLiteral = intlActions.getString(
      "REVIEW_BEFORE_CONFIRMATION_LITERAL"
    );
    const receiverLiteral = intlActions.getString("RECEIVER_LITERAL");
    const processingRequestLiteral = intlActions.getString(
      "PROCESSING_YOUR_REQUEST_LITERAL"
    );
    const confirmLiteral = intlActions.getString("CONFIRM_LITERAL");

    if (status === CreateConnectionState.CREATE_SUCCESS) {
      return (
        // TODO; clear connection state after success
        <SuccessView
          text={connectionRequestSuccess}
          onTimeOut={() => {
            navigation.dismiss();
          }}
          icon={Assets.confirmConnectionIcon}
          iconStyle={styles.icon}
        />
      );
    }

    if (status === CreateConnectionState.CREATE_FAILED) {
      return (
        <FailureView
          text={errorMessage}
          label={intlActions.getString("RETRY_LITERAL")}
          onCancel={() => navigation.dismiss()}
          onPress={() => connectionActions.resetCreateConnectionStatus()}
        />
      );
    }

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView style={styles.container}>
          <TopBarBackHome screen="Connections"></TopBarBackHome>
          <DimmableContainer
            style={styles.innerContainer}
            isDimmed={isProcessing}
          >
            <Text style={styles.title}>{confirmConnectionLiteral}</Text>

            <Text style={styles.label}>{reviewBeforeConfirmationLiteral}</Text>

            <TextInputBorder
              style={styles.input}
              styleLabel={{ color: Colors.darkgrey }}
              styleInput={{ color: Colors.darkgrey }}
              borderTitle={receiverLiteral}
              value={receiver}
              editable={false}
            />
          </DimmableContainer>

          {isProcessing ? (
            <ButtonLoading label={processingRequestLiteral + "..."} />
          ) : (
            <Button
              label={confirmLiteral}
              accessibilityLabel="Confirm"
              onPress={() => {
                connectionActions.createConnection({
                  sender: login.username,
                  receiver: receiver
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
  connection: state.connection.newConnection,
  errorMessage: connectionModule.getNewConnectionErrorMessage(state)
});

const mapDispatchToProps = dispatch => ({
  connectionActions: bindActionCreators(connectionModule, dispatch),
  intlActions: bindActionCreators(intl.actions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConnectionConfirmScreen);
