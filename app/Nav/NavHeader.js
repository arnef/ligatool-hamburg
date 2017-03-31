import store from '../store'

export default (props) => ({
    backTitle: null,
    style: {
        backgroundColor: store.getState().settings.color

    },
    tintColor: '#fff'
})