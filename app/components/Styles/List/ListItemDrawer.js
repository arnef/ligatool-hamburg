import { StyleSheet } from 'react-native';

export default StyleSheet.create({
	item: {
		height: 56,
		paddingVertical: 16,
		paddingHorizontal: 16,
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center'
	},
	icon: {
		marginRight: 32
	},
	separator: {
		borderBottomWidth: 1,
		borderBottomColor: '#eee'
	},
	text: {
		fontWeight: 'bold'
	}
});