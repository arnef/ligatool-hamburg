// @flow
import React from 'react';
import { View } from 'react-native';
import moment from 'moment';
import { connect } from 'react-redux';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {
  Text,
  Button,
  Container,
  ListItem,
  Touchable,
  Separator,
  Icon,
} from '../../components';
import {
  DATETIME_FORMAT,
  DATETIME_DB,
  MAX_DATETIME_SUGGESTIONS,
} from '../../config/settings';
import S from '../../lib/strings';
import * as MatchActions from '../../redux/modules/matches';

import styles from './styles';

class MatchDate extends React.Component {
  renderDatetime: Function;

  constructor(props: any) {
    super(props);
    const match = this.props.matches[this.props.navigation.state.params.id];
    const datetimes =
      match.datetime_suggestions.length > 0
        ? match.datetime_suggestions
        : [
            {
              datetime: moment(match.datetime, DATETIME_DB)
                .add(7, 'days')
                .format(DATETIME_DB),
              comment: '',
            },
          ];
    this.state = {
      datetimes,
      accept: this.props.auth.ids.indexOf(match.datetime_suggest_team) !== -1,
      datetime: moment(match.datetime, DATETIME_DB),
      index: -1,
      defaultDate: undefined,
    };
    this.onConfirm = this.onConfirm.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onRemove = this.onRemove.bind(this);
    this.onPress = this.onPress.bind(this);
    this.renderDatetime = this.renderDatetime.bind(this);
  }

  onConfirm(date) {
    const datetimes = [...this.state.datetimes];
    datetimes[this.state.index] = {
      datetime: moment(date).format(DATETIME_DB),
      comment: '',
    };
    this.setState({
      datetimes,
      index: -1,
      accept: false,
    });
  }

  onCancel() {
    this.setState({ index: -1 });
  }

  onRemove(index) {
    const datetimes = [...this.state.datetimes];
    datetimes.splice(index, 1);

    this.setState({
      datetimes,
    });
  }

  onPress() {
    this.props.suggestDatetime(
      this.props.navigation.state.params.id,
      this.state.datetimes,
    );
  }

  acceptDate(index) {
    const datetimes = [...this.state.datetimes];
    datetimes[index].accept = true;
    this.setState({ datetimes }, () => {
      this.onPress();
    });
  }

  renderDatetime() {
    const { datetimes, accept, datetime } = this.state;
    const childs = [];
    for (let i = 0; i < MAX_DATETIME_SUGGESTIONS; i++) {
      let date = null;
      if (i < datetimes.length) {
        date = moment(datetimes[i].datetime, DATETIME_DB);
      }

      if (date) {
        childs.push(
          <View key={`item-${i}`}>
            <ListItem>
              <Touchable
                style={styles.optionText}
                onPress={() => {
                  this.setState({ index: i, defaultDate: date.toDate() });
                }}
              >
                <Text>
                  {date.format(DATETIME_FORMAT)}
                </Text>
              </Touchable>
              {accept &&
                <Touchable onPress={() => this.acceptDate(i)}>
                  <ListItem.Icon
                    right
                    color={this.props.color}
                    name="checkmark-circle"
                  />
                </Touchable>}
              {!accept &&
                datetimes.length > 1 &&
                <Touchable onPress={() => this.onRemove(i)}>
                  <ListItem.Icon right color="red" name="remove-circle" />
                </Touchable>}
            </ListItem>
            <Separator />
          </View>,
        );
      } else if (i === 1 || i === datetimes.length) {
        childs.push(
          <ListItem
            key={`add-date`}
            onPress={() => {
              this.setState({
                index: i,
                defaultDate: moment()
                  .hour(datetime.hour())
                  .minutes(datetime.minutes())
                  .seconds(0)
                  .toDate(),
              });
            }}
          >
            <Text style={styles.optionText}>
              {S.SELECT_NEXT_DATETIMTE}{' '}
            </Text>
            <ListItem.Icon right color={this.props.color} name="add" />
          </ListItem>,
        );
      }
    }

    return childs;
  }

  render() {
    return (
      <Container>
        <ListItem.Group>
          <ListItem.Header title={S.DATETIME_SUGGESTIONS} />
          {this.renderDatetime()}
          {!this.state.accept &&
            <View style={{ padding: 16 }}>
              <Button onPress={this.onPress} title={S.SUGGEST_DATETIMES} />
            </View>}
        </ListItem.Group>
        {this.state.accept &&
          <Text style={{ lineHeight: 24, margin: 12 }}>
            Klicke auf <Icon name="checkmark-circle" size={22} /> um einen
            Termin zu akzeptieren.
          </Text>}
        <DateTimePicker
          cancelTextIOS={S.CANCEL}
          confirmTextIOS={S.CONFIRM}
          customTitleContainerIOS={<View />}
          isVisible={this.state.index > -1}
          mode="datetime"
          date={this.state.defaultDate}
          minuteInterval={15}
          onCancel={this.onCancel}
          onConfirm={this.onConfirm}
        />
      </Container>
    );
  }
}

export default connect(
  state => ({
    matches: state.matches,
    color: state.settings.color,
    auth: state.auth.team,
  }),
  (dispatch: Dispatch<any>) => ({
    suggestDatetime: (id, datetimes) =>
      dispatch(MatchActions.suggestDatetime(id, datetimes)),
  }),
)(MatchDate);
