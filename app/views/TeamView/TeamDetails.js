import React, { Component } from 'react';
import { View, Linking, Alert, Platform } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { getTeam } from '../../store/actions/teamActions';
import { Container } from '../../components';
import { PLAYER } from '../routes';
import {
  Row,
  Column,
  ListItem,
  Image,
  Text,
  Icon,
  Separator,
  Touchable,
} from '../../components/base';
import strings from '../../Strings';

class TeamView extends Component {
  componentDidMount() {
    if (!this.getTeam()) {
      this.loadTeam();
    }
  }

  render() {
    const { state } = this.props.navigation;
    let team = this.getTeam();

    if (!team) {
      if (state.params.match) {
        team = state.params.match[`team_${this.props.teamKey}`];
      } else {
        team = state.params.team;
      }
    }

    return (
      <Container
        {...this.props}
        error={this.props.error}
        refreshing={this.props.fetching}
        onRefresh={this.loadTeam.bind(this)}
      >
        {this.renderTeamDetails(team)}
        <Separator group />
        {this.renderVenue(team.venue)}
        <Separator group />
        {team.contact && this.renderContacts(team.contact)}
        {team.contact && <Separator group />}
        {team.player && this.renderTeamPlayer(team.player)}
        {team.player && <Separator group />}
      </Container>
    );
  }

  renderItem(name, value, last) {
    return (
      <View key={name}>
        <ListItem multiline>
          <View>
            <Text bold>{name}</Text>
            <Text>{value ? value : '-'}</Text>
          </View>
        </ListItem>
        {!last && <Separator />}
      </View>
    );
  }

  renderTeamDetails(team) {
    return (
      <ListItem.Group>
        <ListItem.Header title={strings.team_info} />
        {!!team.image &&
          <Row>
            <Column center>
              <Image url={team.image} size={240} />
            </Column>
          </Row>}
        {!!team.league &&
          this.renderItem(
            'Gruppe',
            `${team.league.name} - ${team.position}. Platz`,
          )}
        {!!team.club &&
          !!team.club.id &&
          this.renderItem('Verein', team.club.name)}
        {!!team.table && this.renderItem('Heimtisch', team.table)}
        {!isNaN(parseInt(team.home_match_day, 10)) &&
          this.renderItem(
            'Heimspielzeit',
            `${weekdays[team.home_match_day]} um ${team.home_match_time || '-'}`,
            true,
          )}
      </ListItem.Group>
    );
  }

  renderVenue(venue) {
    if (venue && venue.id) {
      return (
        <ListItem.Group>
          <ListItem.Header title="Heimspielort" />
          <ListItem multiline onPress={() => this.openMaps(venue)}>
            <Text
            >{`${venue.name}\n${venue.street}, ${venue.zip_code} ${venue.city}`}</Text>
            <Column />
            <ListItem.Icon right name="pin" color={this.props.color} />
          </ListItem>

        </ListItem.Group>
      );
    } else {
      return <View />;
    }
  }

  renderContacts(contacts) {
    if (contacts) {
      return (
        <ListItem.Group>
          <ListItem.Header title="Kontakt" />
          {contacts.map((item, index) => (
            <View key={`${index}`}>
              <ListItem>
                <Touchable
                  style={{ flex: 1 }}
                  onPress={() =>
                    item.phone_number
                      ? this.openTel(item.phone_number)
                      : this.openMail(item.email)}
                >
                  <Row fluid center>
                    <Text>{`${item.name} ${item.surname}`}</Text>
                    <Column />
                    <Column fluid>
                      <Icon
                        color={this.props.color}
                        name={item.phone_number ? 'call' : 'mail'}
                        size={32}
                      />
                    </Column>
                  </Row>
                </Touchable>
                {!!item.phone_number &&
                  <Touchable
                    onPress={() => this.openMail(item.email)}
                    style={{ flex: 0, marginLeft: 16 }}
                  >
                    <Column fluid>
                      <Icon color={this.props.color} name="mail" size={32} />
                    </Column>

                  </Touchable>}
              </ListItem>
              {index < contacts.length - 1 && <Separator />}
            </View>
          ))}
        </ListItem.Group>
      );
    } else {
      return <View />;
    }
  }

  renderTeamPlayer(players) {
    return (
      <ListItem.Group>
        <ListItem.Header title="Spieler" />
        {players.map((player, idx) => (
          <View key={player.id}>
            <ListItem
              onPress={() => this.props.navigation.navigate(PLAYER, player)}
            >
              <ListItem.Image url={player.image} />
              <Text>{`${player.name} ${player.surname}`}</Text>
            </ListItem>
            {idx < players.length - 1 && <Separator image />}
          </View>
        ))}
      </ListItem.Group>
    );
  }

  getTeam() {
    const teamID = this.getTeamId();

    return this.props.teams[teamID];
  }

  getTeamId() {
    const { state } = this.props.navigation;

    if (state.params.match) {
      return state.params.match[`team_${this.props.teamKey}`].id;
    } else {
      return state.params.team.id;
    }
  }

  loadTeam() {
    this.props.getTeam(this.getTeamId());
  }

  openMail(email) {
    Linking.openURL('mailto:' + email).catch(() => {
      Alert.alert('Keine Mail-App', email);
    });
  }

  openTel(number) {
    Linking.openURL('tel:' + number).catch(() => {
      Alert.alert('Keine Telefon-App', number);
    });
  }

  openMaps(venue) {
    const address = `${venue.street} ${venue.zip_code} ${venue.city}`;
    const prefix = Platform.OS === 'ios'
      ? 'http://maps.apple.com/?address='
      : 'geo:53.5586526,9.6476386?q=';

    Linking.openURL(prefix + encodeURI(address)).catch(() => {
      Alert.alert('Keine Karten-App');
    });
  }
}

const weekdays = [
  'Sonntag',
  'Montag',
  'Dienstag',
  'Mittwoch',
  'Donnerstag',
  'Freitag',
  'Samstag',
];

export default connect(
  state => ({
    teams: state.teams,
    error: state.loading.error,
    fetching: state.loading.nonBlocking,
    color: state.settings.color,
  }),
  dispatch => ({
    getTeam: id => dispatch(getTeam(id)),
    setTitle: (title, key) => dispatch({ type: 'SET_TITLE', title, key }),
    navigate: route => dispatch(NavigationActions.navigate(route)),
  }),
)(TeamView);
