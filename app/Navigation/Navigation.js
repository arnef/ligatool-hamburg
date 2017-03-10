import React, { Component } from 'react';
import { Navigator, Platform, StatusBar } from 'react-native';
import { connect } from 'react-redux';
import * as View from '../views';
import * as Route from '../views/routes';
import { Text, Icon } from '../components';
import { Row, Column } from '../ui';
import Touchable from '../components/Touchable/Touchable.ios';
import style from './style';

class Navigation extends Component {

    constructor(props) {
        super(props);
        if (this.props.getNav) {
            // ref fix for android
            this.props.getNav(this);
			console.tron.log('ref is in props');
		}
    }

    render() {
        
        return (
            <Column style={this.props.topBorder ? { borderTopWidth: 25, borderTopColor: this.props.settings.color } : {}}>
            <Navigator
                style={{flexDirection: 'column-reverse'}}
                ref={(navigator) => { this.navigator = navigator }}
                initialRoute={this.props.initialRoute}
                renderScene={this.props.renderScene ? this.renderSceneProps.bind(this) : this.renderScene.bind(this)}
                navigationBar={
                    <Navigator.NavigationBar routeMapper={{
                        LeftButton: this.renderLeftButton.bind(this),
                        RightButton: () => { return (<Text color='#fff'>{ __DEV__ ? 'DEV':''}</Text>)},
                        Title: this.renderTitle.bind(this)
                    }}
                    style={[style.toolbar, { 
                        position: 'relative', 
                        backgroundColor: this.props.settings.color }]} />
                }
            />
            </Column>
        );
    }

    renderSceneProps(route) {
        return this.props.renderScene(route, this);
    }

    resetTo(route) {
        this.setState({ title: null }); 
        this.navigator.resetTo(route);
    }


    push(route) {
        if (!route.title) {
            route.title = titles[route.state];
        }
        this.navigator.push(route);
    }


    pop() {
        this.navigator.pop();
    }

    getCurrentRoutes() {
        return this.navigator.getCurrentRoutes();
    }

    setTitle(title) {
        if (this.navigator && this.navigator.getCurrentRoutes) {
            const stack = this.navigator.getCurrentRoutes();
            if (stack.length > 0) {
                stack[stack.length - 1].title = title;
                this.forceUpdate();
            }
        }
    }

    renderLeftButton(route, navigator, index, navState) {
        if (index > 0) {
            return (
                <Touchable style={style.leftButton} onPress={this.pop.bind(this)}>
                    <Icon size={24} color='#fff' name='arrow-back' />
                </Touchable>
            );
        } else if (index === 0 && this.props.drawer) {
            return (
                <Touchable style={style.leftButton} onPress={() => { 
                    this.props.drawer.openDrawer();
                }}>
                    <Icon size={24} color='#fff' name='menu' />
                </Touchable>
            );
        } else if (index === 0 && this.props.closeModal) {
            return (
                <Touchable style={style.leftButton} onPress={this.props.closeModal}>
                    <Icon size={24} color='#fff' name='close' />
                </Touchable>
            )
        }
    }

    renderTitle(route, navigator, index, navState) {
        return (
            <Row style={style.title}>
                <Text color='#fff' bold size={Platform.OS === 'ios' ? 17 : 20} numberOfLines={1} ellipsizeMode='tail'>{ route.title }</Text>
            </Row>
        );
    }

    renderScene(route, navigator) {
        switch (route.state) {
            case Route.OVERVIEW:
                return (<View.Overview {...this.props} navigator={this} id={route.id} vid={route.vid} />);
            case Route.LIVE_MATCH:
                return (<View.LiveMatch {...this.props} navigator={this} id={route.id} vid={route.vid} />);
            case Route.MY_TEAM:
                return (<View.MyTeam {...this.props} navigator={this} />);
            case Route.LEAGUES:
                return (<View.Leagues { ...this.props} navigator={this} />)
            case Route.MATCH:
                return (<View.Match {...this.props} navigator={this} id={route.id} vid={route.vid} />);
            case Route.RANKING:
                return (<View.LeagueView {...this.props} navigator={this} leagueID={route.leagueID} />);
            case Route.TEAM:
                return (<View.TeamOverview {...this.props} navigator={this} team={route.team} />);
            case Route.PREVIEW:
                return (<View.PreviewMatch { ...this.props} navigator={this} home={route.home} away={route.away} />);
            case Route.SETTINGS:
                return (<View.Settings.SettingsView {...this.props} navigator={this} />);
            case Route.SETTINGS_NOTIFICATION:
                return (<View.Settings.SettingsNotificationView { ...this.props } navigator={this} />);
        }
    }

}


const titles = {};
titles[Route.OVERVIEW] = 'Übersicht';
titles[Route.LIVE_MATCH] = 'Begegnung';
titles[Route.MY_TEAM] = 'Mein Team';
titles[Route.MATCH] = 'Spiel eintragen';
titles[Route.LEAGUES] = 'Gruppen';
titles[Route.SETTINGS] = 'Einstellungen';
titles[Route.SETTINGS_NOTIFICATION] = 'Gruppen wählen';

Navigation.propTypes = {
    initialRoute: React.PropTypes.object,
    topBorder: React.PropTypes.bool,
    drawer: React.PropTypes.object,
    bottomTabBar: React.PropTypes.bool,
    settings: React.PropTypes.object
};


export default connect(state => ({
    ...state
}))(Navigation);