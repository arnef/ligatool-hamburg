// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { formatDate, formatTime, isAdminForMatch } from '../Helper';
import Score from './Score';
import { Card, Content, Row, Column, Icon, Text } from '../components/base';
import { TeamLogo } from '../components';
import { NavigationActions } from 'react-navigation';
import moment from 'moment';
import { MATCH, PREVIEW } from '../views/routes';

class MatchItem extends Component {
  static ITEM_HEIGHT: number;

  render() {
    const { data, color } = this.props;

    return (
      <Card onPress={() => this.onPress(data)}>
        <Content>
          <Text bold color={color}>{`${data.league
            .name} (${data.match_day})`}</Text>
          {data.venue &&
            <Text secondary small>
              <Icon name="pin" />
              {` ${data.venue.name} ${formatDate(data.datetime)} ${formatTime(
                data.datetime,
              )}`}
            </Text>}
        </Content>
        <Row>
          <Column center>
            <TeamLogo team={data.team_home} big />
            <Content>
              <Text center small>{`${data.team_home.name}`}</Text>
            </Content>
          </Column>
          <Column center fluid>
            <Score setPoints={data} />
          </Column>
          <Column center>
            <TeamLogo team={data.team_away} big />
            <Content>
              <Text center small>{`${data.team_away.name}`}</Text>
            </Content>
          </Column>
        </Row>
      </Card>
    );
  }

  onPress(match) {
    const isAdmin: boolean = isAdminForMatch(match, this.props.auth);
    if (
      match.set_points ||
      (isAdmin && moment(match.datetime).diff(moment(), 'minutes') < 31)
    ) {
      this.props.pushRoute({
        routeName: MATCH,
        params: { id: match.id, isAdmin },
      });
    } else {
      this.props.pushRoute({
        routeName: PREVIEW,
        params: { match },
      });
    }
  }
}

MatchItem.ITEM_HEIGHT = 152;

export default connect(
  state => ({
    auth: state.auth,
    color: state.settings.color,
  }),
  dispatch => ({
    pushRoute: route => dispatch(NavigationActions.navigate(route)),
  }),
)(MatchItem);
