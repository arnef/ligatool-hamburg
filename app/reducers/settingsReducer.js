import {
    SET_SETTINGS,
    SET_UI_COLOR,
    SET_NOTIFICATION,
    SET_GROUP_NOTIFICATION,
    SET_DEVICE_TOKEN,
    SET_USER_TEAM,
    PUT_NOTIFICATION,
    LOGOUT,
    TOKEN,
    LOAD_TOKEN,
    LOAD_SETTINGS,
    FULFILLED,
    UPDATE_FCM_TOKEN
} from '../actions/types';

const defaultColor = '#ef473a';
import {AsyncStorage} from 'react-native';

export default (state = {
    fcm_token: null,
    team: null,
    color: defaultColor,
    changed: false,
    notification: {}
}, action) => {
    switch (action.type) {
        case LOAD_SETTINGS + FULFILLED: {
            if (action.payload.ok) {
                state = {...state, ...action.payload.data};
            }

            break;
        }
        case UPDATE_FCM_TOKEN + FULFILLED:
            if (action.payload.ok) {
                state = { ...state, fcm_token: action.payload.data.fcm_token };
            }
            break;

        case LOGOUT:
            state = {...state, color: defaultColor, team: null};
            saveState(state);
            break;

        case SET_NOTIFICATION:
            state = { ...state };
            state.notification[action.payload.key] = !!action.payload.value;
            state.changed = true;
            break;
        case SET_GROUP_NOTIFICATION:
            state = { ...state };
            if (!state.notification.leagues) {
                state.notification.leagues = {};
            }
            state.changed = true;
            state.notification.leagues[action.payload.key] = action.payload.value;
            break;
        case PUT_NOTIFICATION + FULFILLED:
            if (action.payload.ok) {
                state = { ...state };
                state.changed = false;
                saveState(state);
            }
            break;
        case SET_USER_TEAM: 
            state = { ...state };
            if (!!action.payload.color) {
                state.color = action.payload.color
            }
            state.team = {
                name: action.payload.name,
                id: action.payload.id,
                image: action.payload.image
            }
            saveState(state);
            break;
        // case LOAD_TOKEN + FULFILLED:
        // case TOKEN + FULFILLED:
        //     state = {...state };
        //     if (action.payload.ok && action.payload.data.color) {
        //         state.color = action.payload.data.color;
        //     }
        //     break;
    }
    // if (__DEV__) {
    //     state.color = 'orange';
    // }
    return state;
};

const saveState = (state) => {
    const value = {
        notification: state.notification,
        color: state.color,
        team: state.team
    };
    try {
        AsyncStorage.setItem('SETTINGS_V09', JSON.stringify(value));
    } catch (ex) {
        console.tron.warn('Error store settings');
    }
};