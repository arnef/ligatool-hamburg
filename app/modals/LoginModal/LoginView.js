import React, { Component } from 'react';
import { Dimensions, TextInput, ActivityIndicator } from 'react-native';
import { Container, Text } from '../../components';
import { Row, Column, Button } from '../../ui';
import { ListItemGroup } from '../../components/List';
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
        if (this.props.auth.loading) {
            return (
                <Row center style={{height: Dimensions.get('window').height - 120}}>
                    <Column center>
                        <ActivityIndicator color={this.props.settings.color} size='large' />
                    </Column>
                </Row>
            )
        }
        return (
            <Container>
            <ListItemGroup>
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
                            autoFocus
                            style={style.input}
                            editable={!this.props.auth.loading}
                            blurOnSubmit={false}                        
                            autoCorrect={false}
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
                            editable={!this.props.auth.loading}
                            secureTextEntry={true}
                            onChangeText={(text) => {
                                this.setState({ pass: text })
                            }}
                            returnKeyType='send' />
                        <Row style={style.form} />
                    </Column>
                </Row>
                <Row style={{paddingHorizontal: 16, paddingVertical: 8}}>
                    <Column>
                        <Button block 
                            onPress={this.closeModal.bind(this)}>
                            Überspringen
                        </Button>
                    </Column>
                    <Column fluid style={{width: 8}} />
                    <Column>
                        <Button primary block 
                            disabled={!this.state.user && !this.state.pass}
                            onPress={this.login.bind(this)}>
                            Login
                        </Button>
                    </Column>
                </Row>
            </ListItemGroup>
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