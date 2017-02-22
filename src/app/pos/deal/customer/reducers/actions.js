import {arrayPush, arraySplice} from "redux-form";
import getIn from "redux-form/lib/structure/plain/getIn";
import Immutable from 'seamless-immutable'
import sharedUtils, * as sharedConst from '../../../../core/utils/sharedUtils';

export const CUSTOMER_NUMBER_CHANGED = 'customer/number/CHANGED';
export const CUSTOMER_FETCH_SUCCESS = 'customer/FETCH_SUCCESS';
export const CUSTOMER_FETCH_FAIL = 'customer/FETCH_FAIL';
export const ACTTYPE_CHANGE = 'customer/ACTTYPE_CHANGE';
export const FETCH = 'customer/FETCH';
export const FETCH_ACTTYPE_SUCCESS = 'customer/FETCH_ACTTYPE_SUCCESS';
export const FETCH_FAIL = 'customer/FETCH_FAIL';


// Change customer number : call /actor service
export function setCustomerNumber(form, actcode, rolcode) {
    return (dispatch, getState) => {
        if (actcode) {
            dispatch({
                types: [CUSTOMER_NUMBER_CHANGED, CUSTOMER_FETCH_SUCCESS, CUSTOMER_FETCH_FAIL],
                actcode,
                rolcode,
                promise: (client) => client.get('/actors', {
                    params: {
                        actcode: actcode,
                        actroles: [rolcode].toString()
                    }
                }),
                afterSuccess: (dispatch, getState, result) => {
                    let first = result.data[0];

                    if (first) {
                        dispatch(setCustomer(form, rolcode, first));
                    }
                }
            });
        }
    }
}


export function setCustomer(form, rolCode, customer, actorList, lamordre) {
    return (dispatch, getState) => {
        let dealActor = {
            rolcode: rolCode,
            actcode: customer.actcode,
            actlibcourt: customer.actlibcourt,
            actnom: customer.actnom,
            actid: customer.actid,
            lamordre: lamordre  // dpaordre ? for deal  ?
        }

        var actors = getIn(getState().form[form].values, actorList)
        let actorIndex = actors.findIndex((actor) => actor.rolcode == rolCode)
        if (actorIndex === -1) {
            dispatch(
                arrayPush(form, actorList, dealActor)
            );
        } else {
            dispatch(
                    arraySplice(form, actorList, actorIndex, 1, dealActor)
                );
        }
    }
}

export function clearCustomer(form, rolCode, actorList, customer) {
    return (dispatch, getState) => {
        var dealActor = Immutable({
            rolcode: rolCode,
            actcode: null,
            actlibcourt: null,
            actnom: null,
            actid: null,
            lamordre: customer.lamordre
        })
        var actors = getIn(getState().form[form].values, actorList);
        let actorIndex = actors.findIndex((actor) => actor.rolcode == rolCode)
        if (actorIndex != -1) {
            dealActor = sharedUtils.updateActionMode(dealActor, sharedConst.ACTION_MODE_DELETION);
            dispatch(
                arraySplice(form, actorList, actorIndex, 1, dealActor)
            );
        }
    }
}

export function changeActtype(acttype, actorIndex) {
    return {
        type: ACTTYPE_CHANGE,
        acttype,
        actorIndex
    }
}

export function setActtype(actid, actorIndex) {

    return {
        types: [FETCH, FETCH_ACTTYPE_SUCCESS, FETCH_FAIL],
        promise: (client) => client.get('/actors/' + actid),
        afterSuccess: (dispatch, getState, result) => {
            dispatch(changeActtype(result.data.acttype, actorIndex));
        }
    };
}


