import { StyleSheet } from 'react-native';
import { useState } from 'react';
import { Text, View } from './Themed';
import Video from 'react-native-video';
import Colors from '../constants/Colors';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { Image } from 'react-native';
import useColorScheme from '../hooks/useColorScheme';

export interface allMedia {
    id: string;
    username: string;
    source: string;
    description: string;
    nbLike: number;
    created: string;
}

export function Media(props: allMedia) {
    const colorScheme = useColorScheme();
    type IconName = 'heart-o' | 'heart';
    const [iconName, setIconName] = useState<IconName>('heart-o')
    const [likes, setLikes] = useState(props.nbLike)

    function handlePressLike() {
        iconName === 'heart-o' ? setIconName('heart') : setIconName('heart-o');
        if (iconName !== 'heart') {
            setLikes(likes + 1);
        } else {
            setLikes(likes - 1);
        }
    }

    return (
        <>
            {
                // error with react-native-video
                //<Video source={require('../assets/videos/test.mp4')} onError={(error) => console.log(error)}/>
            }
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', flex: 1, maxWidth: 350 }}>
                <Image source={
                    // user icon placeholder
                    require('../assets/images/icon.png')} style={{
                        width: 50,
                        height: 50,
                        borderRadius: 50,
                        marginTop: 25,
                        right: 12,
                    }} />
                <View style={{ flexDirection: 'column', flexWrap: 'wrap', flex: 1, marginEnd: 5 }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={[styles.name, { color: Colors[colorScheme].text, marginTop: 25 }]}>{props.username}</Text>
                        <Text style={{ color: Colors[colorScheme].tabIconDefault, marginStart: 10, marginTop: 25, fontSize: 12 }}>{props.created}</Text>
                    </View>
                    <Text style={[styles.desc, { color: Colors[colorScheme].text, marginTop: 5 }]}>
                        {props.description}
                    </Text>
                    <View style={[styles.box, { backgroundColor: Colors[colorScheme].text }]} />
                    <View style={{
                        flexDirection: 'row', marginTop: 10, alignItems: 'flex-end',
                        justifyContent: 'flex-end',
                    }}>
                        <MaterialIcons size={24} name='chat-bubble' color={Colors[colorScheme].text} style={styles.icon} />
                        <Text style={{ marginEnd: 10 }}>11</Text>
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
        marginVertical: 10,
        height: 1,
        width: '60%',
    },
    box: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 6,
        borderStyle: 'solid',
        borderWidth: 1,
        padding: 10,
        width: "100%",
        maxWidth: 350,
        aspectRatio: 3 / 5,
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
