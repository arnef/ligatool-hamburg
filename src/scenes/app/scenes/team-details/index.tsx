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

import { MatchList } from '@app/components';
import { topTabBarNavigationOptions } from '@app/containers/navigation';
import { Strings } from '@app/lib/strings';
import { getFixtureByTeam } from '@app/redux/modules/fixtures';
import { getNavigationStateParams } from '@app/redux/modules/navigation';
import { getMatches } from '@app/redux/modules/teams';
import { Routes } from '@app/scenes/routes';
import { TabNavigator } from 'react-navigation';
import { connect, Dispatch } from 'react-redux';

import { ConnectedTeam } from '../Team';

function mapStateToProps(state: any, props: any) {
  return {
    matches: getFixtureByTeam(
      state,
      getNavigationStateParams(props.navigation).team.groupId ||
        getNavigationStateParams(props.navigation).team.id,
    ),
    teams: state.teams,
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
      navigationOptions: { title: Strings.TEAM_INFO },
      screen: ConnectedTeam,
    },
    [Routes.teamFixtures]: {
      navigationOptions: { title: Strings.MATCHES },
      screen: connect(mapStateToProps, mapDispatchToProps)(MatchList),
    },
  },
  topTabBarNavigationOptions,
);
