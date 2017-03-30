import React, { Component, PropTypes } from 'react'
import { View, Switch } from 'react-native'
import formats from './formats'
import { connect } from 'react-redux'
import { Row, Column, Text } from '../base'
import Set from './Set'
import Header from './Header'

class Match extends Component {

    renderRow(data, idx) {
        const { onPress, match, editable, menuOpen, onSave, onSelect, adjustPosition, scoreInput, toggleMenu, toggleMatchType } = this.props
        // const match = matches[this.props.match.id]

        return (
            <View key={idx}>
                { data.toggle && editable && (
                    <Row center style={{ paddingTop: 8 }}>
                        <Text >{ data.toggle.title }</Text>
                        <Column />
                        <Switch onValueChange={ () => {
                            toggleMatchType(data.setsIdx, data.toggle.type)
                        }}
                        value={match.type.indexOf('d5') !== -1} />
                    </Row>
                )}
                <Set
                    onPress={onPress ? () => { onPress(data, idx)} : null}
                    editable={editable}
                    toggleMenu={editable ? () => { toggleMenu(idx)} : null}
                    menuOpen={menuOpen === idx}
                    onSelect={onSelect}
                    onSave={onSave}
                    adjustPosition={adjustPosition}
                    scoreInput={scoreInput === idx}
                    data={data} />
            </View>
        )
    }


    getName(data, key) {
        return data[key] ? `${data[key].name} ${data[key].surname}` : this.props.editable ? 'Bitte wählen' : ''
    }

    buildMatchData() {
        console.tron.log('build match data')
        const id = this.props.match.id
        const { matches } = this.props
        const editMatch = this.props.editable
        const match = matches[id].sets ? matches[id] : { sets: [] }
        const sets = []
        const format = formats[ this.props.match.type || 'default' ]

        for (let set of format) {
            const data = { ...set }

            data.sets = []
            for(let setIdx of data.setsIdx) {
                if (match.sets[setIdx]) {
                    data.sets.push(match.sets[setIdx])
                } else if (editMatch) {
                    if (!data.extra || (data.extra && match.set_points_home >= 16 && match.set_points_away >= 16)) {
                        data.sets.push({})
                    }
                }
            }
            if (data.sets.length > 0) {
                sets.push(data)
            }
        }

        return sets
    }

    render() {
        const sets = this.buildMatchData()

        return (
            <View>
                { sets.map((set, idx) => {
                    return this.renderRow(set, idx)
                })}
            </View>
        )
    }
}

Match.propTypes = {
    adjustPosition: PropTypes.func,
    editable: PropTypes.bool,
    match: PropTypes.object,
    menuOpen: PropTypes.number,
    onPress: PropTypes.func,
    onSave: PropTypes.func,
    onSelect: PropTypes.func,
    scoreInput: PropTypes.number,
    toggleMatchType: PropTypes.func,
    toggleMenu: PropTypes.func,
    type: PropTypes.string
}

Match.Header = Header

export default connect( (state) => ({
    matches: state.matches.data
}))(Match)
// export default Match
