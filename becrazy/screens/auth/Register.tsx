import React, { useState, useContext } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Text } from '../../components/Themed'
import { Button } from '../../components/auth/Button'
import { TextInput } from '../../components/auth/TextInput'
import Logo from '../../components/Logo'
import { emailValidator } from '../../helpers/emailValidator'
import { passwordValidator } from '../../helpers/passwordValidator'
import { passwordConfirmValidator } from '../../helpers/passwordConfirmValidator'
import { MyContext } from '../../App'
import { RootStackScreenProps } from '../../types'


export default function RegisterScreen({ navigation }: RootStackScreenProps<'RegisterScreen'>) {
    const [email, setEmail] = useState({ value: '', error: '' })
    const [password, setPassword] = useState({ value: '', error: '' })
    const [passwordConfirm, setPasswordConfirm] = useState({ value: '', error: '' })
    const { token, setToken } = useContext(MyContext);


    // create a function to handle the register button press
    // it will validate the email and password and then register the user if there are no errors
    // then navigate to the home page
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
            password: password.value
        }
        console.log(data)
        navigation.navigate('Root')
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