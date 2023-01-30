import { StyleSheet } from 'react-native';

import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import { Image, Button, ScrollView } from 'react-native';
import Video from 'react-native-video';
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';

export default function TabOneScreen({ navigation }: RootTabScreenProps<'FeedPage'>) {
    const colorScheme = useColorScheme();

    return (
        <ScrollView>
            <View style={styles.container}>
                {
                    // error with react-native-video
                    //<Video source={require('../assets/videos/test.mp4')} onError={(error) => console.log(error)}/>
                }
                <View style={{ flexDirection: 'row' }}>
                    <Image source={
                        // user icon placeholder
                        require('../assets/images/icon.png')} style={{
                            width: 50,
                            height: 50,
                            borderRadius: 50,
                            marginTop: 25
                        }} />
                    <Text style={[styles.name, { color: Colors[colorScheme].text, marginTop: 41, marginHorizontal: 10 }]}>User1</Text>
                    <Text style={[styles.username, { color: Colors[colorScheme].text, marginTop: 42, marginEnd: 160, }]}>@username</Text>
                </View>
                <View style={[styles.box, { backgroundColor: Colors[colorScheme].text }]} />
                <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
            </View>
        </ScrollView>
    );
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
        width: 350,
        height: 550,
        marginTop: 10,
    },
    name: {
        fontSize: 14,
        fontFamily: 'Century Gothic',
        fontWeight: 'bold',
    },
    username: {
        fontSize: 12,
        fontFamily: 'Century Gothic',
    }
});
