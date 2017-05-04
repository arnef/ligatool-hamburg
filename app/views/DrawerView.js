import React, { Component, PropTypes } from 'react';
import { View, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import actions from '../store/actions';
import { Button, Image, ListItem, Text } from '../components/base';
import * as theme from '../components/base/theme';
// import { RANKING, LEAGUE_MATCHES, OVERVIEW, MY_TEAM, SETTINGS } from '../views/routes'
import { NavigationActions } from 'react-navigation';
import {
  LEAGUE,
  LEAGUES,
  LEAGUE_CUP,
  OVERVIEW,
  MY_TEAM,
  SETTINGS
} from './routes';

class NavigationView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeLeague: -1
    };
  }

  componentDidMount() {
    this.props.getRankings();
  }

  _handleRowPress(state) {
    const { navigate, closeDrawer } = this.props;

    if (!state.active) {
      this.setState({ activeLeague: state.leagueID || -1 });

      if (state.state === LEAGUE) {
        navigate({
          routeName: LEAGUE,
          params: {
            id: state.leagueID,
            title: state.title
          }
        });
      } else if (state.state === LEAGUE_CUP) {
        navigate({
          routeName: LEAGUE_CUP,
          params: {
            id: state.leagueID,
            title: state.title,
            cup: state.title
          }
        });
      } else {
        navigate({ routeName: state.state });
      }
    }
    closeDrawer();
  }

  _renderItem(state, text, icon, idx) {
    const { navigation } = this.props;

    const active = navigation.state.index === idx;
    const color = this.props.settings.color;

    return (
      <ListItem
        active={active}
        onPress={() => {
          this._handleRowPress({ state: state, title: text, active });
        }}
        last
      >
        <ListItem.Icon
          color={active ? color : theme.secondaryTextColor}
          name={icon}
        />
        <Text bold color={active ? color : null}>{text}</Text>
      </ListItem>
    );
  }

  renderLeagues() {
    const { navigation } = this.props;
    const color = this.props.settings.color;

    const leagues = Object.values(this.props.leagues);
    return leagues.map(league => {
      const active =
        navigation.state.index === 2 && league.id === this.state.activeLeague;

      return (
        <ListItem
          key={league.id}
          last
          active={active}
          onPress={() => {
            this._handleRowPress({
              leagueID: league.id,
              state: league.cup ? LEAGUE_CUP : LEAGUE,
              title: league.name,
              active
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
    const width = 260;
    const height = Math.floor(width * 0.625);
    const team = this.props.settings.team || null;
    const leagues = Object.values(this.props.leagues);
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
              <Text color="#fff" size={24} style={styles.teamName}>
                {team.name}
              </Text>
            </View>}
        </View>
        <ScrollView style={{ flex: 1 }}>
          <View style={styles.space} />
          {this._renderItem(OVERVIEW, 'Übersicht', 'football', 0)}
          {this._renderItem(
            MY_TEAM,
            team ? 'Mein Team' : 'Team wählen',
            team ? 'shirt' : 'log-in',
            1
          )}
          {this._renderItem(LEAGUES, 'Gruppen', 'trophy', 2)}
          {/* { this.renderSeparator() }
                    {!this.props.loading &&  leagues.length === 0  && (
                            <View style={{ alignItems: 'center', padding: 16 }}>
                                <Button
                                    centered
                                    style={{ backgroundColor: '#ddd', margin: 8 }}
                                    onPress={() => { this.props.getRankings() }}>Erneut laden</Button>
                            </View>
                        )}
                    {
                        this.props.loading && leagues.length === 0 && (
                            <View style={{ padding: 16 }}>
                            <ActivityIndicator size='large' color='#666' />
                                </View>)
                    }
                    { !this.props.loading && leagues.length > 0 && this.renderLeagues() } */}
          {this.renderSeparator()}
          {this._renderItem(SETTINGS, 'Einstellungen', 'settings', 3)}
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
    overflow: 'hidden'
  },
  separator: {
    backgroundColor: '#eee',
    flex: 1,
    height: 1,
    marginVertical: 4
  },
  space: {
    flex: 1,
    height: 5
  },
  teamContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 60,
    position: 'absolute'
  },
  teamLogo: {
    height: 60,
    marginLeft: 8,
    width: 60
  },
  teamName: {
    flex: 1,
    marginLeft: 16
  }
});

NavigationView.propTypes = {
  getRankings: PropTypes.func,
  navigate: PropTypes.func,
  navigation: PropTypes.object,
  settings: PropTypes.object,
  leagues: PropTypes.object,
  closeDrawer: PropTypes.func
};

export default connect(
  state => ({
    loading: state.loading.nonBlocking,
    leagues: state.leagues,
    settings: state.settings
  }),
  dispatch => ({
    getRankings: () => dispatch(actions.getRankings()),
    navigate: route => dispatch(NavigationActions.navigate(route)),
    closeDrawer: () =>
      dispatch(NavigationActions.navigate({ routeName: 'DrawerClose' }))
  })
)(NavigationView);
