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

import {
  ActionSheet,
  Content,
  Icon,
  MatchItem,
  StaticListHeader,
  Text,
  Touchable,
} from '@app/components';
import { Strings } from '@app/lib/strings';
import { getFixturesByCompetition } from '@app/redux/modules/fixtures';
import { getMatches } from '@app/redux/modules/leagues';
import {
  getNavigationStateParams,
  navigate,
} from '@app/redux/modules/navigation';
import { getColor } from '@app/redux/modules/user';
import { Routes } from '@app/scenes/routes';
import { sortBy } from 'lodash';
import * as React from 'react';
import { View } from 'react-native';
import { connect, Dispatch } from 'react-redux';

import styles from './styles';

interface IProps extends IStateProps, IDispatchProps {
  navigation: any;
}
interface IState {
  selectedMatchDay?: string;
}
class SelectableMatchList extends React.Component<IProps, IState> {
  public container: any;

  constructor(props: IProps) {
    super(props);
    this.state = {
      selectedMatchDay: null,
    };
  }

  public onOpenMenu = (matchDays: string[]) => () => {
    ActionSheet.show(
      {
        options: matchDays,
      },
      (index: number) => this.onSelectMatchDay(matchDays[index])(),
    );
  };

  public onSelectMatchDay = (matchDay: string) => () => {
    this.setState({ selectedMatchDay: matchDay });
    if (this.container && this.container.scrollToOffset) {
      this.container.scrollToOffset({ x: 0, y: 0, animated: true });
    }
  };

  public onPress = (fixture: any) => (): void => {
    this.props.openFixture(fixture);
  };

  public renderItem = ({ item }: any): React.ReactElement<any> => {
    return <MatchItem data={item} onPress={this.onPress(item)} />;
  };

  public render() {
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
          reference={this.refContainer}
        />
      </View>
    );
  }

  private refContainer = (container: any) => {
    this.container = container;
  };
}

const fixturesByMatchDate = (
  state: any,
  props: IProps,
): { data: any; matchdays: string[]; selected?: string } => {
  const fixtures = getFixturesByCompetition(
    state,
    getNavigationStateParams(props.navigation).id,
  );
  const data: { data: any; matchdays: string[]; selected?: string } = {
    data: {},
    matchdays: [],
    selected: null,
  };
  for (const fixture of fixtures) {
    if (!data.data[fixture.matchday]) {
      data.data[fixture.matchday] = [];
      data.matchdays.push(fixture.matchday);
    }
    data.data[fixture.matchday].push(fixture);
    if (!fixture.result && !data.selected) {
      data.selected = fixture.matchday;
    }
  }
  data.matchdays = sortBy(data.matchdays, i => parseInt(i, 10));
  if (!data.selected) {
    data.selected = data.matchdays[data.matchdays.length - 1];
  }

  return data;
};
interface IStateProps {
  color?: string;
  loading?: boolean;
  matchdays: string[];
  selected?: string;
  data: any;
}
interface IDispatchProps {
  getMatches: () => void;
  openFixture: (fixture: any) => void;
}

function mapStateToProps(state: any, props: IProps): IStateProps {
  const data = fixturesByMatchDate(state, props);

  return {
    color: getColor(state),
    data: data.data,
    matchdays: data.matchdays,
    selected: data.selected,
  };
}

function mapDispatchToProps(
  dispatch: Dispatch<any>,
  props: IProps,
): IDispatchProps {
  return {
    getMatches: () =>
      dispatch(getMatches(getNavigationStateParams(props.navigation).id)),
    openFixture: (fixture: any) => {
      dispatch(
        navigate({
          params: { id: fixture.id, title: fixture.competitionName },
          routeName: Routes.fixtureDetails,
        }),
      );
    },
  };
}

export const ConnectedSelectableMatchList = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SelectableMatchList);
