import "react-native-gesture-handler";
import React from "react";
import AppContainer from "./redux/containers/AppContainer";
import configureStore from "./redux/configureStore";

class App extends React.Component {
  constructor(props) {
    super(props);

    console.disableYellowBox = true;
  }
  render() {
    return <AppContainer store={configureStore()} />;
  }
}

export default App;
