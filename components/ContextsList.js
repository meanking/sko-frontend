import React from "react";
import PropTypes from "prop-types";
import { SectionList } from "react-native";

import sortBy from "lodash/sortBy";
import map from "lodash/map";

import ContextView from "./ContextView";

import { ContextType } from "../lib/types";

const contextsFormatter = (contexts) =>
  sortBy(
    map(contexts, (data, title) => ({
      title,
      data,
    })),
    "title"
  );

const ContextsList = (props) => {
  const { contexts, onPressContext, navigation } = props;

  const keyExtractor = ({ name }) => name;

  // eslint-disable-next-line react/prop-types
  const renderItem = (toRender) => {
    return (
      <ContextView
        context={toRender.item.data}
        onPressContext={onPressContext}
        navigation={navigation}
      />
    );
  };

  return (
    <SectionList
      style={{ flex: 1, flexDirection: "row" }}
      renderItem={renderItem}
      sections={[
        {
          title: "Contexts",
          data: contextsFormatter(contexts),
        },
      ]}
      keyExtractor={keyExtractor}
      horizontal={true}
    />
  );
};

ContextsList.propTypes = {
  onPressContext: PropTypes.func,
  contexts: PropTypes.arrayOf(ContextType).isRequired,
};

ContextsList.defaultProps = {
  onPressContext: null,
};

export default ContextsList;
