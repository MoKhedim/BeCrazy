import { StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import { Text, View } from './Themed';
import { Video, AVPlaybackStatus, ResizeMode } from 'expo-av';
import Colors from '../constants/Colors';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { Image } from 'react-native';
import useColorScheme from '../hooks/useColorScheme';
import { allMedia } from '../interfaces/media/allMedia';
import { isMobile } from 'react-device-detect';
import { server } from '../constants/Server';



export function Media(props: allMedia) {
    const colorScheme = useColorScheme();
    type IconName = 'heart-o' | 'heart';
    const [iconName, setIconName] = useState<IconName>('heart-o')
    const [likes, setLikes] = useState(props.nbLikes)
    const [videoBin, setVideoBin] = useState('');

    function handlePressLike() {
        iconName === 'heart-o' ? setIconName('heart') : setIconName('heart-o');
        if (iconName !== 'heart') {
            setLikes(likes + 1);
        } else {
            setLikes(likes - 1);
        }
    }

    useEffect(() => {
        async function getVideo() {
            const urlVideo = `${server}/getMedia/${props.videoId}`;
            const resultVideo = await fetch(urlVideo, {
                method: "GET",
                headers: {
                    "Access-Control-Allow-Origin": "*"
                }
            });
            if (resultVideo.ok) {
                const data = await resultVideo.json();
                setVideoBin(data.data);
            } else {
                console.log("une erreur s'est produite");
            }
        }

        getVideo().then(() => console.log('done getVideo'));
    }, [])

    return (
        <>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', flex: 1, maxWidth: 350, minWidth: 350, marginBottom: 10 }}>
                <Image source={
                    // user icon placeholder
                    require('../assets/images/icon.png')} style={{
                        width: 50,
                        height: 50,
                        borderRadius: 50,
                        marginTop: 25,
                        right: 12,
                    }} />
                <View style={isMobile ?
                    { flexDirection: 'column', flexWrap: 'wrap', maxWidth: "100%", minWidth: "80%", flex: 1, marginEnd: 5 } : 
                    { flexDirection: 'column', flexWrap: 'wrap', maxWidth: "100%", minWidth: 265, flex: 1, marginEnd: 5 }
                }>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={[styles.name, { color: Colors[colorScheme].text, marginTop: 25 }]}>{props.username}</Text>
                        <Text style={{ color: Colors[colorScheme].tabIconDefault, marginStart: 10, marginTop: 25, fontSize: 12 }}>
                            {props.created.split('T')[0].replaceAll('-', '/')}</Text>
                    </View>
                    <Text style={[styles.desc, { color: Colors[colorScheme].text, marginTop: 5 }]}>
                        {props.description}
                    </Text>
                    <Video style={[styles.video, { backgroundColor: Colors[colorScheme].text }]}
                        source={require('../assets/videos/test3.mp4')}
                        useNativeControls={true}
                        isLooping={true}
                        onError={(error) => console.error(error)}
                        resizeMode={isMobile ? ResizeMode.COVER : ResizeMode.CONTAIN}
                    />
                    <View style={{
                        flexDirection: 'row', marginTop: 10, alignItems: 'flex-end',
                        justifyContent: 'flex-end', marginBottom: 20,
                    }}>
                        <MaterialIcons size={24} name='chat-bubble' color={Colors[colorScheme].text} style={styles.icon} />
                        <Text style={{ marginEnd: 10 }}>{props.nbComments}</Text>
                        <FontAwesome size={24} name={iconName} color={Colors[colorScheme].text} style={styles.icon} onPress={handlePressLike} />
                        <Text style={{ marginEnd: 10 }}>{likes}</Text>
                    </View>
                </View>
            </View>
            <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
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
    },
    separator: {
        marginTop: 10,
        height: 1,
        width: '60%',
    },
    video: {
        borderRadius: 8,
        width: "100%",
        maxWidth: 350,
        height: 622,
        marginTop: 5,
    },
    name: {
        fontSize: 14,
        fontFamily: 'Century Gothic',
        fontWeight: 'bold',
    },
    desc: {
        fontSize: 14,
        textAlign: 'justify'
    },
    icon: {
        marginEnd: 10,
        maxHeight: 24,
    }
});
