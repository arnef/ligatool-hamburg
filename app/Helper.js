// @flow
/**
 * Compare date day of two date.
 * 0 = same day
 * < 0 = date2 is before date1
 * < 0 = date2 is after date1
 * @param  {Date} date1
 * @param  {Date} date2
 * @return {number}
 */
export function compareDays(d1: number, d2: number): number {
  const date1: Date = new Date(d1);
  const date2: Date = new Date(d2);
  const day1: number = parseInt(
    date1.getFullYear() +
      ('0' + date1.getMonth()).slice(-2) +
      ('0' + date1.getDate()).slice(-2),
    10,
  );
  const day2: number = parseInt(
    date2.getFullYear() +
      ('0' + date2.getMonth()).slice(-2) +
      ('0' + date2.getDate()).slice(-2),
    10,
  );
  const diff: number = day1 - day2;

  return diff;
}

export function darken(color, amt) {
  let r = parseInt(color.substring(1, 3), 10);
  let g = parseInt(color.substring(3, 5), 10);
  let b = parseInt(color.substring(5, 7), 10);

  r = Math.round(Math.max(r - r * (amt / 100), 0)).toString(16);
  g = Math.round(Math.max(g - g * (amt / 100), 0)).toString(16);
  b = Math.round(Math.max(b - b * (amt / 100), 0)).toString(16);

  return '#' + ('0' + r).slice(-2) + ('0' + g).slice(-2) + ('0' + b).slice(-2);
}

export function getMatchDays(matches) {
  const matchDays = {
    matchdays: {},
    selected: null,
  };

  for (let match of matches) {
    if (!matchDays.matchdays[match.matchday]) {
      matchDays.matchdays[match.matchday] = [];
    }
    matchDays.matchdays[match.matchday].push(`${match.id}`);
    if (!match.set_points && !matchDays.selected) {
      matchDays.selected = match.matchday;
    }
  }
  if (!matchDays.selected) {
    matchDays.selected = matches[matches.length - 1].matchday;
  }

  return { match_days: matchDays.matchdays, selected: matchDays.selected };
}
