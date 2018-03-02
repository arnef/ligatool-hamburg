import React from 'react';
import {
  Platform,
  TextInput,
  View,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { connect } from 'react-redux';
import * as SearchActions from '../../redux/modules/search';
import * as NavigationActions from '../../redux/modules/navigation';
import {
  Container,
  Icon,
  Touchable,
  Text,
  ListItem,
  Image,
  TeamLogo,
  Separator,
} from '../../components';
import S from '../../lib/strings';
import Routes from '../../config/routes';

import styles from './styles';
import { getColor } from '../../redux/modules/user';

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
    };
    this.onSearch = this.onSearch.bind(this);
    this.clear = this.clear.bind(this);
    this.close = this.close.bind(this);
    this.renderNoResults = this.renderNoResults.bind(this);
    this.renderItem = this.renderItem.bind(this);
  }

  onSearch() {
    if (this.state.query) {
      this.props.search(this.state.query);
      Keyboard.dismiss();
    }
  }

  clear() {
    if (this.input) {
      this.setState({ query: '' });
      this.input.clear();
      this.input.focus();
    }
  }

  close() {
    this.props.close();
  }

  openPlayer(player) {
    this.props.navigate({
      routeName: Routes.PLAYER,
      params: player,
    });
  }

  openTeam(team) {
    this.props.navigate({
      routeName: Routes.TEAM,
      params: { team, title: team.name },
    });
  }

  renderNoResults() {
    if (this.props.message) {
      return (
        <View style={styles.message}>
          <Text>
            {this.props.message}
          </Text>
        </View>
      );
    }
    return <View />;
  }

  renderItem({ item }) {
    if (item.type === 'team') {
      return (
        <ListItem onPress={() => this.openTeam(item)}>
          <TeamLogo team={item} />
          <Text>
            {item.name}
          </Text>
        </ListItem>
      );
    } else {
      return (
        <ListItem onPress={() => this.openPlayer(item)}>
          <Image size={32} url={item.image} style={{ marginHorizontal: 6 }} />
          <Text>{`${item.name} ${item.surname}`}</Text>
        </ListItem>
      );
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={[styles.subHeader, { backgroundColor: this.props.color }]}>
          <Touchable light borderless onPress={this.close} style={styles.close}>
            <Icon
              name={Platform.OS === 'android' ? 'arrow-back' : 'arrow-down'}
              size={26}
              color="#fff"
            />
          </Touchable>
          <View style={styles.searchContainer}>
            <TextInput
              ref={input => (this.input = input)}
              underlineColorAndroid="#fff"
              autoFocus={true}
              autoCorrect={false}
              style={styles.searchInput}
              onSubmitEditing={this.onSearch}
              returnKeyType="search"
              placeholder={S.SEARCH_PLACEHOLDER}
              onChangeText={query => this.setState({ query })}
            />
            {this.props.loading &&
              <ActivityIndicator
                color={this.props.color}
                style={styles.loading}
              />}
            {!this.props.loading &&
              !!this.state.query &&
              <Touchable onPress={this.clear}>
                <Icon name="close-circle" size={22} style={styles.clearIcon} />
              </Touchable>}
          </View>
          <Touchable light onPress={this.onSearch} style={styles.iconContainer}>
            <Icon name="search" size={26} color="#fff" />
          </Touchable>
        </View>
        <Container
          dataSource={this.props.results}
          ItemSeparatorComponent={() => <Separator image />}
          keyExtractor={(item, idx) => `search-${idx}`}
          ListEmptyComponent={this.renderNoResults}
          renderRow={this.renderItem}
        />
      </View>
    );
  }
}

export default connect(
  state => ({
    color: getColor(state),
    loading: state.loading.list,
    results: state.search.results,
    message: state.search.message,
  }),
  dispatch => ({
    search: query => dispatch(SearchActions.search(query)),
    navigate: route => dispatch(NavigationActions.navigate(route)),
    close: () => dispatch(NavigationActions.hideSearch()),
  }),
)(Search);
