import { PUT_SETS, LOGOUT, PENDING, FULFILLED } from '../actions/types'

export default (state=false, action) => {
    switch (action.type) {

    case LOGOUT + PENDING:
    case PUT_SETS + PENDING: {
        state = true

        return state
    }

    case LOGOUT + FULFILLED:
    case PUT_SETS + FULFILLED: {
        state = false

        return state
    }
    }

    return state
}