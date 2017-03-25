import React, { Component } from 'react'
import { View, Text, ListView, Modal } from 'react-native'
import { connect } from 'react-redux'
import { hidePlayerDialog } from '../store/actions/dialogActions'
import { ListItem } from '../components/base'
import { Container } from '../components'
import Navigator from './Navigation'


class SelectPlayerModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: null,
            ds: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }),
            items: [],
            selected: {},
            selection: 1,
            title: 'Spieler wählen'
        }
    }

    // setItems(items) {
    //     const { title } = this.state

    //     if (!!this && this.navigator && this.navigator.push) {
    //         this.navigator.push({ items, selected: {}, title })
    //     }
    //     //  else {
    //     //     this.setState({
    //     //         items: items,
    //     //         selected: {}
    //     //     })
    //     // }
    //     if (this.listView) {
    //         this.listView.scrollTo({ animated: false, x: 0, y: 0 })
    //     }
    //     this.setState({
    //         items: items,
    //         selected: {}
    //     })
    // }

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


    onPress(data, idx) {
        const { selected } = this.state

        if (selected[idx]) {
            delete selected[idx]
        } else {
            selected[idx] = true
        }
        this.setState({
            selected: selected
        })
        console.tron.log(""+idx)
        console.tron.log(data)
        if (Object.values(selected).length === this.state.selection && this.result) {
            console.tron.log('return results')
            const result = []

            for (let itemIdx in selected) {
                result.push(this.state.items[itemIdx])
            }

            setTimeout(() => { // wait animation is done
                this.result(result)
                //TODO props.setPlayer
            }, 50)

        }
    }


    renderItems(route, navigator) {
        this.navigator = navigator

        return (
            <Container>
                <ListItem.Group>
                    { route.items.map( (item, idx) => {
                        return this.renderItem(item, idx)
                    })
                    }
                </ListItem.Group>
            </Container>
        )
    }

    render() {
        // const { items, title } = this.state
        const { data, match, visible } = this.props
        const items = match.team_home ? match.team_home.player : []
        const title = 'Spieler wählen'

        return (
            <Modal
                visible={visible}
                animationType='slide'
                onRequestClose={this.onRequestClose.bind(this)}>
                <Navigator
                    closeModal={this.props.hidePlayerDialog.bind(this)}
                    renderScene={this.renderItems.bind(this)}
                    initialRoute={{ items, title }}
                    />
            </Modal>
        )
    }


    renderItem(data, idx) {
        const { items } = this.state

        return (
                <ListItem key={data.id} last={idx === items.length-1} icon onPress={() => { this.onPress(data, idx) }}>
                    <ListItem.Image url={data.image} />
                    <Text>{ `${data.name} ${data.surname}` }</Text>
                    <View style={{ flex:1 }} />
                    <ListItem.Icon right name={this.state.selected[idx] ? 'checkbox' : 'square-outline'} />
                </ListItem>
        )
    }

    onRequestClose() {
        this.props.hidePlayerDialog()
    }
}

SelectPlayerModal.propTypes = {
    dialog: React.PropTypes.object,
    hidePlayerDialog: React.PropTypes.func
}

export default connect(
    state => ({
        data: state.dialog.player.data,
        match: state.match.data,
        visible: state.dialog.player.visible
    }),
    dispatch => ({
        hidePlayerDialog: () => dispatch(hidePlayerDialog())
    })
)(SelectPlayerModal)