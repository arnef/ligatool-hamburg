// @flow
import React from 'react';
import { connect } from 'react-redux';
import Container from '../Container';
import Text from '../Text';
import MatchItem from '../MatchItem';

import styles from './styles';

function MatchList(props): ReactElement<any> {
  // console.log(props);

  return (
    <Container
      error={props.error}
      refreshing={props.refreshing}
      onRefresh={props.onRefresh}
      dataSource={props.matches}
      keyExtractor={item => `match-${item}`}
      ListEmptyComponent={() =>
        <Text secondary style={styles.emptyText}>
          {`${!props.refreshing ? 'Keine Begegnungen' : ''}`}
        </Text>}
      renderRow={({ item }) => <MatchItem data={props.data[item]} />}
    />
  );
}

export default connect(state => ({
  data: state.matches,
  error: state.loading.error,
  refreshing: state.loading.list,
}))(MatchList);
