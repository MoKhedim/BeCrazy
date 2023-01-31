import React, { useState } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Text } from '../../components/Themed'
import { Button } from '../../components/auth/Button'
import { TextInput } from '../../components/auth/TextInput'
import Logo from '../../components/Logo'
import { emailValidator } from '../../helpers/emailValidator'
import { RootStackScreenProps } from '../../types'
import styles from '../../components/auth/StyleSheetForm'

export default function ResetPasswordScreen({ navigation }: RootStackScreenProps<'ResetPasswordScreen'>) {
    const [email, setEmail] = useState({ value: '', error: '' })

    // if the email is valid, send the reset password request
    const onResetPressed = async () => {
        const emailError = emailValidator(email.value)
        if (emailError) {
            setEmail({ ...email, error: emailError })
            return
        }
        /**
         * TODO: send the reset password request
         */
    }

    return (
        <View style={styles.container}>
            <Logo />
            <Text style={styles.title}>Reset Password</Text>
            <TextInput
                returnKeyType="done"
                placeholder='Email'
                value={email.value}
                onChangeText={(text: string) => setEmail({ value: text, error: '' })}
                autoCapitalize="none"
                textContentType="emailAddress"
                keyboardType="email-address"
            />
            <Button onPress={onResetPressed}>
                Reset Password
            </Button>
        </View>
    )
}
