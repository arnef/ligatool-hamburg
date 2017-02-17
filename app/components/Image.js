import React, { Component } from 'react';
import { Image as NativeImage} from 'react-native';
import { baseUrl } from '../api';


class Image extends Component {

    render() {
        const source = this.props.url ?
            { uri: baseUrl + this.props.url } : this.props.source;
        const style = [{
            resizeMode: 'contain'
        }];
        if (this.props.width && this.props.height) {
            style.push({
                width: this.props.width,
                height: this.props.height
            });
        }
        else if (this.props.size) {
            style.push({
                width: this.props.size,
                height: this.props.size
            });
        }
        if (this.props.style) {
            style.push(this.props.style);
        }

        return (
            <NativeImage source={ source } style={style} />
        );

    }
}

export default Image;