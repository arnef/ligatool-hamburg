import React, { Component } from 'react';
import {
  FlatList,
  SectionList,
  ScrollView,
  View,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Text } from '../../components';
import { connect } from 'react-redux';

import styles from './styles';
import { getColor } from '../../redux/modules/user';

function ListEmptyComponent(props) {
  return (
    <Text secondary style={styles.emptyListText}>
      {`${props.text}`}
    </Text>
  );
}

function keyExtractor(item, index) {
  return item.id ? `${item.id}` : `content-${index}`;
}

class Content extends Component {
  constructor(props) {
    super(props);
    if (this.props.reference) {
      this.props.reference(this);
    }
  }

  render() {
    const {
      onRefresh,
      color,
      listEmptyText,
      sections,
      renderItem,
      renderSectionHeader,
      renderSeparator,
      data,
      children,
    } = this.props;
    const Refresh = onRefresh ? (
      <RefreshControl
        colors={[color]}
        refreshing={false}
        onRefresh={onRefresh}
      />
    ) : null;
    const ListEmpty = listEmptyText ? (
      <ListEmptyComponent text={listEmptyText} />
    ) : this.props.ListEmptyComponent ? (
      this.props.ListEmptyComponent
    ) : null;
    if (sections) {
      // section list view
      return (
        <SectionList
          sections={sections}
          // removeClippedSubviews
          // disableVirtualization
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          ItemSeparatorComponent={renderSeparator}
          // stickySectionHeadersEnabled={true}
          keyExtractor={keyExtractor}
          ListEmptyComponent={ListEmpty}
          refreshControl={Refresh}
          ref={list => (this.list = list)}
        />
      );
    } else if (data) {
      // flat list view
      return (
        <FlatList
          data={data}
          renderItem={renderItem}
          ItemSeparatorComponent={renderSeparator}
          keyExtractor={keyExtractor}
          ListEmptyComponent={ListEmpty}
          refreshControl={Refresh}
          extraData={this.props.extraData}
          ref={list => (this.list = list)}
        />
      );
    } else if (children) {
      // scroll list with children
      return <ScrollView refreshControl={Refresh}>{children}</ScrollView>;
    } else {
      // no data available show loading indicator
      return (
        <View style={styles.activityIndicator}>
          <ActivityIndicator color={color} size="large" />
        </View>
      );
    }
  }

  scrollToOffset = params => {
    if (this.list && this.list.scrollToOffset) {
      setTimeout(() => {
        this.list.scrollToOffset(params);
      }, 100);
    }
  };
}

export default connect(state => ({
  color: getColor(state),
}))(Content);
