import { PUT_SETS, API_KEY, TOKEN , PENDING, FULFILLED } from '../actions/types';

export default (state=false, action) => {

    switch (action.type) {
        case API_KEY + PENDING:
        case PUT_SETS + PENDING:
            state = true;
            break;
        case TOKEN + FULFILLED:
        case PUT_SETS + FULFILLED:
            state = false;
            break;
        case API_KEY + FULFILLED:
            if (!action.payload.ok) {
                state = false;
            }
            break;
    }

    return state;
}