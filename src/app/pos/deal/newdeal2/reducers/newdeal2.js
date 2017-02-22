import {LOCATION_CHANGE} from "react-router-redux";
import Immutable from "seamless-immutable";
import {change} from "redux-form";
import dealUtils from "../../utils/dealUtils";
import * as dconst from "../../utils/dealUtils";
import * as qconst from "../../utils/QuoteUtils";
import quoteReducer from "./dealQuote";
import merge from "lodash/merge";
import customer from "../../customer";
import assets from "../../assets";

// Action types
const NEW = "quote/NEW";
const NEW_SUCCESS = "quote/NEW_SUCCESS";
const NEW_FAIL = "quote/NEW_FAIL";

const FETCH = 'quote/FETCH';
const FETCH_SUCCESS = 'quote/FETCH_SUCCESS';
const FETCH_FAIL = 'quote/FETCH_FAIL';

const FETCH_ACTION = 'quote/action/FETCH';
const FETCH_ACTION_SUCCESS = 'quote/action/FETCH_SUCCESS';
const FETCH_ACTION_FAIL = 'quote/action/FETCH_FAIL';

const POST_ACTION = 'quote/action/POST';
const POST_ACTION_SUCCESS = 'quote/action/POST_SUCCESS';
const POST_ACTION_FAIL = 'quote/action/POST_FAIL';

const SAVE = 'quote/SAVE';
const SAVE_SUCCESS = 'quote/SAVE_SUCCESS';
const SAVE_FAIL = 'quote/SAVE_FAIL';

const PROMOTE_TO_DEAL = 'quote/PROMOTE';
const SUBMIT_FOR_APPROVAL = 'quote/APPROVAL';
const SUBMIT_FOR_APPROVAL_SUCCESS = 'quote/APPROVAL_SUCCESS';
const SUBMIT_FOR_APPROVAL_FAILURE = 'quote/APPROVAL_FAILURE';

const STEP_CHANGE = 'quote/STEP_CHANGE';

const EXECUTE_EVENT = 'quote/EXECUTE_EVENT';
const EXECUTE_EVENT_SUCCESS = 'quote/EXECUTE_EVENT_SUCCESS';
const EXECUTE_EVENT_FAILURE = 'quote/EXECUTE_EVENT_FAILURE';

const FETCH_DEAL_EVENTS = 'quote/events/FETCH';
const FETCH_DEAL_EVENTS_SUCCESS = 'quote/events/FETCH_SUCCESS';
const FETCH_DEAL_EVENTS_FAIL = 'quote/events/FETCH_FAIL';
const DEFAULT_EMPTY_OBJECT = [];
// Initial state
const initialState = {
    stepIndex: 0,
    readOnly: false,
    action: {},
    documents: [],
    acttypes: [],
    control: {},
    quoteIndex: 0,
    deal: Immutable(dconst.INITIAL_DEAL()),
    events:[],
    event
};

/*
 * Actions
 */

// Create new empty deal from server (/deal service)
export function newDeal(user) {
    return {
        types: [NEW, NEW_SUCCESS, NEW_FAIL],
        user,
        promise: (client) => client.get('/deals/init'),
        afterSuccess: (dispatch, getState, result) => {
            dispatch(fetchDealEvents(null));
        }
    }
}

// Create new empty deal from server (/deal/init service)
export function saveDeal(deal, onSuccess, onError) {

    if (deal.dosid) {
        // Existing deal, update it (PATCH)
        return {
            types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
            promise: (client) => client.patch('/deals', deal),
            afterSuccess: (dispatch, getState, result) => {
                onSuccess(deal.dosid, 'U');
            },
            afterError(dispatch, getState, error){
                onError(error);
            }
        };
    } else {
        // New deal, create it (POST)
        return {
            types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
            promise: (client) => client.post('/deals', deal),
            afterSuccess: (dispatch, getState, result) => {
                onSuccess(result.data.deal.dosid, 'C');
            },
            afterError(dispatch, getState, error){
                onError(error);
            }
        };
    }


}

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



// Fetch existing deal from /deal Service
export function fetchDeal(dealId) {
    return {
        types: [FETCH, FETCH_SUCCESS, FETCH_FAIL],
        promise: (client) => client.get('/deals/' + dealId),
        afterSuccess: (dispatch, getState, result) => {
            if (getState().newdeal2.readOnly) { //ou check phase
                dispatch(fetchDealAction(dealId));
                dispatch(fetchDealEvents(dealId));
            }
        }
    };
}

export function fetchDealAction(dealId) {
    return {
        types: [FETCH_ACTION, FETCH_ACTION_SUCCESS, FETCH_ACTION_FAIL],
        promise: (client) => client.get('/deals/' + dealId + '/requestedaction')
    };
}

export function actionDone() {
    return (dispatch, getState) => {
        dispatch({
            types: [POST_ACTION, POST_ACTION_SUCCESS, POST_ACTION_FAIL],
            promise: (client) => client.post('/deals/events/doneworkflow ', getState().form.dealQuote.values)
        });
    }

}

export function promoteToDeal() {
    return (dispatch, getState) => {
        let decisions = [{adecode: dconst.PROMOTETODEAL, ddedt: new Date().getTime(), ddeordre: 1}];
        dispatch({type: PROMOTE_TO_DEAL});
        dispatch(change('dealQuote', 'listdealdecision', decisions));
    }
}

export function submitForApproval(deal, onSuccess, onError) {
    return {
        types: [SUBMIT_FOR_APPROVAL, SUBMIT_FOR_APPROVAL_SUCCESS, SUBMIT_FOR_APPROVAL_FAILURE],
        promise: (client) => client.post('/deals/events/fundingrequest', deal),
        afterSuccess: (dispatch, getState, result) => {
            onSuccess();
        },
        afterError: (dispatch, getState, result) => {
            onError();
        }
    };
}

function computeQuoteType(deal) {
    return deal.taccode;
}

export function executeEvent(data, event, onSuccess, onError) {
    var dealEvent = event.set('deal', data);
    return {
        types: [EXECUTE_EVENT, EXECUTE_EVENT_SUCCESS, EXECUTE_EVENT_FAILURE],
        promise: (client) => client.post('/deals/events/executeevent', dealEvent),
        afterSuccess: (dispatch, getState, result) => {
            dispatch(fetchDeal(result.data.deal.dosid));
            onSuccess(result.data.deal.dosid);
        }
        ,
        afterError(dispatch, getState, error){
            onError(error);
        }
    };

}

//Take the list of events by deal
export function fetchDealEvents(dealId) {
    let querry = '';
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

// Reducer
export default function reducer(state = Immutable(initialState), action) {
    switch (action.type) {
        case NEW:
        case FETCH:
            return state.merge({
                readOnly: false,
                stepIndex: 0,
                dealLoading: true,
                variant: null,
                acttypes: [],
                control: {},
                options: null,
            });

        case NEW_SUCCESS:
            // New "empty" deal received, reset the whole deal state
            //var deal = action.result.data;
            var deal = merge(action.result.data, dconst.INITIAL_DEAL()); // pas normal on ecrase linit.

            deal.listdealuser = [{
                dinordre: 1,
                uticode: action.user.uticode,
                dinmetier: action.user.defaultposition,
                dindtaffectation: new Date().getTime()
            }];

            if (deal.listdealquote[0]) {
                deal.listdealquote[0].pfinom = "Quote #1";
                // the ws does not fill the quote services (dirty fix waiting for the webservice to do the job !)
                if (deal.listdealquote[0].listdealquoteservice.length === 0) {
                    deal.listdealquote[0].listdealquoteservice.push(
                        {
                            tprcode: dconst.DOC_FEE,
                            pfpordre: 1
                        },
                        {
                            tprcode: dconst.DOC_FEE_OPTION,
                            pfpordre: 2
                        }
                    );

                }
                if (deal.listdealquote[0].listdealquotepayment.length === 0) {
                    deal.listdealquote[0].listdealquotepayment.push(
                        {
                            pfvordre: 1,
                            pfvtypeversement: qconst.TYPE_VERSEMENT_DEPOSIT,
                        }
                    );
                }
                if (deal.listdealquote[0].listdealquotecommission.length === 0) {
                    deal.listdealquote[0].listdealquotecommission.push(
                        {
                            tcocode: qconst.COMMISSION_TCOCODE,
                            pfcordre: 1
                        }
                    );
                }
            }

            return state.merge({
                stepIndex: 0,
                dealLoading: false,
                variant: null,
                options: null,
                onEdit: true,
                deal: deal
            });

        case SAVE:
            return state.merge({
                control: {},
            });
        case SAVE_SUCCESS:
            return state.merge({
                deal: action.result.data.deal,
                control: action.result.data.control,
                dealLoading: false
            });


        case FETCH_SUCCESS:
            let deal = action.result.data;
            var term = dealUtils.getQuoteAttributeDouble(deal, 'NBTERM');
            const currentPhaseCode = dealUtils.getCurrentPhaseCode(deal);

            return state.merge({
                deal: deal,
                dealLoading: false,
                onEdit: true,
                quoteType: computeQuoteType(deal),
                termEditable: typeof(term) === "number" && term > 0,
                readOnly: currentPhaseCode !== 'NEGO'
            });

        case NEW_FAIL:
        case FETCH_FAIL:
            return state.set('dealLoading', false);

        case FETCH_ACTION_SUCCESS:
            return state.merge({
                readOnly: state.readOnly && !action.result.data.requestedaction,
                action: action.result.data
            });

        case POST_ACTION_SUCCESS:
            return state.merge({
                deal: action.result.data.deal,
                readOnly: dealUtils.getCurrentPhaseCode(action.result.data.deal) === 'FIN',
                action: {}
            });

        case STEP_CHANGE:
            return Immutable.merge(state, {
                stepIndex : action.index === undefined ? state.stepIndex +1 : action.index,
                forceStep: action.index === undefined || action.forceStep
            });

        case PROMOTE_TO_DEAL:
            return state.set('hideStep', false);

        case SUBMIT_FOR_APPROVAL:
            return state.merge({
                control: {},
            });

        case SUBMIT_FOR_APPROVAL_SUCCESS:
            return state.merge({
                readOnly: action.result.data.status == 'OK',
                deal: action.result.data.deal,
                control: action.result.data.control
            });

        case SAVE_FAIL:
        case SUBMIT_FOR_APPROVAL_FAILURE:
            return state.merge({
                control: action.error.response.data.control
            });
        case FETCH_DEAL_EVENTS_SUCCESS:
            return state.set('events', action.result.data);


        case EXECUTE_EVENT:
            return state.merge({
                control: DEFAULT_EMPTY_OBJECT,

            });

        case EXECUTE_EVENT_SUCCESS:
            return state.merge({
                readOnly: action.result.data.status == 'OK',
                deal: action.result.data.deal,
                control: action.result.data.control
            });

        case EXECUTE_EVENT_FAILURE:
            return state.merge({
                control: action.error.response.data.control
            });


        case LOCATION_CHANGE:
            var locationAction = action.payload.action;
            if (locationAction === "POP") {
                return state

            }
            return state.set('onEdit', false);

        default:
            if (state.onEdit) {
                state = quoteReducer(state, action);
                state = customer.reducer(state, action, 'deal');
                state = assets.reducer(state, action);
            }
            return state;
    }
}

