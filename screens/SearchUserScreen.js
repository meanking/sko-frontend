// react imports
import React from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

// redux imports
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// custom component imports
import TextInputUserSearch from '../components/TextInputUserSearch';
import Button from '../components/Button';
import BackArrow from '../components/BackArrow';

// redux again
import * as userSearchModule from '../redux/modules/userSearch';

// types import
import { ActionsType, DisplayUserType } from '../lib/types';

// theme import
import Theme from '../assets/Theme';

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
  },
  textPrefix: {
    fontSize: 46,
    color: Theme.colors.darkgrey,
  },
});

class SearchUserScreen extends React.Component {
  static navigationOptions = {};

  static propTypes = {
    userSearchActions: PropTypes.objectOf(PropTypes.func).isRequired,
    usersActions: ActionsType.isRequired,
    users: PropTypes.arrayOf(DisplayUserType),
    loadingUsers: PropTypes.bool.isRequired,
    loadingUsersSuccess: PropTypes.bool.isRequired,
    navigation: PropTypes.any.isRequired,
  };

  static defaultProps = {
    users: null,
  }

  constructor(props) {
    super(props);
    this.state = {
      userData: "",
    };
  }

  render() {
    const {
      userSearchActions,
      navigation,
    } = this.props;

    const {
      userData,
      user
    } = this.state;

    const updateUserData = data => (
      this.setState({ userData: data })
    );

    const onNext = (userData) => {
      userSearchActions.searchUser(userData, {
        onSuccess: () => {
          // paymentActions.setNewPaymentRecipient(recipient);
          // navigation.navigate('PayAmount');
          console.log("User search complete! User found:\n");
          console.log(user);

        },
        onFailed: () => {
          console.log("No user found with the provided data.")
        },
      });
    };

    return (
      <ScrollView style={styles.container}>
        <View style={styles.container}>
          <BackArrow />
          <View style={styles.innerContainer}>
            <Text style={styles.title}>
              Find an user
            </Text>

            <TextInputUserSearch
              value={userData}
              accessibilityLabel="User data"
              onChangeText={updateUserData}
            />

          {(userData)
              ? (
                <Button
                  label="Search"
                  accessibilityLabel="SearchUser"
                  onPress={() => {
                    onNext(this.state.userData) // TODO see actual search function
                    // navigation.navigate('PayPath'); // load user data
                  }}
                />
              )
              : null
            }
          </View>
          {(user)
              ? (
                <Button
                  label="Search"
                  accessibilityLabel="SearchUser"
                  onPress={() => {
                    onNext(this.state.userData) // TODO see actual search function
                    // navigation.navigate('PayPath'); // load user data
                  }}
                />
              )
              : null
            }
        </View>
      </ScrollView>
    );
  }
}

const mapStateToProps = state => (
  console.log(state.userSearch.user),{
  user: state.userSearch.user,
});

const mapDispatchToProps = dispatch => ({
  userSearchActions: bindActionCreators(userSearchModule, dispatch), // TODO analyse
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchUserScreen); // TODO analyse
