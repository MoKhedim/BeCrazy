import { useContext, useEffect, useState } from "react";
import { View, StyleSheet, ImageBackground, TouchableOpacity } from "react-native";
import { useColorScheme } from "react-native";
import { Text } from "../../components/Themed";
import { RootStackScreenProps } from "../../types";
import { FontAwesome } from '@expo/vector-icons';
import UserInfo from "../../interfaces/UserInfo";
import { useImagePicker } from "../../hooks/useImagePicker";
import { ChangeBioModal } from "../../components/profile/ChangeBioModal";
import { MyContext } from "../../App";
import { server } from "../../constants/Server"


export default function ProfileScreen({ navigation }: RootStackScreenProps<'ProfileScreen'>) {
    const [userInfo, setUserInfo] = useState<UserInfo | undefined>();
    const { token } = useContext(MyContext);
    const { pickImage } = useImagePicker();
    const [bioInput, setBioInput] = useState<string>("");
    const [modalVisible, setModalVisible] = useState(false);

    // get the user info from the server
    // at the start of the page
    useEffect(() => {
        const getUserInfo = async () => {
            const res = await fetch(`${server}/user/profile`, {
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

    const modifiyBio = async () => {
        // send request to modify bio
    }

    return (
        userInfo && (
            <View style={styles.container}>
                <ChangeBioModal
                    visible={modalVisible}
                    value={bioInput}
                    onPress={() => modifiyBio()}
                    onClose={() => setModalVisible(false)}
                    onChangeText={(text: string) => setBioInput(text)}
                />
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
                        <TouchableOpacity onPress={() => setModalVisible(true)}>
                            <Text style={styles.bio}>This is my bio</Text>
                        </TouchableOpacity>
                        <View style={styles.stats}>
                            <Text style={styles.stat}>{userInfo.followers} Followers</Text>
                            <Text style={styles.stat}>{userInfo.following} Following</Text>
                        </View>
                    </View>
                </View>
                <View style={[styles.separator, { "backgroundColor": useColorScheme() === "light" ? "black" : "white" }]} />
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
    separator: {
        marginHorizontal: "auto",
        height: 5,
        width: "90%",
        marginBottom: 15,
    },
});

