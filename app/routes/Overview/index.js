import React from 'react';
import { View, RefreshControl, SectionList } from 'react-native';
import { connect } from 'react-redux';
import NavTabBarTop from '../../Nav/NavTabBarTop';
import { TabNavigator } from 'react-navigation';
import S from '../../lib/strings';
import Routes from '../../config/routes';
import { MatchItem, Text } from '../../components';
import { colors } from '../../config/styles';

import {
  FILTER_TODAY,
  getFixtureByFilter,
  FILTER_PASSED,
  FILTER_UPCOMMING,
} from '../../redux/modules/fixtures';
import { getColor } from '../../redux/modules/user';
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

function NoFixture(props) {
  return (
    <Text secondary style={{ padding: 16, textAlign: 'center' }}>
      {`${props.loading ? '' : 'Keine Begegnungen'}`}
    </Text>
  );
}

function Overview(props) {
  const { matches, loading, queryMatches, color } = props;
  return (
    <SectionList
      renderItem={({ item }) => <MatchItem data={item} />}
      renderSectionHeader={({ section }) =>
        matches.length > 1 ? <SectionHeader title={section.title} /> : null
      }
      stickySectionHeadersEnabled={true}
      sections={matches}
      keyExtractor={(item, index) => `overview-${index}-${item.id}`}
      refreshControl={
        <RefreshControl
          colors={[color]}
          refreshing={loading}
          onRefresh={queryMatches}
        />
      }
      ListEmptyComponent={<NoFixture loading={loading} />}
    />
  );
}

function createTab(keyName) {
  return connect(
    state => ({
      loading: state.loading.list,
      matches: getFixtureByFilter(state, keyName),
      color: getColor(state),
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
