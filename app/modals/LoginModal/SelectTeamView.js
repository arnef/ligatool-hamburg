import React, { Component } from 'react';
import { View, TextInput, StyleSheet, Platform } from 'react-native';
import { sortBy, filter } from 'lodash';
import {
  Container,
  TeamLogo,
  ListItem,
  Text,
  Separator,
} from '../../components';
import { connect } from 'react-redux';
import * as LeaguesActions from '../../redux/modules/leagues';
import * as SettingsActions from '../../redux/modules/settings';
import { NavigationActions } from 'react-navigation';
import { colors } from '../../config/styles';

class SelectTeamView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
    };
    this.renderItem = this.renderItem.bind(this);
    this.getTeams = this.getTeams.bind(this);
  }

  componentDidMount() {
    const id = this.props.navigation.state.params.id;

    if (!this.props.leagues[id]) {
      this.getTeams();
    }
  }

  render() {
    const lid = this.props.navigation.state.params.id;
    const teams = sortBy(
      filter(
        this.props.leagues[lid] ? this.props.leagues[lid].table : [],
        o =>
          o.name.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1,
      ),
      'name',
    );

    return (
      <View style={{ flex: 1 }}>
        <TextInput
          placeholder="Suche"
          autoCorrect={false}
          underlineColorAndroid={colors.BACKGROUND}
          style={styles.input}
          onChangeText={search => this.setState({ search })}
          editable={!this.props.fetching}
        />
        <Container
          error={this.props.error}
          refreshing={this.props.fetching}
          onRefresh={this.getTeams}
          dataSource={teams}
          renderRow={this.renderItem}
          getItemLayout={(data, index) => ({
            length: ListItem.ITEM_HEIGHT,
            offset: ListItem.ITEM_HEIGHT * index,
            index,
          })}
          ItemSeparatorComponent={() => <Separator image />}
          keyExtractor={item => item.id}
        />
      </View>
    );
  }

  renderItem({ item }) {
    return (
      <ListItem onPress={() => this.onPress(item)}>
        <TeamLogo team={item} />
        <Text>{`${item.name}`}</Text>
      </ListItem>
    );
  }

  getTeams() {
    const lid = this.props.navigation.state.params.id;
    this.props.getLeague(lid);
  }

  onPress(team) {
    this.props.setUserTeam(team);
    this.props.navigate({
      routeName: 'LoginView',
    });
  }
}

const styles = StyleSheet.create({
  column: {
    flex: 1,
  },
  buttonSpace: {
    width: 8,
  },
  input: Platform.select({
    ios: {
      height: 40,
      marginLeft: 16,
    },
    android: {
      marginLeft: -2,
      marginRight: -2,
    },
  }),
});

export default connect(
  state => ({
    error: state.loading.error,
    fetching: state.loading.list,
    leagues: state.leagues,
  }),
  dispatch => ({
    getLeague: id => dispatch(LeaguesActions.getLeagueFix(id)),
    setUserTeam: team => dispatch(SettingsActions.setTeam(team)),
    navigate: route => dispatch(NavigationActions.navigate(route)),
  }),
)(SelectTeamView);
