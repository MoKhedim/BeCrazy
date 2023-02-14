import { Pressable, StyleSheet } from 'react-native';

import { RootTabScreenProps } from '../types';
import { ScrollView } from 'react-native';
import useColorScheme from '../hooks/useColorScheme';
import { Media } from '../components/Media';
import { allMedia } from '../interfaces/media/allMedia';
import { useEffect, useState } from 'react';
import { Text, View } from '../components/Themed';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import { server } from '../constants/Server';

export default function FeedScreen({ navigation }: RootTabScreenProps<'Feed'>) {
    const colorScheme = useColorScheme();
    const desc = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam fermentum tristique est, eget maximus felis sagittis at. Phasellus eu finibus odio, vitae tincidunt nisl."
    // array de AllMedias par les users
    const [allMedias, setAllMedias] = useState<Array<allMedia>>([])

    useEffect(() => {
        async function getAllMedias() {
            const urlAllMedias = `${server}/getAllMedia`;
            const resultAllMedias = await fetch(urlAllMedias, {
                method: "GET",
            });
            if (resultAllMedias.ok) {
                const data = await resultAllMedias.json();
                setAllMedias(data);
            } else {
                console.log("une erreur s'est produite");
            }
        }

        //getAllMedias().then(() => console.log('done getAllMedias'));
    }, []);

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
                    allMedias?.map((post) =>
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
