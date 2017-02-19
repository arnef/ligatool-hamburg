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
	constructor(props) {
		super(props);
		this._onNavigate = this._onNavigate.bind(this);
		this.openDrawer = this._openDrawer.bind(this);
	}


	_renderScene(route, navigator) {
		switch (route.state) {
			case Route.OVERVIEW:
				return (<Views.Overview {...this.props} navigator={navigator} id={route.id} vid={route.vid}/>);
      case Route.LIVE_MATCH:
        return (<Views.LiveMatch {...this.props} navigator={navigator} id={route.id} vid={route.vid}/>);
			case Route.MY_TEAM:
				return (<Views.MyTeam {...this.props} navigator={navigator} />);
      case Route.LEAGUES:
        return (<Views.Leagues { ...this.props} navigator={navigator} />)
			case Route.MATCH:
				return (<Views.Match {...this.props} navigator={navigator} id={route.id} vid={route.vid	} />);
			case Route.RANKING:
				return (<Views.Table {...this.props} navigator={navigator} leagueID={route.leagueID} />);
			case Route.TEAM:
				return (<Views.Team {...this.props} navigator={navigator} team={route.team} />);
			case Route.PREVIEW:
				return (<Views.PreviewMatch { ...this.props} navigator={navigator} home={route.home} away={route.away} />);
			case Route.SETTINGS:
				return (<Views.Settings.SettingsView {...this.props} navigator={navigator} />);
			case Route.SETTINGS_NOTIFICATION:
				return (<Views.Settings.SettingsNotificationView { ...this.props } navigator={navigator} />);
		}
	}

	_onNavigate(action) {
		if (this.getDrawer()) {
			this.getDrawer().closeDrawer();
			this.navigator.resetTo(action);
        }
	}

	_openDrawer() {
		if (this.getDrawer()) {
			this.getDrawer().openDrawer();
		}
	}


	componentDidMount() {				
		
		if (this.navigator && this.getDrawer()) {
			BackAndroid.addEventListener('hardwareBackPress', () => {
				const stack = this.navigator.getCurrentRoutes();
				if (this.getDrawer().isOpen) {
					this.getDrawer().closeDrawer();
					return true;
				}
				else if (stack.length > 1) {
					this.navigator.pop();
					return true;
				}
				else if (stack[0].state !== 'LiveTicker') {
					this.navigator.resetTo({ state: 'LiveTicker', title: 'Übersicht' });
					return true;
				}
				return false;
			});
		}
	}

	componentWillUnmount() {
		BackAndroid.removeEventListener('hardwareBackPress');
	}

	getDrawer() {
		return this.drawer;
	}

	render() {
	 	const navigation = (<Views.Navigation {...this.props} onNavigate={this._onNavigate} width={drawerWidth} />);
		return (
			<DrawerLayoutAndroid
				drawerWidth={drawerWidth}
				drawerPosition={DrawerLayoutAndroid.positions.Left}
				ref={(drawer) => { this.drawer = drawer; }}
				onDrawerOpen={() => { this.drawer.isOpen = true; }}
				onDrawerClose={() => { this.drawer.isOpen = false; }}
				renderNavigationView={ () => navigation} >
				<LoginModal { ...this.props } />
					<Navigation initialRoute={{ state: Route.OVERVIEW }} 
						ref={(navigation) => this.navigator = navigation} />
			</DrawerLayoutAndroid>
		);
	}
}

{/*<Navigator
							style={{flexDirection:'column-reverse'}}
							configureScene={(route, stack) => Navigator.SceneConfigs.FadeAndroid}
							initialRoute={{state: Route.OVERVIEW, isRoot: true, title: 'Übersicht'}}
							navigationBar={<Toolbar {...this.props} withBorder openDrawer={this.openDrawer}  />}
							ref={(navigator) => {this.navigator = navigator;}}
							renderScene={this._renderScene.bind(this)} />
			*/}

export default App;
