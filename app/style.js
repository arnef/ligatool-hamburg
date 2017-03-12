import { StyleSheet, Platform } from 'react-native';

const style = StyleSheet.create({
    input: {
        height: 40,
        marginHorizontal: 16
    },
    form: Platform.select({
        android: {
            height: 0,
        },
        ios: {
            height: 1,
            backgroundColor: '#ddd'
        }
    }),
    formSeparator: Platform.select({
        android: {
            height: 0
        },
        ios: {
            height: 1,
            backgroundColor: '#ddd',
            marginLeft: 16
        }
    }),
    score: {
        width: 56,
        marginHorizontal: 4,
        padding: 6,
        borderRadius: 2,
        backgroundColor: '#555'
    },
    scoreText: {
        color: '#FFF',
        fontSize: 14,
        fontFamily: Platform.select({
            android: 'monospace',
            ios: 'Courier New'
        }),
        fontWeight: 'bold',
        textAlign: 'center'
    },
    scoreLive: {
        color: 'red',
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'center',
        fontFamily: Platform.select({
            android: 'monospace',
            ios: 'Courier New'
        }),

    }
});

export default style;
