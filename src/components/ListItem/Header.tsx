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
import { connect } from 'react-redux';
import { Text } from '@app/components';
import { getColor } from '@app/redux/modules/user';
import styles from './styles';

export interface Props extends StateProps {
  title: string;
}
class ListItemHeader extends React.PureComponent<Props> {
  public render() {
    return (
      <View style={styles.header}>
        <Text bold style={styles.headerText} color={this.props.color}>
          {this.props.title}
        </Text>
      </View>
    );
  }
}

interface StateProps {
  color: string;
}

function mapStateToProps(state: any): StateProps {
  return {
    color: getColor(state),
  };
}

export const ConnectedHeader = connect(mapStateToProps)(ListItemHeader);