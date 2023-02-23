import { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import { Camera, CameraType, FlashMode } from 'expo-camera'
import { Audio } from 'expo-av'
import * as ImagePicker from 'expo-image-picker'
import * as MediaLibrary from 'expo-media-library'
import * as VideoThumbnails from 'expo-video-thumbnails';

import { Feather } from '@expo/vector-icons'

import styles from './styles'
import { RootStackScreenProps } from '../../types'


/**
 * Function that renders a component responsible showing
 * a view with the camera preview, recording videos, controling the camera and
 * letting the user pick a video from the gallery
 * @returns Functional Component
 */
export default function CameraScreen({ navigation }: RootStackScreenProps<'CameraScreen'>) {
    // check if the camera is ready and the user is focused on the screen to know when to show the camera preview
    const [isFocused, setIsFocused] = useState(false)
    const [isCameraReady, setIsCameraReady] = useState(false)


    // the state for the camera permissions and the gallery permissions
    const [hasCameraPermissions, setHasCameraPermissions] = useState(false)
    const [hasAudioPermissions, setHasAudioPermissions] = useState(false)
    const [hasGalleryPermissions, setHasGalleryPermissions] = useState(false)

    // state for the gallery items
    const [galleryItems, setGalleryItems] = useState<Array<MediaLibrary.Asset>>([])

    // state for the camera settings
    const [cameraRef, setCameraRef] = useState<Camera | null>(null)
    const [cameraType, setCameraType] = useState(CameraType.back)
    const [cameraFlash, setCameraFlash] = useState(FlashMode.off)


    // set the focus state to true when the user is focused on the screen
    // and set it to false when the user is not focused on the screen
    // because the useIsFocused hook is not working properly
    useEffect(() => {
        setIsFocused(true)

        return () => {
            setIsFocused(false)
        }
    })



    useEffect(() => {
        const requestPermissions = async () => {
            const cameraStatus = await Camera.requestCameraPermissionsAsync()
            setHasCameraPermissions(cameraStatus.status == 'granted')

            const audioStatus = await Audio.requestPermissionsAsync()
            setHasAudioPermissions(audioStatus.status == 'granted')

            const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync()
            setHasGalleryPermissions(galleryStatus.status == 'granted')

            if (galleryStatus.status == 'granted') {
                const userGalleryMedia = await MediaLibrary.getAssetsAsync({ sortBy: ['creationTime'], mediaType: ['video'] })
                setGalleryItems(userGalleryMedia.assets)
            }
        }

        requestPermissions()
    }, [])



    const generateThumbnail = async (source: string) => {
        try {
            const { uri } = await VideoThumbnails.getThumbnailAsync(
                source,
                {
                    time: 5000,
                }
            );
            return uri;
        } catch (e) {
            console.warn(e);
        }
    };



    const recordVideo = async () => {
        if (cameraRef) {
            try {
                const options = { maxDuration: 60, quality: Camera.Constants.VideoQuality['480'] }
                const videoRecordPromise = cameraRef.recordAsync(options)
                if (videoRecordPromise) {
                    const data = await videoRecordPromise;
                    const source = data.uri
                    let sourceThumb = await generateThumbnail(source)
                    navigation.navigate('SavePostScreen', { source, sourceThumb })
                }
            } catch (error) {
                console.warn(error)
            }
        }
    }

    const stopVideo = async () => {
        if (cameraRef) {
            cameraRef.stopRecording()
        }
    }



    const pickFromGallery = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            allowsEditing: true,
            aspect: [16, 9],
            quality: 1
        })
        if (!result.canceled) {
            let sourceThumb = await generateThumbnail(result.assets[0].uri)
            navigation.navigate('SavePostScreen', { source: result.assets[0].uri, sourceThumb })
        }
    }


    return (
        !hasCameraPermissions || !hasAudioPermissions || !hasGalleryPermissions ? (
            <View style={styles.container}>
                <Text style={styles.noPermissionsText}>You need to grant camera and audio permissions to use this feature</Text>
            </View>
        ) : (
            <View style={styles.container}>
                {isFocused && (
                    <Camera
                        ref={(ref) => setCameraRef(ref)}
                        style={styles.camera}
                        ratio={'16:9'}
                        type={cameraType}
                        flashMode={cameraFlash}
                        onCameraReady={() => setIsCameraReady(true)}
                    />
                )}
                <View style={styles.sideBarContainer}>
                    <TouchableOpacity
                        style={styles.sideBarButton}
                        onPress={() => setCameraType(cameraType === CameraType.back ? CameraType.front : CameraType.back)}>

                        <Feather name="refresh-ccw" size={24} color={'white'} />
                        <Text style={styles.iconText}>Flip</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.sideBarButton}
                        onPress={() => setCameraFlash(cameraFlash === FlashMode.off ? FlashMode.torch : FlashMode.off)}>

                        <Feather name="zap" size={24} color={'white'} />
                        <Text style={styles.iconText}>Flash</Text>
                    </TouchableOpacity>
                </View>


                <View style={styles.bottomBarContainer}>
                    <View style={{ flex: 1 }}></View>
                    <View style={styles.recordButtonContainer}>
                        <TouchableOpacity
                            disabled={!isCameraReady}
                            onLongPress={() => recordVideo()}
                            onPressOut={() => stopVideo()}
                            style={styles.recordButton}
                        />
                    </View>
                    <View style={{ flex: 1 }}>
                        <TouchableOpacity
                            onPress={() => pickFromGallery()}
                            style={styles.galleryButton}>
                            {galleryItems[0] && (
                                <Image
                                    style={styles.galleryButtonImage}
                                    source={{ uri: galleryItems[0].uri }}
                                />
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    )
}