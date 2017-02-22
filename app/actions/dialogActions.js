import { DIALOG_SCORE, DIALOG_PLAYER, DIALOG_SUBMIT } from './types';

export const showScoreDialog = () => {
	return {
		type: DIALOG_SCORE,
		payload: true
	};
};

export const hideScoreDialog = () => {
	return {
		type: DIALOG_SCORE,
		payload: false
	};
};

export const showPlayerDialog = () => {
	return {
		type: DIALOG_PLAYER,
		payload: true
	};
};
export const hidePlayerDialog = () => {
	return {
		type: DIALOG_PLAYER,
		payload: false
	};
};
