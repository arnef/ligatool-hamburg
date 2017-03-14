import React, { Component } from 'react';
import { TextInput, ActivityIndicator } from 'react-native';
import { Container } from '../../components';
import { ListItem, Row, Column, Button, Text } from '../../ui';
import style from '../../style';

class LoginView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: '',
            pass: ''
        };
    }


    componentWillReceiveProps(nextProps) {
        this.apiKeyFullfilled(nextProps);
        this.loginFullfiled(nextProps);
    }

    render() {
        const loading = this.props.dialog.login.loading;
        return (
            <Container keyboardShouldPersistTaps='handled'>
            <ListItem.Group>
                <Row style={{paddingHorizontal: 16, paddingVertical: 8}}>
                    <Column>
                        <Text>Zugangsdaten für das Liga-Tool.</Text>
                        <Text>Wenn diese nicht eingetragen werden, können keine Spiele eingetragen werden.</Text>
                    </Column>
                </Row>
                <Row>
                    <Column>
                        <Row style={style.form} />
                        <TextInput placeholder='Username'
                            ref='UserInput'
                            autoCapitalize='none'
                            style={style.input}
                            editable={!this.props.auth.loading}
                            blurOnSubmit={false}                        
                            autoCorrect={false}
                            selectTextOnFocus={true}
                            onChangeText={(text) => {
                                this.setState({ user: text });
                            }}
                            onSubmitEditing={ () => {
                                this.refs.PassInput.focus()
                            }}
                            returnKeyLabel='next' />
                        <Row style={style.formSeparator} />
                        <TextInput placeholder='Passwort'
                            ref='PassInput'      
                            style={style.input}      
                            selectTextOnFocus={true}                
                            editable={!this.props.auth.loading}
                            secureTextEntry={true}
                            keyboardAppearance='dark'
                            onChangeText={(text) => {
                                this.setState({ pass: text })
                            }}
                            onSubmitEditing={this.login.bind(this)}
                            returnKeyType='send' />
                        <Row style={style.form} />
                    </Column>
                </Row>
                <Row style={{paddingHorizontal: 16, paddingVertical: 8}} center>
                    <Column>
                        <Button
                            disabled={loading}
                            onPress={this.closeModal.bind(this)}>
                            { !!this.props.init ? 'Abbrechen' : 'Überspringen' }
                        </Button>
                    </Column>
                    <Column fluid style={{width: 8}} />
                    <Column>
                        { !loading && (
                        <Button
                            disabled={!this.state.user || !this.state.pass}
                            onPress={this.login.bind(this)}>
                            Anmelden
                        </Button>
                        )}
                        { loading && (<ActivityIndicator  color={this.props.settings.color} />)}
                    </Column>
                </Row>
            </ListItem.Group>
            </Container>
        );
    }   

    closeModal() {
        this.props.showLogin(false);
    }

    login() {
        if (this.state.user !== '' && this.state.pass !== '') {
            const loginUser = {
                username: this.state.user,
                password: this.state.pass
            };
            this.props.requestAPIKey(loginUser);
        }
    }

    apiKeyFullfilled(nextProps) {
        if (this.props.auth.api_key === null && nextProps.auth.api_key !== null) {
            nextProps.renewToken(nextProps.auth.api_key);
        }
    }

    loginFullfiled(nextProps) {
        if (this.props.dialog.login.visible && !nextProps.dialog.login.visible) {
            this.setState({
                user: '',
                pass: ''
            });   
        }
    }

}

export default LoginView;