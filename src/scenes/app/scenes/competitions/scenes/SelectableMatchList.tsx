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
import { connect, Dispatch } from 'react-redux';
import { getMatches } from '@app/redux/modules/leagues';
import {
  navigate,
  getNavigationStateParams,
} from '@app/redux/modules/navigation';
import {
  ActionSheet,
  StaticListHeader,
  Touchable,
  Text,
  Icon,
  MatchItem,
  Content,
} from '@app/components';
import styles from './styles';
import { getColor } from '@app/redux/modules/user';
import { getFixturesByCompetition } from '@app/redux/modules/fixtures';
import { sortBy } from 'lodash';
import { Strings } from '@app/lib/strings';
import { Routes } from '@app/scenes/routes';

interface Props extends StateProps, DispatchProps {
  navigation: any;
}
interface State {
  selectedMatchDay?: string;
}
class SelectableMatchList extends React.Component<Props, State> {
  container: any;

  constructor(props: Props) {
    super(props);
    this.state = {
      selectedMatchDay: null,
    };
  }

  onOpenMenu = (matchDays: Array<string>) => () => {
    ActionSheet.show(
      {
        options: matchDays,
      },
      (index: number) => this.onSelectMatchDay(matchDays[index])(),
    );
  };

  onSelectMatchDay = (matchDay: string) => () => {
    this.setState({ selectedMatchDay: matchDay });
    if (this.container && this.container.scrollToOffset) {
      this.container.scrollToOffset({ x: 0, y: 0, animated: true });
    }
  };

  onPress = (fixture: any) => (): void => {
    this.props.openFixture(fixture);
  };

  renderItem = ({ item }: any): React.ReactElement<any> => {
    return <MatchItem data={item} onPress={this.onPress(item)} />;
  };

  render() {
    const { matchdays, selected, data } = this.props;

    const matchList = data[this.state.selectedMatchDay || selected];
    return (
      <View style={styles.container}>
        {matchdays.length > 0 && (
          <StaticListHeader>
            <Touchable onPress={this.onOpenMenu(matchdays)}>
              <View style={styles.matchDayButton}>
                <Text style={styles.matchDayText}>
                  {this.state.selectedMatchDay || selected}
                </Text>
                <Icon
                  name="more"
                  size={22}
                  color={this.props.loading ? this.props.color : '#fff'}
                />
              </View>
            </Touchable>
          </StaticListHeader>
        )}
        <Content
          onRefresh={this.props.getMatches}
          renderItem={this.renderItem}
          listEmptyText={Strings.NO_FIXTURES}
          data={matchList}
          reference={container => {
            this.container = container;
          }}
        />
      </View>
    );
  }
}

const fixturesByMatchDate = (
  state: any,
  props: Props,
): { data: any; matchdays: Array<string>; selected?: string } => {
  const fixtures = getFixturesByCompetition(
    state,
    getNavigationStateParams(props.navigation).id,
  );
  const data: { data: any; matchdays: Array<string>; selected?: string } = {
    data: {},
    matchdays: [],
    selected: null,
  };
  for (let fixture of fixtures) {
    if (!data.data[fixture.matchday]) {
      data.data[fixture.matchday] = [];
      data.matchdays.push(fixture.matchday);
    }
    data.data[fixture.matchday].push(fixture);
    if (!fixture.result && !data.selected) {
      data.selected = fixture.matchday;
    }
  }
  data.matchdays = sortBy(data.matchdays, i => parseInt(i));
  if (!data.selected) {
    data.selected = data.matchdays[data.matchdays.length - 1];
  }

  return data;
};
interface StateProps {
  color?: string;
  loading?: boolean;
  matchdays: Array<string>;
  selected?: string;
  data: any;
}
interface DispatchProps {
  getMatches: () => void;
  openFixture: (fixture: any) => void;
}

function mapStateToProps(state: any, props: Props): StateProps {
  const data = fixturesByMatchDate(state, props);

  return {
    matchdays: data.matchdays,
    selected: data.selected,
    data: data.data,
    color: getColor(state),
  };
}

function mapDispatchToProps(
  dispatch: Dispatch<any>,
  props: Props,
): DispatchProps {
  return {
    getMatches: () =>
      dispatch(getMatches(getNavigationStateParams(props.navigation).id)),
    openFixture: (fixture: any) => {
      dispatch(
        navigate({
          routeName: Routes.fixtureDetails,
          params: { id: fixture.id, title: fixture.competitionName },
        }),
      );
    },
  };
}

export const ConnectedSelectableMatchList = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SelectableMatchList);
