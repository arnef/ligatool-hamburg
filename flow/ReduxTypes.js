// @flow

type Action = {
  type: string,
  payload: any
};


type AuthState = {
  loading: boolean,
  api_key: ?string,
  error: ?string,
  team: ?Team
};


type DialogState = {
  login: {
    loading: boolean,
    visible: boolean
  },
  player: {
    data: Array<Player>,
    visible: boolean
  }
};

type LoadingState = {
  blocking: boolean,
  nonBlocking: boolean,
  error: ?string
};

// data stores
type MatchesState = {
  [id: number]: Match
};

type TeamsState = {
  [id: number]: Team
};

type LeaguesState = {
  [id: number]: any
};

// views
type OverviewState = {
  today: Array<number>,
  next: Array<number>,
  played: Array<number>
};

type MyTeamState =  {
  next: Array<number>,
  played: Array<number>
};

type NavState = {
  state: any,
  actionStack: Array<*>,
  currentRoute: any,
  drawerOpen: boolean,
  modalOpen: boolean,
  actionStacks: {
    tabs: Array<*>
  },
  currentTab: string
};

type SettingState = {
  changed: boolean,
  color: string,
  fcm_token: ?string,
  notification: { [key: string]: boolean },
  team: ?Team
};

type TeamMatchesState = {
  fetched: boolean,
  loading: boolean,
  next: Array<number>,
  played: Array<number>
};

// type TeamState = {
//   id: { [teamId: string]: { details: Team, matches: Array<number>} },
//   loading: boolean,
//   pendingID: number,
//   error: ?string
// };
