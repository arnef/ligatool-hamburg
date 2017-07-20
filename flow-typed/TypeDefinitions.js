// @flow

type User = {
  username: string,
  password: string,
};

type Player = {
  id: number,
  name: string,
  surname: string,
  image: string,
  number: string,
  disabled?: boolean,
};

type Team = {
  id: number,
  name: string,
  image?: string,
  player: Array<Player>,
};

type Venue = {
  id: number,
  name: string,
  street: string,
  zip_code: number,
  city: string,
};

type League = {
  id: number,
  name: string,
  shifting_rule: boolean,
};

type Sets = {
  number: number,
  player_1_home: ?Player,
  player_1_away: ?Player,
  player_2_home: ?Player,
  player_2_away: ?Player,
  goals_home: ?number,
  goals_away: ?number,
};

type LineUp = {
  update: boolean,
  errors: number[],
  playerDisabled: { [key: string]: { singles: boolean, doubles: boolean } },
};

type Match = {
  id: number,
  venue?: Venue,
  datetime: number,
  team_home: Team,
  team_away: Team,
  live: boolean,
  score_unconfirmed: number,
  score_suggest: number,
  match_day: string,
  set_points_home: number,
  set_points_away: number,
  set_points: boolean,
  goals_home: number,
  goals_away: number,
  league: League,
  is_admin: boolean,
  date_confirmed: boolean,
  sets: { [setNumber: string]: Sets },
  type: string,
  showButton?: boolean,
  lineUp?: LineUp,
};

declare var console: {
  assert(condition: mixed, ...data: Array<any>): void,
  clear(): void,
  count(label: string): void,
  debug(...data: Array<any>): void,
  dir(...data: Array<any>): void,
  dirxml(...data: Array<any>): void,
  error(...data: Array<any>): void,
  _exception(...data: Array<any>): void,
  group(...data: Array<any>): void,
  groupCollapsed(...data: Array<any>): void,
  groupEnd(): void,
  info(...data: Array<any>): void,
  log(...data: Array<any>): void,
  profile(name: string): void,
  profileEnd(): void,
  table(
    tabularData:
      | { [key: string]: any }
      | Array<{ [key: string]: any }>
      | Array<Array<any>>,
  ): void,
  time(label: string): void,
  timeEnd(label: string): void,
  timeStamp(label?: string): void,
  trace(...data: Array<any>): void,
  warn(...data: Array<any>): void,
  tron: {
    clear(): void,
    log(...data: Array<any>): void,
    error(...data: Array<any>): void,
    display(...data: Array<any>): void,
    warn(...data: Array<any>): void,
    createStore(...data: Array<any>): void,
  },
};
