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
import { connect } from 'react-redux';
import { MatchList, Team } from '@app/components';
import { getMatches } from '@app/redux/modules/myteam';
import { TabNavigator } from 'react-navigation';
import { topTabBarNavigationOptions } from '@app/containers/navigation';
import { Routes } from '@app/scenes/routes';
import { Strings } from '@app/lib/strings';
import { getActiveTeam } from '../../../../redux/modules/user';
import {
  getPlayedFixturesByTeam,
  getNextFixturesByTeam,
} from '../../../../redux/modules/fixtures';

export const MyTeam = TabNavigator(
  {
    [Routes.myTeamPlayed]: {
      screen: connect(
        (state, props) => {
          const team = getActiveTeam(state);
          return {
            matches: team
              ? getPlayedFixturesByTeam(state, team.groupId || team.id)
              : [],
          };
        },
        dispatch => ({
          onRefresh: () => dispatch(getMatches()),
        }),
      )(MatchList),
      navigationOptions: { title: Strings.PAST_MATCHES },
    },
    [Routes.myTeamUpcomming]: {
      screen: connect(
        state => {
          const team = getActiveTeam(state);

          return {
            matches: team
              ? getNextFixturesByTeam(state, team.groupId || team.id)
              : [],
          };
        },
        dispatch => ({
          onRefresh: () => dispatch(getMatches()),
        }),
      )(MatchList),
      navigationOptions: { title: Strings.NEXT_MATCHES },
    },
    [Routes.myTeamDetails]: {
      screen: Team,
      navigationOptions: { title: Strings.TEAM_INFO },
    },
  },
  {
    ...topTabBarNavigationOptions,
    initialRouteName: Routes.myTeamUpcomming,
  },
);
