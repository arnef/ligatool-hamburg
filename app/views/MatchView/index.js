import React, { Component, PropTypes } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import SetsView from './SetsView';
import PreView from './PreView';
import moment from 'moment';
import NavIcon from '../../Nav/NavIcon';

class MatchView extends Component {
  render() {
    const { navigation, matches } = this.props;
    const match = matches[navigation.state.params.id] || {
      id: navigation.state.params.id
    };

    return <SetsView data={match} />;
  }
}

export default connect(state => ({
  matches: state.matches
}))(MatchView);
