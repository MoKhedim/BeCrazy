import { Pressable, StyleSheet } from 'react-native';

import { RootTabScreenProps } from '../types';
import { ScrollView } from 'react-native';
import useColorScheme from '../hooks/useColorScheme';
import { Media, allMedia } from '../components/Media';
import { useState } from 'react';
import { Text, View } from '../components/Themed';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../constants/Colors';

export default function FeedScreen({ navigation }: RootTabScreenProps<'Feed'>) {
    const colorScheme = useColorScheme();
    const desc = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam fermentum tristique est, eget maximus felis sagittis at. Phasellus eu finibus odio, vitae tincidunt nisl."
    // array de posts par les users
    const [posts, setPosts] = useState<Array<allMedia>>([
        { id: '1', username: 'Deadass', source: '', description: desc, nbLike: 0, created: '01/31/2023' },
        { id: '2', username: 'nihaoma', source: '', description: desc, nbLike: 0, created: '01/23/2023' }
    ])

    return (
        <ScrollView>
            <View style={styles.container}>
                <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-end', width: 350 }}>
                    <Pressable
                        onPress={() => alert('need to login to post!')}
                        style={({ pressed }) => ({
                            opacity: pressed ? 0.5 : 1,
                        })}>
                        <MaterialIcons
                            name="post-add"
                            size={28}
                            color={Colors[colorScheme].text}
                            style={{ marginTop: 20 }}
                        />
                    </Pressable>
                </View>
                {
                    // afficher tous les médias postés
                    posts?.map((post) =>
                        <Media allMedia={post} key={post.id} />)
                }
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
});
