import React, { useContext, useState } from 'react'
import { ActivityIndicator, Image, Keyboard, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import { Text } from '../../components/Themed'
import styles from './styles/savePost'
import { Feather } from '@expo/vector-icons'
import { RootStackScreenProps } from '../../types'
import { ResizeMode, Video } from 'expo-av'
import { server } from '../../constants/Server'
import { MyContext } from '../../App'


export default function SavePostScreen({ navigation, route }: RootStackScreenProps<'SavePostScreen'>) {
    const { token } = useContext(MyContext)
    const [progress, setProgress] = useState(0.4)
    const [description, setDescription] = useState('')
    const [requestRunning, setRequestRunning] = useState(false)

    const handleSavePost = async () => {
        setRequestRunning(true)
        // const res = await fetch(`${server}/postMedia/${token}`, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({
        //         description,
        //         media: route.params.source,
        //     }),
        // })
        // const data = await res.json()
        // if (res.status !== 200) {
        //     alert(data.message)
        //     setRequestRunning(false)
        //     return
        // }
        // navigation.navigate('Root')
        setRequestRunning(false)
    }


    if (requestRunning) {
        return (
            <View style={styles.uploadingContainer}>
                <ActivityIndicator color='red' size='large' />
            </View>
        )
    }
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.container}>
                <View style={styles.formContainer}>
                    <TextInput
                        style={styles.inputText}
                        maxLength={150}
                        multiline
                        onChangeText={(text) => setDescription(text)}
                        placeholder="Describe your video"
                    />
                    <Video
                        style={styles.mediaPreview}
                        source={{ uri: route.params.source }}
                        rate={1.0}
                        volume={1.0}
                        isMuted={false}
                        resizeMode={ResizeMode.COVER}
                        useNativeControls
                    />
                </View>
                <View style={styles.spacer} />
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.cancelButton}>
                        <Feather name="x" size={24} color="black" />
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => handleSavePost()}
                        style={styles.postButton}>
                        <Feather name="corner-left-up" size={24} color="white" />
                        <Text style={styles.postButtonText}>Post</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableWithoutFeedback>
    )
}