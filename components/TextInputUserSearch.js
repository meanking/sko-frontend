import React from "react";
import PropTypes from "prop-types";
import TextInputBorder from "./TextInputBorder";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import * as userSearchModule from "../redux/modules/userSearch";
import * as intl from "../redux/modules/internationalization";
import Theme from "../assets/Theme";

const { SearchUserState } = userSearchModule;

const Colors = Theme.colors;

const computeInputState = (userSearchState, strings) => {
  const {
    userDataLiteral,
    enterUsernameEmail,
    userNotFound,
    userFound,
    searching
  } = strings;

  const defaultInputState = {
    input: {
      style: {}
    },
    label: {
      style: {},
      text: userDataLiteral
    },
    hint: {
      style: {},
      text: enterUsernameEmail
    }
  };

  switch (userSearchState) {
    case SearchUserState.IDLE:
      return defaultInputState;
    case SearchUserState.NOT_FOUND:
      return {
        input: {
          style: { borderColor: Colors.red }
        },
        label: {
          ...defaultInputState.label,
          style: { color: Colors.red }
        },
        hint: {
          style: { color: Colors.red },
          text: userNotFound
        }
      };
    case SearchUserState.FOUND:
      return {
        input: {
          style: { borderColor: Colors.green }
        },
        label: {
          ...defaultInputState.label,
          style: { color: Colors.green }
        },
        hint: {
          style: { color: Colors.green },
          text: userFound
        }
      };
    case SearchUserState.SEARCHING:
      return {
        ...defaultInputState,
        hint: {
          style: null,
          text: searching
        }
      };
    default:
      return defaultInputState;
  }
};

const TextInputUserSearch = props => {
  const {
    value,
    onChangeUser,
    userSearchState,
    existingConnection,
    sameUser,
    noCreditingLines,
    connectionDoesNotExist,
    hasPermit,
    permitToCreditor,
    intlActions,
    ...extraProps
  } = props;

  const connectionAlreadyExists = intlActions.getString(
    "CONNECTION_ALREADY_EXISTS_LITERAL"
  );
  const noCreditingLinesString = intlActions.getString("NO_CREDITING_LINES");
  const noExistingConnectionLiteral = intlActions.getString(
    "NO_EXISTING_CONNECTION"
  );
  const sameUserString = intlActions.getString("SAME_USER");
  const hasPermitString = intlActions.getString("ALREADY_HAS_PERMIT");
  const permitToCreditorString = intlActions.getString(
    "PERMIT_TO_CREDITOR_ERROR"
  );
  const userDataLiteral = intlActions.getString("USER_DATA_LITERAL");
  const enterUsernameEmail = intlActions.getString("ENTER_USERNAME_EMAIL");
  const userNotFound = intlActions.getString("USER_NOT_FOUND_LITERAL");
  const userFound = intlActions.getString("USER_FOUND_LITERAL");
  const searching = intlActions.getString("SEARCHING_LITERAL");

  const existingConnectionStyle = {
    label: {
      style: { color: Colors.red }
    },
    input: {
      style: { borderColor: Colors.red }
    },
    hint: {
      text: connectionAlreadyExists
    }
  };

  const noExistingConnectionStyle = {
    label: {
      style: { color: Colors.red }
    },
    input: {
      style: { borderColor: Colors.red }
    },
    hint: {
      text: noExistingConnectionLiteral
    }
  };

  const noCreditingLinesStyle = {
    label: {
      style: { color: Colors.red }
    },
    input: {
      style: { borderColor: Colors.red }
    },
    hint: {
      text: noCreditingLinesString
    }
  };

  const sameUserStyle = {
    label: { style: { color: Colors.red } },
    input: { style: { borderColor: Colors.red } },
    hint: { text: sameUserString }
  };

  const hasPermitStyle = {
    label: { style: { color: Colors.red } },
    input: { style: { borderColor: Colors.red } },
    hint: { text: hasPermitString }
  };

  const permitToCreditorStyle = {
    label: { style: { color: Colors.red } },
    input: { style: { borderColor: Colors.red } },
    hint: { text: permitToCreditorString }
  };

  var input, label, hint;

  const strings = {
    userDataLiteral,
    enterUsernameEmail,
    userNotFound,
    userFound,
    searching
  };

  if (existingConnection) {
    var { input, label, hint } = existingConnectionStyle;
  } else if (noCreditingLines) {
    var { input, label, hint } = noCreditingLinesStyle;
  } else if (connectionDoesNotExist) {
    var { input, label, hint } = noExistingConnectionStyle;
  } else if (hasPermit) {
    var { input, label, hint } = hasPermitStyle;
  } else if (permitToCreditor) {
    var { input, label, hint } = permitToCreditorStyle;
  } else {
    var { input, label, hint } = computeInputState(userSearchState, strings);
  }

  if (sameUser) var { input, label, hint } = sameUserStyle;

  return (
    <TextInputBorder
      style={input.style}
      styleLabel={label.style}
      styleHint={hint.style}
      placeholder={label.text}
      hint={hint.text}
      value={value}
      onChangeText={onChangeUser}
      {...extraProps}
    />
  );
};

TextInputUserSearch.propTypes = {
  value: PropTypes.string,
  userSearchState: PropTypes.oneOf(Object.values(SearchUserState)).isRequired,
  onChangeUser: PropTypes.func,
  intlActions: PropTypes.object
};

TextInputUserSearch.defaultProps = {
  value: "",
  onChangeUser: null
};

// export default TextInputUserSearch;

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  intlActions: bindActionCreators(intl.actions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TextInputUserSearch);
