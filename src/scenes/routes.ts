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

export const Routes = {
  // main stack
  app: '/app',
  overview: '/app/overview',
  myTeam: '/app/myteam',
  competitions: '/app/competitions',
  settings: '/app/settings',

  fixtureDetails: '/app/fixtureDetails',

  competition: '/app/competitions/competition',
  competitionFixtures: '/app/competitions/fixtures',
  competitionStats: '/app/competitions/stats',
  cup: '/app/competitions/cup',

  teamDetails: '/app/team/details',
  teamFixtures: '/app/team/fixtures',

  playerDetails: '/app/player/details',

  // tabs
  overviewPastFixtures: '/app/overview/past',
  overviewCurrentFixtures: '/app/overview/current',
  overviewUpcommingFixtures: '/app/overview/upcomming',
  
  myTeamPlayed: '/app/myteam/played',
  myTeamUpcomming: '/app/myteam/upcomming',
  myTeamDetails: '/app/myteam/details',
  
  settingsNotifications: '/app/settings/notifications',
  settingsNotificationsTeams: '/app/settings/notifications/teams',
  
  welcome: '/login/welcome',
  selectCompetition: '/login/competition',
  selectTeam: '/login/team',
  login: '/login/login',
}