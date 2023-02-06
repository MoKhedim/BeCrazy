import { StyleSheet } from 'react-native';

// This is the style sheet for the form components of the auth screens
export default StyleSheet.create({
    error: {
        color: 'red',
        fontSize: 13,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 12,
    },
    container: {
        flex: 1,
        padding: 20,
        width: '100%',
        maxWidth: 340,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    forgotPassword: {
        width: '100%',
        alignItems: 'flex-end',
        marginBottom: 24,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    row: {
        flexDirection: 'row',
        marginTop: 15,
    },
    forgot: {
        fontSize: 13,
        color: '#2e64e5',
        textDecorationLine: 'underline',
    },
    link: {
        fontWeight: 'bold',
        color: '#2e64e5',
    },
});