// Action types
import Immutable from 'seamless-immutable'
import {change, arrayPush, arrayRemove} from 'redux-form'
import {batchActions} from 'redux-batched-actions';
import getIn from "redux-form/lib/structure/plain/getIn";


export const ASSET_APPEND_NEW = 'asset/APPEND_NEW';
export const ASSET_APPEND_NEW_SUCCESS = 'asset/APPEND_NEW_SUCCESS';
export const ASSET_APPEND_NEW_FAILURE = 'asset/APPEND_NEW_FAILURE';
export const DEAL_ASSET_CHANGE = 'asset/DEAL_ASSET_CHANGE';
export const ASSET_REMOVE = 'asset/REMOVE';
export const ASSET_UPDATE_FROM_ACACODE = 'asset/ASSET_UPDATE_FROM_ACACODE';
export const ASSET_UPDATE_FROM_ACACODE_SUCCESS = 'asset/ASSET_UPDATE_FROM_ACACODE_SUCCESS';
export const ASSET_UPDATE_FROM_ACACODE_FAILURE = 'asset/ASSET_UPDATE_FROM_ACACODE_FAILURE';
export const ASSET_UPDATE_FROM_NAPCODE = 'asset/ASSET_UPDATE_FROM_NAPCODE';
export const ASSET_UPDATE_FROM_NAPCODE_SUCCESS = 'asset/ASSET_UPDATE_FROM_NAPCODE_SUCCESS';
export const ASSET_UPDATE_FROM_NAPCODE_FAILURE = 'asset/ASSET_UPDATE_FROM_NAPCODE_FAILURE';
export const ASSET_UPDATE_FROM_DPMMTINVEST = 'asset/ASSET_UPDATE_FROM_DPMMTINVEST';
export const ASSET_UPDATE_FROM_DPMMTINVEST_SUCCESS = 'asset/ASSET_UPDATE_FROM_DPMMTINVEST_SUCCESS';
export const ASSET_UPDATE_FROM_DPMMTINVEST_FAILURE = 'asset/ASSET_UPDATE_FROM_DPMMTINVEST_FAILURE';

export const CAR_VARiANT_INIT = 'car/CAR_VARiANT_INTI';
export const CAR_VARIANT_CHANGED = 'car/variant/CHANGED';
export const CAR_FETCH_SUCCESS = 'car/variant/FETCH_SUCCESS';
export const CAR_FETCH_FAILED = 'car/variant/FETCH_FAILED';
export const CAR_ENERGY_CHANGED = 'car/energy/CHANGED';

export const VARIANT_FETCH = 'variant/FETCH';
export const VARIANT_FETCH_SUCCESS = 'variant/FETCH_SUCCESS';
export const VARIANT_FETCH_FAILED = 'variant/FETCH_FAILED';
export const RESET_VARIANT = 'RESET_VARIANT';
export const COPY_VARIANT = 'variant/COPY_VARIANT';

export function changeAssetIndex(assetIndex) {
    return {
        type: DEAL_ASSET_CHANGE,
        assetIndex
    }
}

/**
 * QUOTE actions
 */

//ACTION: asset category has changed, need to reload the asset
export function updateAssetAfterAcacodeChanged(deal, p_dpmordre, p_acacode) {
    return {
        types: [ASSET_UPDATE_FROM_ACACODE, ASSET_UPDATE_FROM_ACACODE_SUCCESS, ASSET_UPDATE_FROM_ACACODE_FAILURE],
        dpmordre: p_dpmordre,
        promise: (client) => client.post('/assets/acacodechanged?dpmordre=' + p_dpmordre + "&acacode=" + p_acacode, deal),
        deal
    }
}

//ACTION: asset type has changed, need to reload the asset
export function updateAssetAfterNapcodeChanged(deal, p_dpmordre, p_napcode) {
    return {
        types: [ASSET_UPDATE_FROM_NAPCODE, ASSET_UPDATE_FROM_NAPCODE_SUCCESS, ASSET_UPDATE_FROM_NAPCODE_FAILURE],
        dpmordre: p_dpmordre,
        promise: (client) => client.post('/assets/napcodechanged?dpmordre=' + p_dpmordre + "&napcode=" + p_napcode, deal)
        , deal
    }
}

//ACTION: asset amount has changed, need to reload the asset
export function updateAssetAfterDpmmtinvestChanged(deal, p_dpmordre, p_dpmmtinvest) {
    return {
        types: [ASSET_UPDATE_FROM_DPMMTINVEST, ASSET_UPDATE_FROM_DPMMTINVEST_SUCCESS, ASSET_UPDATE_FROM_DPMMTINVEST_FAILURE],
        dpmordre: p_dpmordre,
        promise: (client) => client.post('/assets/dpmmtinvestchanged?dpmordre=' + p_dpmordre + "&dpmmtinvest=" + p_dpmmtinvest, deal)
        , deal
    }
}


export function appendDealNewAsset() {
    return (dispatch, getState) => {
        dispatch(appendNewAsset('dealForm', getState().form.dealForm.values.deal, 'deal.listdealasset'));
    }
}

// ACTION: Append new asset
import sharedUtils, * as sharedConst from '../../../../core/utils/sharedUtils';

export function appendNewAsset(form, deal, assetPath) {
    assetPath = assetPath || 'listdealasset';
    return {
        types: [ASSET_APPEND_NEW, ASSET_APPEND_NEW_SUCCESS, ASSET_APPEND_NEW_FAILURE],
        promise: (client) => client.post('/assets/init', deal),
        afterSuccess: (dispatch, getState, result) => {
            var initialAsset = Immutable(result.data);
            var finalAsset = setDefaultProductFamily(sharedUtils.updateActionMode(initialAsset, sharedConst.ACTION_MODE_INSERTION)
                ,deal.listdealasset[0].acacode);
            dispatch(arrayPush(form, assetPath, finalAsset));
        },
        deal
    }
}

function setDefaultProductFamily(asset , acacode) {
    return asset.set ('acacode', acacode );
}

// ACTION: remove asset
export function removeAsset(form, assetIndex, assetPath) {
    return (dispatch, getState) => {
        assetPath = assetPath || 'listdealasset';
        const asset = getIn(getState().form[form].values, assetPath + '['+ assetIndex+']');
        if (sharedUtils.isNew(asset)) {
            dispatch(arrayRemove(form, assetPath, assetIndex));
        }
        else {
            dispatch(change(form, assetPath + '[' + assetIndex + '].actionMode', sharedConst.ACTION_MODE_DELETION));
        }

        dispatch({
            type: ASSET_REMOVE,
            assetIndex
        })
    }
}


/**
 * DEAL actions
 */


export function initVariant() {
    return {
        type: CAR_VARiANT_INIT,
    };
}

// Set car variant
export function setCarVariant(form, varid, asset, index) {
    return {
        types: [CAR_VARIANT_CHANGED, CAR_FETCH_SUCCESS, CAR_FETCH_FAILED],
        varid,
        promise: (client) => client.get('/variants/' + varid),
        afterSuccess: (dispatch, getState, result) => {
            var variant = Immutable(result.data);
            //batch action to reduce number of render
            dispatch(batchActions([//TODDO IGA to check change(form, `${asset}.taxcode`, variant.taxcode),
                change(form, `${asset}.dpmmtvat`, variant.vprmtvat)
                , change(form, `${asset}.dpmmtttc`, variant.vprmt)
                , change(form, `${asset}.dpmmtinvest`, (variant.vprmt * (100.0 - variant.vprmtvat)) / 100.0)
                , change(form, 'deal.listdealquote[' + index + '].pfiinvestissement', variant.vprmt)]));

        },
    };
}

// Set car energy (not used)
export function setCarEnergy(varenergytype) {
    return {
        type: CAR_ENERGY_CHANGED,
        varenergytype
    }
}

// Get variant based on its ID
export function getVariant(varid) {
    return {
        types: [VARIANT_FETCH, VARIANT_FETCH_SUCCESS, VARIANT_FETCH_FAILED],
        varid,
        promise: (client) => client.get('/variants/' + varid)
    };
}

export function copyVariant(variant, assetIndex){
    return{
        type : COPY_VARIANT,
        assetIndex,
        variant
    }
}
export function resetVariant() {
    return {
        type: RESET_VARIANT,
    };
}


