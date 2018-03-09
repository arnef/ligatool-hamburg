import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { sortBy } from 'lodash';
import { Container, Image, Text, Separator } from '../../components';
import Routes from '../../config/routes';

import styles from './styles';
import DrawerItem from './DrawerItem';
import DrawerItemLeague from './DrawerItemLeague';

import S from '../../lib/strings';
import { getActiveTeam } from '../../redux/modules/user';
import { sortCompetition } from '../../Helper';

function Drawer(props) {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: 'drawer' }} style={styles.image} />
        {!!props.team &&
          <View style={styles.teamContainer}>
            {!!props.team.emblemUrl &&
              <Image url={props.team.emblemUrl} style={styles.teamLogo} />}
            <Text style={styles.teamName} numberOfLines={2}>
              {props.team.name}
            </Text>
          </View>}
      </View>
      <Container>
        <DrawerItem
          routeName={Routes.OVERVIEW}
          icon="football"
          name={S.OVERVIEW}
        />
        <DrawerItem
          routeName={Routes.MY_TEAM}
          icon={props.team ? 'shirt' : 'log-in'}
          name={props.team ? S.MY_TEAM : S.SELECT_TEAM}
        />
        <Separator full />
        {props.leagues.map(league =>
          <DrawerItemLeague key={`league-${league.id}`} league={league} />,
        )}
        <Separator full />
        <DrawerItem
          routeName={Routes.SETTINGS}
          icon="settings"
          name={S.SETTINGS}
        />
      </Container>
    </View>
  );
}

export default connect(state => ({
  team: getActiveTeam(state),
  leagues: sortBy(state.drawer, sortCompetition),
}))(Drawer);
