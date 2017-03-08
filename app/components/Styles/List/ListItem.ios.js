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
		height: 40,
		width: 40
	},
	separator: {
		height: 1,
		marginLeft: 16,
		backgroundColor: '#eee'
	},
	separatorIcon: {
		marginLeft: 72
	},
	textDisabled: {
		color: '#aaa'
	}
});