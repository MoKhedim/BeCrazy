import { StyleSheet, TextInput as TextInputImport } from 'react-native';

export const TextInput = ({...props }) => {
    return (
        <TextInputImport style={style.TextInput} {...props} />
      );
};



const style = StyleSheet.create({
    TextInput: {
        backgroundColor: '#E9E9EF',
        borderRadius: 10,
        height: 48,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E9E9EF',
        overflow: 'hidden',
        width: '100%',
        paddingHorizontal: 16,
    },
});