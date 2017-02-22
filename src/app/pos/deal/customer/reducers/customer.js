import * as c from './actions'
//reducer
export default function reducer(state, action, stateDealName) {
    switch (action.type) {

        case c.ACTTYPE_CHANGE:
            return state.setIn(['acttypes', action.actorIndex], action.acttype);

        default:
            return state;
    }
}