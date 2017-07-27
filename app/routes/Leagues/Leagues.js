// @flow
import React from 'react';
import { connect } from 'react-redux';
import { sortBy } from 'lodash';
import { Container, ListItem, Text, Separator } from '../../components';
import * as NavigationActions from '../../redux/modules/navigation';
import * as LeaguesActions from '../../redux/modules/leagues';
import Routes from '../../config/routes';

function LeaguesView(props): ReactElement<any> {
  return (
    <Container
      error={props.error}
      refreshing={props.loading}
      onRefresh={props.getLeagues}
      keyExtractor={item => `${item.id}`}
      dataSource={props.leagues}
      ItemSeparatorComponent={Separator}
      renderRow={({ item }) =>
        <ListItem
          onPress={() =>
            props.navigate(item.cup ? Routes.LEAGUE_CUP : Routes.LEAGUE, {
              id: item.id,
              title: item.name,
            })}
        >
          <Text>
            {item.name}
          </Text>
        </ListItem>}
    />
  );
}

export default connect(
  state => ({
    error: state.loading.error,
    loading: state.loading.list,
    leagues: sortBy(state.drawer, 'name'),
  }),
  (dispatch: Dispatch<any>) => ({
    getLeagues: () => dispatch(LeaguesActions.getLeagues()),
    navigate: (routeName, params) =>
      dispatch(NavigationActions.navigate({ routeName, params })),
  }),
)(LeaguesView);
