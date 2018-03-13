import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import * as LeaguesActions from '../../redux/modules/leagues';
import * as NavigationActions from '../../redux/modules/navigation';
import {
  ActionSheet,
  Container,
  StaticListHeader,
  Touchable,
  Text,
  Icon,
  MatchItem,
} from '../../components';
import styles from './styles';
import { getColor } from '../../redux/modules/user';
import { getFixturesByCompetition } from '../../redux/modules/fixtures';

class SelectableMatchList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedMatchDay: null,
    };
    this.onOpenMenu = this.onOpenMenu.bind(this);
    this.onSelectMatchDay = this.onSelectMatchDay.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.renderItem = this.renderItem.bind(this);
  }

  onOpenMenu(matchDays) {
    ActionSheet.show(
      {
        options: matchDays,
      },
      index => this.onSelectMatchDay(matchDays[index]),
    );
  }

  onSelectMatchDay(matchDay) {
    this.setState({ selectedMatchDay: matchDay });
    if (this.container && this.container.scrollTo) {
      this.container.scrollTo({ x: 0, y: 0, animated: true });
    }
  }

  onRefresh() {
    this.props.getMatches(this.props.navigation.state.params.id);
  }

  renderItem({ item }) {
    return <MatchItem data={item} />;
  }

  render() {
    const { matchdays, selected, data } = this.props;

    const matchList = data[this.state.selectedMatchDay || selected] || [];
    return (
      <View style={styles.container}>
        {matchdays.length > 0 && (
          <StaticListHeader>
            <Touchable onPress={() => this.onOpenMenu(matchdays)}>
              <View style={styles.matchDayButton}>
                <Text style={styles.matchDayText}>
                  {this.state.selectedMatchDay || selected}
                </Text>
                <Icon
                  name="more"
                  size={22}
                  color={this.props.loading ? this.props.color : '#fff'}
                />
              </View>
            </Touchable>
          </StaticListHeader>
        )}
        <Container
          getRef={container => (this.container = container)}
          error={this.props.error}
          refreshing={this.props.loading}
          onRefresh={this.onRefresh}
          renderRow={this.renderItem}
          ListEmptyComponent={
            <View>
              <Text secondary style={{ padding: 16, textAlign: 'center' }}>
                Keine Begegnungen
              </Text>
            </View>
          }
          dataSource={matchList}
          keyExtractor={item => `fixture-${item.id}`}
        />
      </View>
    );
  }
}

const fixturesByMatchDate = (state, props) => {
  const fixtures = getFixturesByCompetition(
    state,
    props.navigation.state.params.id,
  );
  const data = {
    data: {},
    matchdays: [],
    selected: null,
  };
  for (let fixture of fixtures) {
    if (!data.data[fixture.matchday]) {
      data.data[fixture.matchday] = [];
      data.matchdays.push(fixture.matchday);
    }
    data.data[fixture.matchday].push(fixture);
    if (!fixture.result && !data.selected) {
      data.selected = fixture.matchday;
    }
  }
  data.matchdays.sort();
  if (!data.selected) {
    data.selected = data.matchdays[data.matchdays.length - 1];
  }

  return data;
};

export default connect(
  (state, props) => ({
    ...fixturesByMatchDate(state, props),
    error: state.loading.error,
    loading: state.loading.list,
    leagues: state.leagues,
    matches: state.fixtures.data,
    color: getColor(state),
  }),
  dispatch => ({
    getMatches: id => dispatch(LeaguesActions.getMatches(id)),
    navigate: (routeName, params) =>
      dispatch(NavigationActions.navigate((routeName, params))),
  }),
)(SelectableMatchList);
