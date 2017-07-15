import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View } from 'react-native';
import {
  ListItem,
  Text,
  Touchable,
  Icon,
  ActionSheet,
  Row,
  Column,
} from '../components/base';
import { Container, MatchItem, StaticListHeader } from '../components';
import { NavigationActions } from 'react-navigation';
import { sortMatches } from '../Helper';
import * as LeaguesActions from '../redux/modules/leagues';

class SelectableMatchListView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedMatchDay: null,
      showDropdown: false,
    };
  }

  componentDidMount() {
    const id = this.props.navigation.state.params.id;
    if (!this.props.leagues[id] || !this.props.leagues[id].match_days) {
      this.props.getLeagueMatches(id);
    }
  }

  openMenu(matchDays) {
    ActionSheet.show(
      {
        options: matchDays,
      },
      idx => {
        this.onSelectMatchDay(matchDays[idx]);
      },
    );
  }
  render() {
    const id = this.props.navigation.state.params.id;
    const matchDays = this.props.leagues[id].match_days || {};
    const matchDayKeys = Object.keys(matchDays);
    const matchList =
      matchDays[
        this.state.selectedMatchDay || this.props.leagues[`${id}`].selected
      ] || [];
    const { showDropdown } = this.state;
    matchList.sort(sortMatches(this.props.matches));

    return (
      <View style={{ flex: 1 }}>
        {this.props.leagues[id].match_days &&
          <StaticListHeader>
            <Touchable onPress={() => this.openMenu(matchDayKeys)}>
              <Row center style={{ marginVertical: 12 }}>
                <Column>
                  <Text color="#fff">
                    {this.state.selectedMatchDay ||
                      this.props.leagues[id].selected}
                  </Text>
                </Column>
                <Column fluid>
                  <Icon name="more" size={22} color="#fff" />
                </Column>
              </Row>
            </Touchable>
          </StaticListHeader>}
        <Container
          getRef={container => (this.container = container)}
          error={this.props.error}
          refreshing={this.props.loading}
          onRefresh={() => this.props.getLeagueMatches(id)}
          // ItemSeparatorComponent={showDropdown ? Separator : () => (<Separator group />)}
          renderRow={
            showDropdown
              ? this.renderDropdown.bind(this)
              : this.renderItem.bind(this)
          }
          // getItemLayout={(data, index) => ( {length: MatchItem.ITEM_HEIGHT, offset: MatchItem.ITEM_HEIGHT * index, index} )}
          keyExtractor={(item, idx) => idx}
          dataSource={showDropdown ? matchDayKeys : matchList}
        />
      </View>
    );
  }

  renderDropdown({ item }) {
    return (
      <ListItem onPress={() => this.onSelectMatchDay(item)}>
        <Text>
          {item}
        </Text>
      </ListItem>
    );
  }

  renderItem({ item }) {
    return <MatchItem data={this.props.matches[item]} />;
  }

  onSelectMatchDay(matchDay) {
    this.setState({ selectedMatchDay: matchDay, showDropdown: false });
    if (this.container && this.container.scrollTo) {
      this.container.scrollTo({ animated: true, x: 0, y: 0 });
    }
  }
}

export default connect(
  state => ({
    loading: state.loading.list,
    error: null, //state.loading.error,
    leagues: state.leagues,
    matches: state.matches,
    color: state.settings.color,
  }),
  dispatch => ({
    getLeagueMatches: id => dispatch(LeaguesActions.getMatches(id)),
    pushRoute: route => dispatch(NavigationActions.navigate(route)),
  }),
)(SelectableMatchListView);
