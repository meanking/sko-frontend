import React from "react";
import PropTypes from "prop-types";
import { Text, SafeAreaView, ScrollView, StyleSheet, View, Switch } from "react-native";
import { NavigationEvents } from "react-navigation";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import ConnectionsList from "../components/ConnectionsList";
import Button from "../components/Button";

import TopBarBackHome from "../components/TopBarBackHome";
import LoadingIndicator from "../components/LoadingIndicator";
import { ActionsType, DisplayUserType } from "../lib/types";
import * as creditLineModule from "../redux/modules/creditline";
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
  },
  connectionToggle: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 16
  },
  toggleButton: {
    marginTop: 27,
    marginBottom: 9
  },
  toggleButtonSection: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center'
  }
});

class CreditLineRecipientScreen extends React.Component {
  static navigationOptions = {
    title: null
  };

  static propTypes = {
    userSearchActions: ActionsType.isRequired,
    creditLineActions: ActionsType.isRequired,
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
      inputRecipient: "",
      changeUserSelect: false
    };
  }

  componentDidMount() {
    const { connectionsActions, loadingConnectionsSuccess } = this.props;
    if (!loadingConnectionsSuccess) {
      connectionsActions.loadConnections();
    }
  }

  willFocus = () => {
    const { userSearchActions, creditLineActions } = this.props;
    userSearchActions.resetUserSearch();
    creditLineActions.resetCreateCreditLine();
  };

  inputEqualsUsername = () => {
    const { login } = this.props;

    return login.username === this.state.inputRecipient;
  };

  renderContent() {
    const {
      userSearchActions,
      creditLineActions,
      connections,
      loadingConnectionsSuccess,
      userSearch,
      navigation,
      intlActions,
      selectedUsers,
      selectOption,
      connectionsActions,
    } = this.props;

    const { inputRecipient } = this.state;

    const updateInputRecipient = text =>
      this.setState({ inputRecipient: text });

    const onNext = recipient => {
      userSearchActions.searchUser(recipient, {
        onSuccess: () => {
          creditLineActions.setNewCreditLineRecipient(recipient);
          navigation.navigate("CreditLineCurrency");
        }
      });
    };

    const onNextMulti = () => {
      navigation.navigate("CreditLineCurrency");
    };

    const filterConnection = connection => {
      return (
        inputRecipient === "" || connection.username.includes(inputRecipient)
      );
    };

    const whomGrant = intlActions.getString("WHOM_GRANT_CREDIT_LINE");
    const recipientLiteral = intlActions.getString("RECIPIENT_LITERAL");
    const connectionLiteral = intlActions.getString("CONNECTION_LITERAL");

    return (
      <ScrollView style={styles.container}>
        <TopBarBackHome
          screen="CreditLines"
          onBack={() => {
            navigation.navigate("CreditLines");
          }}
        ></TopBarBackHome>

        <View style={styles.innerContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.title}>{recipientLiteral}</Text>

            <Text style={styles.label}>{whomGrant}</Text>
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

          <View style={styles.connectionToggle}>
            <Text style={styles.labelConnection}>{connectionLiteral}</Text>
            <View style={styles.toggleButtonSection}>
              <Text style={styles.labelConnection}>{selectOption? 'Multiple user': 'Single user'}</Text>
              <Switch
                onValueChange={() => {
                  if (selectOption) {
                    connectionsActions.changeSeletOption(false);
                  } else {
                    connectionsActions.changeSeletOption(true);
                  }
                }}
                value={selectOption}
                style={styles.toggleButton}
              />
            </View>
          </View>

          {loadingConnectionsSuccess ? (
            <ConnectionsList
              connections={connections.filter(filterConnection)}
              onPressConnection={connection => {
                if (!selectOption) {
                  updateInputRecipient(connection.username);
                  onNext(connection.username);
                }
              }}
              selectedUsers={selectedUsers}
              selectOption={selectOption}
            />
          ) : null}

          {(inputRecipient !== "" && !this.inputEqualsUsername()) || selectOption ? (
            <Button
              label="Next"
              accessibilityLabel="RecipientNext"
              onPress={() => {
                  if (selectOption) {
                    onNextMulti()
                  } else {
                    onNext(inputRecipient)
                  }
                }
              }
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
  recipient: state.payment.recipient,
  selectedUsers: connectionModule.getSelectedUsers(state),
  selectOption: connectionModule.getSelectOption(state)
});

const mapDispatchToProps = dispatch => ({
  userSearchActions: bindActionCreators(userSearchModule, dispatch),
  creditLineActions: bindActionCreators(creditLineModule, dispatch),
  connectionsActions: bindActionCreators(connectionModule.actions, dispatch),
  intlActions: bindActionCreators(intl.actions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreditLineRecipientScreen);
