import React, { Component, PropTypes } from 'react'
import { View, Text, Modal } from 'react-native'
import { connect } from 'react-redux'
import actions from '../store/actions'
import { ListItem } from '../components/base'
import { Container } from '../components'
import Navigator from './Navigation'


class SelectPlayerModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selected: {
                away: {},
                home: {}
            }
        }
    }

    setSelection(selection) {
        if (typeof selection !== 'number') {
            throw 'selection must be number'
        }
        this.setState({
            selection: selection
        })
    }

    setTitle(title) {
        this.setState({ title })
    }


    onPress(idx, team) {
        const { data, matches, setPlayer, id } = this.props
        const match = matches[id]
        const { selected } = this.state

        if (selected[team][idx]) {
            delete selected[team][idx]
        } else {
            selected[team][idx] = true
        }
        this.setState({
            selected: selected
        })

        if (Object.values(selected[team]).length === data.type) {
            const result = []

            for (let itemIdx in selected[team]) {
                console.tron.log('select player ' + itemIdx)
                result.push(match[`team_${team}`].player[itemIdx])
            }
            setPlayer(id, team, result, data.setsIdx)

            setTimeout(() => { // wait animation is done
                if (team === 'home') {
                    const title = data.type === 1 ? 'Spieler (Gast) wählen' : 'Doppel (Gast) wählen'

                    this.navigator.push({ team: 'away', title })
                } else {
                    this.onRequestClose()
                }
            }, 10)

        }
    }


    renderItems(route, navigator) {
        this.navigator = navigator
        const { matches, id  } = this.props
        const match = matches[id]
        const items = match[`team_${route.team}`] ? match[`team_${route.team}`].player : []

        return (
            <Container>
                <ListItem.Group>
                    { items.map( (item, idx) => {
                        return this.renderItem(item, idx, route.team)
                    })
                    }
                </ListItem.Group>
            </Container>
        )
    }

    render() {
        const { data, visible } = this.props
        const title = data.type === 1 ? 'Spieler (Heim) wählen' : 'Doppel (Heim) wählen'

        return (
            <Modal
                visible={visible}
                animationType='slide'
                onRequestClose={this.onRequestClose.bind(this)}>
                <Navigator
                    closeModal={this.props.hidePlayerDialog.bind(this)}
                    renderScene={this.renderItems.bind(this)}
                    initialRoute={{ team: 'home', title }} />
            </Modal>
        )
    }


    renderItem(data, idx, team) {
        const { selected } = this.state
        const { matches, id } = this.props
        const match = matches[id]

        const itemLength = match[`team_${team}`].player.length - 1

        return (
                <ListItem key={data.id} last={idx === itemLength} icon onPress={() => { this.onPress(idx, team) }}>
                    <ListItem.Image url={data.image} />
                    <Text>{ `${data.name} ${data.surname}` }</Text>
                    <View style={{ flex:1 }} />
                    <ListItem.Icon right name={selected[team][idx] ? 'checkbox' : 'square-outline'} />
                </ListItem>
        )
    }

    onRequestClose() {
        const { hidePlayerDialog } = this.props

        this.setState({
            selected: {
                away: {},
                home: {}
            }
        })
        hidePlayerDialog()
    }
}

SelectPlayerModal.propTypes = {
    data: PropTypes.object,
    hidePlayerDialog: PropTypes.func,
    matches: PropTypes.object,
    setPlayer: PropTypes.func,
    visible: PropTypes.bool
}

export default connect(
    state => ({
        data: state.dialog.player.data,
        matches: state.matches.data,
        visible: state.dialog.player.visible
    }),
    dispatch => ({
        hidePlayerDialog: () => dispatch(actions.hidePlayerDialog()),
        setPlayer: (id, team, player, setsIdx) => dispatch(actions.setPlayer(id, team, player, setsIdx))
    })
)(SelectPlayerModal)