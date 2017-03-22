import { PUT_SETS, PENDING, FULFILLED } from '../actions/types'

export default (state=false, action) => {
    switch (action.type) {

        case PUT_SETS + PENDING: {
            state = true
            
            return state
        }

        case PUT_SETS + FULFILLED: {
            state = false
            
            return state
        }
    }

    return state
}