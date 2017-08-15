// @flow
import moment from 'moment';
import { DATETIME_DB } from '../config/settings';
import MatchTypes from '../config/MatchTypes';
import { getType } from '../config/MatchTypes';

export function sets(match: Match) {
  const matchSets = match.sets || {};
  let sets: Array<Sets> = [];

  const format = MatchTypes[match.type || getType(match) || 'default'];
  for (let set of format) {
    let data = { ...set, sets: [], editable: match.is_admin };
    for (let setIdx of data.setsIdx) {
      if (matchSets[setIdx]) {
        data = { ...data, sets: [...data.sets, matchSets[setIdx]] };
      } else if (
        match.is_admin &&
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

/**
 * check if a user is logged in and can edit given match
 * @param {object} match
 * @return {boolean}
 */
// export function isAdmin(match: Match, user: any): Match {
//   // const user = store.getState().auth;

//   const isAdmin: boolean =
//     user.team &&
//     user.team.ids &&
//     match &&
//     match.id &&
//     !(
//       user.team.ids.indexOf(`${match.team_home.id}`) === -1 &&
//       user.team.ids.indexOf(`${match.team_away.id}`) === -1
//     ) &&
//     (!match.set_points || match.score_unconfirmed)
//       ? true
//       : false;

//   if (isAdmin) {
//     const score =
//       match.score_unconfirmed &&
//       (match.league.cup
//         ? match.set_points_home !== match.set_points_away &&
//           (match.set_points_home > 16 || match.set_points_away > 16)
//         : match.set_points_home + match.set_points_away === 32);
//     const suggestionState = score
//       ? match.live
//         ? 0
//         : user.team.ids.indexOf(`${match.score_suggest}`) !== -1 ? 1 : 2
//       : -1;
//     return {
//       ...match,
//       lineUp: checkLineUp(match),
//       is_admin: true,
//       can_suggest_score: suggestionState,
//       type: getType(match),
//     };
//   } else {
//     return { ...match, is_admin: false };
//   }
// }

export function toggleType(match: Match, type: string, idx: Array<number>) {
  for (let index: number of idx) {
    if (match.sets && match.sets[`${index}`]) {
      match = {
        ...match,
        sets: {
          ...match.sets,
          [`${index}`]: {
            player_1_home: null,
            player_2_home: null,
            player_1_away: null,
            player_2_away: null,
            goals_home: null,
            goals_away: null,
          },
        },
      };
    }
  }
  match = { ...match, type };
  return { ...match, games: sets(match) };
}

export function setPlayer(
  match: Match,
  payload: { setsIdx: Array<number>, player: Array<Player>, team: string },
): Match {
  if (!match.sets) {
    match = { ...match, sets: {} };
  }

  for (let idx: number of payload.setsIdx) {
    let set = match.sets[`${idx}`] || {
      number: idx,
      player_1_home: null,
      player_2_home: null,
      player_1_away: null,
      player_2_away: null,
      goals_home: null,
      goals_away: null,
    };
    for (let i = 0; i < payload.player.length; i++) {
      set = { ...set, [`player_${i + 1}_${payload.team}`]: payload.player[i] };
    }
    match = { ...match, sets: { ...match.sets, [`${idx}`]: set } };
  }

  return { ...match, lineUp: checkLineUp(match), games: sets(match) };
}

function checkLineUp(
  match: Match,
): { update: boolean, errors: Array<number>, playerDisabled: any } {
  let count: number = 0;
  const playerCount = {};
  const playerDisabled = {};
  const errors = [];
  const addPlayerCount = (idx, player, doubles = false) => {
    if (!player || !player.id) {
      return;
    }
    if (!playerCount[player.id]) {
      playerCount[player.id] = { singles: 0, doubles: 0 };
    }
    if (!playerDisabled[player.id]) {
      playerDisabled[player.id] = { singles: false, doubles: false };
    }
    playerCount[player.id][doubles ? 'doubles' : 'singles'] += 1;

    if (
      playerCount[player.id][doubles ? 'doubles' : 'singles'] >
      (doubles ? (match.league.cup ? 6 : 4) : 2)
    ) {
      if (errors.indexOf(parseInt(idx)) === -1) {
        errors.push(parseInt(idx));
      }
    }
    if (
      playerCount[player.id][doubles ? 'doubles' : 'singles'] >
      (doubles ? (match.league.cup ? 5 : 3) : 1)
    ) {
      playerDisabled[player.id][doubles ? 'doubles' : 'singles'] = true;
    }
  };

  if (match.team_home.player && match.team_away.player) {
    for (let idx: string in match.sets) {
      const set = match.sets[idx];
      if (set.player_1_home && set.player_1_away) {
        count += 1;
        if (set.player_2_home != null && set.player_2_away != null) {
          addPlayerCount(idx, set.player_1_home, true);
          addPlayerCount(idx, set.player_2_home, true);
          addPlayerCount(idx, set.player_1_away, true);
          addPlayerCount(idx, set.player_2_away, true);
        } else {
          addPlayerCount(idx, set.player_1_home);
          addPlayerCount(idx, set.player_1_away);
        }
      }
    }
    let i;
    for (i = 0; i < match.team_home.player.length; i++) {
      match.team_home.player[i].disabled =
        playerDisabled[match.team_home.player[i].id];
    }
    for (i = 0; i < match.team_away.player.length; i++) {
      match.team_away.player[i].disabled =
        playerDisabled[match.team_away.player[i].id];
    }

    return {
      update: errors.length === 0 && (count >= 16 || match.set_points),
      errors,
      playerDisabled,
    };
  } else {
    return { update: false, errors: [], playerDisabled: {} };
  }
}

// export function getType(match: Match): string {
//   let type: string = match.league.cup ? 'cup' : 'default';
//   const sets = match && match.sets ? match.sets : {};

//   if (sets['5'] && sets['6']) {
//     if (sets['5'].player_2_home != null && sets['6'].player_2_away != null) {
//       type += '_d5';
//     }
//   }

//   return type;
// }

/**
 *
 */
export function sort(matches: MatchesState = {}): Function {
  return (a: number, b: number): number => {
    const matchA: Match = matches[a];
    const matchB: Match = matches[b];
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
