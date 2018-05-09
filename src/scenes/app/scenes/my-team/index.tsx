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
import {
  getNextFixturesByTeam,
  getPlayedFixturesByTeam,
} from '@app/redux/modules/fixtures';
import { getMatches } from '@app/redux/modules/myteam';
import { navigate } from '@app/redux/modules/navigation';
import { getActiveTeam } from '@app/redux/modules/user';
import { Routes } from '@app/scenes/routes';
import { TabNavigator } from 'react-navigation';
import { connect, Dispatch } from 'react-redux';

import { ConnectedTeam } from '../Team';

interface IStateProps {
  matches: any[];
}
interface IDispatchProps {
  onPress: (fixture: any) => void;
  onRefresh: () => void;
}

export const MyTeam = TabNavigator(
  {
    [Routes.myTeamPlayed]: {
      navigationOptions: { title: Strings.PAST_MATCHES },
      screen: connect<IStateProps, IDispatchProps, any>(
        (state: any): IStateProps => {
          const team = getActiveTeam(state);
          return {
            matches: team
              ? getPlayedFixturesByTeam(state, team.groupId || team.id)
              : [],
          };
        },
        (dispatch: Dispatch<any>): IDispatchProps => ({
          onPress: (fixture: any): void => {
            dispatch(
              navigate({
                params: { id: fixture.id, title: fixture.competitionName },
                routeName: Routes.fixtureDetails,
              }),
            );
          },
          onRefresh: () => dispatch(getMatches()),
        }),
      )(MatchList),
    },
    [Routes.myTeamUpcomming]: {
      navigationOptions: { title: Strings.NEXT_MATCHES },
      screen: connect<IStateProps, IDispatchProps, any>(
        (state: any): IStateProps => {
          const team = getActiveTeam(state);

          return {
            matches: team
              ? getNextFixturesByTeam(state, team.groupId || team.id)
              : [],
          };
        },
        (dispatch: Dispatch<any>): IDispatchProps => ({
          onPress: (fixture: any): void => {
            dispatch(
              navigate({
                params: { id: fixture.id, title: fixture.competitionName },
                routeName: Routes.fixtureDetails,
              }),
            );
          },
          onRefresh: () => dispatch(getMatches()),
        }),
      )(MatchList),
    },
    [Routes.myTeamDetails]: {
      navigationOptions: { title: Strings.TEAM_INFO },
      screen: ConnectedTeam,
    },
  },
  {
    ...topTabBarNavigationOptions,
    initialRouteName: Routes.myTeamUpcomming,
  },
);
