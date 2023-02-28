import { Text, View } from './Themed';
import { Image, Platform, StyleSheet } from 'react-native';
import useColorScheme from '../hooks/useColorScheme';
import Colors from '../constants/Colors';
import { useEffect, useState } from 'react';
import { server } from '../constants/Server';

export function Comment(props: any) {
    const colorScheme = useColorScheme();
    const [profilePic, setProfilePic] = useState('')

    useEffect(() => {
        const getProlfilePic = async () => {
            const urlGetProfilePic = `${server}/searchUser/${props.comment.username}`;
            const resGetProfilePic = await fetch(urlGetProfilePic);
            if (resGetProfilePic.ok) { 
                const data = await resGetProfilePic.json();
                console.log(data);
                setProfilePic(data[0].profilePicture);
            }
        }
        getProlfilePic();
    }, [])

    return (
        <View>
            <View style={{
                flexDirection: 'row', flexWrap: 'wrap', flex: 1, width: "100%", height: 100, marginBottom: 10
            }}>
                <Image source={{uri: profilePic}} style={{
                        width: 50,
                        height: 50,
                        borderRadius: 50,
                        marginTop: 25,
                        marginEnd: 25,
                        marginStart: 25,
                    }} />
                <View style={Platform.OS !== 'web' ?
                    { flexDirection: 'column', flexWrap: 'wrap', maxWidth: "100%", width: "80%", flex: 1, marginEnd: 5 } :
                    { flexDirection: 'column', flexWrap: 'wrap', maxWidth: "100%", width: "90%", flex: 1, marginEnd: 5 }
                }>
                    <Text style={[styles.name, { color: Colors[colorScheme].text, marginTop: 20 }]}>{props.comment.username}</Text>
                    <Text style={[styles.comment, { color: Colors[colorScheme].text, marginTop: 2 }]}>
                        {props.comment.comment}
                    </Text>
                </View>
            </View>
            <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        </View>
    )
}

const styles = StyleSheet.create({
    name: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    comment: {
        fontSize: 16,
        textAlign: 'justify'
    },
    separator: {
        marginTop: 10,
        height: 1,
        width: '60%',
    },
})