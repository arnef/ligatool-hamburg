import React, { Component } from 'react';
import { Icon, Image } from '../components/base';
import * as theme from '../components/base/theme';

const iconSize = 32;
const bigIconSize = 42;

class TeamLogo extends Component {
  render() {
    if (this.props.team.image) {
      return (
        <Image
          url={this.props.team.image}
          size={this.props.big ? bigIconSize : iconSize}
          style={{ marginHorizontal: 8 }}
        />
      );
    } else {
      return (
        <Icon
          size={this.props.big ? bigIconSize : iconSize}
          name="shirt"
          style={{ marginHorizontal: 8 }}
          color={theme.secondaryTextColor}
        />
      );
    }
  }
}

export default TeamLogo;
