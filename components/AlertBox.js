import React from "react";
import { Alert } from "react-native";

export const showChoiceAlert = ({
  title,
  message,
  confirmText,
  cancelText,
  confirmAction,
  cancelAction,
}) => {
  Alert.alert(
    title,
    message,
    [
      {
        text: confirmText,
        onPress: () => {
          if (confirmAction && typeof confirmAction === "function")
            confirmAction();
        },
      },
      {
        text: cancelText,
        onPress: () => {
          if (cancelAction && typeof cancelAction === "function")
            cancelAction();
        },
      },
    ],
    { cancelable: true }
  );
};

export const showNotificationAlert = ({
  title,
  message,
  cancelText,
  cancelAction,
}) => {
  Alert.alert(
    title,
    message,
    [
      {
        text: cancelText,
        onPress: () => {
          if (cancelAction && typeof cancelAction === "function")
            cancelAction();
        },
      },
    ],
    { cancelable: true }
  );
};
