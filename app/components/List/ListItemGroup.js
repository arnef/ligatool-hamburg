import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import styles from '../Styles/List/ListItemGroup';
import Touchable from '../Touchable';
import { Text } from '../Styles'
import { Row } from '../../components';

class ListItemGroup extends Component {

    constructor(props) {
        super(props);
        const style = {};
        if (this.props.padding) {
            style.paddingHorizontal = 16;
            style.paddingBottom = 8;
        }
        this.padding = style;
    }

    render() {
        return (
            <View style={[styles.margin, this.props.style]}>
                <Touchable style={styles.group} onPress={this.props.onPress}>
                    {!!this.props.name && (
                        <Row>
                        <Text
                            center={this.props.center}
                            style={[styles.header, { color: this.props.color, flex: 1, marginLeft: this.props.dropdown ? 52 : 0 }]}>
                            {this.props.name}
                        </Text>
                            { !!this.props.dropdown && this.props.dropdown }
                        </Row>
                    )}
                    <View style={this.padding}>
                        {this.props.children}
                        </View>
                </Touchable>
            </View>);
    }
}

ListItemGroup.propTypes = {
    name: React.PropTypes.string,
    onPress: React.PropTypes.func,
    onLongPress: React.PropTypes.func,
    center: React.PropTypes.bool,
    color: React.PropTypes.string,
    children: React.PropTypes.oneOfType([
        React.PropTypes.object, React.PropTypes.array
    ]),
    padding: React.PropTypes.bool
};

export default connect(state => ({
    color: state.settings.color
}))(ListItemGroup);

