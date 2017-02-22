import dealUtils, {
    CLIENT,
    COCLIEN,
    BORROWER,
    COBORROWER,
    VALUE_CODE_BUSINESS_TYPE_CBM,
    SELF_PAYMENT_SITEOPTION
} from "../../utils/dealUtils";
import {setCarVariant, updateAssetAfterNapcodeChanged} from "../../assets/reducers/actions";
import {change, arrayPush, arrayRemove, arrayPop} from "redux-form";
import sharedUtils from "../../../../core/utils/sharedUtils";
import * as sharedConst from "../../../../core/utils/sharedUtils";
import actorUtils from "../../../../common/actor/actorUtils";
import getIn from "redux-form/lib/structure/plain/getIn";
import {initActor} from "./newdeal";
import Immutable from "seamless-immutable";
import {setCurrencyCode} from "../../../../core/reducers/locales";
import axios from "axios";


export const NEW = "deal/NEW";
export const NEW_SUCCESS = "deal/NEW_SUCCESS";
export const NEW_FAIL = "deal/NEW_FAIL";

export const FETCH = 'deal/FETCH';
export const FETCH_SUCCESS = 'deal/FETCH_SUCCESS';
export const FETCH_FAIL = 'deal/FETCH_FAIL';

export const SAVE = 'deal/SAVE';
export const SAVE_SUCCESS = 'deal/SAVE_SUCCESS';
export const SAVE_FAIL = 'deal/SAVE_FAIL';

export const COMPUTE_SCHEDULE = 'deal/COMPUTE_SCHEDULE';
export const COMPUTE_SCHEDULE_SUCCESS = 'deal/COMPUTE_SCHEDULE_SUCCESS';
export const COMPUTE_SCHEDULE_FAIL = 'deal/COMPUTE_SCHEDULE_FAIL';

export const GET_SERVICES = 'deal/GET_SERVICES';
export const GET_SERVICES_SUCCESS = 'deal/GET_SERVICES_SUCCESS';
export const GET_SERVICES_FAIL = 'deal/GET_SERVICES_FAIL';

export const COMPUTE_PAYMENT = 'deal/COMPUTE_PAYMENT';
export const COMPUTE_PAYMENT_SUCCESS = 'deal/COMPUTE_PAYMENT_SUCCESS';
export const COMPUTE_PAYMENT_FAIL = 'deal/COMPUTE_PAYMENT_FAIL';

export const STEP_CHANGE = 'deal/STEP_CHANGE';
export const CLIENT_TAB_CHANGE = 'deal/CLIENT_TAB_CHANGE';

export const EXECUTE_EVENT = 'deal/EXECUTE_EVENT';
export const EXECUTE_EVENT_SUCCESS = 'deal/EXECUTE_EVENT_SUCCESS';
export const EXECUTE_EVENT_FAILURE = 'deal/EXECUTE_EVENT_FAILURE';

export const FETCH_ACTION = 'deal/action/FETCH';
export const FETCH_ACTION_SUCCESS = 'deal/action/FETCH_SUCCESS';
export const FETCH_ACTION_FAIL = 'deal/action/FETCH_FAIL';

export const POST_ACTION = 'deal/action/POST';
export const POST_ACTION_SUCCESS = 'deal/action/POST_SUCCESS';
export const POST_ACTION_FAIL = 'deal/action/POST_FAIL';

export const QUOTE_APPEND_NEW = 'deal/quote/APPEND_NEW';
export const QUOTE_APPEND_NEW_SUCCESS = 'deal/quote/APPEND_NEW_SUCCESS';
export const QUOTE_APPEND_NEW_FAILURE = 'deal/quote/APPEND_NEW_FAILURE';

export const DEAL_QUOTE_CHANGE = 'deal/quote/DEAL_QUOTE_CHANGE';
export const QUOTE_REMOVE = 'deal/quote/QUOTE_REMOVE';

export const FETCH_DEAL_EVENTS = 'deal/events/FETCH';
export const FETCH_DEAL_EVENTS_SUCCESS = 'deal/events/FETCH_SUCCESS';
export const FETCH_DEAL_EVENTS_FAIL = 'deal/events/FETCH_FAIL';

export const APPEND_NEW_ACTOR = 'deal/APPEND_NEW_ACTOR';
export const PROSPECT_ACTOR_SAVE = 'deal/PROSPECT_ACTOR_SAVE';
export const PROSPECT_ACTOR_SAVE_SUCCESS = 'deal/PROSPECT_ACTOR_SAVE_SUCCESS';
export const PROSPECT_ACTOR_SAVE_FAIL = 'deal/PROSPECT_ACTOR_SAVE_FAIL';

export const CHANGE_COCONTRACTANT_VISIBILITY = 'deal/CHANGE_COCONTRACTANT_VISIBILITY';
export const CHANGE_COCONTRACTANT_ADDRESS_VISIBILITY = 'deal/CHANGE_COCONTRACTANT_ADDRESS_VISIBILITY';
export const CHANGE_COCONTRACTANT_BANKACCOUNT_VISIBILITY = 'deal/CHANGE_COCONTRACTANT_BANKACCOUNT_VISIBILITY';

export const FETCH_CLIENT_ACTOR = 'deal/FETCH_CLIENT_ACTOR';
export const FETCH_CLIENT_ACTOR_SUCCESS = 'deal/FETCH_CLIENT_ACTOR_SUCCESS';
export const FETCH_CLIENT_ACTOR_FAIL = 'deal/PROSPECT_ACTOR_SAVE_FAIL';

export const CHANGE_IBAN_ACCOUNT = 'deal/CHANGE_IBAN_ACCOUNT';
export const SET_CUSTOMER_ROLCODES = 'deal/SET_CUSTOMER_ROLCODES';

export const FETCH_RATE_TAX = 'deal/rate_tax/FETCH';
export const FETCH_RATE_TAX_SUCCESS = 'deal/rate_tax/FETCH_SUCCESS';
export const FETCH_RATE_TAX_FAIL = 'deal/rate_tax/FETCH_FAIL';
export const FETCH_SITEOPTION = 'deal/FETCH_SITEOPTION';
export const FETCH_SITEOPTION_SUCCESS = 'deal/FETCH_SITEOPTION_SUCCESS';
export const FETCH_SITEOPTION_FAIL = 'deal/FETCH_SITEOPTION_FAIL';
export const SET_SELF_PAYMENT_STEP = 'deal/SET_SELF_PAYMENT_STEP';
export const SET_SERVICE_ACTION = 'deal/SET_SERVICE_ACTION';
export const RESET_POSSIBLE_SERVICES = 'deal/RESET_POSSIBLE_SERVICES';
/*
 * Actions
 */

// Create new empty deal from server (/deal/init service)
export function newDeal() {
    return {
        types: [NEW, NEW_SUCCESS, NEW_FAIL],
        promise: (client) => client.get('/deals/init'),

        afterSuccess: (dispatch, getState, result) => {
            dispatch(fetchDealEvents(null));
            dispatch(setCurrencyCode(result.data.devcode))
            if(result.data.taccode === VALUE_CODE_BUSINESS_TYPE_CBM){
                dispatch(setCustomerRolecodes(CLIENT, COCLIEN));
            } else {
                dispatch(setCustomerRolecodes(BORROWER, COBORROWER));
            }
        },
        stepIndex: 0
    }
}

// Create new empty deal from server (/deal/init service)
export function newMF() {
    return {
        types: [NEW, NEW_SUCCESS, NEW_FAIL],
        promise: (client) => client.get('/deals/init?tpgflagfacility=1'),
        isMF: true
    }
}

// Create new empty deal from server (/deal/init service)
export function saveDeal(deal) {
    let request = (client) => client.post('/deals', deal);
    if (deal.dosid) {
        request = (client) => client.patch('/deals ', deal)
    }
    return {
        types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
        promise: request
    }
}


export function executeEvent(data, event, onSuccess, onError) {
    var dealEvent = event.set('deal', data);
    return {
        types: [EXECUTE_EVENT, EXECUTE_EVENT_SUCCESS, EXECUTE_EVENT_FAILURE],
        promise: (client) => client.post('/deals/events/executeevent', dealEvent),
        afterSuccess: (dispatch, getState, result) => {
            onSuccess(result.data.deal.dosid);
            dispatch(fetchDealAction(result.data.deal.dosid));
            dispatch(fetchDealEvents(result.data.deal.dosid));
        }
        ,
        afterError(dispatch, getState, error){
            onError(error);
        }
    };

}


export function actionDone() {
    return (dispatch, getState) => {
        dispatch({
            types: [POST_ACTION, POST_ACTION_SUCCESS, POST_ACTION_FAIL],
            promise: (client) => client.post('/deals/events/doneworkflow ', getState().form.dealForm.values.deal)
        });
    }

}

// Fetch existing deal from /deal Service

const roles = [CLIENT, COCLIEN, BORROWER, COBORROWER];
export function fetchDeal(dealId, stepIndex) {
    return {
        types: [FETCH, FETCH_SUCCESS, FETCH_FAIL],
        promise: (client) => client.get('/deals/' + dealId),
        afterSuccess: (dispatch, getState, result) => {
            var d = result.data;
            if (d && d.listdealasset[0] && d.listdealasset[0].varid) {
                dispatch(setCarVariant('dealForm', d.listdealasset[0].varid, 'deal.listdealasset[0]', 0));
                dispatch(fetchRateTax(d.listdealasset[0].taxcode));
            }
            if (d && d.listdealactor) {
                d.listdealactor.forEach(actor => {
                    if (roles.find(role => role == actor.rolcode)) {
                        dispatch(fetchActor(actor.actid, actor.rolcode));
                    }
                })
            }
            dispatch(setCurrencyCode(d.devcode));
            dispatch(fetchDealAction(dealId));
            dispatch(fetchDealEvents(dealId));
            dispatch(fetchSiteOption(d.jalcode,SELF_PAYMENT_SITEOPTION));
            if(d.taccode === VALUE_CODE_BUSINESS_TYPE_CBM){
                dispatch(setCustomerRolecodes(CLIENT, COCLIEN));
            } else {
                dispatch(setCustomerRolecodes(BORROWER, COBORROWER));
            }

        },stepIndex
    };
}

export function closeDeal() {
    return (dispatch, getstate) => {
        dispatch(setCurrencyCode(null))
    }
}

// Recalculate deal schedule
export function computeSchedule() {
    return (dispatch, getState) => {
        let deal = getState().form.dealForm.values.deal;
        dispatch({
            types: [COMPUTE_SCHEDULE, COMPUTE_SCHEDULE_SUCCESS, COMPUTE_SCHEDULE_FAIL],
            promise: (client) => client.post('/deals/financial/applyscaleandcomputeschedule', deal),
            afterSuccess: (dispatch, getState, result) => {
                dispatch(change('dealForm', 'deal', result.data));
            }
        });
    }
}

export function setDprNom(productName) {
    return change("dealForm", "deal.dprnom", productName + " (deal)"); //no dispatch ?
}


// Recalculate deal payments
export function computePayment(onSuccess, onError) {
    return (dispatch, getState) => {
        let deal = getState().form.dealForm.values.deal;

        dispatch({
            types: [COMPUTE_PAYMENT, COMPUTE_PAYMENT_SUCCESS, COMPUTE_PAYMENT_FAIL],
            promise: (client) => client.post('/deals/financial/computepayment', deal),
            afterSuccess: (dispatch, getState, result) => {
                var payment = dealUtils.getQuoteElement(result.data).pfrmtloyer;
                if (payment) {
                    dispatch(change('dealForm', 'deal', result.data));
                    onSuccess(payment)
                }

            },
            afterError(dispatch, getState, error){
                onError(error);
            }

        });
    }
}


// Change current step
export function StepChange(index, forceStep) {
    return {
        type: STEP_CHANGE,
        index,
        forceStep
    }
}

export function handleFaultyStep(syncErrors, formName) {
    return (dispatch, getState) => {
        const state = getState();
        const registeredFields = state.form[formName].registeredFields || [];
        if(!syncErrors) return;
        let errors = registeredFields
            .map(field => field.name)
            .filter(name => getIn(syncErrors, name))

        if(!errors.length || !registeredFields.length){
            dispatch(StepChange())
        }
    }
}


export function fetchDealAction(dealId) {
    return {
        types: [FETCH_ACTION, FETCH_ACTION_SUCCESS, FETCH_ACTION_FAIL],
        promise: (client) => client.get('/deals/' + dealId + '/requestedaction')
    };
}

//Take the list of events by deal
export function fetchDealEvents(dealId) {
    let querry = ''; //todo @Isamm @Aladin: refactor with params object
    if (dealId) {
        querry = '/deals/events/listevents?destid=' + dealId + '&destination=AVDOSS&module=AVDOSS&taccode=CBM';
    }
    else {
        querry = '/deals/events/listevents?destination=AVDOSS&module=AVDOSS&taccode=CBM';
    }

    return {
        types: [FETCH_DEAL_EVENTS, FETCH_DEAL_EVENTS_SUCCESS, FETCH_DEAL_EVENTS_FAIL],
        promise: (client) => client.get(querry)
    }
}

export function appendDealNewQuote() {
    return (dispatch, getState) => {
        dispatch(appendNewQuote('dealForm', getState().form.dealForm.values.deal, 'deal.listdealquote'));
    }
}
export function appendNewQuote(form, deal, quotePath) {
    quotePath = quotePath || 'listdealquote';
    return {
        types: [QUOTE_APPEND_NEW, QUOTE_APPEND_NEW_SUCCESS, QUOTE_APPEND_NEW_FAILURE],
        promise: (client) => client.post('/deals/quote/init', deal),
        afterSuccess: (dispatch, getState, result) => {
            var newQuote = result.data; // quote returned by the init ws
            const nextOrder = deal.listdealquote.length + 1; // compute the dpfordre, because it is not done by th webservice
            newQuote.dpfordre = nextOrder; // fill the dpfordre
            newQuote.pfinom = 'Quote #' + nextOrder; // fill the pfinom, cause it is not done by the init webservice
            newQuote.actionMode = sharedConst.ACTION_MODE_INSERTION;
            dispatch(arrayPush(form, quotePath, newQuote));
        },
        deal
    }
}
export function changeQuoteIndex(index) {
    return {
        type: DEAL_QUOTE_CHANGE,
        index
    }
}



// ACTION: remove quote (when we remove the corresponding asset)
export function removeQuote(form, quoteIndex, quotePath) {
    return (dispatch, getState) => {
        quotePath = quotePath || 'listdealquote';
        const quote = getIn(getState().form[form].values, quotePath + '[' + quoteIndex + ']');
        if (sharedUtils.isNew(quote)) {
            dispatch(arrayRemove(form, quotePath, quoteIndex));
        }
        else {
            dispatch(change(form, quotePath + '[' + quoteIndex + '].actionMode', sharedConst.ACTION_MODE_DELETION));
        }

        dispatch({
            type: QUOTE_REMOVE,
            quoteIndex
        })
    }
}


export function appendNewActor2(rolCode) {
    return (dispatch, getState) => {
        let actor = initActor(rolCode);
        dispatch(arrayPush('dealForm', 'listActor', {rolcode: rolCode, actor}))
    }

}


export function saveActor(actorData, actorIndex) {
    actorData = Immutable.setIn(actorData, ['actor', 'listactortelecom'], actorUtils.removeEmptyTelecoms(actorData.actor));
    return {
        types: [PROSPECT_ACTOR_SAVE, PROSPECT_ACTOR_SAVE_SUCCESS, PROSPECT_ACTOR_SAVE_FAIL],
        promise: (client) => client.post('/actors', actorData.actor),
        actorIndex,
        rolcode: actorData.rolcode,
        afterSuccess: (dispatch, getState, result) => {
            dispatch(change('dealForm', 'listActor[' + actorIndex + '].actor', result.data))
        }
    }
}

export function fetchActor(actorId, rolcode, options) {

    return {
        types: [FETCH_CLIENT_ACTOR, FETCH_CLIENT_ACTOR_SUCCESS, FETCH_CLIENT_ACTOR_FAIL],
        promise: (client) => client.get('/actors/' + actorId),
        rolcode,
        options
    }
}

export function handleSameAddress(value) {
    return {
        type: CHANGE_COCONTRACTANT_ADDRESS_VISIBILITY,
        value: value,

    }
}
export function handleSameBankAccount(value) {
    return {
        type: CHANGE_COCONTRACTANT_BANKACCOUNT_VISIBILITY,
        value: value,
    }
}

export function clientTabChange(key) {
    return {
        type: CLIENT_TAB_CHANGE,
        key: key
    }
}

function getActor(actorIndex, mappedField) {
    return 'listActor[' + actorIndex + '].actor.' + mappedField;
}

export function setGenderType(form, value, actorIndex) {
    return (dispatch) => {
        dispatch(change(form, getActor(actorIndex, 'apasexe'), (value === 'M') ? 1 : 2));
        if (value === 'M') {
            dispatch(change(form, getActor(actorIndex, 'apanompatronymique'), null));
        }
    }
}

export function setCustomerFullName(form, value, index, mappedField, value2) {
    return (dispatch) => {
        if (mappedField) {
            dispatch(change(form, getActor(index, mappedField), value2.trim()));
        }
        dispatch(change(form, getActor(index, 'actlibcourt'), value.trim()));
    }
}

export function setPostalcode(form, actorIndex, value) {
    return (dispatch) => {
        if (value.length > 2) {
            dispatch(change(form, getActor(actorIndex, 'apadeptnaiss'), value.substring(0, 2)));
            dispatch(change(form, getActor(actorIndex, 'apacomnaiss'), value.substring(2, 5)));
        }
    }
}

export function setTpgcode(value) {
    return (dispatch) => {
        dispatch(change('dealForm', 'deal.tpgcode', value));
    }
}

export function resetSpecificFields(form, collection, fields) {
    return (dispatch) => {
        fields.forEach(field => dispatch(change(form, collection + "." + field, null)));
    }
}

export function validateIban(iban) {
    return axios.post('/actors/validateiban?iban=' + iban);
}

export function changeIbanStatus(status) {
    return {
        type: CHANGE_IBAN_ACCOUNT,
        status
    }
}

export function setCustomerRolecodes(customerRolcode, coCustomerRolcode) {
    return {
        type: SET_CUSTOMER_ROLCODES,
        customerRolcode,
        coCustomerRolcode
    }
}
export function fetchRateTax(taxcode) {
    return {
        types: [FETCH_RATE_TAX, FETCH_RATE_TAX_SUCCESS, FETCH_RATE_TAX_FAIL],
        promise: (client) => client.get('/deals/financial/ratetaxvalue?taxcode=' + taxcode)

    }
}

export function updateCustomerRoles(form, actorList, rolcode, rolcodeRemove) {   // rolcode = current ,   rolcodeRemove= rolcode that is previously added
    return (dispatch) => {
        if (actorList && form) {                                                                                    // checking if the rolcode we want to remove is there in the list or not
            const customerIndex = actorList.findIndex((actor) => (actor.rolcode === rolcodeRemove));        // and if its not there that means we don't have to add the new one in the
            if (customerIndex != -1) {                                                                  //list because the same rolcode is already there.
                dispatch(change(form, 'listActor[' + customerIndex + '].rolcode', rolcode));// setting rolcode outside the actor object int listActor
                let actor = actorList[customerIndex].actor;
                if (actor.actid) {                                                                                           // if actor is in persistent state then it may have more than 1 roles
                    if (actor.listactorrole.find((role) => role.actionMode == '+' && role.rolcode === rolcodeRemove)) {     // if the rolcode that we want to remove it there, but it may happen
                        dispatch(arrayPop(form, "listActor[" + customerIndex + "].actor.listactorrole"));  //that rolcode was already there when we fetched actor
                    }                                                                                                    // in that case we can not remove that role. for that check actionMode
                    if (!actor.listactorrole.find((role) => role.rolcode === rolcode)) {                                // if the rolcode we want to add is already there then don't add it again
                        dispatch(arrayPush(form, "listActor[" + customerIndex + "].actor.listactorrole", {
                            actionMode: '+',
                            rolcode: rolcode
                        }));
                    }
                } else {                                                                                    // if actor is not in persistent state then it will have only 1 role that is , we provided in INITIAL_ACTOR
                    dispatch(change(form, "listActor[" + customerIndex + "].actor.listactorrole[0].rolcode", rolcode));
                }
            }
        }
    }
}

export function updateAssetAfterNapcodeChanged2(dpmordre, napcode) {
    return (dispatch, getState) => {
        dispatch(updateAssetAfterNapcodeChanged(getState().form.dealForm.values.deal, dpmordre, napcode));
    }
}

export function fetchSiteOption(jalcode, tpaparam) {
    return {
        types: [FETCH_SITEOPTION, FETCH_SITEOPTION_SUCCESS, FETCH_SITEOPTION_FAIL],
        promise: (client) => client.get('/referencetable/siteoption', {params: {tpaparam}}),
        afterSuccess: (dispatch, getState, result) => {
            dispatch(setSelfPaymentStep(jalcode, result.data.tpatexte));
        },
    };
}

function setSelfPaymentStep(currentJalcode, selfPaymentSteps) {
    let stepList = selfPaymentSteps.split(';');
    let isSelfPaymentStep = (stepList.find((jalcode) => jalcode == currentJalcode)) ? true : false;
    return {
        type: SET_SELF_PAYMENT_STEP,
        isSelfPaymentStep
    }
}



export function setServiceAction(serviceId, checked) {
    return {
        type: SET_SERVICE_ACTION,
        serviceId,
        checked
    }
}
export function resetPossibleServices(initialPossibleServices){
    return {
        type: RESET_POSSIBLE_SERVICES,
        initialPossibleServices
    }
}
export function getPossibleFinancialServices(quoteIndex) {
    return (dispatch, getState) => {
        let deal = getState().form.dealForm.values.deal;
        let parameters = {pcrid:deal.listdealquote[quoteIndex].pcrid, pcrordre:deal.listdealquote[quoteIndex].pcrordre};
        if(parameters.pcrid && parameters.pcrordre){
            dispatch({
                types: [GET_SERVICES, GET_SERVICES_SUCCESS, GET_SERVICES_FAIL],
                promise: (client) => client.get('/deals/financial/getPossibleFinancialServices', {params:parameters})
            });
        }

    }
}
