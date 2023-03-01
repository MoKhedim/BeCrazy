import { useEffect, useState } from 'react'
import { View, TouchableOpacity, Image, Platform } from 'react-native'
import { Text } from '../../components/Themed'
import { Camera, CameraRecordingOptions, CameraType, FlashMode } from 'expo-camera'
import { Audio } from 'expo-av'
import * as ImagePicker from 'expo-image-picker'
import * as MediaLibrary from 'expo-media-library'

import { Feather } from '@expo/vector-icons'


import styles from './styles/camera'
import { RootStackScreenProps } from '../../types'
import { useIsFocused } from '@react-navigation/native'
import FillButton from '../../components/camera/FillButton'


/**
 * Function that renders a component responsible showing
 * a view with the camera preview, recording videos, controling the camera and
 * letting the user pick a video from the gallery
 * @returns Functional Component
 */
export default function CameraScreen({ navigation }: RootStackScreenProps<'CameraScreen'>) {
    // check if the user is on web and if so show message
    if (Platform.OS === 'web') {
        return (
            <View style={styles.container}>
                <Text style={styles.noPermissionsText}>This feature is not available on web</Text>
            </View>
        )
    }



    // check if the camera is ready and the user is focused on the screen to know when to show the camera preview
    const isFocused = useIsFocused()

    // is camera ready is for when the camera initializes
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
    const [isMuted, setIsMuted] = useState(true)
    // duration are in seconds
    const [maxDuration, setMaxDuration] = useState(30)
    const [minDuration, setMinDuration] = useState(3)



    useEffect(() => {
        const requestPermissions = async () => {
            const cameraStatus = await Camera.requestCameraPermissionsAsync()
            setHasCameraPermissions(cameraStatus.status == 'granted')

            const audioStatus = await Audio.requestPermissionsAsync()
            setHasAudioPermissions(audioStatus.status == 'granted')

            const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync()
            if (galleryStatus.status == 'granted') {
                setHasGalleryPermissions(true)
                const userGalleryMedia = await MediaLibrary.getAssetsAsync({ sortBy: ['creationTime'], mediaType: ['video'] })
                setGalleryItems(userGalleryMedia.assets)
            }
        }

        requestPermissions()
    }, [])



    const recordVideo = async () => {
        if (cameraRef) {
            try {
                /*
                * The options for the video recording
                * maxDuration: the maximum duration of the video = 60 seconds
                * quality: the quality of the video = 480p
                * */
                const options: CameraRecordingOptions = {
                    maxDuration: maxDuration,
                    quality: Camera.Constants.VideoQuality['480'],
                    mute: isMuted,
                }

                // Start the stopwatch
                const startTime = new Date();

                // Start recording the video
                const videoRecordPromise = await cameraRef.recordAsync(options)

                // Calculate the elapsed time
                const elapsedTime = new Date().getTime() - startTime.getTime();
                // Check if the video is too short
                if (elapsedTime < minDuration * 1000) {
                    alert('Video is too short')
                    return
                }


                if (videoRecordPromise) {
                    const data = videoRecordPromise;
                    const source = data.uri
                    navigation.navigate('SavePostScreen', { source })
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
            quality: 1,
            videoMaxDuration: maxDuration
        })
        if (!result.canceled) {
            navigation.navigate('SavePostScreen', { source: result.assets[0].uri })
        }
    }


    // if the user has not granted the camera and audio permissions, show a message
    if (!hasCameraPermissions || !hasAudioPermissions || !hasGalleryPermissions) {
        return (
            <View style={styles.container}>
                <Text style={styles.noPermissionsText}>You need to grant camera and audio permissions to use this feature</Text>
            </View>
        )
    }

    return (
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

                <TouchableOpacity
                    style={styles.sideBarButton}
                    onPress={() => setIsMuted(!isMuted)}>

                    <Feather name={isMuted ? "mic-off" : "mic"} size={24} color={'white'} />
                    <Text style={styles.iconText}>Mute</Text>
                </TouchableOpacity>
            </View>


            <View style={styles.bottomBarContainer}>
                <View style={{ flex: 1 }}></View>
                <View style={styles.recordButtonContainer}>
                    {isCameraReady && (
                        <FillButton
                            whenPressed={() => recordVideo()}
                            whenReleased={() => stopVideo()}
                            // convert the max duration to milliseconds
                            progressTimer={maxDuration * 1000}
                        />
                    )}
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
}