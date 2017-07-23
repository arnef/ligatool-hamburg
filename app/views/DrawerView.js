import React, { Component } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { connect } from 'react-redux';
import { Image, ListItem, Text, Button } from '../components';
import * as LeaguesActions from '../redux/modules/leagues';
import { NavigationActions } from 'react-navigation';
import Routes from '../config/routes';
import { colors } from '../config/styles';

class NavigationView extends Component {
  _handleRowPress(state) {
    const { closeDrawer } = this.props;
    const navigate = this.props.navigation.navigate;
    if (!state.active) {
      if (state.state === Routes.LEAGUE) {
        navigate(Routes.LEAGUE, {
          id: state.leagueID,
          title: state.title,
        });
      } else if (state.state === Routes.LEAGUE_CUP) {
        navigate(Routes.LEAGUE_CUP, {
          id: state.leagueID,
          title: state.title,
          cup: true, // why?
        });
      } else {
        navigate(state.state);
      }
    } else {
      closeDrawer();
    }
  }

  _renderItem(state, text, icon) {
    const color = this.props.settings.color;
    const active = state === this.props.activeItem;

    return (
      <ListItem
        active={active}
        maxHeight={48}
        onPress={() => {
          this._handleRowPress({ state: state, title: text, active });
        }}
        last
      >
        <ListItem.Icon
          color={active ? color : colors.TEXT_SECONDARY}
          name={icon}
        />
        <Text bold color={active ? color : null}>
          {text}
        </Text>
      </ListItem>
    );
  }

  renderLeagues() {
    // const { navigation } = this.props;
    const color = this.props.settings.color;
    return this.props.leagues.map(league => {
      const active = league.cup
        ? `${Routes.LEAGUE_CUP}_${league.id}` === this.props.activeItem
        : `${Routes.LEAGUE}_${league.id}` === this.props.activeItem;
      return (
        <ListItem
          key={league.id}
          active={active}
          maxHeight={48}
          last
          onPress={() => {
            this._handleRowPress({
              leagueID: league.id,
              state: league.cup ? Routes.LEAGUE_CUP : Routes.LEAGUE,
              title: league.name,
              active,
            });
          }}
        >
          <Text bold color={active ? color : null}>
            {league.name}
          </Text>
        </ListItem>
      );
    });
  }

  render() {
    const width = DRAWER_WIDTH;
    const height = Math.floor(width * 0.625);
    const team = this.props.settings.team || null;
    const leagues = this.props.leagues;
    return (
      <View style={{ flex: 1 }}>
        <View style={[styles.imageContainer, { height, width }]}>
          <Image
            style={{ height, resizeMode: 'cover', width }}
            source={{ uri: team ? 'turm_bw' : 'turm' }}
          />
          {team &&
            <View style={[styles.teamContainer, { top: height - 66, width }]}>
              {team.image && <Image url={team.image} style={styles.teamLogo} />}
              <Text color="#fff" style={styles.teamName}>
                {team.name}
              </Text>
            </View>}
        </View>
        <ScrollView style={{ flex: 1 }}>
          <View style={styles.space} />
          {this._renderItem(Routes.OVERVIEW, 'Übersicht', 'football', 0)}
          {this._renderItem(
            Routes.MY_TEAM,
            team ? 'Mein Team' : 'Team wählen',
            team ? 'shirt' : 'log-in',
            1,
          )}
          {this.renderSeparator()}
          {this.props.loading &&
            leagues.length === 0 &&
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                flex: 1,
                padding: 16,
              }}
            >
              <ActivityIndicator
                size={'large'}
                color={this.props.settings.color}
              />
            </View>}
          {!this.props.loading &&
            leagues.length === 0 &&
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                flex: 1,
                padding: 16,
              }}
            >
              <Button
                title="Erneut laden"
                onPress={this.props.getRankings.bind(this)}
              />
            </View>}
          {leagues.length > 0 && this.renderLeagues()}
          {this.renderSeparator()}
          {this._renderItem(Routes.SETTINGS, 'Einstellungen', 'settings', 2)}
          <View style={styles.space} />
        </ScrollView>
      </View>
    );
  }

  renderSeparator() {
    return <View style={styles.separator} />;
  }
}

const styles = StyleSheet.create({
  imageContainer: {
    overflow: 'hidden',
  },
  separator: {
    backgroundColor: '#eee',
    flex: 1,
    height: 1,
    marginVertical: 4,
  },
  space: {
    flex: 1,
    height: 5,
  },
  teamContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 60,
    position: 'absolute',
  },
  teamLogo: {
    height: 60,
    marginLeft: 8,
    width: 60,
  },
  teamName: {
    flex: 1,
    marginLeft: 16,
    fontSize: 24,
  },
});

export const DRAWER_WIDTH = Dimensions.get('window').width * 0.8;

export default connect(
  state => ({
    activeItem: state.nav.activeItem,
    loading: state.loading.nonBlocking,
    leagues: Object.values(state.drawer).sort(
      (a, b) => (a.name < b.name ? -1 : 1),
    ),
    settings: state.settings,
  }),
  dispatch => ({
    getRankings: () => dispatch(LeaguesActions.getLeagues()),
    // navigate: route => dispatch(NavigationActions.navigate(route)),
    closeDrawer: () =>
      dispatch(NavigationActions.navigate({ routeName: 'DrawerClose' })),
  }),
)(NavigationView);
