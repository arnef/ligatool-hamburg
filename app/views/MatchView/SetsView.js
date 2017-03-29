import React, { Component, PropTypes } from 'react'
import { View, Keyboard, Dimensions, Platform, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import actions from '../../store/actions'
import { Container, Match } from '../../components'
import SelectPlayerModal from '../../modals/SelectPlayerModal'
import { Button } from '../../components/base'
import * as theme from '../../components/base/theme'

const height = Dimensions.get('window').height

class SetsView extends Component {

    constructor(props) {
        super(props)
        this.state = {
            btnIdx: 0,
            // editable: true,
            keyboardSpace: 0,
            menuOpen: -1,
            offsetY: 0,
            py: 0,
            scoreInput: -1
        }
    }

    componentDidMount() {
        if (!this.props.match.loading) {
            this.getMatch()
        }
        if (!this.keyboardDidShowListener) {
            this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow.bind(this))
        }
    }
    componentWillUnmount() {
        if (this.keyboardDidShowListener) {
            this.keyboardDidShowListener.remove()
        }
    }

    scrollToInput() {
        const visibleHeight = height - this.state.keyboardSpace - 100
        const keyboardDistance =  this.state.py - visibleHeight

        if (keyboardDistance > 0) {
            this.scrollView.scrollTo({
                animated: true,
                x: 0,
                y: this.state.offsetY + keyboardDistance
            })
            this.setState({ py: this.state.py - keyboardDistance })
        }
    }

    keyboardDidShow(frames) {
        if (!frames.endCoordinates) { return }
        if (this.state.keyboardSpace === 0) {
            this.setState({ keyboardSpace: frames.endCoordinates.height })
            this.scrollToInput()
        }
    }

    componentWillReceiveProps(nextProps) {
        const match = nextProps.matches[nextProps.data.id]
        let idx = 0

        //TODO check submit action in reducer
        if (match.is_admin && match.score_unconfirmed && !match.live) {
            idx = nextProps.auth.team.ids.indexOf(match.score_suggest) !== -1 ? 1 : 2
        }

        this.setState({
            btnIdx: idx
        })
    }


    toggleMenu(idx) {
        if (this.state.menuOpen === idx) {
            this.setState({ menuOpen: -1, scoreInput: -1 })
        }
        else if (this.state.scoreInput === idx) {
            this.setState({ menuOpen: -1, scoreInput: -1 })
        }
        else {
            this.setState({ menuOpen: idx, scoreInput: -1 })
        }
    }

    getMatch() {
        this.props.getMatch(this.props.data.id)
    }

    onPress(data, idx) {
        if (data.sets[0].player_1_home && data.sets[0].player_1_away) {
            this.toggleScoreInput(idx)
        } else {
            console.tron.log('OPEN SHOW PALYER MODAL')
            console.tron.log(data)
            this.props.showPlayerDialog(data)
        }
    }


    onSelect(data, value) {
        this.toggleMenu(-1)
        if (value === 0) {
            console.tron.log('option show player selected')
            console.tron.log(data)
            this.props.showPlayerDialog(data)
        }
        if (value === 1) {
            this.setState({ scoreInput: this.state.menuOpen })
        }
    }

    onSave(data, score) {
        const sets = { ...this.props.match.sets }
        const idx = data.setsIdx[score.set]
        const set = { ...data.sets[score.set] }

        set.number = idx
        set.goals_home = score.goals_home
        set.goals_away = score.goals_away
        if (!set.player_1_home && !set.player_1_away) {
            set.player_1_home = { id: 0 }
            set.player_2_home = { id: 0 }
            set.player_1_away = { id: 0 }
            set.player_2_away = { id: 0 }
        }
        sets[idx] = set
        this.props.updateSets(this.props.data.id, sets)
        this.setState({ scoreInput: -1 })
    }

    confirmScore() {
        const match = this.props.matches[this.props.data.id]

        if (this.state.btnIdx !== 1) {
            this.props.suggestScore(match.id, match.sets, this.state.btnIdx)
        }
    }

    showButton() {
        const match = this.props.matches[this.props.data.id]

        if (match.league && match.league.name.indexOf('pokal') !== -1) {
            return match.score_unconfirmed && (match.set_points_home !== match.set_points_away &&  (match.set_points_home > 16 || match.set_points_away > 16)) ? true : false
        } else {
            return match.score_unconfirmed && (match.set_points_home + match.set_points_away === 32) ? true : false
        }
    }

    toggleScoreInput(idx) {
        if (this.state.scoreInput === idx) {
            this.setState({ menuOpen: -1, scoreInput: -1 })
        } else {
            this.setState({ menuOpen: -1, scoreInput: idx })
        }
    }

    onScroll(event) {
        const offsetY = event.nativeEvent.contentOffset.y

        this.setState({ offsetY })
    }

    adjustPosition(py) {
        this.setState({ py })
        if (this.state.keyboardSpace > 0) {
            this.scrollToInput()
        }
    }

    render() {
        const data = this.props.matches[this.props.data.id]
        const showButton =  this.showButton()
        const editable = data.is_admin

        return (
            <View style={{ backgroundColor: theme.backgroundColor, flex: 1 }}>
                <SelectPlayerModal />
                <Match.Header data={data} pushRoute={this.props.pushRoute} />
                <Container
                    { ...this.props }
                    hasTabbar={this.props.hasTabbar && !showButton}
                    getRef={scrollView => { this.scrollView = scrollView}}
                    onScroll={this.onScroll.bind(this)}
                    error={this.props.match.error}
                    refreshing={this.props.match.loading}
                    onRefresh={this.getMatch.bind(this)}>
                    <Match editable={editable}
                        match={data}
                        toggleMatchType={this.props.toggleMatchType.bind(this)}
                        onPress={this.onPress.bind(this)}
                        scoreInput={this.state.scoreInput}
                        toggleMenu={this.toggleMenu.bind(this)}
                        menuOpen={this.state.menuOpen}
                        onSave={this.onSave.bind(this)}
                        adjustPosition={this.adjustPosition.bind(this)}
                        onSelect={this.onSelect.bind(this)}
                    />
                </Container>

                { showButton && editable && this.renderSubmitButton() }
            </View>
        )
    }

    renderSubmitButton() {
        return (
            <View style={styles.submitRow}>
                <Button disabled={this.state.btnIdx === 1}
                    onPress={this.confirmScore.bind(this)}>
                    { `${btnText[this.state.btnIdx]}` }
                </Button>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    submitRow: Platform.select({
        android: {
            margin: 0,
            minHeight: 52,
            paddingHorizontal: 8
        },
        ios: {
            marginBottom: 40,
            minHeight: 60,
            paddingHorizontal: 8
        }
    })
})

const btnText = [
    'Ergebnis vorschlagen',
    'Ergebnis vorgeschlagen',
    'Ergebnis akzeptieren'
]

SetsView.propTypes = {
    auth: PropTypes.object,
    dialog: PropTypes.object,
    getMatch: PropTypes.func,
    hasTabbar: PropTypes.bool,
    hidePlayerDialog: PropTypes.func,
    match: PropTypes.object,
    pushRoute: PropTypes.func,
    setPlayer: PropTypes.func,
    showPlayerDialog: PropTypes.func,
    suggestScore: PropTypes.func,
    toggleMatchType: PropTypes.func,
    updateSets: PropTypes.func
}

export default connect(
    state => ({
        auth: state.auth,
        dialog: state.dialog,
        match: state.match,
        matches: state.matches.data
    }),
    dispatch => ({
        getMatch: (id) => dispatch(actions.getMatch(id)),
        hidePlayerDialog: () => dispatch(actions.hidePlayerDialog()),
        pushRoute: (route) => dispatch(actions.pushRoute(route)),
        setPlayer: (team, result, setsIdx) => dispatch(actions.setPlayer(team, result, setsIdx)),
        showPlayerDialog: (data) => dispatch(actions.showPlayerDialog(data)),
        suggestScore: (id, sets, btnIdx) => dispatch(actions.suggestScore(id, sets, btnIdx)),
        toggleMatchType: () => dispatch(actions.toggleMatchType()),
        updateSets: (id, sets) => dispatch(actions.updateSets(id, sets))
    })
)(SetsView)