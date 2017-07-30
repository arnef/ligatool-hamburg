// @flow
import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import {
  StaticListHeader,
  Container,
  ListItem,
  Text,
  Separator,
} from '../../components';
import * as NavigatationActions from '../../redux/modules/navigation';
import Routes from '../../config/routes';
import S from '../../lib/strings';
import Player from './Player';
import styles from './styles';

function PlayerStatsList(props): ReactElement<any> {
  function onPress(player) {
    props.navigate(Routes.PLAYER, player);
  }

  const dataSource =
    props.leagues[props.navigation.state.params.id].players || [];

  return (
    <View style={styles.container}>
      <StaticListHeader>
        <View style={styles.header}>
          <View style={styles.position} />
          <View style={styles.playerImage} />
          <Text small color="#fff" style={styles.playerName}>
            {S.NAME}
          </Text>
          <Text small color="#fff" style={styles.rate}>
            {S.RATE_SHORT}
          </Text>
          <Text small color="#fff" style={styles.matches} numberOfLines={1}>
            {S.GAMES}
          </Text>
          <Text small color="#fff" style={styles.competitiveIndex}>
            {S.COMPETITIVE_INDEX_SHORT}
          </Text>
        </View>
      </StaticListHeader>
      <Container
        error={props.error}
        refreshing={props.loading}
        onRefresh={() => {}}
        renderRow={({ item }) => <Player {...item} onPress={onPress} />}
        dataSource={dataSource}
        keyExtractor={item => `${item.position}`}
        ItemSeparatorComponent={() => <Separator table image />}
        getItemLayout={(data, index) => ({
          length: ListItem.ITEM_HEIGHT,
          offset: ListItem.ITEM_HEIGHT * index,
          index,
        })}
      />
    </View>
  );
}

export default connect(
  state => ({
    error: state.loading.error,
    loading: state.loading.list,
    leagues: state.leagues,
  }),
  (dispatch: Dispatch<any>) => ({
    navigate: (routeName, params) =>
      dispatch(NavigatationActions.navigate({ routeName, params })),
  }),
)(PlayerStatsList);