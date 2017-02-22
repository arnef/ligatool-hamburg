import React, { Component } from 'react';
import {
  View,
  TabBarIOS,
  Navigator
} from 'react-native';
import * as Views from './views';
import Icon from 'react-native-vector-icons/Ionicons';
import LoginModal from './modals/LoginModal';
import * as Route from './views/routes';
import { Text } from './components';
import Touchable from './components/Touchable';
import Navigation from './Navigation';


class App extends Component {

  
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: Route.OVERVIEW
    };
  }
  _setTab(name) {
    this.setState({
      selectedTab: name
    });
  }

  // _renderScene(route, navigator) {
  //   switch (route.state) {
	// 		case Route.OVERVIEW:
	// 			return (<Views.Overview {...this.props} navigator={navigator} id={route.id} vid={route.vid}/>);
  //     case Route.LIVE_MATCH:
  //       return (<Views.LiveMatch {...this.props} navigator={navigator} id={route.id} vid={route.vid}/>);
	// 		case Route.MY_TEAM:
	// 			return (<Views.MyTeam {...this.props} navigator={navigator} />);
  //     case Route.LEAGUES:
  //       return (<Views.Leagues { ...this.props} navigator={navigator} />)
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

  _renderTab(name, title) {
    return (<Navigation
      { ...this.props }
      bottomTabBar
      initialRoute={{ state: name, title: title}}
      ref={ (navigator) => { this.navigator = navigator }}
     />)
  }

  /*_renderTab(name, title) {
    return (
      <Navigator
        style={{flexDirection: 'column-reverse', paddingBottom: 50}}
        initialRoute={{state: name, title: title}}
        ref={(navigator) => {this.navigator = navigator;}}
        renderScene={this._renderScene.bind(this)}
        navigationBar={
          <Navigator.NavigationBar routeMapper={{ 
            LeftButton: (route, navigator, index, navState) => { 
              if (index > 0) {
                return (
                  <Touchable style={{padding: 10}} onPress={() => {navigator.pop()}}>
                    <Icon size={24}  color='#fff' name='ios-arrow-back' />
                  </Touchable>
                ); 
              }
            }, 
            RightButton: (route, navigator, index, navState) => { 
              
            }, 
            Title: (route, navigator, index, navState) => { 
              return (
                <View style={{padding: 10}}>
                <Text color='#fff' bold size={18}>{ route.title || this.props.navi.title }</Text>
                </View>
                ); 
            }, 
          }} style={{ 
            position: 'relative', 
            backgroundColor: this.props.settings.color
          }} />
        }
      />
      
    );
  }*/
  
  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#eee'}}>
      <LoginModal { ...this.props } />
      <TabBarIOS
        tintColor='#fff'
        translucent={false}
        
        barTintColor={this.props.settings.color}>
        <Icon.TabBarItemIOS
          title='Übersicht'
          iconName='ios-football'
          selected={ this.state.selectedTab === Route.OVERVIEW }
          onPress={() => { this._setTab(Route.OVERVIEW); }}>
          {this._renderTab(Route.OVERVIEW, 'Übersicht') }
        </Icon.TabBarItemIOS>

        <Icon.TabBarItemIOS
          title='Mein Team'
          iconName='ios-shirt'
          selected={ this.state.selectedTab === Route.MY_TEAM }
          onPress={ () => { this._setTab(Route.MY_TEAM); }}>
          { this._renderTab(Route.MY_TEAM, 'Mein Team') }
        </Icon.TabBarItemIOS>

        <Icon.TabBarItemIOS
          title='Gruppen'
          iconName='ios-trophy'
          selected={this.state.selectedTab === Route.LEAGUES}
          onPress={ () => { this._setTab(Route.LEAGUES); }}>
          { this._renderTab(Route.LEAGUES, 'Gruppen')}
        </Icon.TabBarItemIOS>

        <Icon.TabBarItemIOS
          title='Einstellungen'
          iconName='ios-settings'
          selected={this.state.selectedTab === Route.SETTINGS}
          onPress={ () => { this._setTab(Route.SETTINGS); }}>
          { this._renderTab(Route.SETTINGS, 'Einstellungen') }
        </Icon.TabBarItemIOS>

      </TabBarIOS>
      </View>
    );
  }
}



App.propTypes = {
  settings: React.PropTypes.object
};


export default App;
