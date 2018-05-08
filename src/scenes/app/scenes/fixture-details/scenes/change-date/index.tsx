/**
 * Copyright (C) 2018 Arne Feil
 *
 * This file is part of DTFB App.
 *
 * DTFB App is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * DTFB App is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with DTFB App.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

import * as React from 'react';
import { View } from 'react-native';
import {
  Content,
  ListItem,
  Touchable,
  Text,
  Icon,
  Button,
} from '@app/components';
import { Strings } from '@app/lib/strings';
import { range } from 'lodash';
import styles from './styles';
import { default as moment } from 'moment';
import { DATETIME_DB, DATETIME_FORMAT } from '@app/config/settings';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { suggestDatetime } from '@app/redux/modules/matches';
import { getNavigationStateParams } from '@app/redux/modules/navigation';
import { connect, Dispatch } from 'react-redux';
import { getColor } from '@app/redux/modules/user';
import {
  getFixtureDates,
  setFixtureDate,
  removeFixtureDate,
  suggestFixtureDates,
  acceptFixtureDate,
} from '@app/redux/modules/fixtures';

interface Props extends StateProps, DispatchProps {
  navigation: any;
}
interface State {
  index: number;
  defaultDate: Date;
}
class ChangeDateScene extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      index: -1,
      defaultDate: undefined,
    };
  }

  private onAcceptDate = (index: number) => () => {
    const date = this.props.dates.dates[index];
    if (date && date.id) {
      this.props.acceptDate(date.id);
    }
  };

  private onConfirm = d => {
    const date = moment(d).seconds(0);
    this.props.setFixtureDate(this.state.index, date.format(DATETIME_DB));
    this.setState({ index: -1 });
  };

  private onCancel = () => {
    this.setState({ index: -1 });
  };

  private onRemove = (index: number) => () => {
    this.props.removeFixtureDate(index);
  };

  private onPressDate = (index: number) => () => {
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

  private onSuggestDates = () => {
    this.props.suggestDatetime();
  };

  public render() {
    const data = this.props.dates;
    const countDates = data
      ? data.dates.length >= data.meta.maxDates
        ? data.meta.maxDates
        : data.dates.length + 1
      : 0;

    return (
      <Content>
        <ListItem.Group>
          <ListItem.Header title={Strings.DATETIME_SUGGESTIONS} />
          {range(countDates).map((index: number) => (
            <ListItem key={`date-${index}`}>
              <Touchable
                style={styles.optionText}
                onPress={this.onPressDate(index)}
              >
                <Text>
                  {data.dates[index]
                    ? `${moment(data.dates[index].datetime, DATETIME_DB).format(
                        DATETIME_FORMAT,
                      )}`
                    : Strings.SELECT_NEXT_DATETIMTE}
                </Text>
              </Touchable>
              {data.meta.adminAccept &&
                index < data.dates.length && (
                  <Touchable onPress={this.onAcceptDate(index)}>
                    <ListItem.Icon
                      right
                      color={this.props.color}
                      name="checkmark-circle"
                    />
                  </Touchable>
                )}
              {!data.meta.adminAccept &&
                index < data.dates.length && (
                  <Touchable onPress={this.onRemove(index)}>
                    <ListItem right color="red" name="remove-circle" />
                  </Touchable>
                )}
            </ListItem>
          ))}
          {data &&
            !data.meta.adminAccept && (
              <View style={{ padding: 16 }}>
                <Button
                  onPress={this.onSuggestDates}
                  title={Strings.SUGGEST_DATETIMES}
                />
              </View>
            )}
        </ListItem.Group>
        {data &&
          data.meta.adminAccept && (
            <Text style={{ lineHeight: 24, margin: 12 }}>
              {Strings.PRESS_ON}
              <Icon name="checkmark-circle" size={22} />
              {Strings.CHANGE_DATE_INFO}
            </Text>
          )}
        <DateTimePicker
          cancelTextIOS={Strings.CANCEL}
          confirmTextIOS={Strings.CONFIRM}
          customTitleContainerIOS={<View />}
          isVisible={this.state.index > -1}
          mode="datetime"
          date={this.state.defaultDate}
          minuteInterval={15}
          onCancel={this.onCancel}
          onConfirm={this.onConfirm}
        />
      </Content>
    );
  }
}

interface StateProps {
  dates: any;
  color: string;
}
interface DispatchProps {
  setFixtureDate: Function;
  removeFixtureDate: Function;
  suggestDatetime: Function;
  acceptDate: Function;
}

function mapStateToProps(state: any, props: Props): StateProps {
  return {
    color: getColor(state),
    dates: getFixtureDates(
      state,
      getNavigationStateParams(props.navigation).id,
    ),
  };
}

function mapDispatchToProps(
  dispatch: Dispatch<any>,
  props: Props,
): DispatchProps {
  const fixtureId = getNavigationStateParams(props.navigation).id;
  return {
    setFixtureDate: (index: number, date: string) =>
      dispatch(setFixtureDate(fixtureId, index, date)),
    removeFixtureDate: (index: number) =>
      dispatch(removeFixtureDate(fixtureId, index)),
    suggestDatetime: () => dispatch(suggestFixtureDates(fixtureId)),
    acceptDate: (id: string) => dispatch(acceptFixtureDate(fixtureId, id)),
  };
}

export const ChangeDate = connect(mapStateToProps, mapDispatchToProps)(
  ChangeDateScene,
);
