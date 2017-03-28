import { GET_TEAM, GET_TEAM_MATCHES, FULFILLED, PENDING } from '../actions/types'

const defaultState = {
    error: null,
    id: {},
    loading: false,
    pendingID: -1
}

export default (state=defaultState, action) => {
    switch (action.type) {

    case GET_TEAM + PENDING: {
        state = { ...state, error: null, loading: true }

        return state
    }

    case GET_TEAM + FULFILLED: {
        state = { ...state, loading: false }
        if (action.payload.ok) {
            if (!state.id[`${action.payload.data.id}`]) {
                state.id[`${action.payload.data.id}`] = { details: {}, matches: [] }
            }
            state.id[`${action.payload.data.id}`].details = action.payload.data
        } else {
            state.error = action.payload.problem
        }

        return state
    }

    case GET_TEAM_MATCHES + PENDING: {
        state = { ...state, error: null, loading: true, pendingID: action.payload }

        return state
    }

    case GET_TEAM_MATCHES + FULFILLED: {
        state = { ...state, loading: false }
        if (action.payload.ok) {
            const teamID = state.pendingID

            if (!state.id[`${teamID}`]) {
                state.id[`${teamID}`] = { details: {}, matches: [] }
            }
            state.id[`${teamID}`].matches = action.payload.data
        } else {
            state.error = action.payload.problem
        }
        state.pendingID = -1

        return state
    }
    }

    return state
}