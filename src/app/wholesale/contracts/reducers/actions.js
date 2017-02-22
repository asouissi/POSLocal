import Immutable from 'seamless-immutable'
import {change} from "redux-form";

export const INIT_CONTRACT = "contracts/INIT_CONTRACT";
export const FETCH_CONTRACT = "contracts/FETCH_CONTRACT";
export const FETCH_CONTRACT_SUCCESS = "contracts/FETCH_CONTRACT_SUCCESS";
export const FETCH_CONTRACT_FAIL = "contracts/FETCH_CONTRACT_FAIL";

export const SAVE_CONTRACT = "contracts/SAVE_CONTRACT";
export const SAVE_CONTRACT_SUCCESS = "contracts/SAVE_CONTRACT_SUCCESS";
export const SAVE_CONTRACT_FAIL = "contracts/SAVE_CONTRACT_FAIL";

export const FETCH_REPAYMENT = "repayments/FETCH_REPAYMENT";
export const FETCH_REPAYMENT_SUCCESS = "repayments/FETCH_REPAYMENT_SUCCESS";
export const FETCH_REPAYMENT_FAIL = "repayments/FETCH_REPAYMENT_FAIL";

export const FETCH_INTEREST = "interests/FETCH_INTEREST";
export const FETCH_INTEREST_SUCCESS = "interests/FETCH_INTEREST_SUCCESS";
export const FETCH_INTEREST_FAIL = "interests/FETCH_INTEREST_FAIL";

export const FETCH_VARIANT = "variants/FETCH_VARIANT";
export const FETCH_VARIANT_SUCCESS = "variants/FETCH_VARIANT_SUCCESS";
export const FETCH_VARIANT_FAIL = "variants/FETCH_VARIANT_FAIL";

export const UPLOAD_DOC = 'contract/UPLOAD_DOC';
export const UPLOAD_DOC_SUCCESS = 'contract/UPLOAD_DOC_SUCCESS';
export const UPLOAD_DOC_FAIL = 'contract/UPLOAD_DOC_FAIL';

export const DELETE_DOC = 'contract/DELETE_DOC';
export const DELETE_DOC_SUCCESS = 'contract/DELETE_DOC_SUCCESS';
export const DELETE_DOC_FAIL = 'contract/DELETE_DOC_FAIL';

export const FETCH_LIST_DOC = 'contract/FETCH_LIST_DOC';
export const FETCH_LIST_DOC_SUCCESS = 'contract/FETCH_LIST_DOC_SUCCESS';
export const FETCH_LIST_DOC_FAIL = 'contract/FETCH_LIST_DOC_FAIL';

export const FETCH_LIST_LANNAP = 'contract/FETCH_LIST_LANNAP';
export const FETCH_LIST_LANNAP_SUCCESS = 'contract/FETCH_LIST_LANNAP_SUCCESS';
export const FETCH_LIST_LANNAP_FAIL = 'contract/FETCH_LIST_LANNAP_FAIL';

export const FETCH_LIST_CREDITLINE = 'contract/FETCH_LIST_CREDITLINE';
export const FETCH_LIST_CREDITLINE_SUCCESS = 'contract/FETCH_LIST_CREDITLINE_SUCCESS';
export const FETCH_LIST_CREDITLINE_FAIL = 'contract/FETCH_LIST_CREDITLINE_FAIL';

export const FETCH_LIST_SCALE = 'contract/FETCH_LIST_SCALE';
export const FETCH_LIST_SCALE_SUCCESS = 'contract/FETCH_LIST_SCALE_SUCCESS';
export const FETCH_LIST_SCALE_FAIL = 'contract/FETCH_LIST_SCALE_FAIL';

export const FETCH_TYPE_DOC = 'contract/FETCH_TYPE_DOC_DOC';
export const FETCH_TYPE_DOC_SUCCESS = 'contract/FETCH_TYPE_DOC_SUCCESS';
export const FETCH_TYPE_DOC_FAIL = 'contract/FETCH_TYPE_DOC_FAIL';


export const COMPUTE_OUTSTANDING = 'contract/COMPUTE_OUTSTANDING';
export const COMPUTE_OUTSTANDING_SUCCESS = 'contract/COMPUTE_OUTSTANDING_SUCCESS';
export const COMPUTE_OUTSTANDING_FAIL = 'contract/COMPUTE_OUTSTANDING_FAIL';

export const EXECUTE_SETTLE = 'contract/EXECUTE_SETTLE';
export const EXECUTE_SETTLE_SUCCESS = 'contract/EXECUTE_SETTLE_SUCCESS';
export const EXECUTE_SETTLE_FAIL = 'contract/EXECUTE_SETTLE_FAIL';

export const IS_SETTLE = 'contract/IS_SETTLE';
export const IS_SETTLE_SUCCESS = 'contract/IS_SETTLE_SUCCESS';
export const IS_SETTLE_FAIL = 'contract/IS_SETTLE_FAIL';

export const EXECUTE_CONVERT = 'contract/EXECUTE_CONVERT';
export const EXECUTE_CONVERT_SUCCESS = 'contract/EXECUTE_CONVERT_SUCCESS';
export const EXECUTE_CONVERT_FAIL = 'contract/EXECUTE_CONVERT_FAIL';

export const CAN_CONVERT = 'contract/CAN_CONVERT';
export const CAN_CONVERT_SUCCESS = 'contract/CAN_CONVERT_SUCCESS';
export const CAN_CONVERT_FAIL = 'contract/CAN_CONVERT_FAIL';

export const CHANGE_DOSDTFIN = 'contract/CHANGE_DOSDTFIN';

export function saveContract(contract, onSuccess, onFailure) {
    return {
        types: [SAVE_CONTRACT, SAVE_CONTRACT_SUCCESS, SAVE_CONTRACT_FAIL],
        promise: (client) => client.post('/draws', contract),
        afterSuccess: (dispatch, getState, result) => {
            onSuccess(result.data);
        }
    }
}

export function fetchContract(dosId, parentDosId) {
    return {
        types: [FETCH_CONTRACT, FETCH_CONTRACT_SUCCESS, FETCH_CONTRACT_FAIL],
        promise: (client) => client.get('/draws/' + dosId, {params: {dosid: parentDosId}})
    }
}

export function initContract(initValues) {
    return {
        type: INIT_CONTRACT,
        initValues
    }
}

export function fetchPrincipalRepayment(dosRef, dosid, amount, startDate) {
    return {
        types: [FETCH_REPAYMENT, FETCH_REPAYMENT_SUCCESS, FETCH_REPAYMENT_FAIL],
        promise: (client) => client.get('/draws/principalpayment/' + dosRef, {
            params: {dosid, amount, startdate: startDate ? startDate : new Date().getTime()}
        }),
        afterSuccess: (dispatch, getState, response) => {
            var resp = response.data;
            if (resp && resp.length && resp[0].duedate) {
                dispatch(change('contract', 'dosdtfin', resp[0].duedate));
            }
        }
    }
}

export function fetchInterestPayment(dosRef) {
    return {
        types: [FETCH_INTEREST, FETCH_INTEREST_SUCCESS, FETCH_INTEREST_FAIL],
        promise: (client) => client.get('/draws/interestpayment/' + dosRef)
    }
}

export function fetchVariant(params, onSuccess) {
    return {
        types: [FETCH_VARIANT, FETCH_VARIANT_SUCCESS, FETCH_VARIANT_FAIL],
        promise: (client) => client.get('/draws/varid', {params: {...params}}),
        afterSuccess: (dispatch, getState, result) => {
            onSuccess(result.data);
        }
    }
}

export function uploadDocument(contractId, file, onProgress, onSuccess) {
    return {
        types: [UPLOAD_DOC, UPLOAD_DOC_SUCCESS, UPLOAD_DOC_FAIL],
        promise: (client) => client.post('/draws/' + contractId + '/documents', file, {onUploadProgress: onProgress}),
        afterSuccess: (dispatch, getState, result) => {
            onSuccess(result.data);
        }
    };
}
export function deleteDrawDocument(contractId, dmaid) {
    return {
        types: [DELETE_DOC, DELETE_DOC_SUCCESS, DELETE_DOC_FAIL],
        promise: (client) => client.delete('/draws/' + contractId + '/documents/' + dmaid)
    };
}

export function getCreditlinedetailListDocument(contractId) {
    return {
        types: [FETCH_LIST_DOC, FETCH_LIST_DOC_SUCCESS, FETCH_LIST_DOC_FAIL],
        promise: (client) => client.get('/draws/' + contractId + '/documents')
    };
}

export function getListTypesDocument() {
    return {
        types: [FETCH_TYPE_DOC, FETCH_TYPE_DOC_SUCCESS, FETCH_TYPE_DOC_FAIL],
        promise: (client) => client.get('/referencetable?table=landocument&doccontexte=wholesale')
    };
}

export function computeFees(contractId, settledate) {
    return {
        types: [COMPUTE_FEES, COMPUTE_FEES_SUCCESS, COMPUTE_FEES_FAIL],
        promise: (client) => client.get('/draws/' + contractId + '/fees?settledate=' + settledate),
        settledate
    };
}

export function computeOutstandingAmount(contractId, settledate) {
    return {
        types: [COMPUTE_OUTSTANDING, COMPUTE_OUTSTANDING_SUCCESS, COMPUTE_OUTSTANDING_FAIL],
        promise: (client) => client.get('/draws/' + contractId + '/outstanding?settledate=' + settledate),
        settledate
    };
}

export function executeSettleEvent(settleEvent, onSuccess, onError) {
    return {
        types: [EXECUTE_SETTLE, EXECUTE_SETTLE_SUCCESS, EXECUTE_SETTLE_FAIL],
        promise: (client)=> client.post('/draws/events/settle', settleEvent),
        afterSuccess: (dispatch, getState, result) => {
            onSuccess(result.data);
        },
        afterError(dispatch, getState, error){
            onError();
        }
    };
}
export function isSettled(assetContractId) {
    return {
        types: [IS_SETTLE, IS_SETTLE_SUCCESS, IS_SETTLE_FAIL],
        promise: (client)=> client.get('/draws/' + assetContractId + '/issettled')
    };
}
export function executeConvertEvent(convertEvent, onSuccess, onError) {

    return {
        types: [EXECUTE_CONVERT, EXECUTE_CONVERT_SUCCESS, EXECUTE_CONVERT_FAIL],
        promise: (client)=> client.post('/draws/events/convert', convertEvent),
        afterSuccess: (dispatch, getState, result) => {
            onSuccess(result.data);
        },
        afterError(dispatch, getState, error){
            onError();
        }
    };
}
export function canBeConverted(assetContractId) {
    return {
        types: [CAN_CONVERT, CAN_CONVERT_SUCCESS, CAN_CONVERT_FAIL],
        promise: (client)=> client.get('/draws/' + assetContractId + '/canbeconverted')
    };
}

export function getListAssetStateForConversion(contractId) {
    return {
        types: [FETCH_LIST_LANNAP, FETCH_LIST_LANNAP_SUCCESS, FETCH_LIST_LANNAP_FAIL],
        promise: (client) => client.get('/draws/' + contractId + '/events/convert/assetstates')
    };
}

export function getListCreditLineForConversion(contractId, assetstate) {
    return {
        types: [FETCH_LIST_CREDITLINE, FETCH_LIST_CREDITLINE_SUCCESS, FETCH_LIST_CREDITLINE_FAIL],
        promise: (client) => client.get('/draws/' + contractId + '/events/convert/masterfacilities?assetstate=' + assetstate)
    };
}

export function getListScaleConversion(contractId, creditLineId) {
    return {
        types: [FETCH_LIST_SCALE, FETCH_LIST_SCALE_SUCCESS, FETCH_LIST_SCALE_FAIL],
        promise: (client) => client.get('/draws/' + contractId + '/events/convert/scales?mfid=' + creditLineId)
    };
}


