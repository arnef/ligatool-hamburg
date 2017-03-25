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
    player: {
        data: {},
        visible: false
    }
}, action) => {
    switch (action.type) {

    case DIALOG_PLAYER: {
        if (action.payload) {
            state = { ...state, player: { data: action.payload.data, visible: true } }
        } else {
            state = { ...state, player: { data: {}, visible: false } }
        }

        return state
    }


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
