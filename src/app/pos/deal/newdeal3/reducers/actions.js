/**
 * Created by zos on 01/06/2016.
 */

import dealUtils from '../../utils/dealUtils'
import {change} from 'redux-form';

export const FETCH = 'deal3/FETCH';
export const FETCH_SUCCESS = 'deal3/FETCH_SUCCESS';
export const FETCH_FAIL = 'deal3/FETCH_FAIL';

export const FETCH_DRAW = 'deal3/FETCH_DRAW';
export const FETCH_DRAW_SUCCESS = 'deal3/FETCH_DRAW_SUCESS';
export const FETCH_DRAW_FAIL = 'deal3/FETCH_DRAW_FAIL';

export const FETCH_U = 'newdeal3/FETCH';
export const FETCH_U_SUCCESS = 'newdeal3/FETCH_SUCCESS';
export const FETCH_U_FAIL = 'newdeal3/FETCH_FAIL';

export const NEW = "newdeal3/NEW";
export const NEW_SUCCESS = "newdeal3/NEW_SUCCESS";
export const NEW_FAIL = "newdeal3/NEW_FAIL";

export const STEP_CHANGE = 'newdeal3/STEP_CHANGE';

export const FINANCIAL_PRODUCT_CHANGE = 'newdeal3/FINANCIAL_PRODUCT_CHANGE';
export const SELECT_ASSET_TO_DRAW = 'newdeal3/SELECT_ASSET_TO_DRAW';
export const SELECT_ASSET_TO_DRAW_SUCCESS = 'newdeal3/SELECT_ASSET_TO_DRAW_SUCCESS';
export const SELECT_ASSET_TO_DRAW_FAILED = 'newdeal3/SELECT_ASSET_TO_DRAW_FAILED';

export const SAVE = 'newdeal3/SAVE';
export const SAVE_SUCCESS = 'newdeal3/SAVE_SUCCESS';
export const SAVE_FAIL = 'newdeal3/SAVE_FAIL';

export const VARIANT_FETCH = 'variant/FETCH';
export const VARIANT_FETCH_SUCCESS = 'variant/FETCH_SUCCESS';
export const VARIANT_FETCH_FAILED = 'variant/FETCH_FAILED';

// Change current step
export function StepChange(index) {
    return {
        type: STEP_CHANGE,
        index
    }
}
// Fetch existing deal from /deal Service
export function fetchDeal(dealId) {
    return {
        types: [FETCH, FETCH_SUCCESS, FETCH_FAIL],
        promise: (client) => client.get('/deals/' + dealId)
    };
}
// Fetch existing draw deal from /deal Service
export function fetchDrawDeal(dealId) {
    return {
        types: [FETCH_DRAW, FETCH_DRAW_SUCCESS, FETCH_DRAW_FAIL],
        promise: (client) => client.get('/deals/' + dealId),
        afterSuccess: (dispatch, getState, result) => {
            var d = result.data;
            if (d && d.listdealasset[0] && d.listdealasset[0].varid) {
                dispatch(getVariant(d.listdealasset[0].varid));
            }
        }
    };
}

// Fetch undrawn assets from /deal Service for master facility deals
export function fetchUndrawnAssets(dealId) {
    return {
        types: [FETCH_U, FETCH_U_SUCCESS, FETCH_U_FAIL],
        promise: (client) => client.get('/deals/' + dealId + '/assets/undrawn')
    };
}

// Set Asset name when select changed ang Get its variant
export function selectAssetToDraw(dpmordreSelected) {

    return (dispatch, getState) =>{
        var asset = dealUtils.getDealAssetFromDpmOrdre(getState().newdeal3.deal, dpmordreSelected);
        dispatch(change('drawdeal', 'listdealasset[0]', asset));
        dispatch(getVariant(asset.varid || 0));
    };
}
// get car variant
export function getVariant(varid) {
    return {
        types: [VARIANT_FETCH, VARIANT_FETCH_SUCCESS, VARIANT_FETCH_FAILED],
        varid,
        promise: (client) => client.get('/variants/' + varid)
    };
}
// Create new empty deal from server (/deal/init service)
export function newDrawDeal(dosid) {
    return {
        types: [NEW, NEW_SUCCESS, NEW_FAIL],
        promise: (client) => client.get('/deals/init'),
        dosid
    }
}

export function saveDrawDeal(drawdeal, onSuccess, onError) {
    return (dispatch, getState) => {
        if (drawdeal.dosid) {
            // Existing deal, update it (PATCH)
            dispatch({
                types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
                promise: (client) => client.patch('/deals', drawdeal),
                afterSuccess: (dispatch, getState, result) => {
                    onSuccess(drawdeal.dosid, 'U');
                },
                afterError(dispatch, getState, error){
                    onError(error);
                }
            })
        }else{
            // New deal, create it (POST)
            dispatch({
                types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
                promise: (client) => client.post('/deals', drawdeal),
                afterSuccess: (dispatch, getState, result) => {
                    onSuccess(result.data.dosid, 'C');
                },
                afterError(dispatch, getState, error){
                    onError(error);
                 }
            })
        }
    }
}
export function submitForApproval(onSuccess) {
    saveDrawDeal(onSuccess, null);
    // TODO implement the submit
}
