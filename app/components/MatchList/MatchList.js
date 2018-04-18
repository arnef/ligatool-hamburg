import React from 'react';
import { connect } from 'react-redux';
import { Content, MatchItem } from '../../components';

import S from '../../lib/strings';
function MatchList(props) {
  return (
    <Content
      onRefresh={props.onRefresh}
      renderItem={({ item }) => <MatchItem data={item} />}
      data={props.matches}
      listEmptyText={S.NO_FIXTURES}
    />
  );
}

export default connect(state => ({
  data: state.fixtures.data,
  error: state.loading.error,
  refreshing: state.loading.list,
}))(MatchList);
