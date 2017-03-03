import { StyleSheet } from 'react-native';

export default StyleSheet.create({
	item: {
		height: 48,
		paddingVertical: 8,
		marginVertical: 4,
		paddingHorizontal: 16,
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center'
	},
	icon: {
		marginRight: 32
	},
	separator: {
		height: 1,
		backgroundColor: '#eee'
	},
	text: {
		fontWeight: 'bold'
	}
});