import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import SikobaAppNavigator from "./SikobaAppNavigator";
import BekiAppNavigator from "./BekiAppNavigator";

const appNavigators = { sikoba: SikobaAppNavigator, beki: BekiAppNavigator };

class AppNavigator extends React.Component {
  render() {
    const { context } = this.props;

    const Navigator = appNavigators[context.idName];

    return <Navigator />;
  }
}

const mapStateToProps = (state) => ({
  context: state.context.currentContext,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppNavigator);
