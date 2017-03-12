import React, { Component } from 'react';
import { View } from 'react-native';
import { Container } from '../components';
import { ListItemGroup } from '../components/List/';
import { connect } from 'react-redux';
import { RANKING } from './routes';
import { ListItem, Text } from '../ui';

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
				<ListItemGroup>
				{ this.props.leagues.data.map( (league, idx) => {
					if (!league.cup)
					return (
						<View key={league.id}>
							<ListItem
								last={idx > this.props.leagues.data.length-2}
								onPress={() => this.onPress(league)}>
								<Text>{ league.name }</Text>
							</ListItem>
						</View>
					)
				})}	
				</ListItemGroup>
				)}
			</Container>
		);
	}

	onPress(league) {
		this.props.navigator.push({
			state: RANKING,
			leagueID: league.id,
			title: league.name
		});
	}
}

LeaguesView.propTypes = {
	leagues: React.PropTypes.object,
	getRankings: React.PropTypes.func
};

export default connect(state => ({
	leagues: state.leagues
}))(LeaguesView);