import { StyleSheet, Button } from 'react-native';
import { useContext } from 'react';
import { Text, View } from '../components/Themed';
import { MyContext } from '../App';

export default function Login() {
    const { setToken } = useContext(MyContext);

    const login = () => {
        setToken('124145151');
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <Button title="Login" onPress={() => {login()}} />
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
