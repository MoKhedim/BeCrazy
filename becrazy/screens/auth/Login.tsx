import React, { useContext, useState } from "react";
import { TouchableOpacity, View, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from "react-native";
import { Text } from "../../components/Themed";
import { Button } from "../../components/auth/Button";
import { TextInput } from "../../components/auth/TextInput";
import Logo from "../../components/Logo";
import { emailValidator } from "../../helpers/emailValidator";
import { passwordValidator } from "../../helpers/passwordValidator";
import { RootStackScreenProps } from "../../types";
import { MyContext } from "../../App";
import styles from "../../components/auth/StyleSheetForm";
import LoginUser from "../../interfaces/auth/LoginUser";
import { server } from "../../constants/Server";

export default function LoginScreen({ navigation }: RootStackScreenProps<"LoginScreen">) {
	// create state variables for email and password
	const [email, setEmail] = useState({ value: "", error: "" });
	const [password, setPassword] = useState({ value: "", error: "" });
	const { token, setToken } = useContext(MyContext);
	if (token) navigation.replace("Root");

	// create a function to handle the login button press
	// it will validate the email and password and then log the user in if there are no errors
	// if there are errors, it will set the error state variables to display the error messages
	const onLoginPressed = async () => {
		const emailError = emailValidator(email.value);
		const passwordError = passwordValidator(password.value);
		if (emailError || passwordError) {
			setEmail({ ...email, error: emailError });
			setPassword({ ...password, error: passwordError });
			return;
		}
		const res = await fetch(`${server}/login`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				email: email.value,
				password: password.value
			} as LoginUser)
		});
		if (res.status === 200) {
			const data = await res.json();
			setToken(data.token);
			navigation.replace("Root");
		} else {
			alert(res.status);
		}
	};

	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
			<KeyboardAvoidingView style={styles.container} behavior="padding">
				<Logo />
				<Text style={styles.title}>Login</Text>
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
					returnKeyType="done"
					placeholder='Password'
					value={password.value}
					onChangeText={(text: string) => setPassword({ value: text, error: "" })}
					secureTextEntry
				/>
				{/**Show the error of either email or password */}
				<Text style={styles.error}>{email.error || password.error}</Text>
				<View style={styles.forgotPassword}>
					<TouchableOpacity
						onPress={() => navigation.navigate("ResetPasswordScreen")}
					>
						<Text style={styles.forgot}>Forgot your password?</Text>
					</TouchableOpacity>
				</View>
				<Button onPress={onLoginPressed}>
                    Login
				</Button>
				<View style={styles.row}>
					<Text>Don&apos;t have an account? </Text>
					<TouchableOpacity
						onPress={() => navigation.replace("RegisterScreen")}
					>
						<Text style={styles.link}>Register</Text>
					</TouchableOpacity>
				</View>
			</KeyboardAvoidingView >
		</TouchableWithoutFeedback>
	);
}
