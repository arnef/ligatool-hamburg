import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { getRankings } from '../../store/actions/leagueActions'
import { Container } from '../../components'
import { ListItem, Text } from '../../components/base'
import { NavigationActions } from 'react-navigation'
import { MODAL_SELECT_TEAM } from '../../views/routes'

class SelectGroupView extends Component {


    componentDidMount() {
        console.tron.log(this.props.navigation.state.key)
        if (this.props.leagues.data.length === 0) {
            this.props.getRankings()
        }
    }

    render() {
        return (
            <Container
                error={this.props.leagues.error}
                refreshing={this.props.leagues.loading}
                onRefresh={this.props.getRankings.bind(this)}>
                { this.props.leagues.data.length > 0 && (
                    <ListItem.Group>
                        { this.props.leagues.data.map((league,idx) => {
                            if (!league.cup) {
                                return (
                                <ListItem key={league.id}
                                    last={idx >= this.props.leagues.data.length -2}
                                    onPress={() => this.onPress(league)}>
                                    <Text>{ league.name }</Text>
                                </ListItem>
                                )
                            }
                        })}
                    </ListItem.Group>
                )}
            </Container>
        )
    }

    onPress(league) {
        this.props.navigate({
            routeName: 'SelectTeam',
            params: { id: league.id }
        })
        // this.props.navigator.push({
        //     id: league.id,
        //     state: MODAL_SELECT_TEAM,
        //     title: 'Team wählen'
        // })
    }
}

SelectGroupView.propTypes = {
    getRankings: PropTypes.func,
    leagues: PropTypes.object,
    navigator: PropTypes.object
}

SelectGroupView.navigationOptions = {
    title: 'Gruppe wählen'
}

export default connect(
    state => ({
        leagues: state.leagues
    }),
    dispatch => ({
        getRankings: () => dispatch(getRankings()),
        navigate: (route) => dispatch(NavigationActions.navigate(route))
    })
)(SelectGroupView)