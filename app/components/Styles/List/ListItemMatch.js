import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    item: {
        marginTop: -4,
        paddingHorizontal: 16
    },
    metaRow: {
        flex: 1,
        flexDirection: 'row',
        alignSelf: 'center'
    },
    metaVenue: {
        flex: 1,
        fontWeight: 'bold'
    },
    metaTime: {
        flex: 1,
        fontWeight: 'bold',
        textAlign: 'right'
    },
    detailsRow: {
        flex: 1,
        marginTop: -38,
        flexDirection: 'row',
        paddingBottom: 8
    },
    detailsTeam: {
        flex: 2,
        paddingHorizontal: 8,
        alignItems: 'center'
    },
    detailsTeamName: {
        marginTop: 8,
        fontSize: 13,
        textAlign: 'center'
    },
    scoreRow: {
        flex: 1,
        paddingTop: 20,
        alignItems: 'center'
    }
});