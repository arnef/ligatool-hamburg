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

import { Content, ListItem, Separator, Text } from '@app/components';
import { sortCompetition } from '@app/helper';
import { navigate } from '@app/redux/modules/navigation';
import { Routes } from '@app/scenes/routes';
import { sortBy } from 'lodash';
import * as React from 'react';
import { connect, Dispatch } from 'react-redux';

interface IProps extends IStateProps, IDispatchProps {}

class SettingsCompetitions extends React.PureComponent<IProps> {
  public render() {
    return (
      <Content
        data={this.props.competitions}
        renderItem={this.renderRow}
        renderSeparator={Separator}
      />
    );
  }

  private onOpenCompetition = (competitionId: string) => () => {
    this.props.openCompetiton(competitionId);
  };

  private renderRow = ({ item }: { item: any }) => {
    return (
      <ListItem onPress={this.onOpenCompetition(item.id)}>
        <Text style={{ flex: 1 }}>{`${item.name}`}</Text>
        <ListItem.Icon right name="caret-forward" />
      </ListItem>
    );
  };
}

interface IStateProps {
  competitions: any[];
}

interface IDispatchProps {
  openCompetiton: (competitionId: string) => void;
}

function mapStateToProps(state: any): IStateProps {
  return {
    competitions: sortBy(state.drawer, sortCompetition),
  };
}

function mapDispatchToProps(dispatch: Dispatch<any>): IDispatchProps {
  return {
    openCompetiton: (competitionId: string) =>
      dispatch(
        navigate({
          params: { competitionId },
          routeName: Routes.settingsNotificationsTeams,
        }),
      ),
  };
}

export const SettingsNotificationCompetitions = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SettingsCompetitions);
