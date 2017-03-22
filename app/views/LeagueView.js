import React, { Component } from 'react'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import { TabBar } from '../components'
import TableView from './TableView'
import SelectableMatchListView from './SelectableMatchListView'
import { backgroundColor } from '../components/base/theme'


class LeagueView extends Component {


    render() {
        
        return (
            <ScrollableTabView
                style={{ backgroundColor, flex: 1 }}
                renderTabBar={() => (<TabBar />)}>
                <TableView { ...this.props } tabLabel='TABELLE' />
                <SelectableMatchListView tabLabel='BEGEGNUNGEN' { ...this.props }  />
            </ScrollableTabView>
        )
    }
}

export default LeagueView