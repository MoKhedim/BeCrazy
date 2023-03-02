import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	uploadingContainer: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center"
	},
	spacer: {
		flex: 1
	},
	buttonsContainer: {
		flexDirection: "row",
		margin: 20,
	},
	// make inputText an input field for a description with rounded corners
	inputText: {
		width: "75%",
		height: 100,
		margin: 10,
		borderWidth: 1,
		borderColor: "lightgray",
		borderRadius: 4,
		padding: 10,
		color: "black",
		fontSize: 18,
		backgroundColor: "white",
	},
	mediaPreview: {
		height: "70%",
		aspectRatio: 9 / 16,
		borderRadius: 4,
		margin: 10,
		backgroundColor: "black",
	},
	cancelButton: {
		alignItems: "center",
		flex: 1,
		borderColor: "lightgray",
		borderWidth: 1,
		flexDirection: "row",
		paddingVertical: 10,
		paddingHorizontal: 20,
		justifyContent: "center",
		borderRadius: 4,
		marginRight: 10
	},
	postButton: {
		alignItems: "center",
		flex: 1,
		backgroundColor: "#0000ff",
		flexDirection: "row",
		paddingVertical: 10,
		paddingHorizontal: 20,
		justifyContent: "center",
		borderRadius: 4,
		marginRight: 10
	},
	cancelButtonText: {
		marginLeft: 5,
		color: "black",
		fontWeight: "bold",
		fontSize: 16
	},
	postButtonText: {
		marginLeft: 5,
		color: "white",
		fontWeight: "bold",
		fontSize: 16
	}
});

export default styles;