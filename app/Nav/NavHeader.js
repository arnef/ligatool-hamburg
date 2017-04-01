import store from '../store'
import { connect } from 'react-redux'

export default ({ state, setParams }) => {
    console.tron.log(state)
    return {
    backTitle: null,
    style: {
        backgroundColor: store.getState().settings.color

    },
    tintColor: '#fff'
    }
}

// export default connect(
//     state => ({ color: state.settings.color })
// )((props) => ({
//     backTitle: null,
//     style: {
//         backgroundColor: props.color
//     },
//     tintColor: '#fff'
// }))
