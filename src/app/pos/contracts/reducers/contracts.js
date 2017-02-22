import Immutable from 'seamless-immutable'
import * as a from './actions'

const initialState = {
    contracts: [],
};

export default function reducer(state = Immutable(initialState), action) {
    switch (action.type) {
        case a.FETCH_SUCCESS:
            return state.set("contracts", action.result.data)
        default:
            return state
    }
}