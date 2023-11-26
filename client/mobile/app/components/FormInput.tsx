import React, { useState } from "react"

// modules
import { observer } from "mobx-react-lite"

// components
import { ViewStyle, TouchableOpacity, ImageStyle } from "react-native"
import { Icon } from "./Icon"
import { TextField } from "./TextField"

// i18n
import { TxKeyPath } from "app/i18n"

export interface FormInputProps {
  placeholderTx?: TxKeyPath
  secureEntry?: boolean
}

/**
 * Describe your component here
 */
export const FormInput = observer(function FormInput(props: FormInputProps) {
  const { placeholderTx, secureEntry = false } = props
  const [isHidden, setIsHidden] = useState(secureEntry)

  const handleShowPasswordOnPress = () => {
    setIsHidden(!isHidden)
  }

  return (
    <TextField
      inputWrapperStyle={$inputField}
      placeholderTx={placeholderTx}
      secureTextEntry={isHidden}
      RightAccessory={
        secureEntry
          ? () => (
              <TouchableOpacity activeOpacity={0.7} onPress={handleShowPasswordOnPress}>
                <Icon
                  style={$icon}
                  containerStyle={$iconContainer}
                  icon={isHidden ? "view" : "hidden"}
                />
              </TouchableOpacity>
            )
          : undefined
      }
    />
  )
})

const $inputField: ViewStyle = {
  borderWidth: 0,
  borderBottomWidth: 1,
}

const $icon: ImageStyle = {
  width: 24,
  height: 24,
}

const $iconContainer: ViewStyle = {
  marginVertical: "25%",
  marginRight: 10,
}
