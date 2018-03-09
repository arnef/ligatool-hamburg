import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { Container, StaticListHeader, Text, Separator } from '../../components';
import * as LeaguesActions from '../../redux/modules/leagues';
import * as NavigationActions from '../../redux/modules/navigation';
import Routes from '../../config/routes';
import S from '../../lib/strings';
import TableItem from './TableItem';
import styles from './styles';

function Table(props) {
  function onPress(team) {
    props.navigate(Routes.TEAM, {
      team: { id: team.teamId, groupId: team.teamGroupId },
      title: team.teamName,
    });
  }
  const table = props.leagues[props.navigation.state.params.id]
    ? props.leagues[props.navigation.state.params.id].table || []
    : [];
  const showDetails = props.leagues[props.navigation.state.params.id]
    ? props.leagues[props.navigation.state.params.id].standing > 0
    : false;
  return (
    <View style={styles.container}>
      {showDetails &&
        <StaticListHeader>
          <View style={styles.header}>
            <Text style={styles.position} />
            <View style={styles.teamLogo} />
            <View style={styles.teamName} />
            <Text small color="#fff" style={styles.matches}>
              {S.GAMES_SHORT}
            </Text>
            <Text small color="#fff" style={styles.setPoints}>
              {S.SETS}
            </Text>
            <Text small color="#fff" style={styles.goals}>
              {/* {S.GOALS} */}
              Spiele
            </Text>
            <Text small color="#fff" style={styles.points}>
              {S.POINTS_SHORT}
            </Text>
          </View>
        </StaticListHeader>}
      <Container
        error={props.error}
        refreshing={props.loading}
        onRefresh={() => props.getTable(props.navigation.state.params.id)}
        renderRow={({ item }) =>
          <TableItem details={showDetails} data={item} onPress={onPress} />}
        keyExtractor={(item, idx) => `${item.rank}-${idx}`}
        ItemSeparatorComponent={() => <Separator table image />}
        ListEmptyComponent={
          <Text
            secondary
            style={{
              padding: 16,
              textAlign: 'center',
            }}
          >
            {`${!props.loading ? 'Keine Tabelle' : ''}`}
          </Text>
        }
        dataSource={table}
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
  dispatch => ({
    getTable: id => dispatch(LeaguesActions.getLeague(id)),
    navigate: (routeName, params) =>
      dispatch(NavigationActions.navigate({ routeName, params })),
  }),
)(Table);
