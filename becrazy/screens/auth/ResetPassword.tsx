import React, { useState } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Text } from '../../components/Themed'
import { Button } from '../../components/auth/Button'
import { TextInput } from '../../components/auth/TextInput'
import Logo from '../../components/Logo'
import { emailValidator } from '../../helpers/emailValidator'
import { RootStackScreenProps } from '../../types'

export default function ResetPasswordScreen({ navigation }: RootStackScreenProps<'ResetPasswordScreen'>) {
    const [email, setEmail] = useState({ value: '', error: '' })

    // if the email is valid, send the reset password request
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
            <View style={styles.row}>
                <Text>Remembered your password? </Text>
                <TouchableOpacity
                    onPress={() => navigation.replace('LoginScreen')}
                >
                    <Text style={styles.link}>Login</Text>
                </TouchableOpacity>
            </View>
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
    row: {
        flexDirection: 'row',
        marginTop: 4,
    },
    link: {
        fontWeight: 'bold',
        color: '#2e78b7',
    },
})
