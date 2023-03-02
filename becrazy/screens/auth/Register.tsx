import React, { useState, useContext } from "react";
import { View, TouchableOpacity, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView } from "react-native";
import { Text } from "../../components/Themed";
import { Button } from "../../components/auth/Button";
import { TextInput } from "../../components/auth/TextInput";
import Logo from "../../components/Logo";
import { emailValidator } from "../../helpers/emailValidator";
import { passwordValidator } from "../../helpers/passwordValidator";
import { passwordConfirmValidator } from "../../helpers/passwordConfirmValidator";
import { MyContext } from "../../App";
import { RootStackScreenProps } from "../../types";
import styles from "../../components/auth/StyleSheetForm";
import RegisterUser from "../../interfaces/auth/RegisterUser";
import { server } from "../../constants/Server";


export default function RegisterScreen({ navigation }: RootStackScreenProps<"RegisterScreen">) {
	// set the initial state of the form
	const [username, setUsername] = useState({ value: "", error: "" });
	const [email, setEmail] = useState({ value: "", error: "" });
	const [password, setPassword] = useState({ value: "", error: "" });
	const [passwordConfirm, setPasswordConfirm] = useState({ value: "", error: "" });


	// create a function to handle the register button press
	// it will validate the email and password and then register the user if there are no errors
	// then navigate to the home page
	const onRegisterPressed = async () => {
		const emailError = emailValidator(email.value);
		const passwordError = passwordValidator(password.value);
		const passwordConfirmError = passwordConfirmValidator(password.value, passwordConfirm.value);
		if (emailError || passwordError || passwordConfirmError) {
			setEmail({ ...email, error: emailError });
			setPassword({ ...password, error: passwordError });
			setPasswordConfirm({ ...passwordConfirm, error: passwordConfirmError });
			return;
		}
		const res = await fetch(`${server}/signup`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				username: username.value,
				email: email.value,
				password: password.value
			} as RegisterUser)
		});
		if (res.status === 200) {
			navigation.replace("LoginScreen");
		} else {
			alert(res.status);
		}
	};

	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
			<KeyboardAvoidingView style={styles.container} behavior="padding">
				<Logo />
				<Text style={styles.title}>Register</Text>
				<TextInput
					returnKeyType="next"
					placeholder='Username'
					value={username.value}
					onChangeText={(text: string) => setUsername({ value: text, error: "" })}
					autoCapitalize="none"
				/>
				<TextInput
					returnKeyType="next"
					placeholder='Email'
					value={email.value}
					onChangeText={(text: string) => setEmail({ value: text, error: "" })}
					autoCapitalize="none"
					textContentType="emailAddress"
					keyboardType="email-address"
				/>
				<TextInput
					returnKeyType="next"
					placeholder='Password'
					value={password.value}
					onChangeText={(text: string) => setPassword({ value: text, error: "" })}
					secureTextEntry
				/>
				<TextInput
					returnKeyType="done"
					placeholder='Confirm Password'
					value={passwordConfirm.value}
					onChangeText={(text: string) => setPasswordConfirm({ value: text, error: "" })}
					secureTextEntry
				/>
				<Text style={styles.error}>{email.error || password.error || passwordConfirm.error}</Text>
				<Button onPress={onRegisterPressed}>
                    Register
				</Button>
				<View style={styles.row}>
					<Text>Already have an account? </Text>
					<TouchableOpacity
						onPress={() => navigation.replace("LoginScreen")}
					>
						<Text style={styles.link}>Login</Text>
					</TouchableOpacity>
				</View>
			</KeyboardAvoidingView>
		</TouchableWithoutFeedback>
	);
}
