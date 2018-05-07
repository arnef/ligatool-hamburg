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
import { Routes } from '@app/scenes/routes';
import { getFixtureByTeam } from '../../../../redux/modules/fixtures';
import { getNavigationStateParams } from '../../../../redux/modules/navigation';
import { connect, Dispatch } from 'react-redux';
import { getMatches } from '../../../../redux/modules/teams';
import { MatchList } from '../../../../components';
import { Strings } from '../../../../lib/strings';
import { Team } from '@app/components';
import { topTabBarNavigationOptions } from '../../../../containers/navigation';

function mapStateToProps(state: any, props: any) {
  return {
    teams: state.teams,
    matches: getFixtureByTeam(
      state,
      getNavigationStateParams(props.navigation).team.groupId ||
        getNavigationStateParams(props.navigation).team.id,
    ),
  };
}

function mapDispatchToProps(dispatch: Dispatch<any>, props: any) {
  return {
    onRefresh: () =>
      dispatch(
        getMatches(
          getNavigationStateParams(props.navigation).team.groupId ||
            getNavigationStateParams(props.navigation).team.id,
        ),
      ),
  };
}

export const TeamDetails = TabNavigator(
  {
    [Routes.teamDetails]: {
      screen: Team,
      navigationOptions: { title: Strings.TEAM_INFO },
    },
    [Routes.teamFixtures]: {
      screen: connect(mapStateToProps, mapDispatchToProps)(MatchList),
      navigationOptions: { title: Strings.MATCHES },
    },
  },
  topTabBarNavigationOptions,
);
