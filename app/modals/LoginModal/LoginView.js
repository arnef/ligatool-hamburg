import React, { Component } from 'react';
import { TextInput, StyleSheet, Platform, View, ActivityIndicator } from 'react-native';
import { Container } from '../../components';
import { ListItem, Row, Column, Button, Text } from '../../components/base';
import * as theme from '../../components/base/theme';
// import style from '../../style';
import { CLIENT_ERROR } from 'apisauce';

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
            <Container>
                <Row style={{paddingTop: 8}}>
                    <Column>
                        <Text>Zugangsdaten für das Liga-Tool.</Text>
                        <Text>Wenn diese nicht eingetragen werden, können keine Spiele eingetragen werden.</Text>
                    </Column>
                </Row>
            <ListItem.Group>
                <Row style={{paddingBottom: 0}}>
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
                                this.setState({ user: text });
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
                    <Column fluid style={{width: 8}} />
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
                        <Column style={{marginVertical: 16}}>
                        <ActivityIndicator color={this.props.settings.color} />
                        </Column>
                    </Row>
                )}

                { this.props.auth.error === CLIENT_ERROR && (
                    <Row style={{paddingHorizontal: 16, paddingVertical: 8}}>
                        <Text color='red'>Fehler beim Anmelden. Überprüfe deine Zugangsdaten.</Text>
                    </Row>
                )}
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

const styles = StyleSheet.create({
    input: Platform.select({
        ios: {
            height: 40,
        },
        android: {
            height: 40
        }
    }),
    separator: {
        height: 1,
        backgroundColor: theme.backgroundColor
    }
})

export default LoginView;