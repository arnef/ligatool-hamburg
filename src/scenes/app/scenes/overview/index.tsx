/**
 * Copyright (C) 2018 Arne Feil
 *
 * This file is part of DTFB App.
 *
 * DTFB App is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * DTFB App is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with DTFB App.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

import { Content, MatchItem } from '@app/components';
import { topTabBarNavigationOptions } from '@app/containers/navigation';
import { Strings } from '@app/lib/strings';
import { queryFixtureOverview } from '@app/redux/actions';
import {
  FILTER_PASSED,
  FILTER_TODAY,
  FILTER_UPCOMMING,
  getFixture,
  getFixtureByFilter,
} from '@app/redux/modules/fixtures';
import { navigate } from '@app/redux/modules/navigation';
import { Routes } from '@app/scenes/routes';
import * as React from 'react';
import { TabNavigator } from 'react-navigation';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { SectionHeader } from './components/section-header';

interface IProps extends IStateProps, IDispatchProps {}

class MatchList extends React.PureComponent<IProps> {
  public render() {
    const { matches, queryMatches } = this.props;
    return (
      <Content
        renderItem={this.renderItem}
        renderSectionHeader={this.renderSectionHeader}
        sections={matches}
        listEmptyText={Strings.NO_FIXTURES}
        onRefresh={queryMatches}
      />
    );
  }

  private onPress = (match: any) => (): void => {
    this.props.openMatch(match);
  };

  private renderSectionHeader = ({ section }: any): React.ReactElement<any> => {
    return <SectionHeader title={section.title} />;
  };

  private renderItem = ({ item }: any): React.ReactElement<any> => {
    const fixture = this.props.getFixture(item);
    return <MatchItem data={fixture} onPress={this.onPress(fixture)} />;
  };
}

function connectMatchList(key: string) {
  return connect(mapStateToProps(key), mapDispatchToProps)(MatchList);
}

interface IStateProps {
  matches: any[];
  getFixture: (id: string) => any;
}

function mapStateToProps(key: string) {
  return (state: any) => {
    return {
      getFixture: (id: string) => getFixture(state, id),
      matches: getFixtureByFilter(state, key),
    };
  };
}

interface IDispatchProps {
  queryMatches: () => any;
  openMatch: (match: any) => void;
}
function mapDispatchToProps(dispatch: Dispatch<any>): any {
  return {
    openMatch: (match: any) =>
      dispatch(
        navigate({
          params: { id: match.id, title: match.competitionName },
          routeName: Routes.fixtureDetails,
        }),
      ),
    queryMatches: () => dispatch(queryFixtureOverview()),
  };
}

export const Overview = TabNavigator(
  {
    [Routes.overviewPastFixtures]: {
      navigationOptions: { title: Strings.PAST_MATCHES },
      screen: connectMatchList(FILTER_PASSED),
    },
    [Routes.overviewCurrentFixtures]: {
      navigationOptions: { title: Strings.TODAY },
      screen: connectMatchList(FILTER_TODAY),
    },
    [Routes.overviewUpcommingFixtures]: {
      navigationOptions: { title: Strings.NEXT_MATCHES },
      screen: connectMatchList(FILTER_UPCOMMING),
    },
  },
  {
    ...topTabBarNavigationOptions,
    initialRouteName: Routes.overviewCurrentFixtures,
    lazy: false,
  },
);
