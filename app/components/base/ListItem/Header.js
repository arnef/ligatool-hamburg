import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import Text from '../Text';
import Icon from '../Icon';
import Touchable from '../Touchable';
import * as theme from '../theme';

class ListItemHeader extends Component {
  render() {
    const {
      toggleMenu,
      title,
      subtitle,
      menuOpen,
      closeIcon,
      children,
      hideSeparator
    } = this.props;
    const Container = !!toggleMenu ? Touchable : View;

    return (

        <View style={styles.header}>
          {/* <View style={styles.header}> */}
            <Text
              bold
              style={styles.headerText}
              color={this.props.color}
            >
              {title}
            </Text>

            {/* <View style={{ flex: 1 }} />
            {!!toggleMenu &&
              <Icon
                name={
                  menuOpen ? (closeIcon ? closeIcon : 'caret-up') : 'caret-down'
                }
                size={18}
                style={{ marginRight: 10, textAlign: 'right' }}
                color={theme.secondaryTextColor}
              />}
          </View> */}
          {/* {!!children &&
            <Text secondary size={12} style={styles.subHeaderText}>
              {children}
            </Text>} */}

        </View>

    );
  }
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingBottom: 12
  },
  headerText: {
    marginBottom: 0,
    marginHorizontal: 16,
    marginTop: 0
  },
  separator: {
    borderBottomColor: theme.backgroundColor,
    borderBottomWidth: 1
  },
  subHeaderText: {
    marginBottom: 0,
    marginHorizontal: 16,
    marginTop: 0
  }
});


export default connect(state => ({
  color: state.settings.color
}))(ListItemHeader);
