import React, { Component } from 'react';
import { connect } from 'react-redux';
import SetsView from './SetsView';

class MatchView extends Component {
  render() {
    const { navigation, matches } = this.props;
    const match = matches[navigation.state.params.id] || {
      id: navigation.state.params.id,
    };

    return <SetsView data={match} />;
  }
}

export default connect(state => ({
  matches: state.matches,
}))(MatchView);
