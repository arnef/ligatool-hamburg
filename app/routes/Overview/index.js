import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import NavTabBarTop from '../../Nav/NavTabBarTop';
import { TabNavigator } from 'react-navigation';
import S from '../../lib/strings';
import Routes from '../../config/routes';
import { MatchItem, Text, Content } from '../../components';
import { colors } from '../../config/styles';
import {
  FILTER_TODAY,
  getFixtureByFilter,
  FILTER_PASSED,
  FILTER_UPCOMMING,
} from '../../redux/modules/fixtures';
import { queryFixtureOverview } from '../../redux/actions';

function SectionHeader(props) {
  return (
    <View style={{ paddingTop: 4, elevation: 5, alignItems: 'center' }}>
      <View
        style={{
          paddingVertical: 4,
          paddingHorizontal: 8,
          borderRadius: 6,
          backgroundColor: colors.BACKGROUND,
        }}
      >
        <Text bold>{`${props.title}`}</Text>
      </View>
    </View>
  );
}

function Overview(props) {
  const { matches, queryMatches } = props;
  return (
    <Content
      renderItem={({ item }) => <MatchItem data={item} />}
      renderSectionHeader={({ section }) =>
        matches && matches.length > 1 ? (
          <SectionHeader title={section.title} />
        ) : null
      }
      sections={matches}
      listEmptyText={S.NO_FIXTURES}
      onRefresh={queryMatches}
    />
  );
}

function createTab(keyName) {
  return connect(
    state => ({
      matches: getFixtureByFilter(state, keyName),
    }),
    dispatch => ({
      queryMatches: () => dispatch(queryFixtureOverview()),
    }),
  )(Overview);
}

export default TabNavigator(
  {
    [Routes.TAB_MATCHES_PLAYED]: {
      screen: createTab(FILTER_PASSED),
      navigationOptions: { title: S.PAST_MATCHES },
    },
    [Routes.TAB_MATCHES_TODAY]: {
      screen: createTab(FILTER_TODAY),
      navigationOptions: { title: S.TODAY },
    },
    [Routes.TAB_MATCHES_NEXT]: {
      screen: createTab(FILTER_UPCOMMING),
      navigationOptions: { title: S.NEXT_MATCHES },
    },
  },
  {
    ...NavTabBarTop,
    initialRouteName: Routes.TAB_MATCHES_TODAY,
    lazy: false,
  },
);
