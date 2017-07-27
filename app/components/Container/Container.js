import React, { Component } from 'react';
import { View, ScrollView, FlatList, RefreshControl } from 'react-native';
import { connect } from 'react-redux';
import ErrorFlash from '../ErrorFlash';

class Container extends Component {
  constructor(props) {
    super(props);
    if (this.props.getRef) {
      this.props.getRef(this);
    }
  }

  render() {
    const refreshControl = (
      <RefreshControl
        colors={[this.props.color]}
        refreshing={this.props.refreshing || false}
        onRefresh={this.props.onRefresh}
      />
    );
    const style = { flex: 1 };

    if (this.props.renderRow) {
      return (
        <View style={style}>
          <ErrorFlash
            error={this.props.error}
            onRefresh={this.props.onRefresh}
          />
          <FlatList
            style={{ flex: 1 }}
            onScroll={this.props.onScroll}
            scrollEventThrottle={0}
            keyboardShouldPersistTaps="handled"
            ItemSeparatorComponent={this.props.ItemSeparatorComponent}
            refreshControl={this.props.onRefresh ? refreshControl : null}
            renderItem={this.props.renderRow}
            keyExtractor={this.props.keyExtractor}
            data={this.props.dataSource}
            ref={scrollview => {
              this.scrollView = scrollview;
            }}
            ListFooterComponent={this.props.ListFooterComponent}
            ListEmptyComponent={this.props.ListEmptyComponent}
            getItemLayout={this.props.getItemLayout}
          />
        </View>
      );
    } else {
      return (
        <View style={style}>
          <ErrorFlash
            error={this.props.error}
            onRefresh={this.props.onRefresh}
          />
          <ScrollView
            keyboardShouldPersistTaps="handled"
            automaticallyAdjustContentInsets={false}
            onScroll={this.props.onScroll}
            scrollEventThrottle={0}
            refreshControl={this.props.onRefresh ? refreshControl : null}
            ref={scrollview => {
              this.scrollView = scrollview;
            }}
            style={{ flex: 1 }}
          >
            {this.props.children}
          </ScrollView>
        </View>
      );
    }
  }

  scrollTo(params) {
    if (this.scrollView) {
      setTimeout(() => {
        if (this.scrollView.scrollToOffset) {
          this.scrollView.scrollToOffset(params);
        } else if (this.scrollView.scrollTo) {
          this.scrollView.scrollTo(params);
        }
      }, 100);
    }
  }
}

export default connect(state => ({
  color: state.settings.color,
}))(Container);
