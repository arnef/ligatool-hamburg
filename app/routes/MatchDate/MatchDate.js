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
  Icon,
} from '../../components';
import { DATETIME_FORMAT, DATETIME_DB } from '../../config/settings';
import S from '../../lib/strings';
import { range } from 'lodash';
import styles from './styles';
import {
  getFixtureDates,
  setFixtureDate,
  removeFixtureDate,
  suggestFixtureDates,
  acceptFixtureDate,
} from '../../redux/modules/fixtures';
import { getColor } from '../../redux/modules/user';
import { getNavigationStateParams } from '../../redux/modules/navigation';

class MatchDate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      index: -1,
      defaultDate: undefined,
    };
    this.onConfirm = this.onConfirm.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onRemove = this.onRemove.bind(this);
    this.onPress = this.onPress.bind(this);
  }

  onConfirm(d) {
    const date = moment(d).seconds(0);
    this.props.setFixtureDate(this.state.index, date.format(DATETIME_DB));
    this.setState({ index: -1 });
  }

  onCancel() {
    this.setState({ index: -1 });
  }

  onRemove(index) {
    this.props.removeFixtureDate(index);
  }

  onPress() {
    this.props.suggestDatetime(
      getNavigationStateParams(this.props.navigation).id,
      this.state.datetimes,
    );
  }

  acceptDate(index) {
    const date = this.props.dates.dates[index];
    if (date && date.id) {
      this.props.acceptDate(date.id);
    }
  }

  onPressDate = index => {
    const { dates } = this.props.dates;
    const date = dates[index]
      ? moment(dates[index], DATETIME_DB)
      : moment()
          .hour(20)
          .minutes(0)
          .seconds(0);
    this.setState({
      index,
      defaultDate: date.toDate(),
    });
  };

  render() {
    const data = this.props.dates;
    const countDates = data
      ? data.dates.length >= data.meta.maxDates
        ? data.meta.maxDates
        : data.dates.length + 1
      : 0;

    return (
      <Container onRefresh={() => {}} refreshing={this.props.loading}>
        <ListItem.Group>
          <ListItem.Header title={S.DATETIME_SUGGESTIONS} />
          {range(countDates).map(index => (
            <View key={`${index}`}>
              <ListItem>
                <Touchable
                  style={styles.optionText}
                  onPress={() => this.onPressDate(index)}
                >
                  <Text>
                    {data.dates[index]
                      ? `${moment(
                          data.dates[index].datetime,
                          DATETIME_DB,
                        ).format(DATETIME_FORMAT)}`
                      : S.SELECT_NEXT_DATETIMTE}
                  </Text>
                </Touchable>
                {data.meta.adminAccept &&
                  index < data.dates.length && (
                    <Touchable onPress={() => this.acceptDate(index)}>
                      <ListItem.Icon
                        right
                        color={this.props.color}
                        name="checkmark-circle"
                      />
                    </Touchable>
                  )}
                {!data.meta.adminAccept &&
                  index < data.dates.length && (
                    <Touchable onPress={() => this.onRemove(index)}>
                      <ListItem.Icon right color="red" name="remove-circle" />
                    </Touchable>
                  )}
              </ListItem>
            </View>
          ))}
          {data &&
            !data.meta.adminAccept && (
              <View style={{ padding: 16 }}>
                <Button onPress={this.onPress} title={S.SUGGEST_DATETIMES} />
              </View>
            )}
        </ListItem.Group>
        {data &&
          data.meta.adminAccept && (
            <Text style={{ lineHeight: 24, margin: 12 }}>
              Klicke auf <Icon name="checkmark-circle" size={22} /> um einen
              Termin zu akzeptieren.
            </Text>
          )}
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
  (state, props) => ({
    matches: state.matches,
    color: getColor(state),
    auth: state.auth.team,
    dates: getFixtureDates(
      state,
      getNavigationStateParams(props.navigation).id,
    ),
    loading: !getFixtureDates(
      state,
      getNavigationStateParams(props.navigation).id,
    ),
  }),
  (dispatch, props) => ({
    setFixtureDate: (index, date) =>
      dispatch(
        setFixtureDate(
          getNavigationStateParams(props.navigation).id,
          index,
          date,
        ),
      ),
    removeFixtureDate: index =>
      dispatch(
        removeFixtureDate(getNavigationStateParams(props.navigation).id, index),
      ),
    suggestDatetime: () =>
      dispatch(
        suggestFixtureDates(getNavigationStateParams(props.navigation).id),
      ),
    acceptDate: id =>
      dispatch(
        acceptFixtureDate(getNavigationStateParams(props.navigation).id, id),
      ),
  }),
)(MatchDate);
