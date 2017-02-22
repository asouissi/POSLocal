/**
 * Created by AkshiK on 11/11/2016.
 */
import {change} from "redux-form";

export const STEP_CHANGE = 'portalquote/STEP_CHANGE';
export const VALIDSTEP_CHANGE = 'portalquote/VALIDSTEP_CHANGE';
export const VERIFY_RECAPTCHA = 'portalquote/VERIFY_RECAPTCHA';
export const VERIFY_DECLARATION = 'portalquote/VERIFY_DECLARATION';
export const UPDATE_RECAPTCHA = 'portalquote/UPDATE_RECAPTCHA';
export const UPDATE_VALUES = 'portalquote/UPDATE_VALUES';
export const UPLOAD_DOC = 'portalquote/UPLOAD_DOC';
export const PORTAL_ACTOR_SAVE = 'actor/PORTAL_ACTOR_SAVE';
export const PORTAL_ACTOR_SAVE_SUCCESS = 'actor/PORTAL_ACTOR_SAVE_SUCCESS';
export const PORTAL_ACTOR_SAVE_FAIL = 'actor/PORTAL_ACTOR_SAVE_FAIL';
export const LOAN_DATA = 'portalquote/LOAN_DATA';
export const RESTRICT_BACK_TRAVERSAL = 'portalquote/RESTRICT_BACK_TRAVERSAL';
export const PORTAL_DEAL_SAVE = 'deal/PORTAL_DEAL_SAVE';
export const PORTAL_DEAL_SAVE_SUCCESS = 'deal/PORTAL_DEAL_SAVE_SUCCESS';
export const PORTAL_DEAL_SAVE_FAIL = 'deal/PORTAL_DEAL_SAVE_FAIL';
export const SAVE_USERDATA = 'portalquote/SAVE_USERDATA';

// Change current step
export function stepChange(index) {
    return {
        type: STEP_CHANGE,
        index
    }
}

export function updateValidStepIndex(validStepIndex) {
    return {
        type: VALIDSTEP_CHANGE,
        validStepIndex
    }
}

export function verifyRecaptcha() {
    return {
        type: VERIFY_RECAPTCHA,
        recaptchaStatus: 1
    }
}

export function verifyTermsConditions(flagDisclaimer) {
    return {
        type: VERIFY_DECLARATION,
        flagDisclaimer
    }
}

export function updateRecaptcha(recaptchaStatus) {
    return {
        type: UPDATE_RECAPTCHA,
        recaptchaStatus: recaptchaStatus == -1 ? 0 : recaptchaStatus,
    }
}

export function updateCaptchaDeclaration(validRecaptcha, flagDisclaimer) {
    return {
        type: UPDATE_VALUES,
        recaptchaStatus: validRecaptcha == -1 ? 0 : validRecaptcha,
        flagDisclaimer
    }
}

export function uploadDocument(filename, lastModifDate) {
    return {
        type: UPLOAD_DOC,
        filename: filename,
        lastModifDate: lastModifDate,
    };
}

export function saveDealForUploadDocument(deal) {
    return {
        types: [PORTAL_DEAL_SAVE, PORTAL_DEAL_SAVE_SUCCESS, PORTAL_DEAL_SAVE_FAIL],
        promise: (client) => client.post('/deals', deal)
    }
}

export function createActor(form, actor) {
    return {
        types: [PORTAL_ACTOR_SAVE, PORTAL_ACTOR_SAVE_SUCCESS, PORTAL_ACTOR_SAVE_FAIL],
        promise: (client) => client.post('/actors', actor),
        afterSuccess: (dispatch, getState, result) => {
            dispatch(change(form, 'actor', result.data));
        }
    }
}

export function saveActorUserDetails(actor, user, deal) {
    return {
        type: SAVE_USERDATA,
        actor: actor,
        user: user,
        deal: deal
    };
}

export function setLoanDetails(data) {
    return {
        type: LOAN_DATA,
        data,
    };
}

export function setUserRestriction(restrict) {
    return {
        type: RESTRICT_BACK_TRAVERSAL,
        restrict
    };
}
