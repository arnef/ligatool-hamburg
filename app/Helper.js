// @flow
const weekdays = ['So.', 'Mo.', 'Di.', 'Mi.', 'Do.', 'Fr.', 'Sa.'];

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

export function darken(color: string, amt: number): string {
  amt = Math.round(2.55 * amt);
  const colorVal = parseInt(color.replace('#', ''), 16);
  const darkColor = (((colorVal & 0x0000ff) - amt) |
    ((((colorVal >> 8) & 0x00ff) - amt) << 8) |
    (((colorVal >> 16) - amt) << 16)).toString(16);

  return '#' + `000000${darkColor}`.slice(-6);
}

export function getMatchDays(matches: Array<Match>): any {
  const matchDays: any = {
    matchdays: {},
    selected: null,
  };

  for (let match: Match of matches) {
    if (!matchDays.matchdays[match.match_day]) {
      matchDays.matchdays[match.match_day] = [];
    }
    matchDays.matchdays[match.match_day].push(`${match.id}`);
    if (!match.set_points && !matchDays.selected) {
      matchDays.selected = match.match_day;
    }
  }
  if (!matchDays.selected) {
    matchDays.selected = matches[matches.length - 1].match_day;
  }

  return { match_days: matchDays.matchdays, selected: matchDays.selected };
}
