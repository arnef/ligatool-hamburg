import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import * as LeaguesActions from '../../redux/modules/leagues';
import {
  navigate,
  getNavigationStateParams,
} from '../../redux/modules/navigation';
import {
  ActionSheet,
  StaticListHeader,
  Touchable,
  Text,
  Icon,
  MatchItem,
  Content,
} from '../../components';
import styles from './styles';
import { getColor } from '../../redux/modules/user';
import { getFixturesByCompetition } from '../../redux/modules/fixtures';
import { sortBy } from 'lodash';
import { Strings as S } from '../../lib/strings';

class SelectableMatchList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedMatchDay: null,
    };
  }

  onOpenMenu = matchDays => {
    ActionSheet.show(
      {
        options: matchDays,
      },
      index => this.onSelectMatchDay(matchDays[index]),
    );
  };

  onSelectMatchDay = matchDay => {
    this.setState({ selectedMatchDay: matchDay });
    if (this.container && this.container.scrollToOffset) {
      this.container.scrollToOffset({ x: 0, y: 0, animated: true });
    }
  };

  renderItem = ({ item }) => {
    return <MatchItem data={item} />;
  };

  render() {
    const { matchdays, selected, data } = this.props;

    const matchList = data[this.state.selectedMatchDay || selected];
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
        <Content
          onRefresh={this.props.getMatches}
          renderItem={this.renderItem}
          listEmptyText={S.NO_FIXTURES}
          data={matchList}
          reference={container => {
            this.container = container;
          }}
        />
      </View>
    );
  }
}

const fixturesByMatchDate = (state, props) => {
  const fixtures = getFixturesByCompetition(
    state,
    getNavigationStateParams(props.navigation).id,
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
  data.matchdays = sortBy(data.matchdays, i => parseInt(i));
  if (!data.selected) {
    data.selected = data.matchdays[data.matchdays.length - 1];
  }

  return data;
};

export default connect(
  (state, props) => ({
    ...fixturesByMatchDate(state, props),
    leagues: state.leagues,
    matches: state.fixtures.data,
    color: getColor(state),
  }),
  (dispatch, props) => ({
    getMatches: () =>
      dispatch(
        LeaguesActions.getMatches(
          getNavigationStateParams(props.navigation).id,
        ),
      ),
    navigate: (routeName, params) => dispatch(navigate((routeName, params))),
  }),
)(SelectableMatchList);
