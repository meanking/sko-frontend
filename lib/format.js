import moment from "moment";

/* eslint-disable import/prefer-default-export */
export const formatAmount = (value) => {
  // const absDecimals = Math.abs(value / 100);
  const absDecimals = value;
  const sign = value < 0 ? "-" : "";
  return `${sign}$${absDecimals
    .toFixed(2)
    .replace(/\d(?=(\d{3})+\.)/g, "$&,")}`;
};

export const formatDueDate = (when, getString) => {
  const today = getString("TODAY");
  const tomorrow = getString("TOMORROW");
  const yesterday = getString("YESTERDAY");

  return moment(when).calendar(null, {
    sameDay: "[" + today + "]",
    nextDay: "[" + tomorrow + "]",
    nextWeek: "dddd",
    lastDay: "[" + yesterday + "]",
    lastWeek: "DD/MM/YYYY",
    sameElse: "DD/MM/YYYY",
  });
};

export const formatTxDate = (when) => moment(when).format("DD/MM");

export const formatMonth = (when) => moment(when).format("MMMM YYYY");
