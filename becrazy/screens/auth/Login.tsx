import { useState } from 'react'
import { TouchableOpacity, StyleSheet } from 'react-native'
import { Text, View } from '../../components/Themed'

import { Button } from '../../components/Button'
import { TextInput } from '../../components/TextInput'
import Logo from '../../components/Logo'
import { emailValidator } from '../../helpers/emailValidator'
import { passwordValidator } from '../../helpers/passwordValidator'

export default function LoginScreen() {
    const [email, setEmail] = useState({ value: '', error: '' })
    const [password, setPassword] = useState({ value: '', error: '' })

    const onLoginPressed = () => {
        const emailError = emailValidator(email.value)
        const passwordError = passwordValidator(password.value)
        console.log(email, password)
        if (emailError || passwordError) {
            setEmail({ ...email, error: emailError })
            setPassword({ ...password, error: passwordError })
            return
        }
    }

    return (
        <View style={styles.container}>
            <Logo />
            <Text style={styles.title}>Login</Text>
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
                returnKeyType="done"
                placeholder='Password'
                value={password.value}
                onChangeText={(text: string) => setPassword({ value: text, error: '' })}
                secureTextEntry
            />
            <Text style={styles.error}>{email.error || password.error}</Text>
            <View style={styles.forgotPassword}>
                <TouchableOpacity
                //onPress={() => navigation.navigate('ResetPasswordScreen')}
                >
                    <Text style={styles.forgot}>Forgot your password?</Text>
                </TouchableOpacity>
            </View>
            <Button onPress={onLoginPressed}>
                Login
            </Button>
            <View style={styles.row}>
                <Text>Don't have an account? </Text>
                <TouchableOpacity
                //onPress={() => navigation.replace('RegisterScreen')}
                >
                    <Text style={styles.link}>Sign up</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    error: {
        color: 'red',
        fontSize: 13,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 12,
    },
    container: {
        flex: 1,
        padding: 20,
        width: '100%',
        maxWidth: 340,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    forgotPassword: {
        width: '100%',
        alignItems: 'flex-end',
        marginBottom: 24,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    row: {
        flexDirection: 'row',
        marginTop: 15,
    },
    forgot: {
        fontSize: 13,
        color: 'purple',
    },
    link: {
        fontWeight: 'bold',
        color: 'blue',
    },
})