import {
    // DIALOG_SCORE,
    // PUT_SETS,
    PENDING,
    FULFILLED,
    DIALOG_PLAYER,
    // DIALOG_SUBMIT,
    // CONFIRM_RESULT,
    API_KEY,
    TOKEN,
    QUERY_RANKINGS,
    SHOW_LOGIN
} from '../actions/types'

export default (state={
    login: {
        loading: false,
        visible: false
    },
    player: false    
}, action) => {
    switch (action.type) {

        // case DIALOG_SCORE: {
        //     state = { ...state, score: { loading: false, visible: action.payload } }
            
        //     return state
        // }

        // case PUT_SETS + PENDING: {
        //     state = { ...state, score: { loading: true, visible: true } }
            
        //     return state
        // }

        // case PUT_SETS + FULFILLED: {
        //     state = { ...state, score: { loading: false, visible: false } }
            
        //     return state
        // }

        case DIALOG_PLAYER: {
            state = { ...state, player: action.payload }
            
            return state
        }

        // case DIALOG_SUBMIT:
        //     state = { ...state, submit: { visible: action.payload, loading: false }}
        //     break
        // case CONFIRM_RESULT + PENDING:
        //     state = { ...state, submit: { visible: true, loading: true }}
        //     break
        // case CONFIRM_RESULT + FULFILLED:
        //     state = { ...state, submit: { visible: true, loading: false }}
        //     break


        case SHOW_LOGIN: {
            state = { ...state, login: { loading: false, visible: action.payload } }
            
            return state
        }

        case QUERY_RANKINGS + PENDING: {
            state = { ...state }
            state.login.loading = true
            
            return state
        }

        case QUERY_RANKINGS + FULFILLED: {
            state = { ...state }
            state.login.loading = false
            
            return state
        }

        case API_KEY + PENDING: {
            state = { ...state }
            state.login.loading = true
            
            return state
        }

        case API_KEY + FULFILLED: {
            if (!action.payload.ok) {
                state = { ...state, login: { loading: false }, visible: true }
            }

            return state
        }

        case TOKEN + FULFILLED: {
            if (action.payload.ok) {
                state = { ...state, login: { loading: false, visible: false } }
            } else {
                state = { ...state, login: { 
                    loading: false,
                    visible: action.payload.status !== 200 } 
                }
            }

            return state
        }
    }

    return state
}
