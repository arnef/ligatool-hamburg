import { SET_NOTIFICATION, SET_GROUP_NOTIFICATION,  SET_USER_TEAM, PUT_NOTIFICATION, LOGOUT, LOAD_SETTINGS, FULFILLED, UPDATE_FCM_TOKEN } from '../actions/types'
import { AsyncStorage } from 'react-native'

const defaultColor = '#ef473a'

export default (state = {
    changed: false,
    color: defaultColor,
    fcm_token: null,
    notification: {},
    team: null
}, action) => {
    switch (action.type) {

        case LOAD_SETTINGS + FULFILLED: {
            if (action.payload.ok) {
                state = { ...state, ...action.payload.data }
            }
            
            return state
        }

        case UPDATE_FCM_TOKEN + FULFILLED: {
            console.tron.log(UPDATE_FCM_TOKEN + ' fired')
            if (action.payload.ok) {
                state = { ...state, fcm_token: action.payload.data.fcm_token }
            }
            
            return state
        }

        case LOGOUT: {
            state = { ...state, color: defaultColor, team: null }
            saveState(state)

            return state
        }

        case SET_NOTIFICATION: {
            state = { ...state }
            state.notification[action.payload.key] = !!action.payload.value
            state.changed = true
            
            return state
        }

        case SET_GROUP_NOTIFICATION: {
            state = { ...state }
            if (!state.notification.leagues) {
                state.notification.leagues = {}
            }
            state.changed = true
            state.notification.leagues[action.payload.key] = action.payload.value
            
            return state
        }

        case PUT_NOTIFICATION + FULFILLED: {
            if (action.payload.ok) {
                state = { ...state }
                state.changed = false
                saveState(state)
            }
            
            return state
        }

        case SET_USER_TEAM: {
            state = { ...state }
            if (!!action.payload.color) {
                state.color = action.payload.color
            }
            state.team = {
                id: action.payload.id,
                image: action.payload.image,
                name: action.payload.name
            }
            saveState(state)
            
            return state
        }
    }

    return state
}

const saveState = (state) => {
    const value = {
        color: state.color,
        notification: state.notification,
        team: state.team
    }
    
    try {
        AsyncStorage.setItem('SETTINGS_V09', JSON.stringify(value))
    } catch (ex) {
        console.tron.warn('Error store settings')
    }
}