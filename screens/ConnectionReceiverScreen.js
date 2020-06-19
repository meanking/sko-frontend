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
import { ActionsType, DisplayUserType } from "../lib/types";
import * as connectionModule from "../redux/modules/connection";
import * as userSearchModule from "../redux/modules/userSearch";
import * as intl from "../redux/modules/internationalization";
import TextInputUserSearch from "../components/TextInputUserSearch";
import Theme from "../assets/Theme";
import QRScannerLauncher from "../components/QRScannerLauncher";

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

class ConnectionReceiverScreen extends React.Component {
  static navigationOptions = {
    title: null
  };

  static propTypes = {
    userSearchActions: ActionsType.isRequired,
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
      inputReceiver: ""
    };
  }

  componentDidMount() {
    const { connectionsActions, loadingConnectionsSuccess } = this.props;
    if (!loadingConnectionsSuccess) {
      connectionsActions.loadConnections();
    }
  }

  willFocus = () => {
    const { userSearchActions } = this.props;
    userSearchActions.resetUserSearch();
  };

  inputEqualsUsername = () => {
    const { login } = this.props;

    return login.username === this.state.inputReceiver;
  };

  renderContent() {
    const {
      userSearchActions,
      connectionsActions,
      intlActions,
      connections,
      userSearch,
      navigation
    } = this.props;

    /**
     * Returns true if there's an existing connection; false otherwise.
     *
     * @param {arrayOf(DisplayUserType)} connections  [Array of existing connections of the current user..]
     * @param {String} receiver [The attempted receiver of a connection request.]
     */
    const checkConnectionExists = (connections, receiver) => {
      for (let [key, value] of Object.entries(connections)) {
        const otherUser = value.username;

        if (otherUser === receiver && value.status !== "CANCELLED") return true;
      }

      return false;
    };

    const { inputReceiver } = this.state;

    const updateInputReceiver = text =>
      this.setState({ inputReceiver: text, connectionExists: false });

    const onNext = receiver => {
      userSearchActions.searchUser(receiver, {
        onSuccess: () => {
          if (checkConnectionExists(connections, receiver)) {
            this.setState({ connectionExists: true });
          } else {
            connectionsActions.setNewConnectionReceiver(receiver);
            navigation.navigate("ConnectionConfirm");
          }
        }
      });
    };

    const receiverLiteral = intlActions.getString("RECEIVER_LITERAL");
    const whomSendConnection = intlActions.getString("WHOM_SEND_CONNECTION");
    const nextLiteral = intlActions.getString("NEXT_LITERAL");

    return (
      <ScrollView style={styles.container}>
        <TopBarBackHome
          screen="Connections"
          onBack={() => {
            navigation.navigate("Connections");
          }}
        ></TopBarBackHome>

        <View style={styles.innerContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.title}>{receiverLiteral}</Text>

            <Text style={styles.label}>{whomSendConnection}</Text>
            <TextInputUserSearch
              value={inputReceiver}
              accessibilityLabel="Receiver"
              userSearchState={userSearch.state}
              onChangeUser={userHandle => {
                updateInputReceiver(userHandle);
                if (userSearch.state !== SearchUserState.IDLE) {
                  userSearchActions.resetUserSearch();
                }
              }}
              existingConnection={this.state.connectionExists}
              sameUser={this.inputEqualsUsername()}
            />
          </View>
          {inputReceiver ? null : (
            <QRScannerLauncher
              navigation={navigation}
              onSuccess={userHandle => {
                updateInputReceiver(userHandle);
                if (userSearch.state !== SearchUserState.IDLE) {
                  userSearchActions.resetUserSearch();
                }
              }}
            ></QRScannerLauncher>
          )}

          {inputReceiver !== "" && !this.inputEqualsUsername() ? (
            <Button
              label={nextLiteral}
              accessibilityLabel="ReceiverNext"
              onPress={() => onNext(inputReceiver)}
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
  connections: connectionModule.getConnections(state),
  loadingConnections: connectionModule.isLoading(state),
  loadingConnectionsSuccess: connectionModule.isLoadedSuccess(state),
  userSearch: state.userSearch,
  receiver: state.connection.newConnection.receiver
});

const mapDispatchToProps = dispatch => ({
  userSearchActions: bindActionCreators(userSearchModule, dispatch),
  connectionsActions: bindActionCreators(connectionModule, dispatch),
  intlActions: bindActionCreators(intl.actions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConnectionReceiverScreen);
