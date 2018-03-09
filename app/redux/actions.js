export const QUERY_FIXTURE_OVERVIEW = 'app/overview/QUERY';
export const queryFixtureOverview = () => ({ type: QUERY_FIXTURE_OVERVIEW });

export const QUERY_PLAYER_STATS = 'app/competition/QUERY_STATS';
export const queryPlayerStats = competitionId => ({
  type: QUERY_PLAYER_STATS,
  payload: { competitionId },
});
