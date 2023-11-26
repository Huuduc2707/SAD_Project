import React from "react"

// modules
import { observer } from "mobx-react-lite"

// components
import { TextStyle, ViewStyle } from "react-native"
import { Button } from "./Button"

// i18n
import { TxKeyPath } from "app/i18n"

export interface PrimaryButtonProps {
  titleTx?: TxKeyPath
  handleAction?: any
}

/**
 * Describe your component here
 */
export const PrimaryButton = observer(function PrimaryButton(props: PrimaryButtonProps) {
  const { titleTx, handleAction } = props

  const handleActionOnPress = () => {
    handleAction()
  }

  return (
    <Button
      tx={titleTx}
      onPress={handleActionOnPress}
      style={$button}
      textStyle={$buttonText}
      pressedStyle={$pressedStyle}
    />
  )
})

const $button: ViewStyle = {
  width: "100%",
  height: 52,
  borderRadius: 99,
  backgroundColor: "#6941C6",
}

const $buttonText: TextStyle = {
  color: "white",
  textAlign: "center",
  fontSize: 28,
  fontWeight: "bold",
  lineHeight: 30,
}

const $pressedStyle: ViewStyle = {
  backgroundColor: "#6941C6",
  opacity: 0.7,
}
