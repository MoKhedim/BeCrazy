import React, { useContext, useState } from "react";
import { ActivityIndicator, Keyboard, KeyboardAvoidingView, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { Text } from "../../components/Themed";
import styles from "./styles/savePost";
import { Feather } from "@expo/vector-icons";
import { RootStackScreenProps } from "../../types";
import { ResizeMode, Video } from "expo-av";
import { server } from "../../constants/Server";
import { MyContext } from "../../App";
import Colors from "../../constants/Colors";
import useColorScheme from "../../hooks/useColorScheme";


export default function SavePostScreen({ navigation, route }: RootStackScreenProps<"SavePostScreen">) {
	const { token } = useContext(MyContext);
	const [description, setDescription] = useState("");
	const [requestRunning, setRequestRunning] = useState(false);
	const colorScheme = useColorScheme();

	const handleSavePost = async () => {
		setRequestRunning(true);

		const formData = new FormData();
		formData.append("description", description);
		formData.append("video", route.params.source);

		const response = await fetch(`${server}/postMedia/${token}`, {
			method: "POST",
			headers: {
			    "Content-Type": "multipart/form-data",
			},
			body: formData,
		});



		if (response.status !== 200) {
			alert("Error uploading post");
			setRequestRunning(false);
			return;
		}

		setRequestRunning(false);
		navigation.replace("Root");
	};


	if (requestRunning) {
		return (
			<View style={styles.uploadingContainer}>
				<ActivityIndicator color='red' size='large' />
			</View>
		);
	}
	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
			<KeyboardAvoidingView style={styles.container} behavior="padding">
				<Video
					style={styles.mediaPreview}
					source={{ uri: route.params.source }}
					rate={1.0}
					volume={1.0}
					isMuted={true}
					resizeMode={ResizeMode.COVER}
					useNativeControls
				/>
				<TextInput
					style={[styles.inputText, { backgroundColor: Colors[colorScheme].textInput, color: Colors[colorScheme].text }]}
					maxLength={150}
					multiline
					onChangeText={(text) => setDescription(text)}
					placeholder="Describe your video"
				/>
				<View style={styles.spacer} />
				<View style={styles.buttonsContainer}>
					<TouchableOpacity
						onPress={() => navigation.goBack()}
						style={styles.cancelButton}>
						<Feather name="x" size={24} color={Colors[colorScheme].text} />
						<Text style={[styles.cancelButtonText, { color: Colors[colorScheme].text }]}>Cancel</Text>
					</TouchableOpacity>

					<TouchableOpacity
						onPress={() => handleSavePost()}
						style={[styles.postButton, { backgroundColor: Colors[colorScheme].tint }]}>
						<Feather name="corner-left-up" size={24} color={Colors[colorScheme].background} />
						<Text style={[styles.postButtonText, { color: Colors[colorScheme].background }]}>Post</Text>
					</TouchableOpacity>
				</View>
			</KeyboardAvoidingView>
		</TouchableWithoutFeedback>
	);
}