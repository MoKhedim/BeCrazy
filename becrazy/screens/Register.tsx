import React, { useState, useContext } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Text } from '../components/Themed'
import { Button } from '../components/Button'
import { TextInput } from '../components/TextInput'
import Logo from '../components/Logo'
import { emailValidator } from '../helpers/emailValidator'
import { passwordValidator } from '../helpers/passwordValidator'
import { passwordConfirmValidator } from '../helpers/passwordConfirmValidator'
import { useNavigation } from '@react-navigation/native'
import { MyContext } from '../App'


export default function Register() {
    const [email, setEmail] = useState({ value: '', error: '' })
    const [password, setPassword] = useState({ value: '', error: '' })
    const [passwordConfirm, setPasswordConfirm] = useState({ value: '', error: '' })
    const { token, setToken } = useContext(MyContext);


    const onRegisterPressed = () => {
        const emailError = emailValidator(email.value)
        const passwordError = passwordValidator(password.value)
        const passwordConfirmError = passwordConfirmValidator(password.value, passwordConfirm.value)
        if (emailError || passwordError || passwordConfirmError) {
            setEmail({ ...email, error: emailError })
            setPassword({ ...password, error: passwordError })
            setPasswordConfirm({ ...passwordConfirm, error: passwordConfirmError })
            return
        }
        const data = {
            email: email.value,
            password: password.value,
            passwordConfirm: passwordConfirm.value
        }
        console.log(data)
    }

    return (
        <View style={styles.container}>
            <Logo />
            <Text style={styles.title}>Register</Text>
            <TextInput
                returnKeyType="next"
                placeholder='Email'
                value={email.value}
                onChangeText={(text: string) => setEmail({ value: text, error: '' })}
                autoCapitalize="none"
                textContentType="emailAddress"
                keyboardType="email-address"
            />
            <TextInput
                returnKeyType="next"
                placeholder='Password'
                value={password.value}
                onChangeText={(text: string) => setPassword({ value: text, error: '' })}
                secureTextEntry
            />
            <TextInput
                returnKeyType="done"
                placeholder='Confirm Password'
                value={passwordConfirm.value}
                onChangeText={(text: string) => setPasswordConfirm({ value: text, error: '' })}
                secureTextEntry
            />
            <Text style={styles.error}>{email.error || password.error || passwordConfirm.error}</Text>
            <Button onPress={onRegisterPressed}>
                Register
            </Button>
            <View style={styles.row}>
                <Text>Already have an account? </Text>
                <TouchableOpacity
                //onPress={() => navigation.replace('LoginScreen')}
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
    error: {
        color: 'red',
        fontSize: 14,
        marginBottom: 4,
        marginTop: 4,
    },
    row: {
        flexDirection: 'row',
        marginTop: 4,
    },
    link: {
        fontWeight: 'bold',
        color: '#f01d71',
    },
})