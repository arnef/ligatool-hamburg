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
          <ErrorFlash error={this.props.error} onRefresh={this.props.onRefresh} />
          <FlatList
            style={{flex: 1}}
            keyboardShouldPersistTaps="handled"
            ItemSeparatorComponent={this.props.ItemSeparatorComponent}
            refreshControl={!!this.props.onRefresh ? refreshControl : null}
            renderItem={this.props.renderRow}
            keyExtractor={this.props.keyExtractor}
            data={this.props.dataSource}
            ref={scrollview => {
              this.scrollView = scrollview;
            }}
            getItemLayout={this.props.getItemLayout}
          />
        </View>
      );
    } else {
      return (
        <View style={style}>
          <ErrorFlash error={this.props.error} onRefresh={this.props.onRefresh} />
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
