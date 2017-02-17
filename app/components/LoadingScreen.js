import React, { Component } from 'react';
import {
	View,
	StyleSheet,
	StatusBar,
	Image,
	Platform,
	ActivityIndicator
} from 'react-native';


class LoadingScreen extends Component {

	render() {
		const oldAndroid = Platform.Version < 21;
		return (
			<View style={style.container}>
				<StatusBar translucent={!oldAndroid}
					backgroundColor={ oldAndroid ? 'rgb(0,0,0)' : 'rgba(0,0,0,.4)'} />
				<Image source={{uri: '@mipmap/ic_launcher' }} style={style.icon} />
				<ActivityIndicator size='large' color={ this.props.spinner ? '#666':'#fff'} />
			</View>
		);
	}

}

const style = StyleSheet.create({
	container: {
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'column',
		flex: 1,
		backgroundColor: '#fff'
	},
	icon: {
		width: 60,
		height: 60,
		marginBottom: 20
	}
});

export default LoadingScreen;
