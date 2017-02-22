export const FETCH_LIST_DOC = 'pos/documents/FETCH';
export const FETCH_LIST_DOC_SUCCESS = 'pos/documents/FETCH_SUCCESS';
export const FETCH_LIST_DOC_FAIL = 'pos/documents/FETCH_FAIL';
export const SELECT_FILTER = 'pos/documents/SELECT_FILTER';

export function fetchDocumentsAction(  ) {
    return {
        types: [FETCH_LIST_DOC, FETCH_LIST_DOC_SUCCESS, FETCH_LIST_DOC_FAIL],
        promise: (client) => client.get('/documentmanagements')
    };
}

export function selectFilter(filter) {
    return {
        type: SELECT_FILTER,
        filter: filter
    }
}