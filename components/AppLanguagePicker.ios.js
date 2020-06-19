import React from "react";
import { TextInput, StyleSheet, Text, View } from "react-native";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import * as intl from "../redux/modules/internationalization";

import ModalSelector from "react-native-modal-selector";

import Theme from "../assets/Theme";

class AppLanguagePicker extends React.Component {
  constructor(props) {
    super(props);

    const language = this.props.actions.getLanguage();
    this.state = { language: language };
  }

  sortLanguages = (languages) => {
    return languages.sort((a, b) => {
      return a.lang_short > b.lang_short;
    });
  };

  buildItems = (languages) => {
    var toDisplay = [];

    for (var i in languages) {
      const langEntry = languages[i];

      const { lang_short, lang_full } = langEntry;

      toDisplay.push({ key: lang_short, label: lang_full });
    }

    return toDisplay;
  };

  render() {
    const { actions } = this.props;

    const languages = intl.availableLanguages;
    const selectorItems = this.buildItems(this.sortLanguages(languages));

    return (
      <View>
        <Text>{actions.getString("APP_LANGUAGE_LITERAL")}</Text>

        <View
          style={{
            flexDirection: "column",
            justifyContent: "space-around",
            padding: 20,
          }}
        >
          <ModalSelector
            data={selectorItems}
            onChange={(option) => {
              this.setState({
                language: option.label,
              });
              actions.setLanguage(option.key);
            }}
          >
            <TextInput
              style={{ borderWidth: 1, borderColor: "#ccc", padding: 10 }}
              editable={false}
              value={this.state.language}
            />
          </ModalSelector>
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(intl.actions, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppLanguagePicker);
