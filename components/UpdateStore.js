import { connect } from "react-redux";
import PropTypes from "prop-types";
import React, { Fragment } from "react";
import { bindActionCreators } from "redux";
import * as balance from "../redux/modules/balance";
import * as intlModule from "../redux/modules/internationalization";
import * as connection from "../redux/modules/connection";
import * as creditline from "../redux/modules/creditline";
import * as settings from "../redux/modules/settings";
import * as iouModule from "../redux/modules/iou";
import * as notificationsModule from "../redux/modules/notifications";

const reloadData = () => (dispatch) => {
  dispatch(balance.actions.updateBalance());
  dispatch(connection.actions.updateConnections());
  dispatch(connection.actions.updateConnection());
  dispatch(creditline.actions.updateCreditLines());
  dispatch(creditline.actions.updateCreditLine());
  dispatch(iouModule.actions.updateSingleIOU());
  // dispatch(settings.loadAccountSettings());

  // notifications
  dispatch(notificationsModule.checkNotifications());
};

class UpdateEvents extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    storeAction: PropTypes.objectOf(PropTypes.func).isRequired,
    settingsActions: PropTypes.objectOf(PropTypes.func).isRequired,
    intlActions: PropTypes.objectOf(PropTypes.func).isRequired,
  };

  static defaultProps = {
    children: null,
  };

  componentDidMount() {
    const { settingsActions, intlActions } = this.props;

    this.reloadTime = setTimeout(this.refreshStore, 1000);
    settingsActions.loadAccountSettings();
    intlActions.loadLanguage();
  }

  componentWillUnmount() {
    clearTimeout(this.reloadTime);
  }

  refreshStore = () => {
    const { storeAction } = this.props;
    storeAction.reloadData();
    this.reloadTime = setTimeout(this.refreshStore, 1000);
  };

  render() {
    const { children } = this.props;

    return <Fragment>{children}</Fragment>;
  }
}

const mapDispatchToProps = (dispatch) => ({
  storeAction: {
    reloadData: () => dispatch(reloadData()),
  },
  settingsActions: bindActionCreators(settings.actions, dispatch),
  intlActions: bindActionCreators(intlModule.actions, dispatch),
});

const UpdateStore = connect(
  null,
  mapDispatchToProps
)(UpdateEvents);

export default UpdateStore;
