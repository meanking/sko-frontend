import React from 'react';
import PropTypes from 'prop-types';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as login from '../redux/modules/login';
import Assets from '../assets';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '80%',
    height: 100,
    marginBottom: 12,
    resizeMode: 'contain',
  },
});

const SPLASH_TIMEOUT = __DEV__ ? 100 : 2000;

class LoadingScreen extends React.Component {
  static propTypes = {
    initialized: PropTypes.bool.isRequired,
    username: PropTypes.string,
    actions: PropTypes.objectOf(PropTypes.func).isRequired,
    navigation: PropTypes.any.isRequired,
  };

  static defaultProps = {
    username: null,
  };

  constructor(props) {
    super(props);
    this.timeoutExpired = false;
  }

  componentDidMount() {
    const { actions } = this.props;
    actions.init();
    setTimeout(() => {
      this.timeoutExpired = true;
      this.checkNavigate();
    }, SPLASH_TIMEOUT);
  }

  componentDidUpdate() {
    this.checkNavigate();
  }

  checkNavigate = () => {
    const { initialized, username, navigation } = this.props;
    if (initialized && this.timeoutExpired) {
      navigation.navigate(username ? 'Main' : 'Auth');
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Image source={Assets.logo} style={styles.logo} />
        <ActivityIndicator size="large" />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  initialized: state.login.initialized,
  username: state.login.username,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(login.actions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoadingScreen);
