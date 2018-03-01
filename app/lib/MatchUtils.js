import moment from 'moment';
import { DATETIME_DB } from '../config/settings';
import MatchTypes from '../config/MatchTypes';
import { getType } from '../config/MatchTypes';

export function sets(match, format) {
  const matchSets = match.sets || {};
  let sets = [];

  for (let set of format) {
    let data = { ...set, sets: [], editable: match.isAdmin };
    for (let setIdx of data.gameNumbers) {
      if (matchSets[setIdx]) {
        data = { ...data, sets: [...data.sets, matchSets[setIdx]] };
      } else if (
        match.isAdmin &&
        (!data.extra ||
          (data.extra &&
            match.set_points_home >= 16 &&
            match.set_points_away >= 16))
      ) {
        data = { ...data, sets: [...data.sets, {}] };
      }
    }
    if (data.sets.length > 0) {
      sets = [...sets, data];
    }
  }

  return sets;
}

export function toggleType(match, type, idx) {
  for (let index of idx) {
    if (match.sets && match.sets[`${index}`]) {
      match = {
        ...match,
        sets: {
          ...match.sets,
          [`${index}`]: undefined,
          // [`${index}`]: {
          //   player_1_home: null,
          //   player_2_home: null,
          //   player_1_away: null,
          //   player_2_away: null,
          //   goals_home: null,
          //   goals_away: null,
          // },
        },
      };
    }
  }
  match = {
    ...match,
    games: sets(
      match,
      match.modus.lineUp[type]
        ? match.modus.lineUp[type]
        : match.modus.lineUp.default,
    ),
    modus: { ...match.modus, fixtureModus: type },
  };
  return match;
}

export function setPlayer(match, payload) {
  if (!match.sets) {
    match = { ...match, sets: {} };
  }

  for (let idx of payload.gameNumbers) {
    let set = match.sets[`${idx}`] || {
      gameNumber: idx,
      homePlayer1: null,
      homePlayer2: null,
      awayPlayer1: null,
      awayPlayer2: null,
      result: null,
    };
    for (let i = 0; i < payload.player.length; i++) {
      // set = { ...set, [`player_${i + 1}_${payload.team}`]: payload.player[i] };
      set = {
        ...set,
        [`${payload.team.toLowerCase()}Player${i + 1}`]: payload.player[i],
      };
    }
    match = { ...match, sets: { ...match.sets, [`${idx}`]: set } };
  }

  return {
    ...match,
    lineUp: checkLineUp(match),
    games: sets(
      match,
      match.modus.lineUp[match.type]
        ? match.modus.lineUp[match.type]
        : match.modus.lineUp.default,
    ),
  };
}

function checkLineUp(match) {
  // let count = 0;
  // const playerCount = {};
  // const playerDisabled = {};
  // const errors = [];
  // const addPlayerCount = (idx, player, doubles = false) => {
  //   if (!player || !player.id) {
  //     return;
  //   }
  //   if (!playerCount[player.id]) {
  //     playerCount[player.id] = { singles: 0, doubles: 0 };
  //   }
  //   if (!playerDisabled[player.id]) {
  //     playerDisabled[player.id] = { singles: false, doubles: false };
  //   }
  //   playerCount[player.id][doubles ? 'doubles' : 'singles'] += 1;

  //   if (
  //     playerCount[player.id][doubles ? 'doubles' : 'singles'] >
  //     (doubles ? (match.league.cup ? 6 : 4) : 2)
  //   ) {
  //     if (errors.indexOf(parseInt(idx)) === -1) {
  //       errors.push(parseInt(idx));
  //     }
  //   }
  //   if (
  //     playerCount[player.id][doubles ? 'doubles' : 'singles'] >
  //     (doubles ? (match.league.cup ? 5 : 3) : 1)
  //   ) {
  //     playerDisabled[player.id][doubles ? 'doubles' : 'singles'] = true;
  //   }
  // };

  // if (match.team_home.player && match.team_away.player) {
  //   for (let idx in match.sets) {
  //     const set = match.sets[idx];
  //     if (set.player_1_home && set.player_1_away) {
  //       count += 1;
  //       if (set.player_2_home != null && set.player_2_away != null) {
  //         addPlayerCount(idx, set.player_1_home, true);
  //         addPlayerCount(idx, set.player_2_home, true);
  //         addPlayerCount(idx, set.player_1_away, true);
  //         addPlayerCount(idx, set.player_2_away, true);
  //       } else {
  //         addPlayerCount(idx, set.player_1_home);
  //         addPlayerCount(idx, set.player_1_away);
  //       }
  //     }
  //   }
  //   let i;
  //   for (i = 0; i < match.team_home.player.length; i++) {
  //     match.team_home.player[i].disabled =
  //       playerDisabled[match.team_home.player[i].id];
  //   }
  //   for (i = 0; i < match.team_away.player.length; i++) {
  //     match.team_away.player[i].disabled =
  //       playerDisabled[match.team_away.player[i].id];
  //   }

  //   return {
  //     update: errors.length === 0 && (count >= 16 || match.set_points),
  //     errors,
  //     playerDisabled,
  //   };
  // } else {
  return { update: false, errors: [], playerDisabled: {} };
  // }
}

/**
 *
 */
export function sort(matches: MatchesState = {}): Function {
  return (a: number, b: number): number => {
    const matchA: Match = matches[a] || {};
    const matchB: Match = matches[b] || {};
    let sort =
      (matchB.live ? 2 : matchB.set_points ? 1 : 0) -
      (matchA.live ? 2 : matchA.set_points ? 1 : 0);
    if (sort === 0) {
      if (
        matchA.set_points &&
        matchB.set_points &&
        !matchA.live &&
        !matchB.live
      ) {
        sort = moment(matchB.datetime, DATETIME_DB).diff(
          moment(matchA.datetime),
          'hours',
        );
      } else {
        sort = moment(matchA.datetime, DATETIME_DB).diff(
          moment(matchB.datetime),
          'hours',
        );
      }
    }
    if (sort === 0) {
      sort = parseInt(matchA.id) - parseInt(matchB.id);
    }
    return sort;
  };
}

export const gamePayload = (state, fixtureId, game) => {
  const payload = [];
  for (let gameNumber of game.gameNumbers) {
    const g = getFixtureGame(state, fixtureId, gameNumber);
    payload.push({
      home_player_1_id: g.homePlayer1 ? g.homePlayer1.id : null,
      home_player_2_id: g.homePlayer2 ? g.homePlayer2.id : null,
      away_player_1_id: g.awayPlayer1 ? g.awayPlayer1.id : null,
      away_player_2_id: g.awayPlayer2 ? g.awayPlayer2.id : null,
      goals_home: g.result ? g.result.goalsHome : null,
      goals_away: g.result ? g.result.goalsAway : null,
      key: game.key,
      game_number: gameNumber,
    });
  }
  return payload;
};
