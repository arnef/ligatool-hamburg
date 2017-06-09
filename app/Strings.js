// @flow

const pkg = require('../package.json');
const strings: { [string]: string } = {
  overview: 'Übersicht',
  my_team: 'Mein Team',
  leagues: 'Gruppen',
  settings: 'Einstellungen',
  notifications: 'Benachrichtigungen',
  today: 'Heute',
  next: 'Kommende',
  played: 'Vergangene',
  team: 'Team',
  home: 'Heim',
  away: 'Gast',
  table: 'Tabelle',
  user_data: 'Benutzerdaten',
  login: 'Anmelden',
  logout: 'Abmelden',
  skip: 'Überspringen',
  score_live: 'Live-Zwsichenergebnis',
  score_end: 'Endstand',
  select_leagues: 'Gruppen wählen',
  information: 'Informationen',
  app_version: 'App-Version ' + pkg.version,
  match: 'Begegnung',
  matches: 'Begegnungen',
  login_info:
    'Zugangsdaten für das Liga-Tool.\nWenn diese nicht eingetragen werden, können keine Spiele eingetragen werden.',
  login_error: 'Fehler beim Anmelden. Überprüfe deine Zugangsdaten.',
  player_statistics: 'Statistiken',
  player_info: 'Spieler-Info',
  team_info: 'Team-Info',
  clear_image_cache: 'Bilder-Cache leeren',
  cache_information:
    'Teamlogos und Spielerbilder werden Lokal gespeichert, um das Datenvolumen zu schonen. Sollten mal nicht die aktuellsten Bilder angezeigt werden, kann hier der Speicher gelöscht werden und die Bilder werden neu geladen.',
};

export default strings;
