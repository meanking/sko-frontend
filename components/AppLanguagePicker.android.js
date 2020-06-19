import React from "react";
import { Picker, StyleSheet, Text, View } from "react-native";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import * as intl from "../redux/modules/internationalization";

import Theme from "../assets/Theme";

const styles = StyleSheet.create({
  container: {
    margin: 10,
    height: 56,
  },
  slider: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

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

  buildPickerItems = (languages) => {
    var toDisplay = [];

    for (var i in languages) {
      const langEntry = languages[i];

      const { lang_short, lang_full } = langEntry;

      toDisplay.push(
        <Picker.Item key={lang_short} label={lang_full} value={lang_short} />
      );
    }

    return toDisplay;
  };

  render() {
    const { actions } = this.props;

    const languages = intl.availableLanguages;

    return (
      <View style={styles.container}>
        <Text>{actions.getString("APP_LANGUAGE_LITERAL")}</Text>
        <Picker
          selectedValue={this.state.language}
          onValueChange={(itemValue, itemIndex) => {
            this.setState({ language: itemValue });
            actions.setLanguage(itemValue);
          }}
        >
          {this.buildPickerItems(this.sortLanguages(languages))}
          {/* {this.buildPickerItems(languages)} */}
        </Picker>
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
