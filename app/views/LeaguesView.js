import React, { Component } from 'react';
import { View } from 'react-native';
import { Container } from '../components';
import { connect } from 'react-redux';
import { RANKING, LEAGUE_MATCHES } from './routes';
import { ListItem, Text } from '../components/base';

class LeaguesView extends Component {

	componentDidMount() {
		if (this.props.leagues.data.length === 0) {
			this.props.getRankings();
		}
	}


	render() {
		return (
			<Container 
				{ ...this.props }
				error={this.props.leagues.error}	
				refreshing={this.props.leagues.loading}
				onRefresh={this.props.getRankings.bind(this)}>
				{ this.props.leagues.data.length > 0 && (
				<ListItem.Group>
				{ this.props.leagues.data.map( (league, idx) => {
					return (
						<View key={league.id}>
							<ListItem
								last={idx === this.props.leagues.data.length-1}
								onPress={() => this.onPress(league)}>
								<Text>{ league.name }</Text>
							</ListItem>
						</View>
					)
				})}	
				</ListItem.Group>
				)}
			</Container>
		);
	}

	onPress(league) {
		if (league.cup) {
			this.props.navigator.push({
				state: LEAGUE_MATCHES,
				leagueID: league.id,
				title: league.name
			})
		} else {
			this.props.navigator.push({
				state: RANKING,
				leagueID: league.id,
				title: league.name
			});
		}
	}
}

LeaguesView.propTypes = {
	leagues: React.PropTypes.object,
	getRankings: React.PropTypes.func
};

export default connect(state => ({
	leagues: state.leagues
}))(LeaguesView);