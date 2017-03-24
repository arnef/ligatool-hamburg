import React, { Component, PropTypes } from 'react'
import { Modal } from 'react-native'
import { connect } from 'react-redux'
import actions from '../../store/actions'
import Navigator from '../Navigation'
import SelectGroupView from './SelectGroupView'
import SelectTeamView from './SelectTeamView'
import LoginView from './LoginView'
import { MODAL_SELECT_TEAM, MODAL_SELECT_GROUP, MODAL_LOGIN } from '../../views/routes'
// export const ROUTE_SELECT_GROUP = 'ROUTE.SELECT_GROUP'
// export const ROUTE_SELECT_TEAM = 'ROUTE.SELECT_TEAM'
// export const ROUTE_LOGIN = 'ROUTE.LOGIN'

class LoginModal extends Component {

    _onRequestClose() {
        this.props.showLogin(false)
        if (this.props.onClose) {
            this.props.onClose()
        }
    }

    render() {
        let initState = { state: MODAL_SELECT_GROUP, title: 'Gruppe wählen' }

        if (this.props.settings.team) {
            initState = { init: true, state: MODAL_LOGIN, title: 'Login' }
        }

        return (
            <Modal
                animationType='slide'
                onRequestClose={this._onRequestClose.bind(this)}
                visible={this.props.dialog.login.visible}>
                <Navigator
                    { ...this.props }
                    closeModal={this._onRequestClose.bind(this)}
                    initialRoute={initState}
                    renderScene={this.renderScene.bind(this)}
                    />
            </Modal>
        )
    }

    renderScene(route, navigator) {
        console.tron.log(route)
        switch (route.state) {
        case MODAL_SELECT_GROUP:

            return (<SelectGroupView navigator={navigator} />)

        case MODAL_SELECT_TEAM:

            return (<SelectTeamView navigator={navigator} id={route.id} />)

        case MODAL_LOGIN:

            return (<LoginView navigator={navigator} init={route.init} />)
        }
    }
}


LoginModal.propTypes = {
    dialog: PropTypes.object,
    onClose: PropTypes.func,
    settings: PropTypes.object,
    showLogin: PropTypes.func
}

export default connect(
    state => ({
        dialog: state.dialog,
        settings: state.settings
    }),
    dispatch => ({
        showLogin: (show) => dispatch(actions.showLogin(show))
    })
)(LoginModal)