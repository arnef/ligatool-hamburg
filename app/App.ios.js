import React, { Component, PropTypes } from 'react';
import { View, TabBarIOS, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LoginModal from './modals/LoginModal';
import LoadingModal from './modals/LoadingModal';
import * as Route from './views/routes';
import Navigation from './Navigation';
import * as theme from './components/base/theme';
import * as Views from './views'
import { TAB_OVERVIEW, TAB_MY_TEAM, TAB_LEAGUES, TAB_SETTINGS } from './views/tabs'

const tabs = {
  OVERVIEW: 0,
  MY_TEAM: 1,
  LEAGUES: 2,
  SETTINGS: 3
}

class App extends Component {

  componentDidMount() {
    StatusBar.setBarStyle('light-content');
  }

  onPress(tabKey) {
    // if (this.props.route.tab === TAB_SETTINGS && tabIdx !== TAB_SETTINGS && this.props.settings.changed) {
    //   this.props.saveNotifications();
    // } 
    // if (tabIdx === TAB_MY_TEAM && !this.props.settings.team) {
    //   this.props.showLogin(true);
    // }

    this.props.setTab(tabKey);
  }

  renderScene(sceneProps) {
    return (<Views.OVERVIEW { ...sceneProps } />)
  }

  _renderTab(name, title) {
     /*return (<CardStack navigationState={this.props.route}
      renderScene={this.renderScene.bind(this)} />)
      */
  return (
      <Navigation
        { ...this.props }
        hasTabbar
        initialRoute={{ state: name, title: title}}
      />);
  }
  
  onCloseLogin() {
    if (!this.props.settings.team && this.state.selectedTab === Route.MY_TEAM) {
      this.setState({
        selectedTab: Route.OVERVIEW
      });
    }
  }


  render() {
    const activeTab = this.props.route.tabs.index;

    return (
      <View style={{ backgroundColor: theme.backgroundColor, flex: 1 }}>
        <LoadingModal />
        <LoginModal { ...this.props } onClose={this.onCloseLogin.bind(this)} />
      <TabBarIOS
        tintColor={this.props.settings.color}
        translucent={true}>
        <Icon.TabBarItemIOS
          title='Übersicht'
          iconName='ios-football'
          selected={ activeTab === tabs.OVERVIEW }
          onPress={() => this.onPress(TAB_OVERVIEW) }>
          {this._renderTab(Route.OVERVIEW, 'Übersicht') }
        </Icon.TabBarItemIOS>

        <Icon.TabBarItemIOS
          title='Mein Team'
          iconName='ios-shirt'
          selected={ activeTab === tabs.MY_TEAM }
          onPress={ () => this.onPress(TAB_MY_TEAM) }>
          { this._renderTab(Route.MY_TEAM, 'Mein Team') }
        </Icon.TabBarItemIOS>

        <Icon.TabBarItemIOS
          title='Gruppen'
          iconName='ios-trophy'
          selected={ activeTab === tabs.LEAGUES }
          onPress={ () => this.onPress(TAB_LEAGUES) }>
          { this._renderTab(Route.LEAGUES, 'Gruppen')}
        </Icon.TabBarItemIOS>

        <Icon.TabBarItemIOS
          title='Einstellungen'
          iconName='ios-settings'
          selected={ activeTab === tabs.SETTINGS }
          onPress={ () => this.onPress(TAB_SETTINGS) }>
          { this._renderTab(Route.SETTINGS, 'Einstellungen') }
        </Icon.TabBarItemIOS>

      </TabBarIOS>
      </View>
    );
  }
}



App.propTypes = {
  saveNotifications: PropTypes.func,
  showLogin: PropTypes.func,
  setTab: PropTypes.func,
  route: PropTypes.object,
  settings: PropTypes.object
};


export default App;
