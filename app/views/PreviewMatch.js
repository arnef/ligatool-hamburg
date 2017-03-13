import React, { Component } from 'react';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import TeamView from './TeamView';
import { TabBar } from '../components';


class PreviewMatch extends Component {

  componentDidMount() {
    this.props.navigator.setTitle(this.props.home.name);
  }

  onChangeTab(keys) {
    if (keys.i === 0) {
      this.props.navigator.setTitle(this.props.home.name);
    } else {
      this.props.navigator.setTitle(this.props.away.name);
    }
  }

  render() {
    return (
      <ScrollableTabView
        onChangeTab={this.onChangeTab.bind(this)}
        prerenderingSiblingsNumber={0}
        renderTabBar={() => (<TabBar />)}>
        <TeamView {...this.props} team={this.props.home} tabLabel='HEIM' />
        <TeamView {...this.props} team={this.props.away} tabLabel='GAST' />
      </ScrollableTabView>
    );
  }
}

PreviewMatch.propTypes = {
  setTitle: React.PropTypes.func,
  home: React.PropTypes.object,
  away: React.PropTypes.object
};

export default PreviewMatch;
