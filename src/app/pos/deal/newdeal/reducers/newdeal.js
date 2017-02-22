import {LOCATION_CHANGE} from "react-router-redux";
import Immutable from "seamless-immutable";
//var Immutable = require("seamless-immutable").static;
import dealUtils from "../../utils/dealUtils";
import * as d from "./actions";
import customer from "../../customer";
import assets from "../../assets";
import actorUtils from "../../../../common/actor/actorUtils";
const DEFAULT_EMPTY_OBJECT = [];


// Initial state

const initialState = {
    readOnly: false,
    isMF: false,
    stepIndex: 0,
    assetIndex: 0,
    action: {},
    quoteIndex: 0,
    variant: [{}],
    acttypes: [],
    documents: [],
    control: {},
    clientTabKey: null,
    customerRolcode: null,
    coCustomerRolcode: null,
    formValues: {
        listActor: [],

        deal: {
            listdealasset: [
                {
                    listdealassetcomponent: [{}]
                }
            ],
            listdealquote: [
                {
                    listdealquoteelement: [{}],
                    listdealquotepayment: [{}],
                    listdealquoteattribute: [{}]
                }
            ],
            listdealactor: [],
            dealextrainfo: {},
            listdealattribute: []
        },
        changeIban: false
    }
};

export const initActor = (rolcode) => ({
    actflagprospect: 1,
    listactorrole: [{actionMode:'+', rolcode: rolcode}],
    listactortelecom: [
        {
            atetype: "NET",
            ateordre: 0,
            atenum: null
        },
        {
            atetype: "TEL",
            ateordre: 1,
            atenum: null
        },
        {
            atetype: "MOB",
            ateordre: 2,
            atenum: null
        }
    ],
    listactorphase: [{
        aphordre :1,
        jalcode :"OUVERT",
        phacode: "INI",
        phadest: "ACTEUR"
    }],
});
// Reducer
export default function reducer(state = Immutable(initialState), action) {
    console.log("Action[" + action.type + "]=>", action);
    switch (action.type) {
        case d.NEW:
        case d.FETCH:
            return state.merge({
                readOnly: false,
                stepIndex:  action.stepIndex || 0,
                assetIndex: 0,
                quoteIndex: 0,
                dealLoading: true,
                options: null,
                onEdit: true,
                variant: [{}],
                formValues: Immutable.set(state.formValues, 'listActor', []),
                control: {},
                acttypes: [],
                clientTabKey: null,
                flagSelfpayment: false
                //deal: initialState.deal
            });

        case d.NEW_SUCCESS:
            // New "empty" deal received, reset the whole deal state
            let deal = action.result.data;
            // Default deal name and financial name
            if (deal.listdealquote[state.quoteIndex]) {
                deal.listdealquote[state.quoteIndex].pfinom = "-";
            }
            deal.listdealattribute = [{
                datcode: "TPGTYPE"
            }];
            let mf = action.isMF || false;
            return Immutable.merge(state, {
                formValues: Immutable.set(state.formValues, 'deal', action.result.data),
                dealLoading: false,
                onEdit: true,
                isMF: mf
            });

        case d.SAVE:
            return Immutable.merge(state, {
                control: DEFAULT_EMPTY_OBJECT,
            });

        case d.SAVE_SUCCESS:
            // Inserted or updated deal received, reset the whole deal state
            return Immutable.merge(state, {
                formValues: Immutable.set(state.formValues, 'deal', action.result.data.deal),
                control: action.result.data.control,
                dealLoading: false
            });

        case d.SAVE_FAIL:
            return state.merge({
                control: action.error.response.data.control
            });

        case d.FETCH_RATE_TAX_SUCCESS:
            return state.set('rateTaxValue', action.result.data);

        case d.FETCH_SUCCESS:
            // New deal received, reset the whole deal state
            var deal = action.result.data;

            return Immutable.merge(state, {
                formValues: Immutable.set(state.formValues, 'deal', deal),
                dealLoading: false,
                clientTabKey: '',
                coContractantSameAddress: false,
                coContractantSameBankAccount: false
            });

        case d.STEP_CHANGE:
            return Immutable.merge(state, {
                stepIndex : action.index === undefined ? state.stepIndex +1 : action.index,
                forceStep: action.index === undefined || action.forceStep
            });


        // case d.COMPUTE_PAYMENT_SUCCESS:
        //     // New deal received after computing payment, reset the whole deal to new values
        //     return Immutable.merge(state,{ formValues: {deal: action.result.data}});

        case d.COMPUTE_SCHEDULE:
        case d.COMPUTE_PAYMENT:
            return state.set('dealLoading', true);


        case d.COMPUTE_SCHEDULE_SUCCESS:
        case d.COMPUTE_SCHEDULE_FAIL:
        case d.COMPUTE_PAYMENT_SUCCESS:
        case d.COMPUTE_PAYMENT_FAIL:
        case d.FETCH_FAIL:
            return state.set('dealLoading', false);

        case d.GET_SERVICES_SUCCESS:
            return state.merge({'possibleServices': action.result.data, 'initialPossibleServices': action.result.data});

        case LOCATION_CHANGE:
            var locationAction = action.payload.action;
            if (locationAction === "POP") {
                return state

            }
            return state.set('onEdit', false);

        case d.FETCH_ACTION_SUCCESS:
            return state.merge({
                readOnly: state.readOnly || !action.result.data.requestedaction,
                action: action.result.data
            });

        case d.POST_ACTION_SUCCESS:

            return Immutable.merge(state, {
                formValues: Immutable.set(state.formValues, 'deal', action.result.data.deal) ,
                readOnly: dealUtils.getCurrentPhaseCode(action.result.data.deal) === 'FIN',
                action: {}
            });

        case d.EXECUTE_EVENT:
            return state.merge({
                control: DEFAULT_EMPTY_OBJECT,

            });

        case d.EXECUTE_EVENT_SUCCESS:
            return Immutable.merge(state, {
                readOnly: action.result.data.status == 'OK',
                formValues: Immutable.set(state.formValues, 'deal', action.result.data.deal),
                control: action.result.data.control
            });

        case d.EXECUTE_EVENT_FAILURE:
            return state.merge({
                control: action.error.response.data.control
            });

        case d.QUOTE_APPEND_NEW_SUCCESS:
            var newQuoteIndex = action.deal.listdealquote.length;
            return state.merge({
                quoteIndex: newQuoteIndex
            });

        case d.DEAL_QUOTE_CHANGE:
            return state.set('quoteIndex', action.index);

        case d.FETCH_DEAL_EVENTS_SUCCESS:
            return state.set('events', action.result.data);

        case d.EXECUTE_EVENT_FAILURE:
            return state.merge({
                control: action.error.response.data.control
            })

        case d.APPEND_NEW_ACTOR: //not
            var actor = initActor(action.rolCode);
            return Immutable.setIn(state, ['formValues', 'listActor', state.formValues.listActor.length], {
                rolcode: action.rolCode,
                actor
            });

        case d.FETCH_CLIENT_ACTOR:
            return Immutable.set(state, "clientLoading", true); //todo: manage with actrol when two actors are ferch ?

        case d.FETCH_CLIENT_ACTOR_SUCCESS:
            if (action.options && action.options.skipAssignment) {
                return Immutable.set(state, "clientLoading", false);
            }

            var actor = actorUtils.addMissingTelecomFields(action.result.data);
            //filter valid IBAN account
            if (actor && actor.listactorbankaccount && actor.listactorbankaccount.length > 0) {
                actor = actorUtils.filterValidIbanAccount(actor);
            }

            let actorIndex = state.formValues.listActor.findIndex(act => act.rolcode == action.rolcode);
            actorIndex = actorIndex !== -1 ? actorIndex : state.formValues.listActor.length;

            return Immutable.merge(state, {
                formValues: Immutable.setIn(state.formValues,
                    ['listActor', actorIndex], {rolcode: action.rolcode, actor}),
                clientLoading: false
            });

        case d.CHANGE_COCONTRACTANT_ADDRESS_VISIBILITY:
            return state.set('coContractantSameAddress', action.value);

        case d.CHANGE_COCONTRACTANT_BANKACCOUNT_VISIBILITY:
            return state.set('coContractantSameBankAccount', action.value);

        case d.CLIENT_TAB_CHANGE:
            return state.set('clientTabKey', action.key);

        case d.CHANGE_IBAN_ACCOUNT:
            return state.set('flagDisableIbanField', action.status);

        case d.SET_CUSTOMER_ROLCODES:
            return Immutable.merge(state, {
                customerRolcode: action.customerRolcode,
                coCustomerRolcode: action.coCustomerRolcode,
            });

        case d.SET_SELF_PAYMENT_STEP:
            return state.set('flagSelfpayment', action.isSelfPaymentStep);

        case d.SET_SERVICE_ACTION:
            var serviceIndex = state.possibleServices.findIndex((item) => item.pelid === action.serviceId);
            return state.setIn(['possibleServices', serviceIndex, 'ppeflagauto'], action.checked);

        case d.RESET_POSSIBLE_SERVICES:
            return state.set('possibleServices', action.initialPossibleServices);

        default:
            if (state.onEdit) {
                state = customer.reducer(state, action, 'deal');
                state = assets.reducer(state, action);
            }
            return state;
    }
}


