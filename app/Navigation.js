import React, { Component } from 'react';
import { Navigator } from 'react-native';
import * as View from './views';
import * as Route from './views/routes';
import { Row, Text, Icon } from './components';
import Touchable from './components/Touchable';

class Navigation extends Component {


    push(route) {
        // if (!route.title) {
        //     route.title = titles[route.state];
        // }
        this.navigator.push(route);
    }

    pop() {
        this.navigator.pop();
    }

    render() {
        return (
            <Navigator
                style={{flexDirection: 'column-reverse'}}
                ref={(navigator) => { this.navigator = navigator }}
                initialRoute={this.props.initialRoute}
                renderScene={this.renderScene.bind(this)}
                navigationBar={
                    <Navigator.NavigationBar routeMapper={{
                        LeftButton: this.renderLeftButton.bind(this),
                        RightButton: () => {},
                        Title: this.renderTitle.bind(this)
                    }}
                    style={{ position: 'relative', backgroundColor: 'blue' }} />
                }
            />
        );
    }

    renderLeftButton(route, navigator, index, navState) {
        if (index > 0) {
            return (
                <Touchable style={{padding: 10}} onPress={this.pop.bind(this)}>
                    <Icon size={24} color='#fff' name='arrow-back' />
                </Touchable>
            )
        }
    }

    renderTitle(route, navigator, index, navState) {
        return (
            <Row style={{padding: 10}}>
                <Text color='#fff' bold size={18}>{route.title}</Text>
            </Row>
        );
    }

    renderScene(route, navigator) {
        switch (route.state) {
            case Route.OVERVIEW:
                return (<View.Overview {...this.props} navigator={navigator} id={route.id} vid={route.vid} />);
            case Route.LIVE_MATCH:
                return (<View.LiveMatch {...this.props} navigator={navigator} id={route.id} vid={route.vid} />);
            case Route.MY_TEAM:
                return (<View.MyTeam {...this.props} navigator={navigator} />);
            case Route.LEAGUES:
                return (<View.Leagues { ...this.props} navigator={navigator} />)
            case Route.MATCH:
                return (<View.Match {...this.props} navigator={navigator} id={route.id} vid={route.vid} />);
            case Route.RANKING:
                return (<View.Table {...this.props} navigator={navigator} leagueID={route.leagueID} />);
            case Route.TEAM:
                return (<View.Team {...this.props} navigator={navigator} team={route.team} />);
            case Route.PREVIEW:
                return (<View.PreviewMatch { ...this.props} navigator={navigator} home={route.home} away={route.away} />);
            case Route.SETTINGS:
                return (<View.Settings.SettingsView {...this.props} navigator={navigator} />);
            case Route.SETTINGS_NOTIFICATION:
                return (<View.Settings.SettingsNotificationView { ...this.props } navigator={navigator} />);
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
    initialRoute: React.PropTypes.object
}


export default Navigation;