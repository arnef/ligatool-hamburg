import { QUERY_MATCHES, FULFILLED, PENDING, PUT_SETS, SUGGEST_SCORE, SCORE_CONFIRMED, SCORE, NOTIFICATION, GET_MATCH } from '../actions/types'
import { compareDays } from '../../Helper'

export default (state = {
    error: null,
    fetched: false,
    fetching: false,
    next: [],
    played: [],
    today: []
}, action) => {
    // let matchId
    switch (action.type) {
    case QUERY_MATCHES + PENDING:
        state = { ...state, error: null, fetching: true  }
        break

    case QUERY_MATCHES + FULFILLED:
        state = { ...state, fetching: false }
        if (action.payload.ok) {
            const newState = reorderMatches(action.payload.data)

            state.today = newState.today
            state.next = newState.next
            state.played = newState.played
            state.fetched = true
        } else {
            state.error = action.payload.problem
        }
        break

    case PUT_SETS + FULFILLED: {
        if (action.payload.ok) {
            state = { ...state }
            for (let i = 0; i < state.today.length; i++) {
                if (state.today[i].id === action.payload.data.id) {
                    state.today[i] = action.payload.data
                    break
                }
            }
        }

        return state
    }

    case GET_MATCH + FULFILLED: {
        state = { ...state }
        if (action.payload.ok && action.payload.data.live) {
            for (let i = 0; i < state.today.length; i++) {
                if (state.today[i].id === action.payload.data.id) {
                    state.today[i].set_points = action.payload.data.set_points
                    state.today[i].set_points_home = action.payload.data.set_points_home
                    state.today[i].set_points_away = action.payload.data.set_points_away
                    break
                }
            }
        }

        return state
    }


    case SCORE + NOTIFICATION:
    case SUGGEST_SCORE + NOTIFICATION: {
        const matchId = parseInt(action.payload.id, 10)
        const data = state.today

        state = { ...state }
        for (let i = 0; i < data.length; i++) {
            if (data[i].id === matchId) {
                data[i].set_points_home = parseInt(action.payload.set_points_home, 10)
                data[i].set_points_away = parseInt(action.payload.set_points_away, 10)
                data[i].live = JSON.parse(action.payload.live)
                break
            }
        }

        return state
    }

    case SCORE_CONFIRMED + NOTIFICATION: {
        const matchId = parseInt(action.payload.id, 10)
        let skipPlayed = false

        state = { ... state }
        for (let i = 0; i < state.today.length; i++) {
            if (state.today[i].id === matchId) {
                state.today[i].score_unconfirmed = JSON.parse(action.payload.score_unconfirmed)
                state.today[i].live = JSON.parse(action.payload.live)
                skipPlayed = true
                break
            }
        }
        console.tron.log('skilp played ' + skipPlayed)
        if (!skipPlayed) {
            for (let i = 0; i < state.played.length; i++) {
                if (state.played[i].id === matchId) {
                    state.played[i].score_unconfirmed = JSON.parse(action.payload.score_unconfirmed)
                    state.played[i].live = JSON.parse(action.payload.live)
                    break
                }
            }
        }

        return state
    }
    }

    return state
}

const reorderMatches = (matches) => {
    let today = []
    const next = []
    const played = []
    const now = new Date().getTime()

    matches.map((match) => {
        if (match.date_confirmed) {
            const diff = compareDays(match.datetime, now)

            if ((match.live && diff > -2) || diff === 0) {
                today.push(match)
            } else if (diff < 0) {
                if (match.set_points) {
                    played.push(match)
                }
            } else if (diff > 0) {
                if (match.set_points) {
                    played.push(match)
                } else {
                    next.push(match)
                }
            }
        }

    })
    today.sort(sortMatches)
    next.sort(sortMatches)
    played.sort((a, b) => {
        let order = b.datetime-a.datetime

        if (order === 0) {
            order = a.league.name < b.league.name ? -1 : 1
        }

        return order
    })

    return {
        next,
        played,
        today
    }
}

const sortMatches = (a, b) => {
    let order = (b.live ? 2 : b.set_points ? 1 : 0) - (a.live ? 2 : a.set_points ? 1 : 0)

    if (order === 0) {
        order = a.datetime-b.datetime
    }
    if (order === 0) {
        order = a.league.name < b.league.name ? -1 : 1
    }

    return order
}