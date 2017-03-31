import { TOKEN, FULFILLED } from '../actions/types'
import Navigator from '../../Navigator'
import { NavigationActions } from 'react-navigation'

export default (state, action) => {
    switch (action.type) {
    case 'CLOSE_LOGIN_MODAL': {
        console.tron.log('close login modal')

        return Navigator.router.getStateForAction(
            { type:  NavigationActions.BACK }
        )
    }
    case TOKEN + FULFILLED: {
        if (action.payload.ok) {
            return Navigator.router.getStateForAction(
                NavigationActions.back()
            )
        }
    }
    default: {
        if (console.tron) console.tron.log(action)
        return Navigator.router.getStateForAction(action, state)
    }
    }
}