import React, { Component } from 'react'
import { AppRegistry } from 'react-native'
import { Provider } from 'react-redux'
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


AppRegistry.registerComponent('arnefeilligatool', () => androidapp)
