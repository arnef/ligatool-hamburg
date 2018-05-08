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
import { Platform, Linking, Alert } from 'react-native';
import { ListItem, Text } from '@app/components';
import { Strings } from '@app/lib/strings';
import { IS_IOS } from '@app/consts';

interface Props {
  venue: any;
  color: string;
}
export class TeamVenue extends React.PureComponent<Props> {
  private onPress = () => {
    const address = `${this.props.venue.street}, ${this.props.venue.zipCode} ${
      this.props.venue.city
    }`;
    const uri = IS_IOS
      ? 'http://maps.apple.com/?address='
      : 'geo:53.5586526,9.6476386?q=';

    Linking.openURL(uri + encodeURI(address)).catch(() => {
      Alert.alert(Strings.MAPS_APP_NOT_FOUND);
    });
  };
  public render() {
    return (
      <ListItem.Group>
        <ListItem.Header title={Strings.HOME_VENUE} />
        <ListItem multiline onPress={this.onPress}>
          <Text style={{ flex: 1 }}>
            {`${this.props.venue.name}\n${this.props.venue.street}, ${
              this.props.venue.zipCode
            } ${this.props.venue.city}`}
          </Text>
          <ListItem.Icon right name="pin" color={this.props.color} />
        </ListItem>
      </ListItem.Group>
    );
  }
}
