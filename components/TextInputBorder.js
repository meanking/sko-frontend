import React from "react";
import PropTypes from "prop-types";
import { Platform, StyleSheet, Text, TextInput, View } from "react-native";
import NumericInput from "./NumericInput";
import Theme from "../assets/Theme";

const styles = StyleSheet.create({
  inputBorder: {
    borderWidth: 2,
    borderColor: Theme.colors.blackgrey,
    flex: 0,
    flexDirection: "row",
    alignItems: "center"
  },
  inputRounded: {
    borderRadius: 4
  },
  prefix: {
    ...Theme.fonts.regular,
    paddingLeft: 12,
    fontSize: 16,
    textAlign: "center"
  },
  suffix: {
    ...Theme.fonts.regular,
    paddingRight: 12,
    fontSize: 16,
    textAlign: "center"
  },
  input: {
    ...Theme.fonts.regular,
    flex: 1,
    fontSize: 16,
    backgroundColor: "transparent",
    paddingLeft: 12,
    paddingRight: 12,
    ...Platform.select({
      ios: {
        height: 56
      }
    })
  },
  label: {
    backgroundColor: Theme.colors.white,
    position: "absolute",
    top: -7,
    left: 9,
    paddingLeft: 5,
    paddingRight: 5,
    ...Platform.select({
      android: {
        top: -8,
        left: 12
      }
    })
  },
  labelText: {
    ...Theme.fonts.regular,
    color: Theme.colors.grey,
    fontSize: 12
  },
  hint: {
    ...Theme.fonts.regular,
    marginTop: 5,
    marginLeft: 15,
    color: Theme.colors.grey,
    fontSize: 14,
    ...Platform.select({
      android: {
        // TODO: test marginTop with different android devices
        // marginTop: -11,
      }
    })
  }
});

const TextInputBorder = props => {
  const {
    style,
    styleLabel,
    styleInput,
    stylePrefix,
    styleSuffix,
    styleHint,
    prefix,
    suffix,
    hint,
    isNumeric,
    onChangeValue,
    ...extraProps
  } = props;

  const { value, borderTitle } = extraProps;

  return (
    <View>
      <View style={[styles.inputBorder, styles.inputRounded, style]}>
        {prefix !== "" ? (
          <Text style={[styles.prefix, stylePrefix]}>{prefix}</Text>
        ) : null}
        {isNumeric ? (
          <NumericInput
            style={[styles.input, styleInput]}
            placeholderTextColor={styles.labelText.color}
            onChange={onChangeValue}
            {...extraProps}
          />
        ) : (
          <TextInput
            style={[styles.input, styleInput]}
            placeholderTextColor={styles.labelText.color}
            onChangeText={onChangeValue}
            {...extraProps}
          />
        )}
        {suffix !== "" ? (
          <Text style={[styles.suffix, styleSuffix]}>{suffix}</Text>
        ) : null}
      </View>

      <Text style={[styles.hint, styleHint]}>{hint}</Text>

      {borderTitle !== undefined ? (
        <View style={styles.label}>
          <Text style={[styles.labelText, styleLabel]}>{borderTitle}</Text>
        </View>
      ) : null}
    </View>
  );
};

TextInputBorder.propTypes = {
  style: PropTypes.any,
  styleLabel: PropTypes.any,
  styleInput: PropTypes.any,
  stylePrefix: PropTypes.any,
  styleSuffix: PropTypes.any,
  styleHint: PropTypes.any,
  placeholder: PropTypes.string,
  prefix: PropTypes.string,
  suffix: PropTypes.string,
  hint: PropTypes.string,
  isNumeric: PropTypes.bool,
  onChangeValue: PropTypes.func
};

TextInputBorder.defaultProps = {
  style: null,
  styleLabel: null,
  styleInput: null,
  stylePrefix: null,
  styleSuffix: null,
  styleHint: null,
  placeholder: "",
  prefix: "",
  suffix: "",
  hint: "",
  isNumeric: false,
  onChangeValue: null
};

export default TextInputBorder;
