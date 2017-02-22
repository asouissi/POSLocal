import Immutable from 'seamless-immutable'
import * as a from './actions'
const initialState = {
    actors: [],
    actor: {
        actid: 0,
        name: ""
    }
}
export default function reducer(state = Immutable(initialState), action) {
    switch (action.type) {
        case a.FETCH_ACTORS_SUCCESS:
            return state.set('actors', action.result.data)
        default:
            return state
    }
}