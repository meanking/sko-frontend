import React from "react";
import PropTypes from "prop-types";
import { StyleSheet, View, SafeAreaView, Text } from "react-native";
import { BalanceType } from "../lib/types";

const styles = StyleSheet.create({
  container: { flexDirection: "column", width: null },
  primaryComponentView: { flex: 1, width: null },
  primaryComponentText: { fontSize: 38, textAlign: "center" },
  secondaryComponentView: { flex: 1, width: null },
  secondaryComponentText: { fontSize: 24, textAlign: "center", opacity: 0.4 }
});

class BalanceSlider extends React.Component {
  static propTypes = {
    balances: PropTypes.arrayOf(BalanceType)
  };

  constructor(props) {
    super(props);

    this.state = { currentIndex: 0 };
  }

  // To be used by the bottom component.
  incrementIndex = balances => {
    this.setState({
      currentIndex: (this.state.currentIndex + 1) % balances.length
    });
  };

  // To be used by the top component.
  decrementIndex = balances => {
    var newIndex = this.state.currentIndex - 1;

    if (newIndex < 0) newIndex = balances.length + newIndex;

    this.setState({
      currentIndex: newIndex
    });
  };

  // Main component that is placed in the middle.
  mainComponent = balances => {
    const currentIndex = this.state.currentIndex;
    return (
      <View style={styles.primaryComponentView}>
        <Text style={styles.primaryComponentText}>
          {balances[currentIndex].formatted}
        </Text>
      </View>
    );
  };

  // Top component, placed above the main component.
  topComponent = balances => {
    var topIndex = this.state.currentIndex - 1;
    if (topIndex < 0) topIndex = balances.length + topIndex;

    return (
      <View style={styles.secondaryComponentView}>
        <Text
          style={styles.secondaryComponentText}
          onPress={() => this.decrementIndex(balances)}
        >
          {balances[topIndex].formatted}
        </Text>
      </View>
    );
  };

  // Bototm component, placed below the main component.
  bottomComponent = balances => {
    const currentIndex = this.state.currentIndex;
    return (
      <View style={styles.secondaryComponentView}>
        <Text
          style={styles.secondaryComponentText}
          onPress={() => this.incrementIndex(balances)}
        >
          {balances[(currentIndex + 1) % balances.length].formatted}
        </Text>
      </View>
    );
  };

  render() {
    const { balances } = this.props;
    const balancesCount = balances.length;

    if (balancesCount === 0) {
      return <SafeAreaView></SafeAreaView>;
    }

    return (
      <SafeAreaView style={styles.container}>
        {balancesCount > 2 ? this.topComponent(balances) : null}
        {this.mainComponent(balances)}
        {balancesCount > 1 ? this.bottomComponent(balances) : null}
      </SafeAreaView>
    );
  }
}

export default BalanceSlider;
