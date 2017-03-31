import React, { Component, PropTypes } from 'react'
import { TextInput, StyleSheet, View, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'
import actions from '../../store/actions'
import { Container } from '../../components'
import { ListItem, Row, Column, Button, Text } from '../../components/base'
import * as theme from '../../components/base/theme'
import { NavigationActions } from 'react-navigation'
import { CLIENT_ERROR } from 'apisauce'

class LoginView extends Component {

    constructor(props) {
        super(props)
        this.state = {
            pass: '',
            user: ''
        }
    }


    componentWillReceiveProps(nextProps) {
        this.apiKeyFullfilled(nextProps)
        this.loginFullfiled(nextProps)
    }

    render() {
        const loading = this.props.dialog.login.loading

        return (
            <Container>
                <Row style={{ paddingTop: 8 }}>
                    <Column>
                        <Text>Zugangsdaten für das Liga-Tool.</Text>
                        <Text>Wenn diese nicht eingetragen werden, können keine Spiele eingetragen werden.</Text>
                    </Column>
                </Row>
            <ListItem.Group>
                <Row style={{ paddingBottom: 0 }}>
                    <Column>
                        <TextInput placeholder='Username'
                            ref='UserInput'
                            autoCapitalize='none'
                            style={styles.input}
                            editable={!this.props.auth.loading}
                            blurOnSubmit={false}
                            underlineColorAndroid='#fff'
                            autoCorrect={false}
                            selectTextOnFocus={true}
                            onChangeText={(text) => {
                                this.setState({ user: text })
                            }}
                            onSubmitEditing={ () => {
                                this.refs.PassInput.focus()
                            }}
                            returnKeyLabel='next' />
                            <View style={styles.separator} />
                        <TextInput placeholder='Passwort'
                            ref='PassInput'
                            style={styles.input}
                            selectTextOnFocus={true}
                            underlineColorAndroid='#fff'
                            editable={!this.props.auth.loading}
                            secureTextEntry={true}
                            keyboardAppearance='dark'
                            onChangeText={(text) => {
                                this.setState({ pass: text })
                            }}
                            onSubmitEditing={this.login.bind(this)}
                            returnKeyType='send' />
                    </Column>
                </Row>
                </ListItem.Group>

                { !loading && (

                <Row center>
                    <Column>
                        <Button
                            onPress={this.closeModal.bind(this)}>
                            { !!this.props.init ? 'Abbrechen' : 'Überspringen' }
                        </Button>
                    </Column>
                    <Column fluid style={{ width: 8 }} />
                    <Column>
                        <Button
                            disabled={!this.state.user || !this.state.pass}
                            onPress={this.login.bind(this)}>
                            Anmelden
                        </Button>
                    </Column>
                </Row>
                )}

                { loading && (
                    <Row center>
                        <Column style={{ marginVertical: 16 }}>
                        <ActivityIndicator color={this.props.settings.color} />
                        </Column>
                    </Row>
                )}

                { this.props.auth.error === CLIENT_ERROR && (
                    <Row style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
                        <Text color='red'>Fehler beim Anmelden. Überprüfe deine Zugangsdaten.</Text>
                    </Row>
                )}
            </Container>
        )
    }

    closeModal() {
        console.tron.log('close modal')
        this.props.closeModal()
        // this.props.showLogin(false)
    }

    login() {
        if (this.state.user !== '' && this.state.pass !== '') {
            const loginUser = {
                password: this.state.pass,
                username: this.state.user
            }

            this.props.requestAPIKey(loginUser)
        }
    }

    apiKeyFullfilled(nextProps) {
        if (this.props.auth.api_key === null && nextProps.auth.api_key !== null) {
            nextProps.renewToken(nextProps.auth.api_key)
        }
    }

    loginFullfiled(nextProps) {
        // console.tron.log('logon fullfiled')
        // if (this.props.dialog.login.visible && !nextProps.dialog.login.visible) {
        //     this.setState({
        //         pass: '',
        //         user: ''
        //     })
        //     this.closeModal()
        // }
    }
}

const styles = StyleSheet.create({
    input: {
        height: 40
    },
    separator: {
        backgroundColor: theme.backgroundColor,
        height: 1
    }
})

LoginView.propTypes = {
    auth: PropTypes.object,
    dialog: PropTypes.object,
    init: PropTypes.bool,
    renewToken: PropTypes.func,
    requestAPIKey: PropTypes.func,
    settings: PropTypes.object,
    showLogin: PropTypes.func
}

LoginView.navigationOptions = {
    title: 'Login'
}

export default connect(
    state => ({
        auth: state.auth,
        dialog: state.dialog,
        settings: state.settings
    }),
    dispatch => ({
        renewToken: (apiKey) => dispatch(actions.renewToken(apiKey)),
        requestAPIKey: (user) => dispatch(actions.requestAPIKey(user)),
        showLogin: (show) => dispatch(actions.showLogin(show)),
        closeModal: () => dispatch({ type: 'CLOSE_LOGIN_MODAL' })
    })
)(LoginView)