import React, { Component } from 'react';
import { connect } from 'react-redux';

import { TabBarBottom } from 'react-navigation';
import { getColor } from '../redux/modules/user';

class NavTabBarBottom extends Component {
  render() {
    return <TabBarBottom {...this.props} activeTintColor={this.props.color} />;
  }
}

export default connect(state => ({ color: getColor(state) }))(NavTabBarBottom);
