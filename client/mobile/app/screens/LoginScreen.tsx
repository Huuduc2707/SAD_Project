import React, { FC } from "react"

// modules
import { observer } from "mobx-react-lite"

// components
import { ViewStyle, View } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { FormInput, PrimaryButton, LinkButton, Text } from "app/components"
import { SafeAreaView } from "react-native-safe-area-context"

// themes
import { appHeight } from "app/theme"

interface LoginScreenProps extends AppStackScreenProps<"Login"> {}

export const LoginScreen: FC<LoginScreenProps> = observer(function LoginScreen(props) {
  
  const handleLoginOnPress = () => {
    alert("Login")
  }
  
  const handleRegisterOnPress = () => {
    props.navigation.navigate("Register")
  }

  return (
    <SafeAreaView style={$root}>
      <View style={$inputContainer}>
        <FormInput placeholderTx="emailOrPhone" />
        <FormInput placeholderTx="password" secureEntry={true} />
      </View>
      <PrimaryButton titleTx="login" handleAction={handleLoginOnPress}/>
      <View style={appHeight.height25}></View>
      <LinkButton style={$forgotPasswordContainer} titleTx="forgotPassword"/>
      <View style={$registerTextContainer}>
        <Text tx="dontHaveAccount"/>
        <LinkButton titleTx="signUp" handleAction={handleRegisterOnPress}/>
      </View>
    </SafeAreaView>
  )
})

const $root: ViewStyle = {
  flex: 1,
  paddingHorizontal: 20,
}

const $inputContainer: ViewStyle = {
  paddingTop: "30%",
  gap: 25,
  marginBottom: 25
}

const $forgotPasswordContainer: ViewStyle = {
  alignSelf: "center",
  marginBottom: 16
}

const $registerTextContainer: ViewStyle = {
  alignSelf: "center",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center"
} 
