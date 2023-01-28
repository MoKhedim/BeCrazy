import { StyleSheet, Text, TouchableOpacity } from 'react-native'

export const Button = ({ ...props }) => {
    return (
        <TouchableOpacity style={style.button} {...props}>
            <Text style={style.buttonTitle}>{props.children}</Text>
        </TouchableOpacity>
    );
};

const style = StyleSheet.create({
    button: {
        backgroundColor: '#E31676',
        borderRadius: 10,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        shadowColor: '#E31676',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 8,
    },
    buttonTitle: {
        color: '#fff',
        fontSize: 18,
    },
});
