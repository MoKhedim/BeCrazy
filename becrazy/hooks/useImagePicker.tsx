import { useContext } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { MyContext } from '../App';
import { server } from '../constants/Server';


// this is the hook responsible for using the async storage
export const useImagePicker = () => {
    const { token } = useContext(MyContext);


    // this is the function that will be called when the user wants to pick an image
    // it open the phone's gallery and let the user pick an image
    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            uploadProfilePic(result.assets[0].uri)
        }
    };

    // this function will be called at the end of the pickImage function
    // it will send the image to the server
    const uploadProfilePic = async (image: string) => {
        const res = await fetch(`${server}/updateUser/${token}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                profilePicture: image
            })
        })
        const data = await res.json()
        console.log(data)
    }

    return { pickImage };
};