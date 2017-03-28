import { SHOW_LOGIN } from './types'

export function showLogin(loginVisible) {
    return {
        payload: loginVisible,
        type: SHOW_LOGIN
    }
}
