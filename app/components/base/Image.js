import React, { Component, PropTypes } from 'react'
import { Image as RNImage, StyleSheet } from 'react-native'
import { baseUrl } from '../../api'

class Image extends Component {
    render() {
        const source = this.props.url ? 
            { uri: baseUrl + this.props.url } : this.props.source
        const imageStyle = [styles.image]
        
        if (this.props.size) {
            imageStyle.push({ height: this.props.size, width: this.props.size })
        }
        if (this.props.width && this.props.height) {
            imageStyle.push({ height: this.props.height, width: this.props.width })
        }
        if (this.props.style) {
            imageStyle.push(this.props.style)
        }

        return (
            <RNImage source={source} style={imageStyle} />
        )
    }
}

Image.propTypes = {
    height: PropTypes.number,
    size: PropTypes.number,
    source: PropTypes.oneOfType([ PropTypes.object, PropTypes.number ]),
    style: PropTypes.object,
    url: PropTypes.string,
    width: PropTypes.number
}

const styles = StyleSheet.create({
    image: {
        resizeMode: 'contain'
    }
})

export default Image