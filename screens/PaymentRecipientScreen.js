// base react imports
import React from "react";
import PropTypes from "prop-types";
import { Text, SafeAreaView, ScrollView, StyleSheet, View } from "react-native";

// navigation imports
import { NavigationEvents } from "react-navigation";

// redux imports
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

// custom component imports
import Button from "../components/Button";
import ConnectionsList from "../components/ConnectionsList";
import LoadingIndicator from "../components/LoadingIndicator";

import TopBarBackHome from "../components/TopBarBackHome";
import TextInputUserSearch from "../components/TextInputUserSearch";

// types import
import { ActionsType, DisplayUserType } from "../lib/types";

// redux modules import
import * as connectionModule from "../redux/modules/connection";
import * as paymentModule from "../redux/modules/payment";
import * as userSearchModule from "../redux/modules/userSearch";
import * as intl from "../redux/modules/internationalization";

// theme import
import Theme from "../assets/Theme";

const { SearchUserState } = userSearchModule;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
    backgroundColor: Theme.colors.white
  },
  innerContainer: {
    paddingLeft: 16,
    paddingBottom: 24
  },
  headerContainer: {
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
  }
});

class PaymentRecipientScreen extends React.Component {
  static navigationOptions = {
    title: null
  };

  static propTypes = {
    userSearchActions: PropTypes.objectOf(PropTypes.func).isRequired,
    paymentActions: PropTypes.objectOf(PropTypes.func).isRequired,
    connectionsActions: ActionsType.isRequired,
    connections: PropTypes.arrayOf(DisplayUserType),
    loadingConnections: PropTypes.bool.isRequired,
    loadingConnectionsSuccess: PropTypes.bool.isRequired,
    navigation: PropTypes.any.isRequired,
    userSearch: PropTypes.any.isRequired
  };

  static defaultProps = {
    connections: null
  };

  constructor(props) {
    super(props);
    this.state = {
      inputRecipient: ""
    };
  }

  componentDidMount() {
    const { connectionsActions, loadingConnectionsSuccess } = this.props;
    if (!loadingConnectionsSuccess) {
      connectionsActions.loadConnections();
    }
  }

  willFocus = () => {
    const { userSearchActions, paymentActions } = this.props;

    userSearchActions.resetUserSearch();
    paymentActions.resetCreatePayment();
  };

  inputEqualsUsername = () => {
    const { login } = this.props;

    return login.username === this.state.inputRecipient;
  };

  renderContent() {
    const {
      userSearchActions,
      paymentActions,
      userSearch,
      connections,
      loadingConnectionsSuccess,
      navigation,
      intlActions
    } = this.props;

    const { inputRecipient } = this.state;

    const updateInputRecipient = text =>
      this.setState({ inputRecipient: text });

    const onNext = recipient => {
      userSearchActions.searchUser(recipient, {
        onSuccess: () => {
          paymentActions.setNewPaymentRecipient(recipient);
          paymentActions.loadPaymentCapacity(recipient);
          navigation.navigate("PaymentCurrency");
        }
      });
    };

    const filterConnection = connection =>
      inputRecipient === "" || connection.username.includes(inputRecipient);

    const whomPay = intlActions.getString("WHOM_PAY");
    const recipientLiteral = intlActions.getString("RECIPIENT_LITERAL");
    const latestTransactionsLiteral = intlActions.getString(
      "LATEST_TRANSACTIONS_LITERAL"
    );

    return (
      <ScrollView style={styles.container}>
        <TopBarBackHome
          screen="Balance"
          onBack={() => {
            navigation.navigate("Balance");
          }}
        ></TopBarBackHome>

        <View style={styles.innerContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.title}>{recipientLiteral}</Text>

            <Text style={styles.label}>{whomPay}</Text>

            <TextInputUserSearch
              value={inputRecipient}
              accessibilityLabel="Recipient"
              userSearchState={userSearch.state}
              onChangeUser={userHandle => {
                updateInputRecipient(userHandle);
                if (userSearch.state !== SearchUserState.IDLE) {
                  userSearchActions.resetUserSearch();
                }
              }}
              sameUser={this.inputEqualsUsername()}
            />
          </View>

          <Text style={[styles.label, { marginTop: 27 }]}>
            {latestTransactionsLiteral}
          </Text>
          {loadingConnectionsSuccess ? (
            <ConnectionsList
              connections={connections.filter(filterConnection)}
              onPressConnection={connection => {
                updateInputRecipient(connection.username);
                onNext(connection.username);
              }}
            />
          ) : null}

          {inputRecipient !== "" && !this.inputEqualsUsername() ? (
            <Button label="Next" onPress={() => onNext(inputRecipient)} />
          ) : null}
        </View>
      </ScrollView>
    );
  }

  render() {
    const { loadingConnections } = this.props;

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <NavigationEvents onWillFocus={this.willFocus} />
        {loadingConnections ? <LoadingIndicator /> : this.renderContent()}
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  login: state.login,
  connections: connectionModule.getConnections(state), // FIXME; lastTransactionsConnections
  loadingConnections: connectionModule.isLoading(state),
  loadingConnectionsSuccess: connectionModule.isLoadedSuccess(state),
  userSearch: state.userSearch,
  recipient: state.payment.recipient
});

const mapDispatchToProps = dispatch => ({
  userSearchActions: bindActionCreators(userSearchModule, dispatch),
  paymentActions: bindActionCreators(paymentModule, dispatch),
  connectionsActions: bindActionCreators(connectionModule.actions, dispatch),
  intlActions: bindActionCreators(intl.actions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PaymentRecipientScreen);
