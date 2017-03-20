import React, { Component, PropTypes } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { Container, Match } from '../components';


class LiveMatchView extends Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		if (!this.props.match.error) {
			this._fetchLiveMatch();
		}
	}

	_fetchLiveMatch() {
		this.props.getMatch(this.props.id);
	}


	render() {
		return (
			<View style={{flex: 1}}>
				<Match.Header data={this.props.match.data} pushRoute={this.props.pushRoute}  />
				<Container 
					{ ...this.props }
					error={this.props.match.error}
					refreshing={this.props.match.loading}
					onRefresh={this._fetchLiveMatch.bind(this)}>
					<Match />
				</Container>
			</View>);
	}
}

LiveMatchView.propTypes = {
	pushRoute: PropTypes.func,
	getMatch: PropTypes.func,
	match: PropTypes.object,
	id: PropTypes.number	
};

export default connect((state) => ({
		settings: state.settings,
		match: state.match
}))(LiveMatchView);
