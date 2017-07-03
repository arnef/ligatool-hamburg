// @flow
/**
 * check if a user is logged in and can edit given match
 * @param {object} match
 * @return {boolean}
 */
export function isAdmin(match: Match, user: any): Match {
  // const user = store.getState().auth;

  const isAdmin: boolean =
    user.team &&
    user.team.ids &&
    match &&
    match.id &&
    !(
      user.team.ids.indexOf(`${match.team_home.id}`) === -1 &&
      user.team.ids.indexOf(`${match.team_away.id}`) === -1
    ) &&
    (!match.set_points || match.score_unconfirmed)
      ? true
      : false;

  console.log(`is admin for match: ${isAdmin ? 'true' : 'false'}`);
  if (isAdmin) {
    return {
      ...match,
      lineUp: checkLineUp(match),
      is_admin: true,
      type: getType(match),
    };
  } else {
    return { ...match, is_admin: false };
  }
}

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

  return { ...match, type };
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
  console.log(match);
  return { ...match, lineUp: checkLineUp(match) };
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
    console.log('else zweig');
    return { update: false, errors: [], playerDisabled: {} };
  }
}

function getType(match: Match): string {
  let type: string = match.league.cup ? 'cup' : 'default';
  const sets = match && match.sets ? match.sets : {};

  if (sets['5'] && sets['6']) {
    if (sets['5'].player_2_home != null && sets['6'].player_2_away != null) {
      type += '_d5';
    }
  }

  return type;
}
