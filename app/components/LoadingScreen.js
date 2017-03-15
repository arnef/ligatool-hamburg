import React, { Component } from 'react';
import { View, StyleSheet, StatusBar, Platform, Animated } from 'react-native';


class LoadingScreen extends Component {

	constructor(props) {
		super(props);
		this.state = {
			opacity: new Animated.Value(1)
		};
	}

	componentDidMount() {

		this.animation();
	}

	animation() {
		Animated.sequence([
			Animated.timing(this.state.opacity, { toValue: 0.3, duration: 700 }),
			Animated.timing(this.state.opacity, { toValue: 1, duration: 700 })
		]).start(event => {
			if (event.finished) {
				this.animation();
			}
		});
	}

	render() {
		const oldAndroid = Platform.Version < 21;
		return (
			<View style={style.container}>
				<StatusBar translucent={!oldAndroid}
					backgroundColor={ oldAndroid ? 'rgb(0,0,0)' : 'rgba(0,0,0,.4)'} />
				<Animated.Image source={{ uri: 'loading'}} style={[style.icon, { opacity: this.state.opacity}]} />
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
		width: 64,
		height: 64
	}
});

export default LoadingScreen;
