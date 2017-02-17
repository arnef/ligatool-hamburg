import React, { Component } from 'react';
import { StyleSheet, Platform, StatusBar, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';

const oldAndroid = Platform.Version < 21;
StatusBar.setTranslucent(!oldAndroid);
StatusBar.setBackgroundColor(oldAndroid ? 'rgb(0,0,0)' : 'rgba(0,0,0,.3)');

class Toolbar extends Component {
  constructor(props) {
    super(props);
  }


  _onIconClicked() {
    const stack = this.props.navState.routeStack;
    if (stack.length === 1) {
      this.props.openDrawer();
    } else {
      this.props.navigator.pop();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.navState) {
      const nextRoute = nextProps.navState.routeStack[nextProps.navState.routeStack.length-1];
      const route = this.props.navState.routeStack[this.props.navState.routeStack.length-1];
      if (nextRoute.state !== route.state || (nextRoute.leagueID !== route.leagueID)) {
        if (nextRoute.state === 'LiveTicker') {
          this.props.setTitle('Übersicht');
        } 
        else if (nextRoute.state === 'LiveMatch') {
          this.props.setTitle('Begegnung');
        }
        else if (nextRoute.state === 'MatchList') {
          this.props.setTitle('Mein Team');
        }
        else if (nextRoute.state === 'Match') {
          this.props.setTitle('Spiel eintragen');
        } else if (nextRoute.title) {
          this.props.setTitle(nextRoute.title);
        }
      }
    }
  }

  render() {
    const route = !!this.props.navState ? this.props.navState.routeStack[this.props.navState.routeStack.length-1] : null;
    const color = !!route && !!route.team && !!route.team.color ? route.team.color : this.props.settings.color;

    const border = !oldAndroid && this.props.withBorder ?  { borderTopWidth: 24, borderColor: color } : { borderTopWidth: 0 };
    let toolbar;
    if (this.props.onIconClicked && this.props.navIconName && this.props.title) {
      toolbar = (<Icon.ToolbarAndroid
        style={[style.toolbar, { backgroundColor: color}, border]}
        onIconClicked={this.props.onIconClicked}
        titleColor='#ffffff'
        navIconName={`md-${this.props.navIconName}`}
        title={this.props.title}
      />);
    } else {
      
      let title = route.title || '';
      const icon = this.props.navState.routeStack.length === 1 ? 'md-menu' : 'md-arrow-back';
      toolbar = (
        <Icon.ToolbarAndroid
          style={[style.toolbar, { backgroundColor: color}, border]}
          onIconClicked={this._onIconClicked.bind(this)}
          titleColor='#ffffff'
          navIconName={icon}
          title={this.props.navi.title} />
      );
    }
    return (
      <View>
      <View style={[border]} />{ toolbar }</View>
    )
  }
}

const style = StyleSheet.create({
  toolbar: {
		backgroundColor: '#ef473a',
		height: 56,
    borderTopWidth: 25
	}
});

function mapStateToProps(state) {
  return {
    liveMatch: state.liveMatch,
    match: state.match,
    settings: state.settings,
    navi: state.navi
  };
}

export default connect(mapStateToProps)(Toolbar);
