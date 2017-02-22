import Immutable from 'seamless-immutable';

import * as c from './actions'

const initialState = {
    creditlines: [],
    creditLine: {},
    isLoading: false
};


// Reducer
export default function reducer(state = Immutable(initialState), action) {
    switch (action.type) {
        case c.FETCH_CREDITLINES_SUCCESS:
            return state.merge({
                creditLines: action.result.data,
                isLoading: false
            });
        case c.FETCH_CREDITLINES:
            return state.set('isLoading', true);

        case c.FETCH_CREDITLINES_FAIL:
            return state.set('isLoading', false);

        case c.FETCH_SUCCESS_CREDITLINE:
            return state.merge({
                creditLine: action.result.data,
                isLoading: false
            });
        case c.FETCH_CREDITLINE:
            return state.set('isLoading', true);

        case c.FETCH_FAIL_CREDITLINE:
            return state.set('isLoading', false);
        default:
            return state;
    }
}

