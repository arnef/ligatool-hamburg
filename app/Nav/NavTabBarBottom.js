import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { TabView } from 'react-navigation';

class NavTabBarTop extends Component {
  render() {
    return (
      <TabView.TabBarBottom
        {...this.props}
        activeTintColor={this.props.color}
      />
    );
  }
}

export default connect(state => ({ color: state.settings.color }))(
  NavTabBarTop,
);
