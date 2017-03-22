import { QUERY_RANKINGS, FULFILLED, PENDING } from '../actions/types'

export default (state = {
    data: [],
    error: null,
    fetched: false,
    loading: false
}, action) => {
    switch (action.type) {

        case QUERY_RANKINGS + PENDING: {
            state = { ...state, error: null, loading: true }
            
            return state
        }

        case QUERY_RANKINGS + FULFILLED:
            if (action.payload.ok) {
                state = { ...state, 
                    data: action.payload.data,
                    error: null, 
                    fetched: true, 
                    loading: false 
                }
            } else {
                state = { ...state, error: action.payload.problem, loading: false }
            }
            
            return state
    }

    return state
}
