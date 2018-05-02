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
import { connect, Dispatch } from 'react-redux';
import { sortBy } from 'lodash';
import { sortCompetition } from 'src/Helper'
import { navigate } from 'src/redux/modules/navigation';
import { ListItem, Text, Content, Separator } from '../../../../../components';
import { Routes } from 'src/scenes/routes';

interface Props extends StateProps, DispatchProps {}

class SettingsCompetitions extends React.PureComponent<Props> {
  private onOpenCompetition = (competitionId: string ) => () => {
    this.props.openCompetiton(competitionId);
  }
  private renderRow = ({ item }: { item: any }) => {
    return (
      <ListItem onPress={this.onOpenCompetition(item.id)}>
        <Text style={{ flex: 1 }}>{`${item.name}`}</Text>
        <ListItem.Icon right name="caret-forward" />
      </ListItem>
    );
  }

  public render() {
    return (
      <Content
        data={this.props.competitions} 
        renderItem={this.renderRow}
        renderSeparator={Separator}
      />
    )
  }
}

interface StateProps {
  competitions: Array<any>
}

interface DispatchProps {
  openCompetiton: Function
}

function mapStateToProps(state: any): StateProps {
  return {
    competitions: sortBy(state.drawer, sortCompetition),
  };
}

function mapDispatchToProps(dispatch: Dispatch<any>): DispatchProps {
  return {
    openCompetiton: (competitionId: string) => dispatch(navigate({
      routeName: Routes.settingsNotificationsTeams,
      params: { competitionId }
    }))
  };
}

export const SettingsNotificationCompetitions = connect(mapStateToProps, mapDispatchToProps)(SettingsCompetitions)