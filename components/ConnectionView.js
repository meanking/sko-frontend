import React from "react";
import PropTypes from "prop-types";
import { Image, StyleSheet, Text, View, CheckBox } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { DisplayUserType } from "../lib/types";
import ArrowRow from "./ArrowRow";
import Theme from "../assets/Theme";
import Assets from "../assets";

import * as intl from "../redux/modules/internationalization";
import * as connection from "../redux/modules/connection.js";

const styles = StyleSheet.create({
  connectionView: {
    flexDirection: "row",
    backgroundColor: Theme.colors.white,
    height: 72
  },
  iconContainer: {
    backgroundColor: Theme.colors.grey,
    borderRadius: 24,
    width: 40,
    height: 40,
    alignItems: "center",
    marginTop: 16,
    marginRight: 16
  },
  icon: {
    flex: 1,
    width: 32, // TODO: check for general case image
    resizeMode: "contain"
  },
  border: {
    borderBottomColor: Theme.colors.lightgrey,
    borderBottomWidth: 1
  },
  connectionName: {
    ...Theme.fonts.semiBold,
    fontSize: 16,
    color: Theme.colors.black
  },
  connectionHandle: {
    ...Theme.fonts.regular,
    marginTop: 3,
    color: Theme.colors.darkgrey,
    fontSize: 12
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginRight: 12
  },
  connectionInfo: {
    flexDirection: "column"
  },
  children: {
    flexDirection: "column",
    alignItems: "flex-end"
  }
});

const ConnectionView = props => {
  const {
    connection,
    onPressConnection,
    children,
    style,
    intlActions,
    actions,
    addSelectedUser,
    removeSelectedUser,
    selectedUser,
    selectOption
  } = props;

  return (
    <View style={styles.connectionView}>
      <View style={styles.iconContainer}>
        <Image style={styles.icon} source={Assets.connectionIcon} />
      </View>
      <ArrowRow
        style={styles.border}
        onPress={() => {
          actions.inspectConnection(connection.id);
          onPressConnection(connection);
        }}
      >
        <View style={styles.row}>
          <View style={styles.connectionInfo}>
            <Text style={[styles.connectionName, style]}>
              {connection.username}
            </Text>
            <Text style={[styles.connectionHandle, style]}>
              {intlActions.getString(connection.status)}
            </Text>
          </View>
          <View style={styles.children}>
            {selectOption !== undefined && selectOption === true && selectedUser !== undefined && (
              <CheckBox 
                value={selectedUser().selectedStatus}
                onValueChange={() => {
                  if (selectedUser().selectedStatus) {
                    removeSelectedUser(selectedUser().connectionPosition);
                  } else {
                    addSelectedUser(selectedUser().connectionUsername);
                  }
                }}
              ></CheckBox>
            )}            
          </View>
        </View>
      </ArrowRow>
    </View>
  );
};

ConnectionView.propTypes = {
  // connection: DisplayUserType.isRequired,
  // onPressConnection: PropTypes.func.isRequired,
  // children: PropTypes.node,
  // style: PropTypes.any
};

ConnectionView.defaultProps = {
  children: null,
  style: null
};

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(connection.actions, dispatch),
  intlActions: bindActionCreators(intl.actions, dispatch),
  addSelectedUser: bindActionCreators(connection.addSelectedUser, dispatch),
  removeSelectedUser: bindActionCreators(connection.removeSelectedUser, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ConnectionView);
