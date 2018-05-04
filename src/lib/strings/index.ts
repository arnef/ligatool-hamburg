import LocalizedStrings from 'react-native-localization';
import en from './en';
import de from './de';

export const Strings = new LocalizedStrings<StringsObject>({
  de,
  en,
});

export interface StringsObject {
  ASSOCIATION: string;
  CONFIRM: string;
  AWAY: string;
  HOME: string;
  CLUB: string;
  CONTACT: string;
  HOME_TABLE: string;
  HOME_MATCH_TIME: string;
  HOME_VENUE: string;
  OPEN_VENUE: string;
  CHANGE_MATCH_DATETIME: string;
  DATETIME_SUGGESTIONS: string;
  SUGGEST_DATETIMES: string;
  SELECT_NEXT_DATETIMTE: string;
  FIRST_MATCH: string;
  MAIL_APP_NOT_FOUND: string;
  MAPS_APP_NOT_FOUND: string;
  NAME: string;
  PHONE_APP_NOT_FOUND: string;
  PLAYER: string;
  GROUP: string;
  GROUPS: string;
  LEAGUES: string;
  WEEKDAYS: Array<string>;
  SCORE_BUTTON_TEXT: Array<string>;
  TIME_AT: string;
  DOT_POSITION: string;
  POSITION: string;
  SELECT_GROUP: string;
  SELECT_GROUPS: string;
  SELECT_TEAM: string;
  SELECT_TEAMS: string;
  LOGIN: string;
  LOGOUT: string;
  LOGIN_INFO: string;
  LOGIN_ERROR: string;
  USERNAME: string;
  PASSWORD: string;
  CANCEL: string;
  DELETE: string;
  SAVE: string;
  SKIP: string;
  MATCHES: string;
  STATISTICS: string;
  STATISTIC: string;
  MY_TEAM: string;
  SECOND_HALFTIME: string;
  CLASSIFICATION: string;
  SET_POINTS_RATE: string;
  NATIONAL_NUMBER: string;
  INTERNATIONAL_NUMBER: string;
  WIN: string;
  WIN_POSTFIX: string;
  DRAW: string;
  DRAW_POSTFIX: string;
  LOST: string;
  LOST_POSTFIX: string;
  APP_VERSION: string;
  INFORMATION: string;
  COMPETITIVE_INDEX: string;
  COMPETITIVE_INDEX_SHORT: string;
  GAMES: string;
  GAMES_SHORT: string;
  GOALS: string;
  MATCH: string;
  ENTER_ACCESS_DATA: string;
  USER_DATA: string;
  NOTIFICATIONS: string;
  NOTIFICATION_LIVE: string;
  NOTIFICATION_END: string;
  NOTIFICATION_MATCH_DATE: string;
  NOTIFICATION_SOUND: string;
  OVERVIEW: string;
  PAST_MATCHES: string;
  NEXT_MATCHES: string;
  PLAYER_INFO: string;
  POINTS_SHORT: string;
  RATE_SHORT: string;
  GAME_POINTS_POSITIV: string;
  SELECT: string;
  SELECT_PLAYER: string;
  INSERT_SCORE: string;
  SETS: string;
  SETTINGS: string;
  SO_FAR: string;
  TABLE: string;
  TEAM: string;
  TEAM_INFO: string;
  TODAY: string;
  RESULT: string;
  DOT_SET: string;
  NO_FIXTURES: string;
  NO_STANDING: string;
  NO_PLAYER_STATS: string;
  SET_UP: string;
  WELCOME_TEXT: string;
  PARTICIPANTS: string;
  RANKING: string;
  RANKINGS: string;
  RANKING_POSITIONS: string;
  TOURNAMENT_PARTICIPATIONS: string;
  TOURNAMENT: string;
  LAST_SINGLES: string;
  LAST_DOUBLES: string;
  TEAMS: string;
  SEASON: string;
  COMPETITIONS: string;
  UNCONFIRMED: string;
  LIVE: string;
  CONFIRM_DELETE_TEAM_TITLE: string;
  CONFIRM_DELETE_TEAM_MESSAGE: string;
  ADD_TEAM: string;
  YES: string;
  NO: string;
  PRESS_ON: string;
  CHANGE_DATE_INFO: string;
}
