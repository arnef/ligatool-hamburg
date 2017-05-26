// @flow

type User = {
  username: string,
  password: string
};

type Player = {
  id: number,
  name: string,
  surname: string,
  image: string,
  number: string
};

type Team = {
  id: number,
  name: string,
  image?: string,
  player: Array<Player>
};

type Venue = {
  id: number,
  name: string,
  street: string,
  zip_code: number,
  city: string
};

type League = {
  id: number,
  name: string,
  shifting_rule: boolean
};

type Sets = {
  number: number,
  player_1_home: ?Player,
  player_1_away: ?Player,
  player_2_home: ?Player,
  player_2_away: ?Player,
  goals_home: ?number,
  goals_away: ?number
};

type Match = {
  id: number,
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
  date_confirmed: boolean,
  sets: { [setNumber: string]: Sets },
  type: string,
  is_admin: boolean
};
