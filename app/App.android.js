import React, { Component } from 'react';
import { DrawerLayoutAndroid, Navigator, BackAndroid, Dimensions } from 'react-native';
import LoginModal from './modals/LoginModal';
import { Toolbar } from './components';
import * as Views from './views';
import * as Route from './views/routes';
import Navigation from './Navigation';

const windowWidth = Math.floor(Dimensions.get('window').width * 0.8);
const drawerWidth = windowWidth < 300 ? windowWidth : 300;

class App extends Component {


	// _renderScene(route, navigator) {
	// 	switch (route.state) {
	// 		case Route.OVERVIEW:
	// 			return (<Views.Overview {...this.props} navigator={navigator} id={route.id} vid={route.vid}/>);
    //   case Route.LIVE_MATCH:
    //     return (<Views.LiveMatch {...this.props} navigator={navigator} id={route.id} vid={route.vid}/>);
	// 		case Route.MY_TEAM:
	// 			return (<Views.MyTeam {...this.props} navigator={navigator} />);
    //   case Route.LEAGUES:
    //     return (<Views.Leagues { ...this.props} navigator={navigator} />)
	// 		case Route.MATCH:
	// 			return (<Views.Match {...this.props} navigator={navigator} id={route.id} vid={route.vid	} />);
	// 		case Route.RANKING:
	// 			return (<Views.Table {...this.props} navigator={navigator} leagueID={route.leagueID} />);
	// 		case Route.TEAM:
	// 			return (<Views.Team {...this.props} navigator={navigator} team={route.team} />);
	// 		case Route.PREVIEW:
	// 			return (<Views.PreviewMatch { ...this.props} navigator={navigator} home={route.home} away={route.away} />);
	// 		case Route.SETTINGS:
	// 			return (<Views.Settings.SettingsView {...this.props} navigator={navigator} />);
	// 		case Route.SETTINGS_NOTIFICATION:
	// 			return (<Views.Settings.SettingsNotificationView { ...this.props } navigator={navigator} />);
	// 	}
	// }

	_onNavigate(action) {
		console.tron.log('_onNavigate');
		if (this.drawer) {
			this.drawer.closeDrawer();
			if (this.nav) {
				alert(this.nav.resetTo);
			}
			
			// this.navigator.resetTo(action);
        }
	}

	_openDrawer() {
		if (this.drawer) {
			this.drawer.openDrawer();
		}
	}


	componentDidMount() {				
		if (this.navigator && this.drawer) {
			BackAndroid.addEventListener('hardwareBackPress', () => {
				const stack = this.navigator.getCurrentRoutes();
				if (this.isOpen) {
					this.drawer.closeDrawer();
					return true;
				}
				else if (stack.length > 1) {
					this.navigator.pop();
					return true;
				}
				else if (stack[0].state !== Route.OVERVIEW) {
					this.navigator.resetTo({ state: Route.OVERVIEW, title: 'Übersicht' });
					return true;
				}
				BackAndroid.exitApp();
				return true;
			});
		}
	}

	componentWillUnmount() {
		BackAndroid.removeEventListener('hardwareBackPress');
	}

	render() {
	 	// const navigation = ();
		return (
			<DrawerLayoutAndroid
				drawerWidth={drawerWidth}
				drawerPosition={DrawerLayoutAndroid.positions.Left}
				ref={(drawer) => { this.drawer = drawer; }}
				onDrawerOpen={() => { this.isOpen = true; }}
				onDrawerClose={() => { this.isOpen = false; }}
				renderNavigationView={() => (<Views.Navigation {...this.props} onNavigate={this._onNavigate} width={drawerWidth} />)} >
				<LoginModal { ...this.props } />
					<Navigation 
						{ ...this.props }
						initialRoute={{ state: Route.OVERVIEW }}
						ref={ (navigator) => { this.navigator = navigator }}
						drawer={this.drawer} />
			</DrawerLayoutAndroid>
		);
	}
}

{/*<Navigator
							style={{flexDirection:'column-reverse'}}
							configureScene={(route, stack) => Navigator.SceneConfigs.FadeAndroid}
							initialRoute={{state: Route.OVERVIEW, title: 'Übersicht'}}
							navigationBar={<Toolbar {...this.props} withBorder openDrawer={this.openDrawer}  />}
							ref={(navigator) => {this.navigator = navigator;}}
							renderScene={this._renderScene.bind(this)} />
			*/}

export default App;
