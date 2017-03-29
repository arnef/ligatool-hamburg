import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Container, MatchItem  } from '../components'
import { Row, Column, Button, Text } from '../components/base'


class MatchListView extends Component {

    constructor(props) {
        super(props)
        this._renderMatch.bind(this)
        this.state={
            openMenu: -1
        }
    }

    _renderMatch(id, sec, idx) {
        const match = this.props.data[id]

        return (
            <MatchItem
                key={idx}
                menuOpen={this.state.openMenu === idx}
                toggleMenu={() => {this.toggleMenu(idx) }}
                data={match} />
        )
    }

    componentDidMount() {
        if (this.props.matches.length === 0 && this.props.refreshOnMount) {
            this.props.onRefresh()
        }
    }

    toggleMenu(idx) {
        const openMenu = this.state.openMenu === idx ? -1 : idx

        this.setState({ openMenu })
    }

    render() {
        if (this.props.error) {
            return (
                <Container
                    { ...this.props }>
                    <Row style={{ marginTop: 16 }}>
                        <Column center>
                            <Button onPress={this.props.onRefresh}>Erneut Laden</Button>
                        </Column>
                    </Row>
                </Container>
            )
        }
        if (this.props.fetched && this.props.matches.length === 0) {
            return (
                <Container
                    { ...this.props }
                    error={this.props.error}
                    refreshing={this.props.refreshing}
                    onRefresh={this.props.onRefresh}>
                    <Text center secondary style={{ padding: 16 }}>Keine Begegnungen</Text>
                </Container>
            )
        }

        return (
            <Container
                { ...this.props }
                error={this.props.error}
                refreshing={this.props.refreshing}
                onRefresh={this.props.onRefresh}
                dataSource={this.props.matches}
                renderRow={this._renderMatch.bind(this)}
             />
        )
    }
}

MatchListView.propTypes = {
    data: PropTypes.object,
    error: PropTypes.string,
    fetched: PropTypes.bool,
    matches: PropTypes.array,
    onRefresh: PropTypes.func,
    refreshOnMount: PropTypes.bool,
    refreshing: PropTypes.bool
}

export default connect(
    state => ({
        data: state.matches.data
    })
)(MatchListView)
