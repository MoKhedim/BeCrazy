import { useEffect, useState } from "react";
import { View, StyleSheet, Image, ImageBackground } from "react-native";
import { Text } from "../components/Themed";
import { RootStackScreenProps } from "../types";

interface Post {
    title: string;
    description: string;
    image: string;
    likes: number;
    comments: number;
    date: string;
}

interface UserInfo {
    username: string;
    followers: number;
    following: number;
    posts: Array<Post>;
}


export default function ProfileScreen({ navigation }: RootStackScreenProps<'ProfileScreen'>) {
    //const [userInfo, setUserInfo] = useState<UserInfo | undefined>();

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
            }
        ]
    }

    /*
    useEffect(() => {
        const getUserInfo = async () => {
            const res = await fetch("localhost:3000/user");
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
                    <Image style={styles.avatar} source={{ uri: "https://i.pravatar.cc/300" }} />
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
                            <ImageBackground style={styles.image} source={{ uri: post.image }}>
                                <Text style={styles.likes}>♥ {post.likes}</Text>
                            </ImageBackground>
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
        borderRadius: 50,
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
});

