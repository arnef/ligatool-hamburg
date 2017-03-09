import { StyleSheet } from 'react-native';

export default StyleSheet.create({
	item: {
		paddingVertical: 12,
		paddingHorizontal: 16,
		flex: 1,
		height: 44,
		flexDirection: 'row',
		alignItems: 'center'
	},
	icon: {
		marginRight: 16,
		height: 29,
		width: 29
	},
	separator: {
		height: 1,
		marginLeft: 16,
		backgroundColor: '#eee'
	},
	separatorIcon: {
		marginLeft: 61
	},
	textDisabled: {
		color: '#aaa'
	}
});