import Immutable from 'seamless-immutable'
import {CLEAR_CACHE} from "../../../core/reducers/authentication"

// Action names
export const FETCH = 'deals/FETCH';
export const FETCH_SUCCESS = 'deals/FETCH_SUCCESS';
export const FETCH_FAIL = 'deals/FETCH_FAIL';

export const SELECT_FILTER = 'deals/SELECT_FILTER';

const initialState = {
    deals: [],
    isLoading: false,
    filter: {
        buttonsField: "",
        searchField: ""
    },
    showFilterModal:true
};

// Actions
export function fetchDeals(parameters) {
    return {
        types: [FETCH, FETCH_SUCCESS, FETCH_FAIL],
        //promise: (client) => client.get('data/deals4.json')
        promise: (client) => client.get('/deals', {params:parameters})
    };
}

export function selectFilter(filter) {
    return {
        type: SELECT_FILTER,
        filter: filter
    }
}

// Reducer
export default function deals(state = Immutable(initialState), action) {
    switch (action.type) {
        case FETCH_SUCCESS:

            return state.merge({
                deals: action.result.data,
                isLoading: false
            });
        case FETCH:
            return state.merge({
                isLoading: true
            });

        case FETCH_FAIL:
            return state.merge({
                isLoading: false
            });

        case SELECT_FILTER:
            return state.merge({
                filter: action.filter
            });
        case CLEAR_CACHE:
            return Immutable(initialState);
        default:
            return state;
    }
}