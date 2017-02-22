import { StyleSheet, Platform } from 'react-native';

const oldAndroid = true; //Platform.Version < 21;

export default StyleSheet.create({
    leftButton: {
        padding: 10,
        // marginTop: oldAndroid ? 0 : 3
    },
    title: {
        marginTop: 16
    },
    toolbar: {
        height: oldAndroid ? 48 : 73
    }
})