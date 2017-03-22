import React, { Component } from 'react'
import { View, Switch } from 'react-native'
import formats from './formats'
import { connect } from 'react-redux'
import { Row, Column, Text } from '../base' 
import Set from './Set'
import Header from './Header'

class Match extends Component {

    renderRow(data, idx) {
        const { onPress, editable, menuOpen, onSave, adjustPosition, scoreInput, toggleMenu, toggleMatchType } = this.props
        return (
            <View key={idx}>
                { data.toggle && editable && (
                    <Row center style={{ paddingTop: 8}}>
                        <Text >{ data.toggle.title }</Text>
                        <Column />
                        <Switch onValueChange={ () => { 
                                toggleMatchType(data.setsIdx, data.toggle.type) 
                            }}
                            value={this.props.match.data.type.indexOf('d5') !== -1} />
                    </Row>
                )}
                <Set
                    onPress={this.props.onPress ? () => { this.props.onPress(data, idx)} : null}
                    editable={this.props.editable}
                    toggleMenu={this.props.editable ? () => { this.props.toggleMenu(idx)} : null}
                    menuOpen={this.props.menuOpen === idx}
                    onSelect={this.props.onSelect}
                    onSave={this.props.onSave}
                    adjustPosition={this.props.adjustPosition}
                    scoreInput={this.props.scoreInput === idx}
                    data={data} />
            </View>
        )
    }


    getName(data, key) {
        return data[key] ? `${data[key].name} ${data[key].surname}` : this.props.editable ? 'Bitte wählen' : ''
    }

    buildMatchData() {
        const editMatch = this.props.editable
        const match = this.props.match.data.sets ? this.props.match.data : { sets: [] }
        const sets = []
        const format = formats[this.props.match.data.type]
        
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
    type: React.PropTypes.string,
    onSelect: React.PropTypes.func
}

Match.Header = Header

export default connect( (state) => ({
    match: state.match
}))(Match)
