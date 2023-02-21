import { useContext, useEffect, useState } from "react";
import { View, StyleSheet, ImageBackground, TouchableOpacity } from "react-native";
import { useColorScheme } from "react-native";
import { Text } from "../../components/Themed";
import { RootStackScreenProps } from "../../types";
import { FontAwesome } from '@expo/vector-icons';
import UserInfo from "../../interfaces/profile/UserInfo";
import { useImagePicker } from "../../hooks/useImagePicker";
import { ChangeBioModal } from "../../components/profile/ChangeBioModal";
import { MyContext } from "../../App";
import { server } from "../../constants/Server";
import Post from "../../interfaces/Post";
import { PostsGrid } from "../../components/profile/PostsGrid";


export default function ProfileScreen({ navigation }: RootStackScreenProps<'ProfileScreen'>) {
    const colorScheme = useColorScheme();
    const { token } = useContext(MyContext);
    const { pickImage } = useImagePicker();

    // state for the user info and posts
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [userPosts, setUserPosts] = useState<Array<Post> | null>(null);

    // state for the bio modal
    const [bioInput, setBioInput] = useState<string>("");
    const [modalVisible, setModalVisible] = useState(false);


    // at the start of the page
    const getUserInfo = async () => {
        // get the user info from the server
        const res = await fetch(`${server}/getuser/${token}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });
        if (res.status !== 200) return
        const data = await res.json();
        setUserInfo(data.info);
    }

    useEffect(() => {
        getUserInfo();
    }, []);



    useEffect(() => {
        // get the user posts from the server
        if (!userInfo) return
        const getUserPosts = async () => {
            const res2 = await fetch(`${server}/userProfil/${userInfo.username}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });
            if (res2.status !== 200) return
            const data2 = await res2.json();
            setUserPosts(data2.result2);
        }

        getUserPosts();
    }, [userInfo]);


    // function to modify the bio
    const modifyBio = async () => {
        const res = await fetch(`${server}/updateUser/${token}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                bio: bioInput,
            })
        });
        if (res.status !== 200) return
        setModalVisible(false);
        getUserInfo();
    }


    return (
        userInfo && userPosts ? (
            <View style={styles.container}>
                <ChangeBioModal
                    visible={modalVisible}
                    value={bioInput}
                    onPress={() => modifyBio()}
                    onClose={() => setModalVisible(false)}
                    onChangeText={(text: string) => setBioInput(text)}
                />
                <View style={styles.header}>
                    <ImageBackground imageStyle={{ borderRadius: 50, }} style={styles.avatar} source={{ uri: userInfo.profilePicture }} >
                        <TouchableOpacity onPress={() => pickImage()}>
                            <FontAwesome
                                name="camera"
                                size={76}
                                color="white"
                                style={styles.camera}
                            />
                        </TouchableOpacity>
                    </ImageBackground>
                    <View style={styles.headerInfo}>
                        <Text style={styles.username}>{userInfo.username}</Text>
                        <TouchableOpacity onPress={() => setModalVisible(true)}>
                            <Text style={styles.bio}>{userInfo.bio}</Text>
                        </TouchableOpacity>
                        <View style={styles.stats}>
                            <Text style={styles.stat}>{userInfo.nbFollowers} Followers</Text>
                            <Text style={styles.stat}>{userInfo.nbFollows} Following</Text>
                        </View>
                    </View>
                </View>
                <View style={[styles.separator, { "backgroundColor": colorScheme === "light" ? "black" : "white" }]} />
                <PostsGrid userPosts={userPosts} />
            </View>
        ) : (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        )
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        padding: 20,
    },
    avatar: {
        width: 100,
        height: 100,
    },
    headerInfo: {
        marginLeft: 20,
    },
    username: {
        fontSize: 20,
        fontWeight: "bold",
    },
    bio: {
        marginTop: 5,
    },
    stats: {
        flexDirection: "row",
        marginTop: 10,
    },
    stat: {
        marginRight: 20,
    },



    camera: {
        position: "absolute",
        right: 0,
        top: 3.5,
        backgroundColor: "#000",
        borderRadius: 50,
        padding: 10,
        opacity: 0.3,
    },
    separator: {
        marginHorizontal: "auto",
        height: 5,
        width: "90%",
        marginBottom: 15,
    },
});

