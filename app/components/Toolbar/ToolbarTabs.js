import React, { Component } from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import { connect } from 'react-redux';
import Touchable from '../Touchable';
import { Text } from '../Styles';

class ToolbarTabs extends Component {
    render() {
        const containerWidth = this.props.containerWidth;
        const numberOfTabs = this.props.tabs.length;

        const tabUnderlineStyle = {
            position: 'absolute',
            width: containerWidth / numberOfTabs,
            height: 3,
            backgroundColor: '#fff',
            bottom: 0            
        };

        const left = this.props.scrollValue.interpolate({
            inputRange: [0, 1], 
            outputRange:[0, containerWidth / numberOfTabs]
        });

        return (
            <View style={[styles.tabs, { backgroundColor: this.props.color}]}>
                { this.props.tabs.map( (name, page) => {
                    const isTabActive = this.props.activeTab === page;
                    return this.renderTab(name, page, isTabActive, this.props.goToPage);
                })}
                <Animated.View style={[tabUnderlineStyle, { left }]} />
            </View>
        )
    }

    renderTab(name, page, isActive, onPressHandler) {
        return (
            <Touchable key={name} 
                style={styles.tab}
                onPress={() => onPressHandler(page)}>
                <Text bold color={ isActive ? '#fff' : 'rgba(255, 255, 255, 0.7)'}>{name}</Text>  
            </Touchable>
        );
    }
}

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 2,
  },
  tabs: {
    height: 46,
    maxHeight: 46,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderWidth: 0
  },
});

export default connect(state => ({
    color: state.settings.color
}))(ToolbarTabs);