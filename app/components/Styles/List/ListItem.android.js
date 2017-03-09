import { StyleSheet } from 'react-native';

export default StyleSheet.create({
	item: {
		paddingVertical: 12,
		paddingHorizontal: 16,
		flex: 1,
		height: 48,
		flexDirection: 'row',
		alignItems: 'center'
	},
	icon: {
		marginRight: 16,
		height: 24,
		width: 24
	},
	separator: {
		height: 1,
		marginLeft: 0,
		backgroundColor: '#eee'
	},
	separatorIcon: {
		marginLeft: 52,
	},
	textDisabled: {
		color: '#aaa'
	}
});