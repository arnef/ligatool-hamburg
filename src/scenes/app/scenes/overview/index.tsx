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

import * as React from 'react';
import { TabNavigator } from 'react-navigation';
import { connect } from 'react-redux';
import { Content, MatchItem, Text } from 'src/components';
import { Routes } from 'src/scenes/routes';
import { Strings } from 'src/lib/strings';
import { 
  getFixtureByFilter, 
  FILTER_PASSED, 
  FILTER_TODAY,
  FILTER_UPCOMMING, 
  getFixture 
} from 'src/redux/modules/fixtures';
import { Dispatch } from 'redux';
import { topTabBarNavigationOptions } from 'src/containers/navigation';
import { queryFixtureOverview } from 'src/redux/actions';
import { SectionHeader } from './components/section-header';

interface Props extends StateProps, DispatchProps {

}

class MatchList extends React.PureComponent<Props> {

  private renderSectionHeader = ({ section }: any) => {
    return <SectionHeader title={section.title} />
  }

  private renderItem = ({ item }: any) => {
    return <MatchItem data={this.props.getFixture(item)} />
  }

  public render() {
    const { matches, queryMatches } = this.props;
    return (
      <Content
        renderItem={this.renderItem}
        renderSectionHeader={this.renderSectionHeader}
        sections={matches}
        listEmptyText={ Strings.NO_FIXTURES }
        onRefresh={queryMatches}
      />
    );
  }
}

function connectMatchList(key:string) {
  return connect(mapStateToProps(key), mapDispatchToProps)(MatchList);
}

interface StateProps {
  matches: any,
  getFixture: any,
}

function mapStateToProps(key: string) {
  return (state: any) => {
    console.log('map overview state to props');
    return {
      matches: getFixtureByFilter(state, key),
      getFixture: (id: string) => getFixture(state, id),
    };
  }
}

interface DispatchProps {
  queryMatches: () => any
}
function mapDispatchToProps(dispatch: Dispatch<any>): any {
  return {
    queryMatches: () => dispatch(queryFixtureOverview()),
  };
}

export const Overview = TabNavigator({
  [Routes.overviewPastFixtures]: {
    screen: connectMatchList(FILTER_PASSED),
    navigationOptions: { title: Strings.PAST_MATCHES },
  },
  [Routes.overviewCurrentFixtures]: {
    screen: connectMatchList(FILTER_TODAY),
    navigationOptions: { title: Strings.TODAY },
  },
  [Routes.overviewUpcommingFixtures]: {
    screen: connectMatchList(FILTER_UPCOMMING),
    navigationOptions: { title: Strings.NEXT_MATCHES },
  }
}, { ...topTabBarNavigationOptions, lazy: false });