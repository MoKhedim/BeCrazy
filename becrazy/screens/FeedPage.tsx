import { StyleSheet } from 'react-native';

import { RootTabScreenProps } from '../types';
import { ScrollView } from 'react-native';
import useColorScheme from '../hooks/useColorScheme';
import { Media, allMedia } from '../components/Media';
import { useState } from 'react';

export default function TabOneScreen({ navigation }: RootTabScreenProps<'FeedPage'>) {
    const colorScheme = useColorScheme();
    const desc = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam fermentum tristique est, eget maximus felis sagittis at. Phasellus eu finibus odio, vitae tincidunt nisl."
    // array de posts par les users
    const [posts, setPosts] = useState<Array<allMedia>>([
        { id: '1', username: 'Deadass', source: '', description: desc, nbLike: 0, created: '01/31/2023' },
        { id: '2', username: 'nihaoma', source: '', description: desc, nbLike: 0, created: '01/23/2023' }
    ])

    return (
        <ScrollView>
            {
                // afficher tous les médias postés
                posts?.map((post) =>
                    <Media id={post.id} username={post.username} key={post.id}
                    source={post.source} description={post.description}
                    nbLike={post.nbLike} created={post.created} />)
            }
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
