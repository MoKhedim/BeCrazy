import React, { View, Modal, Text, StyleSheet, TouchableOpacity, TextInput } from "react-native";

export const ChangeBioModal = ({ ...props }) => {
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

					<Text style={styles.modalText}>Change Bio</Text>
					<TextInput
						style={styles.input}
						placeholder="Enter new bio"
						onChangeText={props.onChangeText}
						maxLength={25}
						value={props.value}
					/>
					<TouchableOpacity
						style={styles.button}
						onPress={props.onPress}
					>
						<Text style={styles.textStyle}>Change</Text>
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
	textStyleClose: {
		color: "red",
		fontWeight: "bold",
		textAlign: "center",
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
	topRightButton: {
		position: "absolute",
		top: 2,
		right: 2,
		padding: 10,
	},
});

