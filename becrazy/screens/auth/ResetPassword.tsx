import React, { useState } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Text } from '../../components/Themed'
import { Button } from '../../components/Button'
import { TextInput } from '../../components/TextInput'
import Logo from '../../components/Logo'
import { emailValidator } from '../../helpers/emailValidator'

export default function ResetPassword() {
    const [email, setEmail] = useState({ value: '', error: '' })

    const onResetPressed = () => {
        const emailError = emailValidator(email.value)
        if (emailError) {
            setEmail({ ...email, error: emailError })
            return
        }
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        width: '100%',
        maxWidth: 340,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 12,
    },
})
