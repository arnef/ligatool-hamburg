import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { StaticListHeader, Text, Separator, Content } from '../../components';
import {
  navigate,
  getNavigationStateParams,
} from '../../redux/modules/navigation';
import Routes from '../../config/routes';
import S from '../../lib/strings';
import Player from './Player';
import styles from './styles';
import { queryPlayerStats } from '../../redux/actions';

function PlayerStatsList(props) {
  const dataSource =
    props.leagues[getNavigationStateParams(props.navigation).id] &&
    props.leagues[getNavigationStateParams(props.navigation).id].players
      ? props.leagues[getNavigationStateParams(props.navigation).id].players
      : null;

  return (
    <View style={styles.container}>
      {dataSource &&
        dataSource.length > 0 && (
          <StaticListHeader>
            <View style={styles.header}>
              <View style={styles.position} />
              <View style={styles.playerImage} />
              <Text small color="#fff" style={styles.playerName} numberOfLines={1}>
                {S.NAME}
              </Text>
              <Text small color="#fff" style={styles.rate} numberOfLines={1}>
                {S.RATE_SHORT}
              </Text>
              <Text small color="#fff" style={styles.matches} numberOfLines={1}>
                {S.GAMES}
              </Text>
              {!!dataSource[0].competitiveIndex && (
                <Text small color="#fff" style={styles.competitiveIndex} numberOfLines={1}>
                  {S.COMPETITIVE_INDEX_SHORT}
                </Text>
              )}
              {!dataSource[0].competitiveIndex && (
                <Text small color="#fff" style={styles.competitiveIndex} numberOfLines={1}>
                  {S.GAME_POINTS_POSITIV}
                </Text>
              )}
            </View>
          </StaticListHeader>
        )}
      <Content
        onRefresh={props.queryPlayerStats}
        renderItem={({ item }) => (
          <Player {...item} onPress={props.openPlayer} />
        )}
        renderSeparator={() => <Separator table image />}
        listEmptyText={S.NO_PLAYER_STATS}
        data={dataSource}
      />
    </View>
  );
}

export default connect(
  state => ({
    leagues: state.leagues,
  }),
  (dispatch, props) => ({
    queryPlayerStats: () =>
      dispatch(queryPlayerStats(getNavigationStateParams(props.navigation).id)),
    navigate: (routeName, params) => dispatch(navigate({ routeName, params })),
    openPlayer: player =>
      dispatch(navigate({ routeName: Routes.PLAYER, params: player })),
  }),
)(PlayerStatsList);
