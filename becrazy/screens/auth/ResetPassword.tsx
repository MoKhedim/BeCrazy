import React, { useState } from 'react'
import { View, TouchableOpacity, TouchableWithoutFeedback, KeyboardAvoidingView, Keyboard } from 'react-native'
import { Text } from '../../components/Themed'
import { Button } from '../../components/auth/Button'
import { TextInput } from '../../components/auth/TextInput'
import Logo from '../../components/Logo'
import { emailValidator } from '../../helpers/emailValidator'
import { RootStackScreenProps } from '../../types'
import styles from '../../components/auth/StyleSheetForm'
import { server } from '../../constants/Server'
import { ChangePasswordModal } from '../../components/auth/ChangePasswordModal'
import { passwordValidator } from '../../helpers/passwordValidator'

export default function ResetPasswordScreen({ navigation }: RootStackScreenProps<'ResetPasswordScreen'>) {
    const [email, setEmail] = useState({ value: '', error: '' })
    const [modalVisible, setModalVisible] = useState(false)

    // the state for when the user wants to change his password
    const [newPassword, setNewPassword] = useState({ value: '', error: '' })
    const [code, setCode] = useState('')

    // if the email is valid, send the reset password request
    const onResetPressed = async () => {
        const emailError = emailValidator(email.value)
        if (emailError) {
            setEmail({ ...email, error: emailError })
            return
        }
        const res = await fetch(`${server}/forgotpassword`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email.value
            })
        });
        const data = await res.json();
        if (res.status === 200) {
            setModalVisible(true)
        } else {
            alert(data.message)
        }
    }

    // if the new password is valid and the code too, send the reset password request
    // and close the modal
    // only shows after the user has requested a reset password
    const modifyPassword = async () => {
        const passwordError = passwordValidator(newPassword.value)
        if (passwordError) {
            setNewPassword({ ...newPassword, error: passwordError })
            return
        }
        const res = await fetch(`${server}/verifCode/${email.value}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                code: code,
                newpassword: newPassword.value
            })
        });
        const data = await res.json();
        if (res.status === 200) {
            setModalVisible(false)
            navigation.replace('LoginScreen')
        } else {
            alert(data.message)
        }
    }


    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <KeyboardAvoidingView style={styles.container} behavior="padding">
                <ChangePasswordModal
                    visible={modalVisible}
                    onPress={() => modifyPassword()}
                    error={newPassword.error}
                    password={newPassword.value}
                    onChangePassword={(text: string) => setNewPassword({ value: text, error: '' })}
                    code={code}
                    onChangeCode={(text: string) => setCode(text)}
                    onClose={() => setModalVisible(false)}
                />
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
                <Text style={styles.error}>{email.error}</Text>
                <View style={styles.forgotPassword}>
                    <TouchableOpacity
                        onPress={() => setModalVisible(true)}
                    >
                        <Text style={styles.forgot}>Show modal</Text>
                    </TouchableOpacity>
                </View>
                <Button onPress={onResetPressed}>
                    Reset Password
                </Button>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    )
}
