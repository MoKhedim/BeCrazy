import { StyleSheet, Text, TouchableOpacity } from 'react-native'

export const Button = ({ ...props }) => {
    return (
        // props est égal aux props so like style or color or classnames
        // props.children est égal au texte entre les balises
        <TouchableOpacity style={style.button} {...props}>
            <Text style={style.buttonTitle}>{props.children}</Text>
        </TouchableOpacity>
    );
};

const style = StyleSheet.create({
    button: {
        backgroundColor: '#2e64e5',
        borderRadius: 10,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        shadowColor: '#000',
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
