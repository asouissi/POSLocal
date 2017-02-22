import Immutable from 'seamless-immutable';

import * as c from './actions'

const initialState = {
    isLoading: false,
    isUploading: false,
    contract: {},
    interest: [],
    repayment: [],
    documents: [],
    settle: {},
    listNap: [],
    control: {},
    isSettled: false
};

// Reducer
export default function reducer(state = Immutable(initialState), action) {
    switch (action.type) {
        case c.FETCH_CONTRACT :
            return state.merge({
                contract: {},
                interest: [],
                repayment: [],
                documents: [],
                isLoading: true,
                isUploading: false,
                settle: {},
                isSettled: false
            });
        case c.INIT_CONTRACT :
            return state.merge({...initialState, contract: action.initValues || {}});

        case c.FETCH_CONTRACT_SUCCESS :
        case c.SAVE_CONTRACT_SUCCESS :
            return state.merge({
                contract: action.result.data,
                isLoading: false
            });
        case c.FETCH_CONTRACT_FAIL :
            return state.set('isLoading', false);
        //case c.FETCH_INTEREST_SUCCESS :

        case c.FETCH_INTEREST_SUCCESS :
            return state.set('interest', action.result.data);
        case c.FETCH_REPAYMENT_SUCCESS :
            return state.set('repayment', action.result.data);

        case c.FETCH_TYPE_DOC_SUCCESS :
            return state.set('docTypes', action.result.data);

        case c.FETCH_LIST_DOC:
            return state.set('isLoading', true);
        case c.FETCH_LIST_DOC_FAIL:
            return state.set('isLoading', false);
        case c.FETCH_LIST_DOC_SUCCESS :
            return state.merge({
                documents: action.result.data,
                isLoading: false
            });

        case c.UPLOAD_DOC :
            return state.set('isUploading', true);
        case c.UPLOAD_DOC_FAIL :
            return state.set('isUploading', false);
        case c.UPLOAD_DOC_SUCCESS :
            return state.merge({
                documents: action.result.data,
                isUploading: false
            });
        case c.DELETE_DOC_SUCCESS :
            return state.merge({
                documents: action.result.data,
                isUploading: false
            });

        case c.COMPUTE_OUTSTANDING_SUCCESS:
            return state.setIn(['settle', 'outstandingAmount'], action.result.data);

        case c.COMPUTE_FEES_SUCCESS:
            return state.setIn(['settle', 'fees'], action.result.data);

        case c.EXECUTE_SETTLE_SUCCESS:
            return state.set('settleSuccess', action.result.data);

        case c.IS_SETTLE_SUCCESS :
            return state.set('isSettled', action.result.data);

        case c.EXECUTE_CONVERT_SUCCESS:
            return state.set('convertSuccess', action.result.data);

        case c.CAN_CONVERT_SUCCESS :
            return state.set('canBeConverted', action.result.data);

        case c.SAVE_CONTRACT_FAIL:
            return state.merge({
                control: action.error.response.data.control
            });
        case c.SAVE_CONTRACT_SUCCESS:
            return state.merge({
                control: DEFAULT_EMPTY_OBJECT,
            });
        case c.FETCH_LIST_LANNAP_SUCCESS :
            return state.merge({
                listAssetstate: action.result.data
            });
        case c.FETCH_LIST_CREDITLINE_SUCCESS :
            return state.merge({
                convertTo: action.result.data
            });
        case c.FETCH_LIST_SCALE_SUCCESS :
            return state.merge({
                listScale: action.result.data
            });

        default:
            return state;
    }
}