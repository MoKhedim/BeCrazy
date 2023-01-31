import { useContext, useEffect, useState } from "react";
import { View, StyleSheet, Image, ImageBackground, TouchableOpacity } from "react-native";
import { Text } from "../../components/Themed";
import { RootStackScreenProps } from "../../types";
import { FontAwesome } from '@expo/vector-icons';
import Post from "../../interfaces/Post";
import UserInfo from "../../interfaces/UserInfo";
import { useImagePicker } from "../../hooks/useImagePicker";


export default function ProfileScreen({ navigation }: RootStackScreenProps<'ProfileScreen'>) {
    //const [userInfo, setUserInfo] = useState<UserInfo | undefined>();
    //const { token } =  useContext(MyContext);
    const { pickImage } = useImagePicker();

    // create a fake user info
    const userInfo: UserInfo = {
        username: "John Doe",
        followers: 100,
        following: 200,
        posts: [
            {
                title: "Post 1",
                description: "This is the first post",
                image: "https://i.pravatar.cc/300",
                likes: 100,
                comments: 10,
                date: "2021-01-01",
            },
            {
                title: "Post 2",
                description: "This is the second post",
                image: "https://i.pravatar.cc/300",
                likes: 200,
                comments: 20,
                date: "2021-01-02",
            },
            {
                title: "Post 3",
                description: "This is the third post",
                image: "https://i.pravatar.cc/300",
                likes: 300,
                comments: 30,
                date: "2021-01-03",
            },
            {
                title: "Post 4",
                description: "This is the fourth post",
                image: "https://i.pravatar.cc/300",
                likes: 400,
                comments: 40,
                date: "2021-01-04",
            }
        ]
    }

    /*
    useEffect(() => {
        const getUserInfo = async () => {
            const res = await fetch("localhost:3000/user/profile", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await res.json();
            setUserInfo(data);
        }

        getUserInfo();
    }, []);
    */


    return (
        userInfo && (
            <View style={styles.container}>
                <View style={styles.header}>
                    <ImageBackground imageStyle={{ borderRadius: 50, }} style={styles.avatar} source={{ uri: "https://i.pravatar.cc/300" }} >
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
                        <View style={styles.stats}>
                            <Text style={styles.stat}>{userInfo.followers} Followers</Text>
                            <Text style={styles.stat}>{userInfo.following} Following</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.columns}>
                    {userInfo.posts.map((post, index) => (
                        <View key={index} style={styles.column}>
                            <TouchableOpacity onPress={() => console.log('navigation.navigate("PostScreen")')}>
                                <ImageBackground
                                    style={styles.image}
                                    source={{ uri: post.image }}>
                                    <Text style={styles.likes}>♥ {post.likes}</Text>
                                </ImageBackground>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            </View>
        )
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
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
    stats: {
        flexDirection: "row",
        marginTop: 10,
    },
    stat: {
        marginRight: 20,
    },



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



    camera: {
        position: "absolute",
        right: 0,
        top: 3.5,
        backgroundColor: "#000",
        borderRadius: 50,
        padding: 10,
        opacity: 0.3,
    },
});

