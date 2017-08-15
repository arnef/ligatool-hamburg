// @flow
const formats = {
  cup: require('./cup.json'),
  cup_d5: require('./cup_d5.json'),
  default: require('./default.json'),
  default_d5: require('./default_d5.json'),
};

export function getType(match: Match): string {
  let type: string = match.league.cup ? 'cup' : 'default';
  const sets = match && match.sets ? match.sets : {};

  if (sets['5'] && sets['6']) {
    if (sets['5'].player_2_home != null && sets['6'].player_2_away != null) {
      type += '_d5';
    }
  }

  return type;
}

export default formats;
