import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { setTitle } from '../../store/actions/routeActions'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import TeamView from '../TeamView'
import { TabBar } from '../../components'
import { backgroundColor } from '../../components/base/theme'


class PreviewMatch extends Component {

    componentDidMount() {
        this.props.setTitle(this.props.match.team_home.name)
    }

    onChangeTab(keys) {
        const { match } = this.props
        const title = keys.i === 0 ? match.team_home.name : match.team_away.name

        this.props.setTitle(title)
    }

    render() {
        const { match } = this.props

        return (
        <ScrollableTabView
            style={{ backgroundColor, flex: 1 }}
            onChangeTab={this.onChangeTab.bind(this)}
            prerenderingSiblingsNumber={0}
            renderTabBar={() => (<TabBar />)}>
            <TeamView {...this.props} team={match.team_home} tabLabel='HEIM' />
            <TeamView {...this.props} team={match.team_away} tabLabel='GAST' />
        </ScrollableTabView>
        )
    }
}

PreviewMatch.propTypes = {
    match: PropTypes.object,
    setTitle: PropTypes.func
}

export default connect(
    null,
    dispatch => ({
        setTitle: (title) => dispatch(setTitle(title))
    })
)(PreviewMatch)
