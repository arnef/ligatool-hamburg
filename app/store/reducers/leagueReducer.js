import { GET_LEAGUE, GET_LEAGUE_MATCHES, PENDING, FULFILLED } from '../actions/types'

export default (state={
    error: null,
    fetchingID: -1,
    id: {},
    loading: false,
    matches: {}
}, action) => {
    switch (action.type) {

        case GET_LEAGUE + PENDING: {
            state = { ...state, error: null, loading: true }
            
            return state
        }
        case GET_LEAGUE + FULFILLED: {
            state = { ...state, loading: false }
            if (action.payload.ok) {
                const league = action.payload.data

                state.id[`${league.id}`] = league
            } else {
                state.error = action.payload.problem
            }
            
            return state
        }

        case GET_LEAGUE_MATCHES + PENDING: {
            state = { ... state, error: null, loading: true }
            state.fetchingID = action.payload
            
            return state
        }
        case GET_LEAGUE_MATCHES + FULFILLED: {
            state = { ...state, loading: false }
            if (action.payload.ok) {
                const matches = action.payload.data

                matches.sort((a, b) => {
                    let sort = (b.set_points ? 1 : 0) - (a.set_points ? 1 : 0)
                    
                    if (sort === 0) {
                        sort = a.datetime - b.datetime
                    }
                    
                    return sort
                })
                state.matches[state.fetchingID] = matches
            } else {
                state.error = action.payload.problem
            }
            state.fetchingID = -1
            
            return state
        }
    }

    return state
}