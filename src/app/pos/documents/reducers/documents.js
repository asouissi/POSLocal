import * as doc from './actions'
import Immutable from 'seamless-immutable'

const initialState = {
    documents:{

    },

    filter: {
        buttonsField: "",
        searchField: ""
    }

}

export default function reducer(state = Immutable(initialState), action) {
    switch (action.type) {
        case  doc.FETCH_LIST_DOC_SUCCESS :
            return state.set('documents', action.result.data)
        case  doc.SELECT_FILTER :
            return state.merge({
                filter: action.filter
            })
        default :
            return state;
    }

}
