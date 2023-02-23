import { View } from "react-native";
import { Text } from "../../components/Themed";
import { RootStackScreenProps } from "../../types";


export default function SavePostScreen({ navigation }: RootStackScreenProps<'SavePostScreen'>, props:any) {
    console.log(props)


    return (
        <View>
            <Text>SavePostScreen</Text>
        </View>
    )
}