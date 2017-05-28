import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { TabBarBottom } from 'react-navigation';

class NavTabBarBottom extends Component {
  render() {
    return <TabBarBottom {...this.props} activeTintColor={this.props.color} />;
  }
}

export default connect(state => ({ color: state.settings.color }))(
  NavTabBarBottom,
);
