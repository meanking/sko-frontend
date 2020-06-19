import React from "react";
import PropTypes from "prop-types";
import { Text, SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { NavigationEvents } from "react-navigation";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import ConnectionsList from "../components/ConnectionsList";
import Button from "../components/Button";

import TopBarBackHome from "../components/TopBarBackHome";
import LoadingIndicator from "../components/LoadingIndicator";
import { ActionsType, DisplayUserType, CreditLineType } from "../lib/types";
import * as creditlines from "../redux/modules/creditline";
import * as connectionModule from "../redux/modules/connection";
import * as userSearchModule from "../redux/modules/userSearch";
import * as intl from "../redux/modules/internationalization";
import TextInputUserSearch from "../components/TextInputUserSearch";
import Theme from "../assets/Theme";

const { SearchUserState } = userSearchModule;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.white,
    paddingTop: 16
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
  },
  labelConnection: {
    ...Theme.fonts.regular,
    color: Theme.colors.darkgrey,
    fontSize: 16,
    marginTop: 27,
    marginBottom: 9
  }
});

class ConversionPermitGranteeScreen extends React.Component {
  static navigationOptions = {
    title: null
  };

  static propTypes = {
    userSearchActions: ActionsType.isRequired,
    creditLineActions: ActionsType.isRequired,
    connectionsActions: ActionsType.isRequired,
    connections: PropTypes.arrayOf(DisplayUserType),
    creditLine: CreditLineType.isRequired,
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
      inputGrantee: "",
      noCreditingLines: false,
      connectionDoesNotExist: false,
      hasPermit: false
    };
  }

  componentDidMount() {
    const {
      connectionsActions,
      creditLineActions,
      loadingConnectionsSuccess,
      navigation
    } = this.props;
    if (!loadingConnectionsSuccess) {
      connectionsActions.loadConnections();
    }

    const { creditLineId } = navigation.state.params;
    creditLineActions.loadCreditLine(creditLineId);
  }

  willFocus = () => {
    const { userSearchActions, creditLineActions } = this.props;
    userSearchActions.resetUserSearch();
    creditLineActions.resetCreateCreditLine();
  };

  inputEqualsUsername = () => {
    const { login } = this.props;

    return login.username === this.state.inputGrantee;
  };

  findConnection(connections, username) {
    for (var i in connections) {
      const conn = connections[i];
      if (conn.username === username) return conn;
    }
  }

  renderContent() {
    const {
      userSearchActions,
      creditLineActions,
      creditLineModule,
      connections,
      creditLine,
      loadingConnectionsSuccess,
      userSearch,
      navigation,
      login,
      intlActions
    } = this.props;

    const { inputGrantee } = this.state;
    const updateInputGrantee = text =>
      this.setState({
        inputGrantee: text,
        noCreditingLines: false,
        connectionDoesNotExist: false,
        hasPermit: false,
        permitToCreditor: false
      });
    const onNext = grantee => {
      userSearchActions.searchUser(grantee, {
        onSuccess: () => {
          const connection = this.findConnection(connections, grantee);

          // check if connection exists
          if (!connection) this.setState({ connectionDoesNotExist: true });
          else {
            // check if connection is for credit line creditor
            if (creditLine.creditor === connection.username) {
              this.setState({ permitToCreditor: true });
              return;
            }

            // check if permit exists for user
            if (hasPermit(connection.username, creditLine)) {
              this.setState({ hasPermit: true });
              return;
            }

            // check if connection has crediting credit line
            const creditingLineExists = hasCreditingLine(
              login.username,
              connection
            );

            if (creditingLineExists) {
              creditLineModule.setGrantee(grantee);
              navigation.navigate("ConversionPermitSingleMax", {
                creditLine: creditLine
              });
            } else {
              this.setState({ noCreditingLines: true });
            }
          }
        }
      });
    };

    const hasCreditingLine = (username, connection) => {
      const cls = connection.creditlines;

      for (var i in cls) {
        const cl = cls[i];

        if (cl.creditor === username) return true;
      }
      return false;
    };

    const hasPermit = (username, creditLine) => {
      for (var i in creditLine.permits) {
        const permit = creditLine.permits[i];

        if (permit.grantee === username) return true;
      }

      return false;
    };

    const creditLineCreditor = creditLine.creditor;

    const filterConnection = connection => {
      const initCond =
        inputGrantee === "" || connection.username.includes(inputGrantee);

      // cannot grant to credit line creditor
      const cond2 = connection.username !== creditLineCreditor;

      // must have at least one existing crediting credit line to connection, (in same currency)
      const creditingLineExists = hasCreditingLine(login.username, connection);

      // must not have a permit already existing on this credit line
      const noPermit = !hasPermit(connection.username, creditLine);

      return initCond && cond2 && creditingLineExists && noPermit;
    };

    const whomGrant = intlActions.getString("WHOM_GRANT_PERMIT");
    const granteeLiteral = intlActions.getString("GRANTEE_LITERAL");
    const connectionLiteral = intlActions.getString("CONNECTION_LITERAL");

    return (
      <ScrollView style={styles.container}>
        <TopBarBackHome
          screen="InspectCreditLine"
          onBack={() => {
            navigation.navigate("InspectCreditLine");
          }}
        ></TopBarBackHome>
        <View style={styles.innerContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.title}>{granteeLiteral}</Text>

            <Text style={styles.label}>{whomGrant}</Text>
            <TextInputUserSearch
              value={inputGrantee}
              accessibilityLabel="Grantee"
              userSearchState={userSearch.state}
              onChangeUser={userHandle => {
                updateInputGrantee(userHandle);
                if (userSearch.state !== SearchUserState.IDLE) {
                  userSearchActions.resetUserSearch();
                }
              }}
              noCreditingLines={this.state.noCreditingLines}
              connectionDoesNotExist={this.state.connectionDoesNotExist}
              hasPermit={this.state.hasPermit}
              sameUser={this.inputEqualsUsername()}
              permitToCreditor={this.state.permitToCreditor}
            />
          </View>

          <Text style={styles.labelConnection}>{connectionLiteral}</Text>
          {loadingConnectionsSuccess ? (
            <ConnectionsList
              connections={connections.filter(filterConnection)}
              onPressConnection={connection => {
                updateInputGrantee(connection.username);
                onNext(connection.username);
              }}
            />
          ) : null}

          {inputGrantee !== "" && !this.inputEqualsUsername() ? (
            <Button
              label="Next"
              accessibilityLabel="GranteeNext"
              onPress={() => onNext(inputGrantee)}
            />
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
  //
  connections: connectionModule.getConnections(state),
  loadingConnections: connectionModule.isLoading(state),
  loadingConnectionsSuccess: connectionModule.isLoadedSuccess(state),
  userSearch: state.userSearch,
  grantee: state.payment.grantee,
  creditLine: creditlines.getCreditLine(state)
});

const mapDispatchToProps = dispatch => ({
  userSearchActions: bindActionCreators(userSearchModule, dispatch),
  creditLineActions: bindActionCreators(creditlines.actions, dispatch),
  creditLineModule: bindActionCreators(creditlines, dispatch),
  connectionsActions: bindActionCreators(connectionModule.actions, dispatch),
  intlActions: bindActionCreators(intl.actions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConversionPermitGranteeScreen);
