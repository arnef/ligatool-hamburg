import React, { Component } from 'react';
import { View, TabBarIOS, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LoginModal from './modals/LoginModal';
import * as Route from './views/routes';
import Navigation from './Navigation';


class App extends Component {

  
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: Route.OVERVIEW
    };
  }

  componentDidMount() {
    StatusBar.setBarStyle('light-content');
  }

  _setTab(name) {
    this.setState({
      selectedTab: name
    });
  }

  _renderTab(name, title) {
    return (<Navigation
      { ...this.props }
      bottomTabBar
      initialRoute={{ state: name, title: title}}
      ref={ (navigator) => { this.navigator = navigator }}
     />)
  }
  
  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#eee'}}>
      <LoginModal { ...this.props } />
      <TabBarIOS
        tintColor={this.props.settings.color}
        translucent={true}>
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
