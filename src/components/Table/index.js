import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { StaticListHeader, Text, Separator, Content } from '../../components';
import * as LeaguesActions from '../../redux/modules/leagues';
import {
  getNavigationStateParams,
  navigate,
} from '../../redux/modules/navigation';
// import Routes from '../../config/routes';
import { Routes } from '@app/scenes/routes';
import { Strings as S } from '../../lib/strings';
import TableItem from './TableItem';
import styles from './styles';

function Table(props) {
  function onPress(team) {
    props.navigate(Routes.teamDetails, {
      team: { id: team.teamId, groupId: team.teamGroupId },
      title: team.teamName,
    });
  }
  const table = props.leagues[getNavigationStateParams(props.navigation).id]
    ? props.leagues[getNavigationStateParams(props.navigation).id].table
    : null;
  const showDetails = props.leagues[
    getNavigationStateParams(props.navigation).id
  ]
    ? props.leagues[getNavigationStateParams(props.navigation).id].standing > 0
    : false;
  return (
    <View style={styles.container}>
      {showDetails && (
        <StaticListHeader>
          <View style={styles.header}>
            <Text style={styles.position} />
            <View style={styles.teamLogo} />
            <View style={styles.teamName} />
            <Text small color="#fff" style={styles.matches} numberOfLines={1}>
              {S.GAMES_SHORT}
            </Text>
            <Text small color="#fff" style={styles.setPoints} numberOfLines={1}>
              {S.SETS}
            </Text>
            <Text small color="#fff" style={styles.goals} numberOfLines={1}>
              {/* {S.GOALS} */}
              {S.GAMES}
            </Text>
            <Text small color="#fff" style={styles.points} numberOfLines={1}>
              {S.POINTS_SHORT}
            </Text>
          </View>
        </StaticListHeader>
      )}
      <Content
        onRefresh={props.getTable}
        renderItem={({ item }) => (
          <TableItem details={showDetails} data={item} onPress={onPress} />
        )}
        renderSeparator={() => <Separator table image />}
        listEmptyText={S.NO_STANDING}
        data={table}
      />
    </View>
  );
}

export default connect(
  state => ({
    leagues: state.leagues,
  }),
  (dispatch, props) => ({
    getTable: () =>
      dispatch(
        LeaguesActions.getLeague(getNavigationStateParams(props.navigation).id),
      ),
    navigate: (routeName, params) => dispatch(navigate({ routeName, params })),
  }),
)(Table);
