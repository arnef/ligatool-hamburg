import React, { Component } from 'react';
import { View, Picker, ActionSheetIOS } from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import { Toolbar } from '../components';
import TableView from './TableView';
import SelectableMatchListView from './SelectableMatchListView';
import { Button } from '../ui';

class LeagueView extends Component {


    render() {
        
        return (
            <ScrollableTabView
                style={this.props.style}
                renderTabBar={() => (<Toolbar.Tabs />)}>
                <TableView { ...this.props } tabLabel="TABELLE" />
                <View tabLabel="BEGEGNUNGEN" style={{flex: 1}}>
                    <SelectableMatchListView { ...this.props }  />
                </View>
            </ScrollableTabView>
        )
    }
}

export default LeagueView;