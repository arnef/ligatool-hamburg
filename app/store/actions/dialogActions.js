import { DIALOG_SCORE, DIALOG_PLAYER } from './types'

export const showScoreDialog = () => {
    return {
        payload: true,
        type: DIALOG_SCORE
    }
}

export const hideScoreDialog = () => {
    return {
        payload: false,
        type: DIALOG_SCORE
    }
}

export const showPlayerDialog = (data) => {
    return {
        payload: { data },
        type: DIALOG_PLAYER
    }
}
export const hidePlayerDialog = () => {
    return {
        payload: false,
        type: DIALOG_PLAYER
    }
}
