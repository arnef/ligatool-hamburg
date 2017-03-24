import React, { Component } from 'react'
import { AppRegistry } from 'react-native'
import { Provider } from 'react-redux'
import codePush from 'react-native-code-push'
import AppContainer from './app/AppContainer'

import store from './app/store'


class androidapp extends Component {

    render() {
        return (
            <Provider store={store}>
                <AppContainer />
            </Provider>
        )
    }
}
const codePushOptions = { checkFrequency: codePush.CheckFrequency.ON_APP_RESUME }

AppRegistry.registerComponent('arnefeilligatool', () => codePush(codePushOptions)(androidapp))
