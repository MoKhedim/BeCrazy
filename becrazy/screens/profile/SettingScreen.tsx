import { View, Text } from "../../components/Themed";
import { StyleSheet } from "react-native";
import { RootStackScreenProps } from "../../types";


export default function SettingScreen({ navigation }: RootStackScreenProps<'SettingScreen'>) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Setting Screen</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
});
