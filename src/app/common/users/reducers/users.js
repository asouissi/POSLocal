import Immutable from 'seamless-immutable'

export const FETCH = 'users/FETCH'
export const FETCH_SUCCESS = 'users/FETCH_SUCCESS'
export const FETCH_FAIL = 'users/FETCH_FAIL'
const UPDATE = 'users/UPDATE'
const UPDATE_SUCCESS = 'users/UPDATE_SUCCESS'
const UPDATE_FAIL = 'users/UPDATE_FAIL'


const initialState = {
    users: [],
    dealerships: [],
    brands: [],
    isLoading: false
};

export function fetchUsers() {
    return {
        types: [FETCH, FETCH_SUCCESS, FETCH_FAIL],
        promise: (client) => client.get('/users')
    };
}

export function updateUser(user) {
    return {
        types: [UPDATE, UPDATE_SUCCESS, UPDATE_FAIL],
        promise: (client) => {
            return client.post('/users/' + user + '/deactivateUser')
        },
        afterSuccess: (dispatch, getState, result) => {
            dispatch(fetchUsers());
        }
    };
}

export default function reducer(state = Immutable(initialState), action) {
    switch (action.type) {
        case FETCH_SUCCESS:
            return state.merge({
                users: action.result.data,
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

        default:
            return state;
    }
}