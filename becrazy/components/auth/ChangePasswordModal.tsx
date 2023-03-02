import React, { useState } from "react";
import { View, Modal, Text, StyleSheet, TouchableOpacity, TextInput } from "react-native";

export const ChangePasswordModal = ({ ...props }) => {
	const [passwordConfirm, setPasswordConfirm] = useState("");

	return (
		<Modal
			animationType="slide"
			transparent={true}
			{...props}
		>
			<View style={styles.centeredView}>
				<View style={styles.modalView}>

					<TouchableOpacity
						style={styles.topRightButton}
						onPress={props.onClose}
					>
						<Text style={styles.textStyleClose}>X</Text>
					</TouchableOpacity>

					<Text style={styles.modalText}>Change Password</Text>
					<TextInput
						style={styles.input}
						placeholder="Enter code"
						onChangeText={props.onChangeCode}
						maxLength={25}
						value={props.code}
					/>
					<TextInput
						style={styles.input}
						placeholder="Enter new password"
						onChangeText={props.onChangePassword}
						maxLength={25}
						value={props.password}
					/>
					<TextInput
						style={styles.input}
						placeholder="Confirm new password"
						onChangeText={(text: string) => setPasswordConfirm(text)}
						maxLength={25}
						value={passwordConfirm}
					/>
					<Text style={styles.error}>
						{props.error}
					</Text>
					<TouchableOpacity
						style={styles.button}
						onPress={props.onPress}
						disabled={props.password !== passwordConfirm || props.password.length < 1}
					>
						<Text
							style={
								props.password !== passwordConfirm || props.password.length < 1 ?
									styles.textStyleDisabled : styles.textStyle}
						>
                            Change
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	centeredView: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		marginTop: 22,
	},
	modalView: {
		margin: 20,
		backgroundColor: "white",
		borderRadius: 20,
		padding: 35,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	modalText: {
		marginBottom: 15,
		textAlign: "center",
		fontWeight: "bold",
		fontSize: 20,
	},
	input: {
		backgroundColor: "#E9E9EF",
		borderRadius: 10,
		height: 48,
		marginBottom: 16,
		borderWidth: 1,
		borderColor: "#E9E9EF",
		overflow: "hidden",
		width: "100%",
		paddingHorizontal: 16,
		margin: 12,
	},
	button: {
		borderRadius: 20,
		padding: 10,
		elevation: 2,
		backgroundColor: "#2196F3",
	},
	textStyle: {
		color: "white",
		fontWeight: "bold",
		textAlign: "center",
	},
	textStyleDisabled: {
		color: "white",
		fontWeight: "bold",
		textAlign: "center",
		opacity: 0.5,
	},
	error: {
		color: "red",
		fontWeight: "bold",
		textAlign: "center",
	},
	topRightButton: {
		position: "absolute",
		top: 10,
		right: 10,
	},
	textStyleClose: {
		color: "red",
		fontWeight: "bold",
		textAlign: "center",
	},
});