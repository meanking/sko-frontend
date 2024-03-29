// @flow
import { AppRegistry, YellowBox } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";
import "react-native-gesture-handler";

YellowBox.ignoreWarnings([
  "Warning: isMounted(...) is deprecated",
  "Module RCTImageLoader",
  "Class RCTCxxModule was not exported",
  "Setting a timer"
]);

AppRegistry.registerComponent(appName, () => App);
