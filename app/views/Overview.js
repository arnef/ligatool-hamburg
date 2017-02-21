import React, { Component } from 'react';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import { Toolbar } from '../components';
import { connect } from 'react-redux';
import MatchListView from './MatchListView';

class Overview extends Component {


  componentDidMount() {
    const matches = this.props.matches;
    if (matches.today.length === 0 && matches.next.length === 0 && matches.played.length === 0) {
      this.props.queryMatches();
    }
  }


  render() {
    const props = {
      error: this.props.matches.error,
      refreshing: this.props.matches.fetching,
      onRefresh: this.props.queryMatches.bind(this)
    };


    return (
      <ScrollableTabView
        prerenderingSiblingsNumber={2}
        renderTabBar={() => (
          <Toolbar.Tabs />)}>
        <MatchListView {...this.props} { ...props } tabLabel='HEUTE' matches={this.props.matches.today} />
        <MatchListView {...this.props} { ...props } tabLabel='KOMMENDE' matches={this.props.matches.next} />
        <MatchListView {...this.props} { ...props } tabLabel='VERGANGENE' matches={this.props.matches.played} />
      </ScrollableTabView>
    );
  }
}

Overview.propTypes = {
  matches: React.PropTypes.object,
  queryMatches: React.PropTypes.func
};

export default connect(state => ({
  matches: state.matches
}))(Overview);
