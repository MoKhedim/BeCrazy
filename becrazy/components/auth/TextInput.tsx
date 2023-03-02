import React from "react";
import { StyleSheet, TextInput as TextInputImport } from "react-native";
import Colors from "../../constants/Colors";
import useColorScheme from "../../hooks/useColorScheme";

export const TextInput = ({ ...props }) => {
	const colorScheme = useColorScheme();
	return (
	// props est égal aux props so like style or color or classnames
		<TextInputImport style={[style.TextInput,
			{
				backgroundColor: Colors[colorScheme].textInput,
				borderColor: Colors[colorScheme].textInput,
				color: Colors[colorScheme].text
			}]} {...props} />
	);
};



const style = StyleSheet.create({
	TextInput: {
		borderRadius: 10,
		height: 48,
		marginBottom: 16,
		borderWidth: 1,
		overflow: "hidden",
		width: "100%",
		paddingHorizontal: 16,
	},
});