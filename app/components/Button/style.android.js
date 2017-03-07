import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    button: {
        borderWidth: 1,
        borderRadius: 2,
        minHeight: 36,
        minWidth: 64,
        paddingVertical: 0,
        paddingHorizontal: 10,
        alignItems: 'center',
        marginRight: 8,
        marginVertical: 4,
        flexDirection: 'row',
        borderColor: 'rgba(0,0,0,0.12)'
    },
    buttonText: {
        lineHeight: 36,
        fontSize: 14,
        fontWeight: 'bold'
    }
});