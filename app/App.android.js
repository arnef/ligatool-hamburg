import React, { Component } from 'react';
import { DrawerLayoutAndroid, BackAndroid, Dimensions, Platform, StatusBar } from 'react-native';
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
		
	}

	_onNavigate(action) {
		console.tron.log('_onNavigate');
		if (this.drawer) {
			console.tron.log('yup drawer');
			this.drawer.closeDrawer();
			if (this.navigator) {
				console.tron.log('yuo navigator');
				// alert(this.navigator.resetTo);
				this.navigator.resetTo(action);
			}
        }
	}

	_openDrawer() {
		if (this.drawer) {
			this.drawer.openDrawer();
		}
	}


	componentDidMount() {	
		if (Platform.Version > 20) {
            StatusBar.setTranslucent(true);
            StatusBar.setBackgroundColor('rgba(0,0,0,.3)');
        }			
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
		return (
			<DrawerLayoutAndroid
				drawerWidth={drawerWidth}
				drawerPosition={DrawerLayoutAndroid.positions.Left}
				ref={drawer => { this.drawer = drawer; }}
				onDrawerOpen={() => { this.isOpen = true; }}
				onDrawerClose={() => { this.isOpen = false; }}
				renderNavigationView={() => (
					<Views.Navigation {...this.props} 
						onNavigate={this._onNavigate.bind(this)}
						width={drawerWidth} />)
				}>
				<LoginModal { ...this.props } />
					<Navigation 
						{ ...this.props }
						topBorder={ Platform.Version > 20 }
						initialRoute={{ state: Route.OVERVIEW }}
						getNav={navigator => { this.navigator = navigator }}
						drawer={this.drawer} />
			</DrawerLayoutAndroid>
		);
	}
}

export default App;
