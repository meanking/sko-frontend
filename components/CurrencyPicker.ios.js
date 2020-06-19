import React from "react";
import PropTypes from "prop-types";
import { StyleSheet, Text, View, TextInput } from "react-native";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import ModalSelector from "react-native-modal-selector";

import * as intl from "../redux/modules/internationalization";
import * as currency from "../redux/modules/currency";

import Theme from "../assets/Theme";

import CurrencyType from "../lib/types";
import LoadingIndicator from "./LoadingIndicator";

const Colors = Theme.colors;

const styles = StyleSheet.create({
  container: {
    margin: 10,
    height: 56,
  },
  noCurrencyAvailable: {
    fontSize: 20,
    textAlign: "center",
    marginTop: "10%",
    marginBottom: "10%",
  },
});

class CurrencyPicker extends React.Component {
  constructor(props) {
    super(props);

    this.state = { currencyISO: null };
  }

  static propTypes = {
    currencies: PropTypes.arrayOf(CurrencyType),
  };

  componentDidMount() {
    const { actions, loaded } = this.props;
    if (!loaded) {
      actions.loadCurrencies();
    }
  }

  refresh = () => {
    const { actions, refreshing } = this.props;
    if (!refreshing) {
      actions.refreshCurrencies();
    }
  };

  shouldCurrencyBeShown = (isoCode) => {
    const { availableCurrencies } = this.props;

    if (availableCurrencies) {
      for (var i in availableCurrencies) {
        const avCurr = availableCurrencies[i];

        if (avCurr === isoCode) return true;
      }

      return false;
    } else return true;
  };

  sortCurrencies = (currencies) => {
    return currencies.sort((a, b) => {
      return a.full_name > b.full_name;
    });
  };

  buildPickerItems = (currencies) => {
    var toDisplay = [];

    for (var i in currencies) {
      const currency = currencies[i];
      const { id, iso_code, full_name, symbol } = currency;

      var toShow = true;

      toShow = this.shouldCurrencyBeShown(iso_code);

      if (toShow) {
        toDisplay.push({ key: iso_code, label: full_name + " - " + symbol });
      }
    }

    return toDisplay;
  };

  findCurrency = (currencies, toFindId) => {
    for (var i in currencies) {
      const curr = currencies[i];

      if (curr.iso_code === toFindId) return curr;
    }
  };

  render() {
    const {
      onSelectCallback,
      currencies,
      style,
      toSelect,
      disabled,
      intlActions,
    } = this.props;

    if (currencies === null || currencies === undefined)
      return <LoadingIndicator />;

    // Set a default selected currency
    if (toSelect && this.state.currencyISO === null) {
      this.setState({ currencyISO: toSelect });
      onSelectCallback(this.findCurrency(currencies, toSelect));
    }

    const noCurrenciesAvailableLiteral = intlActions.getString(
      "NO_CURRENCIES_AVAILABLE_LITERAL"
    );
    const currencyItems = this.buildPickerItems(
      this.sortCurrencies(currencies)
    );

    if (currencyItems.length > 0) {
      return (
        <View
          style={{
            // flex: 1,
            flexDirection: "column",
            justifyContent: "space-around",
            padding: 20,
          }}
        >
          <ModalSelector
            data={currencyItems}
            initValue="Select your preferred currency"
            onChange={(option) => {
              this.setState({
                currencyISO: option.key,
              });
              onSelectCallback(this.findCurrency(currencies, option.key));
            }}
          >
            <TextInput
              style={{ borderWidth: 1, borderColor: "#ccc", padding: 10 }}
              editable={false}
              value={toSelect || this.state.currencyISO}
            />
          </ModalSelector>
        </View>
      );
    } else {
      return <Text>{noCurrenciesAvailableLiteral}</Text>;
    }
  }
}

const mapStateToProps = (state) => ({
  loaded: currency.isLoadedSuccess(state),
  refreshing: currency.isRefreshing(state),
  currencies: currency.getCurrencies(state),
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(currency.actions, dispatch),
  intlActions: bindActionCreators(intl.actions, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CurrencyPicker);
