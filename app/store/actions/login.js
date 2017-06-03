// @flow
import { SHOW_LOGIN } from './types';

export function showLogin(loginVisible: boolean): Action {
  return {
    payload: loginVisible,
    type: SHOW_LOGIN,
  };
}
