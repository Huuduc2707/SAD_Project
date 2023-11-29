import React from "react"

// modules
import { observer } from "mobx-react-lite"

// components
import { TextStyle, ViewStyle, TouchableOpacity } from "react-native"
import { Text } from "app/components/Text"

// i18n
import { TxKeyPath } from "app/i18n"

export interface LinkButtonProps {
  textStyle?: TextStyle
  titleTx?: TxKeyPath
  style?: ViewStyle
  handleAction?: any
}

/**
 * Describe your component here
 */
export const LinkButton = observer(function LinkButton(props: LinkButtonProps) {
  const { style, textStyle, titleTx, handleAction } = props

  const handleActionOnPress = () => {
    handleAction()
  }

  return (
    <TouchableOpacity style={style} activeOpacity={0.7} onPress={handleActionOnPress}>
      <Text style={[$text, textStyle]} tx={titleTx} />
    </TouchableOpacity>
  )
})

const $text: TextStyle = {
  color: "#6941C6",
  fontSize: 14,
  fontWeight: "bold",
}
