import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import Text from '../../Text';

class ListItemHeader extends Component {
  render() {
    const { title } = this.props;

    return (
      <View style={styles.header}>
        <Text bold style={styles.headerText} color={this.props.color}>
          {title}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingBottom: 12,
  },
  headerText: {
    marginBottom: 0,
    marginHorizontal: 16,
    marginTop: 0,
  },
});

export default connect(state => ({
  color: state.settings.color,
}))(ListItemHeader);
