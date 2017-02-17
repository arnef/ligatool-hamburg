import {StyleSheet} from 'react-native';

const style = StyleSheet.create({
    content: {
        backgroundColor: '#eee',
        flex: 1
    },
    card: {
        marginVertical: 8,
        marginHorizontal: 16,
        paddingTop: 8,
        paddingLeft: 16,
        paddingRight: 16,
        paddingBottom: 8,
        backgroundColor: '#fff',
        borderRadius: 2,
        borderWidth: 1,
        borderColor: '#dcdcdc'
    },
    score: {
        marginLeft: 8,
        marginRight: 8,
        marginTop: 4,
        marginBottom: 4,
        padding: 6,
        borderRadius: 2,

        backgroundColor: '#555'
    },
    scoreText: {
        color: '#FFF',
        // fontFamily: 'monospace',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    row: {
        flexDirection: 'row',
    },
    rowCenter: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    column: {
        flexDirection: 'column',
        flex: 1
    },
    column2: {
        flexDirection: 'column',
        flex: 2,
        alignItems: 'center'
    },
    name: {
        marginTop: 2,
        marginBottom: 2,
        textAlign: 'center'
    },
    textCenter: {
        textAlign: 'center'
    },
    textSmall: {
        fontSize: 13
    },
    textBold: {
        fontWeight: 'bold'
    },
    switchRow: {
        flexDirection: 'row',
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 8,
        paddingBottom: 8,
        alignItems: 'center'
    }
});

export default style;
