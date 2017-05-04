import React, { Component, PropTypes } from 'react';
import { Platform } from 'react-native';
import { Icon, Image } from '../components/base';
import * as theme from '../components/base/theme';

const iconSize = Platform.OS === 'ios' ? 29 : 24;
const bigIconSize = 42;

class TeamLogo extends Component {
  render() {
    if (this.props.team.image) {
      return (
        <Image
          url={this.props.team.image}
          size={this.props.big ? bigIconSize : iconSize}
        />
      );
    } else {
      return (
        <Icon
          size={this.props.big ? bigIconSize : iconSize}
          name="shirt"
          color={theme.secondaryTextColor}
        />
      );
    }
  }
}

TeamLogo.defaultProps = {
  big: false,
  url: {}
};

TeamLogo.propTypes = {
  big: PropTypes.bool,
  team: PropTypes.object.isRequired
};

export default TeamLogo;
