import { StyleSheet } from 'react-native';

import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import { Image, Button } from 'react-native';
import Video from 'react-native-video';
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';

export default function TabOneScreen({ navigation }: RootTabScreenProps<'FeedPage'>) {
    const colorScheme = useColorScheme();

    return (
        <View style={styles.container}>
            {
                // error with react-native-video
                //<Video source={require('../assets/videos/test.mp4')} onError={(error) => console.log(error)}/>
            }
            <View style={[styles.box, { backgroundColor: Colors[colorScheme].text }]} />
            <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        </View>
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
        width: '100%',
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
        marginTop: 20,
    },
});
