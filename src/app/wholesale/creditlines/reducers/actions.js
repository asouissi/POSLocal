// Action names
export const FETCH_CREDITLINES = 'creditlines/FETCH';
export const FETCH_CREDITLINES_SUCCESS = 'creditlines/FETCH_SUCCESS';
export const FETCH_CREDITLINES_FAIL = 'creditlines/FETCH_FAIL';


export const FETCH_DETAIL = 'creditLineDetail/FETCH';
export const FETCH_DETAIL_SUCCESS = 'creditLineDetail/FETCH_SUCCESS';
export const FETCH_DETAIL_FAIL = 'creditLineDetail/FETCH_FAIL';

export const FETCH_CREDITLINE = 'creditLineDetail/FETCH_CREDITLINE';
export const FETCH_SUCCESS_CREDITLINE = 'creditLineDetail/FETCH_SUCCESS_CREDITLINE';
export const FETCH_FAIL_CREDITLINE = 'creditLineDetail/FETCH_FAIL_CREDITLINE';


export const UPLOAD_ASSETDRAWS = 'contract/UPLOAD_DRAWS';
export const UPLOAD_ASSETDRAWS_SUCCESS = 'contract/UPLOAD_DRAWS_SUCCESS';
export const UPLOAD_ASSETDRAWS_FAIL = 'contract/UPLOAD_DRAWS_FAIL';

// Actions
export function fetchCreditLines() {
    return {
        types: [FETCH_CREDITLINES, FETCH_CREDITLINES_SUCCESS, FETCH_CREDITLINES_FAIL],
        promise: (client) => client.get('/masterfacilities')
    };
}

export function fetchCreditLine(dosid) {
    return {
        types: [FETCH_CREDITLINE, FETCH_SUCCESS_CREDITLINE, FETCH_FAIL_CREDITLINE],
        promise: (client) => client.get('/masterfacilities/' + dosid)
    };
}

export function uploadDraws(file) {
    return {
        types: [UPLOAD_ASSETDRAWS, UPLOAD_ASSETDRAWS_SUCCESS, UPLOAD_ASSETDRAWS_FAIL],
        promise: (client) => client.post('/draws/import/', file)
    };
}