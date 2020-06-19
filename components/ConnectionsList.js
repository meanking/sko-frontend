import React from "react";
import PropTypes from "prop-types";
import { StyleSheet, SectionList, Text } from "react-native";

import groupBy from "lodash/groupBy";
import sortBy from "lodash/sortBy";
import map from "lodash/map";
import deburr from "lodash/deburr";

import { DisplayUserType } from "../lib/types";
import ConnectionView from "./ConnectionView";
import Theme from "../assets/Theme";

const styles = StyleSheet.create({
  sectionTitle: {
    color: Theme.colors.darkgrey,
    fontSize: 16,
    paddingTop: 16,
    paddingBottom: 16
  }
});

const sortConnections = connections =>
  connections.sort((conn1, conn2) =>
    conn1.username
      .toLocaleLowerCase()
      .localeCompare(conn2.username.toLocaleLowerCase(), "en", {
        sensitivity: "case"
      })
  );

const groupConnections = connections =>
  groupBy(connections, ({ username }) => deburr(username[0]).toUpperCase());

const connectionsByInitial = connections =>
  sortBy(
    map(groupConnections(sortConnections(connections)), (data, title) => ({
      title,
      data
    })),
    "title"
  );

const ConnectionsList = props => {
  const {
    connections,
    groupByInitial,
    onPressConnection,
    style,
    refreshing,
    onRefresh,
    navigation,
    selectOption,
    selectedUsers,
  } = props;

  // eslint-disable-next-line react/prop-types
  const renderSectionHeader = ({ section: { title } }) => (
    <Text style={styles.sectionTitle}>{title}</Text>
  );

  const checkSelected = connection => {
    return {
      selectedStatus: selectedUsers !== undefined? selectedUsers.includes(connection.username): null,
      connectionPosition: selectedUsers !== undefined? selectedUsers.indexOf(connection.username): null,
      connectionUsername: connection.username
    }
  }

  // eslint-disable-next-line react/prop-types
  const renderItem = ({ item: connection }) => (selectOption !== undefined && selectedUsers !== undefined)? (
    <ConnectionView
      connection={connection}
      onPressConnection={onPressConnection}
      navigation={navigation}
      selectOption={selectOption}
      selectedUser={() => checkSelected(connection)}
    />
  ): (
    <ConnectionView
      connection={connection}
      onPressConnection={onPressConnection}
      navigation={navigation}
    />
  );

  const keyExtractor = ({ handle }) => handle;

  return groupByInitial ? (
    <SectionList
      style={style}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
      sections={connectionsByInitial(connections)}
      keyExtractor={keyExtractor}
      refreshing={refreshing}
      onRefresh={onRefresh}
    />
  ) : (
    <SectionList
      style={style}
      renderItem={renderItem}
      sections={[
        {
          title: "Connections",
          data: sortConnections(connections)
        }
      ]}
      keyExtractor={keyExtractor}
      refreshing={refreshing}
      onRefresh={onRefresh}
    />
  );
};

ConnectionsList.propTypes = {
  onPressConnection: PropTypes.func,
  // connections: PropTypes.arrayOf(DisplayUserType).isRequired,
  groupByInitial: PropTypes.bool,
  style: PropTypes.any,
  refreshing: PropTypes.bool,
  onRefresh: PropTypes.func
};

ConnectionsList.defaultProps = {
  onPressConnection: null,
  groupByInitial: false,
  style: null,
  refreshing: false,
  onRefresh: null
};

export default ConnectionsList;
