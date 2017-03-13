import React, { Component } from 'react';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import { TabBar } from '../components';
import TableView from './TableView';
import SelectableMatchListView from './SelectableMatchListView';

class LeagueView extends Component {


    render() {
        
        return (
            <ScrollableTabView
                style={this.props.style}
                renderTabBar={() => (<TabBar />)}>
                <TableView { ...this.props } tabLabel="TABELLE" />
                <SelectableMatchListView tabLabel="BEGEGNUNGEN" { ...this.props }  />
            </ScrollableTabView>
        )
    }
}

export default LeagueView;