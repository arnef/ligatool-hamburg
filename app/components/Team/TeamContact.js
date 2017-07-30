// @flow
import React from 'react';
import { View, Linking, Alert } from 'react-native';
import { ListItem, Touchable, Icon, Text, Separator } from '../../components';
import S from '../../lib/strings';

export default function TeamContact(props): ReactElement<any> {
  function call(number) {
    Linking.openURL('tel:' + number).catch(() =>
      Alert.alert(S.PHONE_APP_NOT_FOUND),
    );
  }

  function mail(email) {
    Linking.openURL('mailto:' + email).catch(() =>
      Alert.alert(S.MAIL_APP_NOT_FOUND),
    );
  }

  return (
    <ListItem.Group>
      <ListItem.Header title={S.CONTACT} />
      {props.contacts.map((contact, index) =>
        <View key={`contact-${index}`}>
          <ListItem>
            <Touchable
              style={{ flex: 1 }}
              onPress={() =>
                contact.phone_number
                  ? call(contact.phone_number)
                  : mail(contact.email)}
            >
              <View
                style={{ flexDirection: 'row', alignItems: 'center', flex: 0 }}
              >
                <Text
                  style={{ flex: 1 }}
                >{`${contact.name} ${contact.surname}`}</Text>
                <Icon
                  color={props.color}
                  name={contact.phone_number ? 'call' : 'mail'}
                  size={32}
                />
              </View>
            </Touchable>
            {!!contact.phone_number &&
              <Touchable
                onPress={() => mail(contact.email)}
                style={{ paddingLeft: 16 }}
              >
                <Icon color={props.color} name="mail" size={32} />
              </Touchable>}
          </ListItem>
          {index < props.contacts.length - 1 && <Separator />}
        </View>,
      )}
    </ListItem.Group>
  );
}
