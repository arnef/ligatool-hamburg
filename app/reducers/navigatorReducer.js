import { SET_TOOLBAR_TITLE, SCORE_CONFIRMED, NOTIFICATION } from '../actions/types';


export default (state={ title: 'Übersicht' }, action) => {
    switch (action.type) {
        case SET_TOOLBAR_TITLE:
            state = { ...state, title: action.payload };
            break;
        case SCORE_CONFIRMED + NOTIFICATION:
            if (state.title === 'Spiel eintragen') {
                state = { ...state, title: 'Begegnung'};
            }
            break;
    }    
    return state;
};