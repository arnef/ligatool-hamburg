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
import { View, Linking, Alert } from 'react-native';
import { ListItem, Touchable, Icon, Text, Separator } from '@app/components';
import { Strings } from '@app/lib/strings';

interface Props {
  color: string;
  contacts: Array<any>;
}

export class TeamContact extends React.PureComponent<Props> {
  private call = (number: string) => {
    Linking.openURL('tel:' + number).catch(() =>
      Alert.alert(Strings.PHONE_APP_NOT_FOUND),
    );
  };

  private mail = (email: string) => () => {
    Linking.openURL('mailto:' + email).catch(() =>
      Alert.alert(Strings.MAIL_APP_NOT_FOUND),
    );
  };

  private onPress = (contact: any) => () => {
    if (contact.phoneNumber) {
      this.call(contact.phoneNumber);
    } else {
      this.mail(contact.email)();
    }
  };

  public render() {
    return (
      <ListItem.Group>
        <ListItem.Header title={Strings.CONTACT} />
        {this.props.contacts.map((contact, index) => (
          <View key={`contact-${index}`}>
            <ListItem>
              <Touchable style={{ flex: 1 }} onPress={this.onPress(contact)}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    flex: 0,
                  }}
                >
                  <Text style={{ flex: 1 }}>{`${contact.name} ${
                    contact.surname
                  }`}</Text>
                  <Icon
                    color={this.props.color}
                    name={contact.phoneNumber ? 'call' : 'mail'}
                    size={32}
                  />
                </View>
              </Touchable>
              {!!contact.phoneNumber && (
                <Touchable
                  onPress={this.mail(contact.email)}
                  style={{ paddingLeft: 16 }}
                >
                  <Icon color={this.props.color} name="mail" size={32} />
                </Touchable>
              )}
            </ListItem>
            {index < this.props.contacts.length - 1 && <Separator />}
          </View>
        ))}
      </ListItem.Group>
    );
  }
}
