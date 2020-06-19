import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TextInput } from 'react-native';

class NumericInput extends Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    value: PropTypes.number,
    style: PropTypes.any,
  };

  static defaultProps = {
    value: null,
    style: null,
  };

  constructor(props) {
    super(props);
    this.state = { localValue: '' };
  }

  handleChangeText = (text) => {
    const pattern = new RegExp(/^\d*\.?\d*$/);
    const { onChange } = this.props;
    if (pattern.test(text)) {
      this.setState({ localValue: text });
      if (text === '' || text === '.') {
        onChange(undefined);
      } else {
        onChange(Number(text));
      }
    }
  }

  render() {
    const { localValue } = this.state;
    const { onChange, value, ...extraProps } = this.props;
    const fieldValue = !value || Number(localValue) === value
      ? localValue
      : (value && value.toString());
    return (
      <TextInput
        keyboardType="numeric"
        value={fieldValue}
        onChangeText={this.handleChangeText}
        {...extraProps}
      />
    );
  }
}

export default NumericInput;
