import {batchActions} from "redux-batched-actions";
import {arrayPush} from "redux-form";
import actorUtils from "../actorUtils"
import Immutable from 'seamless-immutable';
export const NEW = 'actor/NEW';

export const ACTOR_SAVE = 'actor/SAVE';
export const ACTOR_SAVE_SUCCESS = 'actor/SAVE_SUCCESS';
export const ACTOR_SAVE_FAIL = 'actor/SAVE_FAIL';

export const FETCH_ACTOR = 'actor/FETCH';
export const FETCH_ACTOR_SUCCESS = 'actor/FETCH_SUCCESS';
export const FETCH_ACTOR_FAIL = 'actor/FETCH_FAIL';

export const CHANGE_ADDRESS = 'address/CHANGE_ADDRESS';

export function newActor(rolcode, customFields) {
    return (dispatch, getState) => {
        dispatch({
            type: NEW,
            uticode: getState().authentication.user.uticode,
            rolcode,
            customFields
        });
    }

}

export function fetchActor(actorId, customFields) {
    return {
        types: [FETCH_ACTOR, FETCH_ACTOR_SUCCESS, FETCH_ACTOR_FAIL],
        promise: (client) => client.get('/actors/' + actorId),
        customFields
    }
}

export function saveActor(formData, onSuccess) {
    formData = Immutable.setIn(formData, ['listactortelecom'], actorUtils.removeEmptyTelecoms(formData));
    formData = Immutable.setIn(formData, ['listactoraddress'], actorUtils.removeEmptyAddresses(formData));
    formData = Immutable.setIn(formData, ['listcustomcharacteristic'], removeEmptyCustomcharacteristics(formData));

    // let actor = getState().actorReducer.actor.merge({
    //     uticodemaj: getState().authentication.user.uticode,
    //     ...formData
    // });

    return {
        types: [ACTOR_SAVE, ACTOR_SAVE_SUCCESS, ACTOR_SAVE_FAIL],
        promise: (client) => client.post('/actors', formData),
        afterSuccess: (dispatch, getState, result) => {
            onSuccess(result.data);
        }
    }

}

function removeEmptyCustomcharacteristics(formData) {
    return formData.listcustomcharacteristic.filter(customcharacteristic => customcharacteristic && customcharacteristic.cchvaluecode)
}

export function addAddress(addressIndex) {
    return (dispatch, getState) => {
        var actor = getState().form.actor.values;
        var newAddress = { aadordre: addressIndex + 1 };
        dispatch(batchActions([
            arrayPush('actor', 'listactoraddress', newAddress),
        ]));

        dispatch({
            type: CHANGE_ADDRESS,
            addressIndex
        })
    }
}

export function changeAddress(addressIndex) {
    return {
        type: CHANGE_ADDRESS,
        addressIndex
    }
}