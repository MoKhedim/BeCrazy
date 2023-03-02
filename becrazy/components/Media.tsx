import { Modal, Platform, Pressable, ScrollView, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { useContext, useEffect, useState } from 'react';
import { Text, View } from './Themed';
import { Video, ResizeMode } from 'expo-av';
import Colors from '../constants/Colors';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { Image } from 'react-native';
import { Comment } from './Comment';
import useColorScheme from '../hooks/useColorScheme';
import { server } from '../constants/Server';
import { MyContext } from '../App';
import { comments } from '../interfaces/media/comments';
import { useNavigation } from '@react-navigation/native';



export function Media(props: any) {
	const navigation = useNavigation();
	const colorScheme = useColorScheme();
	type IconName = 'heart-o' | 'heart';
	const [isLiked, setIsLiked] = useState(props.allMedia.isLiked)
	const [profilePic, setProfilePic] = useState('');
	const [iconName, setIconName] = useState<IconName>('heart-o')
	const [likes, setLikes] = useState(props.allMedia.nbLikes)
	const { token } = useContext(MyContext);
	const [commentsModalVisible, setCommentsModalVisible] = useState(false);
	const [comments, setComments] = useState<Array<comments>>([{
		idMedia: '1', username: 'momo', comment: 'ta video est nulle'
	}, {
		idMedia: '2', username: 'Deadass', comment: 'deadass c nulle bro'
	}])
	const [commentInput, setCommentInput] = useState('');

	// get comments lorsqu'on ouvre le modale des commentaires
	useEffect(() => { getComments() }, [commentsModalVisible])

	function handlePressLike() {
		iconName === 'heart-o' ? setIconName('heart') : setIconName('heart-o');
		likeVideo()
	}

	const getComments = async () => {
		if (commentsModalVisible === true) {
			console.log('opening comments');
			const urlGetComments = `${server}/getComments/${props.allMedia._id}`;
			const resGetComments = await fetch(urlGetComments);
			if (resGetComments.ok) {
				const data = await resGetComments.json();
				setComments(data);
			}
		}
	}

	const getProlfilePic = async () => {
		const urlGetProfilePic = `${server}/searchUser/${props.allMedia.username}`;
		const resGetProfilePic = await fetch(urlGetProfilePic);
		if (resGetProfilePic.ok) {
			const data = await resGetProfilePic.json();
			setProfilePic(data[0].profilePicture);
		}
	}


	const postComment = async () => {
		const urlPostComment = `${server}/commentsMedia/${token}`
		const resPostComment = await fetch(urlPostComment, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				idMedia: props.allMedia._id,
				comment: commentInput
			})
		});
		if (resPostComment.ok) {
			const data = await resPostComment.json();
			let newComment = {
				idMedia: data.idMedia,
				username: data.username,
				comment: data.comment
			}
			setComments(comments => [...comments, newComment]);
			props.allMedia.nbComments += 1;
			setCommentInput('');
		}
	}

	async function likeVideo() {
		const urlLikes = `${server}/likeMedia/${token}`;

		const resultLikes = await fetch(urlLikes, {
			method: "POST",
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				idMedia: props.allMedia._id
			})
		});
		if (resultLikes.ok) {
			if (iconName !== 'heart') {
				setLikes(likes + 1);
			} else {
				setLikes(likes - 1);
			}
		} else {
			console.log("une erreur s'est produite");
		}
	}

	useEffect(() => {
		function checkLike() {
			if (isLiked == true) {
				setIconName('heart')
			} else {
				setIconName('heart-o')
			}
		}
		checkLike();
		getProlfilePic();
	}, [])


	return (
		profilePic === '' ? <View></View> : 
			<>
				<View style={{ flexDirection: 'row', flexWrap: 'wrap', flex: 1, maxWidth: 350, minWidth: 350, marginBottom: 10 }}>
					<TouchableOpacity onPress={() => navigation.navigate('ProfileScreen', { username: props.allMedia.username })}>
						<Image source={{ uri: profilePic }} style={{
							width: 50,
							height: 50,
							borderRadius: 50,
							marginTop: 25,
							right: 12,
						}} />
					</TouchableOpacity>
					<View style={Platform.OS !== 'web' ?
						{ flexDirection: 'column', flexWrap: 'wrap', maxWidth: "100%", minWidth: "70%", flex: 1, marginEnd: 5 } :
						{ flexDirection: 'column', flexWrap: 'wrap', maxWidth: "100%", minWidth: 265, flex: 1, marginEnd: 5 }
					}>
						<View style={{ flexDirection: 'row' }}>
							<TouchableOpacity onPress={() => navigation.navigate('ProfileScreen', { username: props.allMedia.username })}>
								<Text style={[styles.name, { color: Colors[colorScheme].text, marginTop: 25 }]}>
									{props.allMedia.username}
								</Text>
							</TouchableOpacity>
							<Text style={{ color: Colors[colorScheme].tabIconDefault, marginStart: 10, marginTop: 25, fontSize: 12 }}>
								{props.allMedia.created.split('T')[0].replaceAll('-', '/')}</Text>
						</View>
						<Text style={[styles.desc, { color: Colors[colorScheme].text, marginTop: 0, marginBottom: 0 }]}>
							{props.allMedia.description}
						</Text>
						<Video style={[styles.video, { backgroundColor: Colors[colorScheme].background }]}
							source={{ uri: `${server}/getMedia/${props.allMedia.videoId}` }}
							useNativeControls={true}
							isLooping={true}
							onError={(error) => console.error(error)}
							resizeMode={ResizeMode.CONTAIN}
						/>
						<View style={{
							flexDirection: 'row', marginTop: 10, alignItems: 'flex-end',
							justifyContent: 'flex-end', marginBottom: 20,
						}}>
							<MaterialIcons size={24} name='chat-bubble' color={Colors[colorScheme].text} style={styles.icon} onPress={() => setCommentsModalVisible(true)} />
							<Text style={{ marginEnd: 10 }}>{props.allMedia.nbComments}</Text>
							<FontAwesome size={24} name={iconName} color={Colors[colorScheme].text} style={styles.icon} onPress={handlePressLike} />
							<Text style={{ marginEnd: 10 }}>{likes}</Text>
						</View>
					</View>
				</View>
				<View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

				<Modal
					animationType="slide"
					transparent={true}
					visible={commentsModalVisible}
					onRequestClose={() => {
						setCommentsModalVisible(!commentsModalVisible);
					}}>
					<View style={Platform.OS == 'web' ? { height: '92%' } : { height: '100%' }}>
						<View style={{ flex: 1, flexDirection: 'row', position: 'absolute', top: 20 }}>
							<Pressable style={{ margin: 20 }} onPress={() => setCommentsModalVisible(!commentsModalVisible)}>
								<MaterialIcons name='arrow-back' size={30} color={Colors[colorScheme].text} />
							</Pressable>
							<Text style={[styles.title, { alignItems: 'center', marginTop: 16 }]}>Comments</Text>
						</View>
						<ScrollView style={{ marginTop: 100 }}>
							{comments?.map((comment, index) => {
								return <Comment key={comment.idMedia + index} comment={comment} modalTime={() => setCommentsModalVisible(false)} />
							})}</ScrollView>

					</View>
					<KeyboardAvoidingView behavior='position'>
						<View style={Platform.OS == 'web' ? { flex: 1, flexDirection: 'row', position: 'absolute', bottom: 0, width: '100%' } :
							{ flex: 1, flexDirection: 'row', position: 'absolute', bottom: 0, width: '80%' }}>

							<TextInput style={[styles.input,
							{
								alignItems: 'center',
								marginTop: 14,
								backgroundColor: Colors[colorScheme].textInput,
								color: Colors[colorScheme].text
							}]}
								value={commentInput}
								onChangeText={input => setCommentInput(input)}
								keyboardType='default'
							></TextInput>
							<TouchableOpacity style={{ margin: 20 }} onPress={postComment}>
								<MaterialIcons name='send' size={32} color={Colors[colorScheme].tint} />
							</TouchableOpacity>
						</View>
					</KeyboardAvoidingView>
				</Modal>
			</>
		)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	title: {
		fontSize: 30,
		fontWeight: 'bold',
		justifyContent: 'center'
	},
	separator: {
		marginTop: 10,
		height: 1,
		width: '60%',
		marginBottom: 10,
	},
	modalText: {
		marginBottom: 15,
		textAlign: 'center',
	},
	modalView: {
		margin: 20,
		backgroundColor: 'white',
		borderRadius: 20,
		padding: 35,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	video: {
		flex: 1,
		borderRadius: 8,
		width: "100%",
		maxWidth: 350,
		aspectRatio: 9 / 16,
		marginTop: 5,
		alignItems: 'center',
		justifyContent: 'center',
	},
	name: {
		fontSize: 14,
		fontWeight: 'bold',
	},
	desc: {
		fontSize: 14,
		textAlign: 'justify'
	},

	icon: {
		marginEnd: 10,
		maxHeight: 24,
	},
	input: {
		borderRadius: 30,
		width: '100%',
		borderWidth: 1,
		padding: 10,
		overflow: 'hidden',
		marginVertical: 10,
		marginStart: 10,
		height: 40,
	}
});
