import React, { useState } from 'react'
import { ActivityIndicator, Image, Keyboard, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import { Text } from '../../components/Themed'
import styles from './styles/savePost'
import { Feather } from '@expo/vector-icons'
import { RootStackScreenProps } from '../../types'

export default function SavePostScreen({ navigation, route }: RootStackScreenProps<'SavePostScreen'>) {
    const [description, setDescription] = useState('')
    const [requestRunning, setRequestRunning] = useState(false)

    const handleSavePost = async () => {
        setRequestRunning(true)
        console.log("save post")
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
                    <Image
                        style={styles.mediaPreview}
                        source={{ uri: route.params.source }}
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