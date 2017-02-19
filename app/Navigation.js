import React, { Component } from 'react';
import { Navigator } from 'react-native';
import * as View from './views';
import * as Route from './views/routes';

class Navigation extends Component {

    constructor(props) {
        super(props)
        this.state = {
            title: ''
        };
    }

    push(route) {
        this.navigator.push(route);
    }

    render() {
        return (
            <Navigator 
                ref={(navigator) => {this.navigator = navigator}} 
            />
        );
    }


    renderScene(route, navigator) {
        switch (route.state) {
            case Route.OVERVIEW:
                return ();
        }
    }
}

export default Navigation;