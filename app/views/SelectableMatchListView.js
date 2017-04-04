import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import actions from '../store/actions'
import { ListItem, Text } from '../components/base'
import { Container, MatchItem } from '../components'
import { NavigationActions } from 'react-navigation'
// import NavIcon from '../Nav/NavIcon'

class SelectableMatchListView extends Component {

    constructor(props) {
        super(props)
        this.state = {
            matchDays: [],
            selectedMatchDay: null,
            showDropdown: false
        }
    }

    componentDidMount() {
        const id = this.props.navigation.state.params.id

        if (!this.props.league.matches[`${id}`]) {
            this.props.getLeagueMatches(id)
        } else {
            this.getMatchDays()
        }
    }

    componentWillReceiveProps(nextProps) {
        const id = nextProps.navigation.state.params.id

        // console.tron.log('view receive new props')
        if (nextProps.league.matches[`${id}`]) {
            // console.tron.log('update match days')
            this.getMatchDays()
        }
    }

    render() {
        const id = this.props.navigation.state.params.id

        const props = {
            error: this.props.league.error,
            onRefresh: () => { this.props.getLeagueMatches(id)},
            refreshing: this.props.league.loading
        }

        const matches = this.props.league.matches[`${id}`] || []
        const matchDays = this.state.matchDays

        return (
            <Container { ...this.props} { ...props } getRef={container => { this.container = container }}>
                { matches.length > 0 && (
                    <ListItem.Group>
                        <ListItem.Header
                            hideSeparator={!this.state.showDropdown}
                            menuOpen={this.state.showDropdown}
                            title={'Spieltag wählen'}
                            toggleMenu={this.onPress.bind(this)}>
                                { this.state.selectedMatchDay }
                            </ListItem.Header>
                        { this.state.showDropdown && matchDays.map((matchDay, idx) => {
                            return (
                                <ListItem key={idx}
                                    onPress={() => { this.onSelectMatchDay(matchDay) }}
                                    last={idx === matchDays.length -1}><Text>{ matchDay }</Text>
                                </ListItem>)
                        })
                        }
                    </ListItem.Group>
                )}
                { !this.state.showDropdown && matches.map((match) => {
                    if (match.match_day === this.state.selectedMatchDay) {
                        return (<MatchItem key={match.id}  data={match} />)
                    }
                })}
            </Container>
        )
    }

    // onPressMatch(match) {
    //     // const match = this.props.matches[mid]

    //     this.props.pushRoute({
    //         routeName: 'Match',
    //         params: { id: match.id }
    //     })
    // }

    getMatchDays() {
        const id = this.props.navigation.state.params.id
        const matchDays = []
        const matches = this.props.league.matches[`${id}`] || []
        let selectedMatchDay = null

        for (let match of matches) {
            if (matchDays.indexOf(match.match_day) === -1) {
                matchDays.push(match.match_day)
            }
            if (!match.set_points && !selectedMatchDay) {
                selectedMatchDay = match.match_day
            }
        }
        if (!selectedMatchDay) {
            selectedMatchDay = matchDays[matchDays.length-1]
        }
        this.setState({ matchDays, selectedMatchDay })
    }

    onSelectMatchDay(matchDay) {
        this.setState({ selectedMatchDay: matchDay, showDropdown: false })
        if (this.container && this.container.scrollTo) {
            this.container.scrollTo({ animated: true, x: 0 , y: 0 })
        }
    }

    onPress() {
        this.setState({ showDropdown: !this.state.showDropdown })
    }
}

// SelectableMatchListView.navigationOptions = {
//     title: 'Begegnungen',
//     tabBar: {
//         label: 'Begegnungen',
//         icon: ({ tintColor }) => NavIcon('trophy', tintColor)
//     }
// }

SelectableMatchListView.propTypes = {
    getLeagueMatches: PropTypes.func,
    league: PropTypes.object,
    pushRoute: PropTypes.func
}

export default connect(
    state => ({
        league: state.league,
        matches: state.matches.data
    }),
    dispatch => ({
        getLeagueMatches: (id) => dispatch(actions.getLeagueMatches(id)),
        pushRoute: (route) => dispatch(NavigationActions.navigate(route))
    })
)(SelectableMatchListView)