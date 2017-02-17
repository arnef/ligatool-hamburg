import React, { Component } from 'react';
import { View } from 'react-native';
import { Container } from '../components';
import { ListItemGroup, ListItem } from '../components/List/';
import { connect } from 'react-redux';
import { RANKING } from './routes';


class LeaguesView extends Component {

	componentDidMount() {
		if (this.props.leagues.data.length === 0) {
			this.props.getRankings();
		}
	}


	render() {
		return (
			<Container error={this.props.leagues.error}	
				refreshing={this.props.leagues.loading}
				onRefresh={this.props.getRankings.bind(this)}>
				<ListItemGroup>
				{ this.props.leagues.data.map( league => {
					return (
						<View key={league.id}>
							<ListItem
								onPress={() => this.onPress(league)}>
								{ league.name }
							</ListItem>
							<ListItem.Separator />
						</View>
					)
				})}	
				</ListItemGroup>
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