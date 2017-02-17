import {
	DIALOG_SCORE,
	DIALOG_PLAYER,
	DIALOG_SUBMIT,
	DIALOG_UPDATE
} from './types';


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


export const showSubmitDialog = () => {
	return {
		type: DIALOG_SUBMIT,
		payload: true
	};
};

export const hideSubmitDialog = () => {
	return {
		type: DIALOG_SUBMIT,
		payload: false
	};
};

// export const showUpdateDialog = () => {
// 	return {
// 		type: DIALOG_UPDATE,
// 		payload: true
// 	};
// };
// export const hideUpdateDialog = () => {
// 	return {
// 		type: DIALOG_UPDATE,
// 		payload: false
// 	};
// };
