import {
	DIALOG_SCORE,
	PUT_SETS,
	PENDING,
	FULFILLED,
	DIALOG_PLAYER,
	DIALOG_SUBMIT,
	CONFIRM_RESULT,
	API_KEY,
	TOKEN,
	QUERY_RANKINGS,
    SHOW_LOGIN
} from '../actions/types';

export default (state={

	score: {
		visible: false,
		loading: false
	},
	player: false,
	submit: {
		visible: false,
		loading: false
	},
    login: {
	    visible: false,
        loading: false
    }
}, action) => {
	switch (action.type) {

		case DIALOG_SCORE:
			state = { ...state, score: { loading: false, visible: action.payload }};
			break;

		case PUT_SETS + PENDING:
			state = { ...state, score: { loading: true, visible: true } };
			break;

		case PUT_SETS + FULFILLED:
			state = { ...state, score: { loading: false, visible: false } };
			break;

		case DIALOG_PLAYER:
			state = { ...state, player: action.payload };
			break;

		case DIALOG_SUBMIT:
			state = { ...state, submit: { visible: action.payload, loading: false }};
			break;
		case CONFIRM_RESULT + PENDING:
			state = { ...state, submit: { visible: true, loading: true }};
			break;
		case CONFIRM_RESULT + FULFILLED:
			state = { ...state, submit: { visible: true, loading: false }};
			break;


        case SHOW_LOGIN:
            state = { ...state, login: { visible: action.payload, loading: false }};
            break;
		case QUERY_RANKINGS + PENDING:
			state = { ...state };
			state.login.loading = true;
			break;
		case QUERY_RANKINGS + FULFILLED:
			state = { ...state };
			state.login.loading = false;
			break;
        case API_KEY + PENDING:
            state = { ...state };
			// state.login.visible = false;
            state.login.loading = true;
            break;
		case API_KEY + FULFILLED: {
			if (!action.payload.ok) {
				state = { ...state, login: { visible: true, loading: false }};
			}
			break;
		}
        case TOKEN + FULFILLED:
            if (action.payload.ok) {
                state = { ...state, login: { visible: false, loading: false}};
            } else {
                state = { ...state, login: { visible: action.payload.status !== 200, loading: false }};
            }

            break;
	}

	return state;
};
