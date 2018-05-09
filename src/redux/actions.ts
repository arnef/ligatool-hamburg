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

export const QUERY_FIXTURE_OVERVIEW = 'app/overview/QUERY';
export const queryFixtureOverview = () => ({ type: QUERY_FIXTURE_OVERVIEW });

export const QUERY_PLAYER_STATS = 'app/competition/QUERY_STATS';
export const queryPlayerStats = (competitionId: string) => ({
  payload: { competitionId },
  type: QUERY_PLAYER_STATS,
});
