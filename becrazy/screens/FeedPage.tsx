import { StyleSheet } from 'react-native';

import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import { Image, Button } from 'react-native';

export default function TabOneScreen({ navigation }: RootTabScreenProps<'FeedPage'>) {
    return (
        <View>
            <View style={{ flexDirection: 'row' }}>
                <Image source={
                    // profile picture placeholder
                    require('../assets/images/icon.png')} style={{
                        width: 50,
                        height: 50,
                        borderRadius: 50,
                        marginTop: 10,
                        marginStart: 60,
                        marginEnd: 10
                    }} />
                <Text style={[styles.title, {
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    marginStart: 10,
                    marginTop: 15
                }]}>Feed</Text>
                <View style={{
                    marginTop: 20,
                    marginStart: 1100,
                    width: 100,
                }}>
                    <Button
                        title='Login'
                        onPress={() => alert('work in progress!')}
                    />
                </View>
            </View>
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
});
