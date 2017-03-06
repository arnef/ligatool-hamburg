import React, { Component } from 'react';
import { View } from 'react-native';
import Menu, {
    MenuContext, MenuOptions, MenuOption, MenuTrigger
} from 'react-native-menu';
import { connect } from 'react-redux';
import style from '../Styles/List/ListItemGroup';
import Touchable from '../Touchable';
import { Text } from '../Styles'
import { Row, Column } from '../../components';

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
            <View style={style.margin}>
                <View style={style.group}>
                    {!!this.props.name && (
                        <Row>
                        <Text
                            center={this.props.center}
                            style={[style.header, { color: this.props.color, flex: 1, paddingLeft: this.props.dropdown ? 32 : 0}]}>
                            {this.props.name}
                        </Text>
                            { !!this.props.dropdown && this.props.dropdown }
                        </Row>
                    )}
                    <Touchable 
                        onPress={this.props.onPress}
                        onLongPress={this.props.onLongPress}
                        style={this.padding}>
                        {this.props.children}
                    </Touchable>
                </View>
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

