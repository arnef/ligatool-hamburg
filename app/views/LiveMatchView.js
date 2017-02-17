import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { Container, Toolbar, Match } from '../components';


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
				<Toolbar.Match data={this.props.match.data} />
				<Container error={this.props.match.error}
					refreshing={this.props.match.loading}
					onRefresh={this._fetchLiveMatch.bind(this)}>
					<Match />
				</Container>
			</View>);
	}
}

LiveMatchView.propTypes = {
	getMatch: React.PropTypes.func,
	match: React.PropTypes.object,
	id: React.PropTypes.number	
};

export default connect((state) => ({
		settings: state.settings,
		match: state.match
}))(LiveMatchView);
