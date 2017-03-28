import { API_KEY, TOKEN, FULFILLED, LOGOUT, LOAD_ACCESS_KEY, PENDING, LOAD_TOKEN } from '../actions/types'
import { AsyncStorage } from 'react-native'
import api from '../../api'
import { DEFAULT_HEADERS } from 'apisauce'

export default (state={
    api_key: null,
    error: null,
    loading: false,
    team: null
}, action) => {
    switch (action.type) {
    case TOKEN + PENDING:
    case API_KEY + PENDING: {
        state = { ...state, error: null, loading: true }

        return state
    }

    case API_KEY + FULFILLED: {
        state = { ...state }
        if (action.payload.ok) {
            state.api_key = action.payload.data.access_key
            save(API_KEY, state.api_key)
        } else {
            state.loading = false
            state.error = action.payload.problem
        }

        return state
    }

    case TOKEN + FULFILLED: {
        state = { ...state, loading: false }
        if (action.payload.ok) {
            state.team = action.payload.data
            api.setHeader('Secret', state.team.token)
            save(TOKEN, state.team)
        } else {
            state.error = action.payload.problem
        }

        return state
    }

    case LOAD_ACCESS_KEY + FULFILLED: {
        if (action.payload.ok) {
            state = { ...state, api_key: action.payload.data }
        }

        return state
    }

    case LOAD_TOKEN + FULFILLED: {
        if (action.payload.ok) {
            state = { ...state, team: action.payload.data }
            api.setHeader('Secret', state.team.token)
        }

        return state
    }

    case LOGOUT: {
        api.setHeaders(DEFAULT_HEADERS)
        state = { api_key: null, team: null }
        try {
            AsyncStorage.removeItem(TOKEN)
            AsyncStorage.removeItem(API_KEY)
        } catch (ex) { console.tron.error(ex) }

        return state
    }
    }

    return state
}

const save = (key, value) => {
    try {
        if (value !== null) {
            AsyncStorage.setItem(key, JSON.stringify(value))
        }
    } catch (ex) {
        console.tron.warn(ex)
    }
}