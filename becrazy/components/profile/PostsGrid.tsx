import React, { View, StyleSheet } from "react-native";
import { Text } from "../Themed";
import Post from "../../interfaces/Post";
import { server } from "../../constants/Server";
import { ResizeMode, Video } from "expo-av";

export const PostsGrid = ({ ...props }) => {
	const userPosts: Array<Post> = props.userPosts;

	return (
		<View style={styles.columns}>
			{userPosts.map((post, index) => (
				<View key={index} style={styles.column}>
					<Video
						source={{ uri: `${server}/getMedia/${post.videoId}` }}
						volume={1.0}
						isMuted={true}
						resizeMode={ResizeMode.CONTAIN}
						shouldPlay={false}
						style={styles.image}
					/>
					<Text style={styles.likes}>♥ {post.nbLikes}</Text>
				</View>
			))}
		</View>
	);
};

const styles = StyleSheet.create({
	columns: {
		flexDirection: "row",
		flexWrap: "wrap",
	},
	column: {
		width: "33%",
		padding: 5,
	},
	image: {
		width: "100%",
		height: 175,
	},
	likes: {
		position: "absolute",
		bottom: 10,
		right: 10,
		color: "#fff",
		fontWeight: "bold",
		textShadowColor: "rgba(0, 0, 0, 0.75)",
		textShadowOffset: { width: -1, height: 1 },
		textShadowRadius: 10,
	},
});