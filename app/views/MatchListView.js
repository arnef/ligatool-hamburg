import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, MatchItem } from '../components';
import { Row, Column, Button, Text } from '../components/base';
import { sortMatches } from '../Helper';

class MatchListView extends Component {
  constructor(props) {
    super(props);
    this._renderMatch.bind(this);
    this.state = {
      openMenu: -1
    };
  }

  _renderMatch(id, sec, idx) {
    const match = this.props.data[id];

    return (
      <MatchItem
        key={idx}
        menuOpen={this.state.openMenu === idx}
        toggleMenu={() => {
          this.toggleMenu(idx);
        }}
        data={match}
      />
    );
  }

  componentWillMount() {
    if (this.props.matches.length === 0 && this.props.refreshOnMount) {
      this.props.onRefresh();
    }
  }

  toggleMenu(idx) {
    const openMenu = this.state.openMenu === idx ? -1 : idx;

    this.setState({ openMenu });
  }

  render() {
    if (this.props.error) {
      return (
        <Container {...this.props}>
          <Row style={{ marginTop: 16 }}>
            <Column center>
              <Button onPress={this.props.onRefresh}>Erneut Laden</Button>
            </Column>
          </Row>
        </Container>
      );
    }
    if (this.props.matches.length === 0 && !this.props.refreshing) {
      return (
        <Container
          {...this.props}
          error={this.props.error}
          refreshing={this.props.refreshing}
          onRefresh={this.props.onRefresh}
        >
          <Text center secondary style={{ padding: 16 }}>
            Keine Begegnungen
          </Text>
        </Container>
      );
    }
    const matches = this.props.matches;
    matches.sort(sortMatches(this.props.data));
    return (
      <Container
        {...this.props}
        error={this.props.error}
        refreshing={this.props.refreshing}
        onRefresh={this.props.onRefresh}
        dataSource={this.props.matches}
        renderRow={this._renderMatch.bind(this)}
      />
    );
  }
}

export default connect(state => ({
  data: state.matches
}))(MatchListView);
