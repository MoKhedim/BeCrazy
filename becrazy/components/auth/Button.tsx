import React, { StyleSheet, Text, TouchableOpacity } from "react-native";
import Colors from "../../constants/Colors";
import useColorScheme from "../../hooks/useColorScheme";

export const Button = ({ ...props }) => {
	const colorScheme = useColorScheme();

	return (
	// props est égal aux props so like style or color or classnames
	// props.children est égal au texte entre les balises
		<TouchableOpacity style={[style.button, { backgroundColor: Colors[colorScheme].tint }]} {...props}>
			<Text style={[style.buttonTitle, { color: Colors[colorScheme].background }]}>{props.children}</Text>
		</TouchableOpacity>
	);
};

const style = StyleSheet.create({
	button: {
		backgroundColor: "#2e64e5",
		borderRadius: 10,
		height: 48,
		justifyContent: "center",
		alignItems: "center",
		width: "100%",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 8 },
		shadowOpacity: 0.25,
		shadowRadius: 8,
		elevation: 8,
	},
	buttonTitle: {
		color: "#fff",
		fontSize: 18,
	},
});
