import {
  TOGGLE_D5,
  SET_PLAYER,
  GET_LEAGUE_MATCHES,
  QUERY_MATCHES,
  QUERY_TEAM_MATCHES,
  GET_TEAM_MATCHES,
  FULFILLED,
  PENDING,
  PUT_SETS,
  SUGGEST_SCORE,
  SCORE_CONFIRMED,
  SCORE,
  NOTIFICATION,
  GET_MATCH
} from '../actions/types'
import {
  compareDays,
  isAdminForMatch
} from '../../Helper'


export default (state = {
    data: {},
    error: null,
    fetched: false,
    fetching: false,
    next: [],
    played: [],
    today: []
}, action) => {

    switch (action.type) {
    case GET_LEAGUE_MATCHES + FULFILLED:
    case GET_TEAM_MATCHES + FULFILLED:
    case QUERY_TEAM_MATCHES + FULFILLED: {
        if (action.payload.ok) {
            state = { ...state }
            for (let match of action.payload.data) {
                match.type = getMatchType(match);
                match.is_admin = isAdminForMatch(match);

                if (state.data[match.id]) {
                    state.data[match.id] = { ...state.data[match.id], ...match };
                } else {
                  state.data[match.id] = match;
                }

            }
        }

        return state
    }
    case PUT_SETS + FULFILLED:
    case GET_MATCH + FULFILLED: {
        if (action.payload.ok) {
            state = { ...state };
            const match = action.payload.data

            if (state.data[match.id]) {
                match.sets = compaireSets(match, state.data[match.id])
            }
            match.type = getMatchType(match)
            match.is_admin = isAdminForMatch(match)
            state.data[match.id] = match
        }

        return state
    }

    case QUERY_MATCHES + PENDING: {
        state = { ...state, error: null, fetching: true  }

        return state
    }

    case QUERY_MATCHES + FULFILLED: {
        state = { ...state, fetching: false }
        if (action.payload.ok) {
            const newState = reorderMatches(action.payload.data)

            state.today = newState.today
            state.next = newState.next
            state.played = newState.played
            state.data = newState.data
            state.fetched = true
        } else {
            state.error = action.payload.problem
        }

        return state
    }

    case SCORE + NOTIFICATION:
    case SUGGEST_SCORE + NOTIFICATION: {
        state = { ...state }
        // console.tron.log(action.payload)
        const matchId = parseInt(action.payload.id, 10)
        const { set_points_away, set_points_home, live } = action.payload

        if (!state.data[matchId]) {
            state.data[matchId] = { id: matchId }
        }
        state.data[matchId].set_points_home = parseInt(set_points_home)
        state.data[matchId].set_points_away = parseInt(set_points_away)
        state.data[matchId].live = JSON.parse(live)
        state.data[matchId].set_points = true


        return state
    }

    case SCORE_CONFIRMED + NOTIFICATION: {
        state = { ... state }
        const matchId = parseInt(action.payload.id, 10)

        if (state.data[matchId]) {
            state.data[matchId].score_unconfirmed = parseInt(action.payload.score_unconfirmed)
            state.data[matchId].live = false
        }

        return state
    }

    case TOGGLE_D5: {
        state = { ...state }
        const match = state.data[action.payload.id]

        if (match) {
            for (let idx of action.payload.idx) {
                if (match.sets[idx]) {
                    match.sets[idx].player_1_home = null
                    match.sets[idx].player_2_home = null
                    match.sets[idx].player_1_away = null
                    match.sets[idx].player_2_away = null
                    match.sets[idx].goals_home = null
                    match.sets[idx].goals_away = null
                }
            }
            match.type = action.payload.type
            // console.tron.log(action.payload)
        }

        return state
    }
    case SET_PLAYER: {
        state = { ...state }
        const match = state.data[action.payload.id]

        // console.tron.log(action.payload)
        if (!match.sets) {
            match.sets = {}
        }
        for (let idx of action.payload.setsIdx) {
            const set = match.sets[idx] || {}

            for (let i = 0; i < action.payload.player.length; i++) {
                set[`player_${i + 1}_${action.payload.team}`] = action.payload.player[i]
            }
            set.number = idx
            match.sets[idx] = set
        }
        // state.data[action.payload.id] = match

        return state
    }
    }

    return state
}

const reorderMatches = (matches) => {
    const today = []
    const next = []
    const played = []
    const data = {}
    const now = new Date().getTime()

    for (let match of matches) {
        match.is_admin = isAdminForMatch(match)
        match.type = getMatchType(match)
        data[match.id] = match

        if (match.date_confirmed) {
            const diff = compareDays(match.datetime, now)

            if ((match.live && diff > -2) || diff === 0) {
                today.push(match.id)
            } else if (diff < 0) {
                if (match.set_points) {
                    played.push(match.id)
                }
            } else if (diff > 0) {
                if (match.set_points) {
                    played.push(match.id)
                } else {
                    next.push(match.id)
                }
            }
        }
    }

    return sortMatches( {
        data,
        next,
        played,
        today
    } )
}

const sortMatches = (matches) => {
    const sortDESC = (a, b) => {
        const matchA = matches.data[a]
        const matchB = matches.data[b]
        let order = matchB.datetime - matchA.datetime

        if (order === 0) {
            order = matchA.league.name < matchB.league.name ? -1 : 1
        }

        return order
    }
    const sortASC = (a, b) => {
        const matchA = matches.data[a]
        const matchB = matches.data[b]
        let order = (matchB.live ? 2 : matchB.set_points ? 1 : 0) - (matchA.live ? 2 : matchA.set_points ? 1 : 0)

        if (order === 0) {
            order = matchA.datetime - matchB.datetime
        }

        if (order === 0) {
            order = matchA.league.name < matchB.league.name ? -1 : 1
        }

        return order
    }

    matches.today.sort(sortASC)
    matches.next.sort(sortASC)
    matches.played.sort(sortDESC)

    return matches
}

const getMatchType = (match) => {
    let type = match.league.cup ? 'cup' : 'default'
    const sets = match && match.sets ? match.sets : {}

    if (sets['5'] && sets['6']) {
        if (sets['5'].player_2_home !== null && sets['6'].player_2_away !== null) {
            type += '_d5'
        }
    }

    return type
}

const compaireSets = (match, cacheMatch) => {
    let sets = match.sets

    if (cacheMatch && cacheMatch.sets) {
        for(let nr in cacheMatch.sets) {
            if (!match.sets[nr] && cacheMatch.sets[nr]) {
                sets[nr] = cacheMatch.sets[nr]
            }
        }
    }

    return sets
}
