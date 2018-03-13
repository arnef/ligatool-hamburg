import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { sortBy } from 'lodash';
import {
  Container,
  ListItem,
  Switch,
  Separator,
  Text,
  Button,
} from '../../components';
import * as SettingsActions from '../../redux/modules/settings';

class SettingsNotification extends React.Component {
  constructor(props) {
    super(props);
    this.renderItem = this.renderItem.bind(this);
  }

  renderItem({ item }) {
    const groups = this.props.notifications.leagues || {};

    return (
      <ListItem>
        <Switch
          title={item.name}
          value={groups[`${item.id}`]}
          onValueChange={() => this.props.toggleNotification(`${item.id}`)}
        />
      </ListItem>
    );
  }

  render() {
    const isSetup = this.props.navigation.state.routeName === 'SetupNotif';

    return (
      <View style={{ flex: 1 }}>
        <Container
          dataSource={this.props.leagues}
          renderRow={this.renderItem}
          keyExtractor={item => `${item.id}`}
          ListHeaderComponent={() => {
            if (isSetup) {
              return (
                <View style={{ padding: 12 }}>
                  <Text>
                    Wähle aus für welche Gruppen du Benachrichtigungen von
                    Ergebnissen bekommen möchtest. Die Gruppen können jederzeit
                    in den Einstellungen geändert werden.
                  </Text>
                </View>
              );
            } else {
              return null;
            }
          }}
          ItemSeparatorComponent={Separator}
        />
        {isSetup && (
          <Button
            square
            onPress={this.props.completeSetup}
            title="Einrichtug abschließen"
            padding={12}
          />
        )}
      </View>
    );
  }
}

export default connect(
  state => ({
    leagues: sortBy(state.drawer, 'name'),
    notifications: state.settings.notification,
  }),
  dispatch => ({
    toggleNotification: key =>
      dispatch(SettingsActions.toggleGroupNotification(key)),
    completeSetup: () => dispatch(SettingsActions.completeSetup()),
  }),
)(SettingsNotification);
