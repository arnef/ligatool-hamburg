import React from 'react';
import { Platform, Linking, Alert } from 'react-native';
import { ListItem, Text } from '../../components';
import S from '../../lib/strings';

export default function TeamVenue(props) {
  function onPress() {
    const address = `${props.venue.street}, ${props.venue.zipCode} ${props.venue
      .city}`;
    const uri =
      Platform.OS === 'ios'
        ? 'http://maps.apple.com/?address='
        : 'geo:53.5586526,9.6476386?q=';

    Linking.openURL(uri + encodeURI(address)).catch(() =>
      Alert.alert(S.MAPS_APP_NOT_FOUND),
    );
  }

  return (
    <ListItem.Group>
      <ListItem.Header title={S.HOME_VENUE} />
      <ListItem multiline onPress={onPress}>
        <Text style={{ flex: 1 }}>{`${props.venue.name}\n${props.venue
          .street}, ${props.venue.zipCode} ${props.venue.city}`}</Text>
        <ListItem.Icon right name="pin" color={props.color} />
      </ListItem>
    </ListItem.Group>
  );
}
