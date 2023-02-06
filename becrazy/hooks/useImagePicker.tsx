import * as ImagePicker from 'expo-image-picker';


// this is the hook responsible for using the async storage
export const useImagePicker = () => {
    // this is the function that will be called when the user wants to pick an image
    // it open the phone's gallery and let the user pick an image
    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);

        if (!result.canceled) {
            //uploadProfilePic(result.assets[0].uri)
        }
    };

    // this function will be called at the end of the pickImage function
    // it will send the image to the server
    const uploadProfilePic = async (image: string) => {
        const res = await fetch("localhost:3000/user/profilePic", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer ${token}"
            },
            body: JSON.stringify({
                picture: image
            })
        })
        const data = await res.json()
        console.log(data)
    }

    return { pickImage };
};