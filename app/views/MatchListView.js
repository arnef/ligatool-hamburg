// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, MatchItem, Text } from '../components';
import { sortMatches } from '../Helper';

type State = {
  openMenu: number,
};

class MatchListView extends Component {
  state: State;

  constructor(props) {
    super(props);
    this._renderMatch.bind(this);
    this.state = {
      openMenu: -1,
    };
  }

  _renderMatch({ item, index }) {
    const match = this.props.data[item];

    return (
      <MatchItem
        menuOpen={this.state.openMenu === index}
        toggleMenu={() => {
          this.toggleMenu(index);
        }}
        data={match}
      />
    );
  }

  componentDidMount() {
    if (this.props.refreshOnMount && this.props.matches.length === 0) {
      this.props.onRefresh();
    }
  }

  toggleMenu(idx) {
    const openMenu = this.state.openMenu === idx ? -1 : idx;

    this.setState({ openMenu });
  }

  render() {
    const matches = this.props.matches;
    matches.sort(sortMatches(this.props.data));
    return (
      <Container
        error={this.props.error}
        refreshing={this.props.refreshing}
        onRefresh={this.props.onRefresh}
        dataSource={this.props.matches}
        keyExtractor={item => {
          return `${item}`;
        }}
        ListEmptyComponent={() =>
          <Text center secondary style={{ padding: 16 }}>
            {`${!this.props.refreshing ? 'Keine Begegnungen' : ''}`}
          </Text>}
        renderRow={this._renderMatch.bind(this)}
      />
    );
  }
}

export default connect(state => ({
  data: state.matches,
}))(MatchListView);
