// @flow
import { INIT_APP, FULFILLED } from '../actions/types';

export default (state: boolean = false, action: Action) => {
  switch (action.type) {

    case INIT_APP + FULFILLED: {
        state = true;

        return state;
    }
  }

  return state;
}
