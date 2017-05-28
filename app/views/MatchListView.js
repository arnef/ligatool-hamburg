// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, MatchItem } from '../components';
import { Row, Column, Button, Text, Separator } from '../components/base';
import { sortMatches, compareDays } from '../Helper';

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
    if (this.props.refreshOnMount) {
      if (this.props.matches.length === 0) {
        this.props.onRefresh();
      } else {
        const id: number = this.props.matches[0];
        const match: Match = this.props.data[id];
        if (compareDays(match.datetime, new Date().getTime()) < 0) {
          this.props.onRefresh();
        }
      }
    }
  }

  toggleMenu(idx) {
    const openMenu = this.state.openMenu === idx ? -1 : idx;

    this.setState({ openMenu });
  }

  render() {
    // if (this.props.error) {
    //   return (
    //     <Container>
    //       <Row style={{ marginTop: 16 }}>
    //         <Column center>
    //           <Button onPress={this.props.onRefresh}>Erneut Laden</Button>
    //         </Column>
    //       </Row>
    //     </Container>
    //   );
    // }
    if (this.props.matches.length === 0 && !this.props.refreshing) {
      return (
        <Container
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
        error={this.props.error}
        refreshing={this.props.refreshing}
        onRefresh={this.props.onRefresh}
        dataSource={this.props.matches}
        keyExtractor={item => {
          return `${item}`;
        }}
        // getItemLayout={(data, index) => ( {length: MatchItem.ITEM_HEIGHT, offset: MatchItem.ITEM_HEIGHT * index, index} )}
        // ItemSeparatorComponent={() => (<Separator group />)}
        renderRow={this._renderMatch.bind(this)}
      />
    );
  }
}

export default connect(state => ({
  data: state.matches,
}))(MatchListView);
