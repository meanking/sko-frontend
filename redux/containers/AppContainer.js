import React from "react";
import PropTypes from "prop-types";
import { Platform, StatusBar, StyleSheet, View } from "react-native";
import { Provider } from "react-redux";
import AppNavigator from "../../navigation/AppNavigator";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        {Platform.OS === "ios" && <StatusBar barStyle="default" />}
        <AppNavigator />
      </View>
    );
  }
}

const AppContainer = ({ store }) => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};

AppContainer.propTypes = {
  store: PropTypes.object.isRequired,
};

export default AppContainer;
