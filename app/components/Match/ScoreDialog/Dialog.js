import React, { Component } from 'react';
import {
	Modal,
	View,
	StyleSheet,
	TouchableWithoutFeedback,
	ActivityIndicator,
	Dimensions
} from 'react-native';

import Heading from './Heading';

class Dialog extends Component {
	constructor(props) {
		super(props);
		this.state = {
			visible: false,
			refreshing: false,
			title: null
		};
	}

	hide() {
		this.setState({ visible: false});
	}

	show() {
		this.setState({ visible: true });
	}
	refreshing(active) {
		this.setState({ refreshing: active });
	}
	setTitle(title) {
		this.setState({ title: title });
	}


	render() {
		const closeOnTouch = (
			<TouchableWithoutFeedback onPress={ () => {
				if (!this.state.refreshing) {
					this.hide();
				}
			}}>
				<View style={{ flex: 1}} />
			</TouchableWithoutFeedback>
		);
		
		return (
			<Modal
				animationType='fade'
				transparent={true}
				visible={this.props.visible}
				onRequestClose={ () => {
					if (this.props.onRequestClose) {
						this.props.onRequestClose();
					}
				}}>
				<View style={[style.background]}>
				{ closeOnTouch }
					{ this.props.refreshing && (
						<ActivityIndicator size='large' color='#fff' style={{margin: 16}} />
					)}
					{ !this.props.refreshing && (
					<View style={style.card}>
					{ this.state.title && (
						<Heading h1>{ this.state.title }</Heading>
					)}
					{ this.props.children }
					</View>
					)}
					{ closeOnTouch }
				</View>
			</Modal>
		);
	}
}

const {height} = Dimensions.get('window');
const style = StyleSheet.create({
	background: {
		backgroundColor: 'rgba(0,0,0,.6)',
		flex: 1,
	},
	card: {
		margin: 24,
		borderRadius: 3	,
		backgroundColor: '#fff',
		maxHeight: Math.floor(height * 0.8)
	}
});

Dialog.propTypes = {
	onRequestClose: React.PropTypes.func,
	refreshing: React.PropTypes.bool,
	visible: React.PropTypes.bool,
	children: React.PropTypes.array
};

export default Dialog;
