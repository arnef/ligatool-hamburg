// @flow
import moment from 'moment';
import store from './store';

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

/**
 * check if a user is logged in and can edit given match
 * @param {object} match
 * @return {boolean}
 */
export function isAdminForMatch(match: Match): boolean {
  const user = store.getState().auth;

  return user.team &&
    user.team.ids &&
    match &&
    match.id &&
    !(user.team.ids.indexOf(match.team_home.id) === -1 &&
      user.team.ids.indexOf(match.team_away.id) === -1) &&
    (!match.set_points || match.score_unconfirmed)
    ? true
    : false;
}

/**
 * format timestamp to date string (Mo. dd.mm.yyyy)
 * @param {number} timestamp
 * @return {string}
 */
export function formatDate(timestamp: number): string {
  const date: Date = new Date(timestamp);
  const day: string = `0${date.getDate()}`.slice(-2);
  const month: string = `0${date.getMonth() + 1}`.slice(-2);

  return `${weekdays[date.getDay()]} ${day}.${month}.${('' + date.getFullYear()).slice(-2)}`;
}

/**
 * format timestamp to time string (HH:MM)
 * @param {number} timestamp
 * @return {string}
 */
export function formatTime(timestamp: number): string {
  const date: Date = new Date(timestamp);
  const hours: string = `0${date.getHours()}`.slice(-2);
  const minutes: string = `0${date.getMinutes()}`.slice(-2);

  return `${hours}:${minutes}`;
}

/**
 *
 */
export function sortMatches(matches: MatchesState): Function {
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
        sort = matchB.datetime - matchA.datetime;
      } else {
        sort = matchA.datetime - matchB.datetime;
      }
    }
    if (sort === 0) {
      sort = matchA.id - matchB.id;
    }
    return sort;
  };
}

export function currentRoute(navigation: any): NavigationRoute {
  const recursiveFindRoute = nav => {
    const subState = nav.routes[nav.index].routeName === 'DrawerOpen'
      ? nav.routes[0]
      : nav.routes[nav.index];

    if (
      !subState.routes ||
      subState.routes[0].routeName.indexOf('TAB_') !== -1
    ) {
      return subState;
    }
    return recursiveFindRoute(subState);
  };

  return recursiveFindRoute(navigation || store.getState().nav.navigation);
}

export function darken(color: string, amt: number): string {
  amt = Math.round(2.55 * amt);
  const colorVal = parseInt(color.replace('#', ''), 16);
  const darkColor = (((colorVal & 0x0000ff) - amt) |
    ((((colorVal >> 8) & 0x00ff) - amt) << 8) |
    (((colorVal >> 16) - amt) << 16)).toString(16);
  return `#${darkColor}`;
}
