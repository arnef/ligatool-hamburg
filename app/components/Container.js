import React, { Component } from 'react';
import {
  View,
  ScrollView,
  FlatList,
  RefreshControl,
  ListView
} from 'react-native';
import { connect } from 'react-redux';
import ErrorFlash from './ErrorFlash';
import * as theme from './base/theme';

class Container extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
    };
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
          <ErrorFlash error={this.props.error} />
          <FlatList
            style={{flex: 1}}
            keyboardShouldPersistTaps="handled"
            refreshControl={!!this.props.onRefresh ? refreshControl : null}
            renderItem={this.props.renderRow}
            keyExtractor={this.props.keyExtractor}
            data={this.props.dataSource}
          />
        </View>
      );
    } else {
      return (
        <View style={style}>
          <ErrorFlash error={this.props.error} />
          <ScrollView
            keyboardShouldPersistTaps="handled"
            automaticallyAdjustContentInsets={false}
            onScroll={this.props.onScroll}
            scrollEventThrottle={200}
            refreshControl={!!this.props.onRefresh ? refreshControl : null}
            ref={scrollview => {
              this.scrollView = scrollview;
            }}
            style={{ flex: 1 }}
          >
            <View style={{ paddingVertical: 4 }}>
              {this.props.children}
            </View>
          </ScrollView>
        </View>
      );
    }
  }

  scrollTo(params) {
    if (this.scrollView) {
      setTimeout(() => {
        this.scrollView.scrollTo(params);
      }, 100);
    }
  }

  renderFooter() {
    return <View style={{ height: 4 }} />;
  }

  renderHeader() {
    return <View style={{ height: 0 }} />;
  }
}

export default connect(state => ({
  color: state.settings.color
}))(Container);
