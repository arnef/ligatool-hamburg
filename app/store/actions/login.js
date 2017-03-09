import { SHOW_LOGIN } from './types';

export function showLogin(loginVisible) {
	return {
		type: SHOW_LOGIN,
		payload: loginVisible
	};
}
