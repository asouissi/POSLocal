import Immutable from 'seamless-immutable'

import * as d from './actions'

const DEFAULT_EMPTY_OBJECT = [];

// Initial state
const initialState = {
    initial: {
        monthlyBudget: [50, 250],
        deposit: undefined,
        paymentPeriod: undefined,
        annualMileage: undefined,
    },
    solution: {

    }
};

let requestId = 0;

// Reducer
export default function reducer(state = Immutable(initialState), action) {
    //console.log("Action[" + action.type + "]=>", action);
    switch (action.type) {

        case d.GET_QUOTES_LOADING:
            state = state.merge({loading: true, error: false});
            return state;

        case d.GET_QUOTES_SUCCESS:
            state = state.merge({quotes: action.result.data, loading: false, error: false, quotesCleared: false});
            return state;

        case d.GET_QUOTES_FAIL:
            state = state.merge({quotes: null, loading: false, error: action.error});
            return state;

        case d.CLEAR_QUOTES:
            state = state.merge({loading: false, error: null, quotesCleared: true});
            return state;

        default:
            return state;
    }
}
