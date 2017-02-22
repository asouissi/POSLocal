import Immutable from 'seamless-immutable'
import config from "./config";

import {CLEAR_CACHE} from "./authentication"

// Action names
const FETCH = 'referenceTable/FETCH';
const FETCH_SUCCESS = 'referenceTable/FETCH_SUCCESS';
const FETCH_FAIL = 'referenceTable/FETCH_FAIL';
const WAITING_FETCH = 'referenceTable/WAITING_FETCH';
const WAITING_FETCH_SUCCESS = 'referenceTable/WAITING_FETCH_SUCCESS';
const WAITING_FETCH_FAILED = 'referenceTable/WAITING_FETCH_FAILED';
const WAITING_FETCH_REGISTRATION = 'referenteTable/WAITING_FETCH_REGISTRATION';

export const tables = {
    LANJALON: 'lanjalon',
    COLORJALON: 'colorjalon',
    LANNAP: 'lannap',
    LANASSETCATEGORY: 'lanassetcategory',
    LANTUSPARAM: 'lantusparam',
    LANTTRPARAM: 'lanttrparam',
    TPROFILGESTION: 'tprofilgestion',
    CODEPOSTAL: 'codepostal',
    LANPHASE: 'lanphase',
    LANMAKE: 'lanmake',
    LANMAKEMODEL: 'lanmakmodel',
    LANMAKMODTRIMLEVEL: 'lanmakmodtrimlevel',
    FINANCIALSCALE: 'financialscale',
    CREDITLINE: 'creditline',
    SIRET: 'siret',
    AVTPRESTATION: 'LANAVTPRESTATION',
    LANVARIANT: 'lanvariant',
    LKTUPTACTPG: 'lktuptactpg',
    CATJURIDIQUE: 'catjuridique',
    PAYS: 'pays',
    LANDASHBOARD: 'LANDASHBOARD',
    VENDORS: 'VENDORS',
    LANNAF: 'LANNAF',
    CURRENCY:'SYBDEVISE',
    LANTAXE :'LANTAXE',
    LANPRICINGCRITERIA : 'lanpricingcriteria'
};

const initialTable = {data: [], isLoading: false};

const WAITING_FETCHS_SYMBOL = '$waiting-fetchs';

const CLEARED_REASON = {
    date: null,
    errored: true,
    isLoading: false,
    reason: "CLEARED"
};

const initialState = {
    creditline: initialTable,
    lanjalon: initialTable,
    lantusparam: initialTable,
    lanttrparam: initialTable,
    lanmake: initialTable,
    lannap: initialTable,
    lanassetcategory: initialTable,
    lanphase: initialTable,
    pays: initialTable,

    [WAITING_FETCHS_SYMBOL]: {}
};

function _wakeUpWaitings(state, referenceTableKey) {
    // debug("_wakeUpWaitings", "Wake up key=", referenceTableKey);

    let waiting = state[WAITING_FETCHS_SYMBOL][referenceTableKey];
    if (!waiting || !waiting.length) {
        return state;
    }
    state = state.setIn([WAITING_FETCHS_SYMBOL, referenceTableKey], undefined);

    // debug("_wakeUpWaitings", "Wake up key=", referenceTableKey, "#functions=", waiting.length);

    let referenceTable = state[referenceTableKey];
    waiting.forEach((pr) => {
        try {
            if (referenceTable.errored) {
                pr.rejected(referenceTable);
                return;
            }

            pr.resolved(referenceTable.data);

        } catch (x) {
            console.error("Resolved waiting reference tables throws error", x);
        }
    });

    // debug("_wakeUpWaitings", "Wake up key=", referenceTableKey, "DONE");
    return state;
}

// Reducer
/**
 *
 * @param {Immutable} state
 * @param {*} action
 * @returns {*}
 */
export default function reducer(state = Immutable(initialState), action) {
    switch (action.type) {
        case FETCH:
            return state.merge({
                [action.key]: {data: [], isLoading: true, loaded: false, requestTimestamp: Date.now()}
            });

        case FETCH_SUCCESS: {
            // debug("reducer", "FETCH_SUCCESS action=", action);

            let newState = state.merge({
                [action.key]: {
                    data: action.result.data,
                    isLoading: false,
                    errored: false,
                    loaded: true,
                    successTimestamp: Date.now()
                }
            });

            newState = _wakeUpWaitings(newState, action.key);

            return newState;
        }

        case FETCH_FAIL: {
            // debug("reducer", "FETCH_FAIL action=", action);
            console.error("referenceTable: Can not load reference table", action.key, "error=", action.error);

            let newState = state.merge({
                [action.key]: {data: [], isLoading: false, loaded: true, errored: true, errorTimestamp: Date.now()}
            });

            newState = _wakeUpWaitings(newState, action.key);

            return newState;
        }

        case CLEAR_CACHE: {
            let waitingFetchs = state[WAITING_FETCHS_SYMBOL];
            let newState = Immutable(initialState);

            if (waitingFetchs) {
                for (let k in waitingFetchs) {
                    let ws = waitingFetchs[k];
                    ws && ws.forEach((w) => {
                        w.rejected(CLEARED_REASON);
                    });
                }
            }

            return newState;
        }

        case WAITING_FETCH_REGISTRATION: {
            // debug("reducer", "WAITING_FETCH_REGISTRATION action=", action);
            let referenceTable = state[action.key];
            if (!referenceTable.isLoading) {
                // Reference table is already loaded !

                if (referenceTable.errored) {
                    action.rejected(referenceTable);
                    return state;
                }

                action.resolved(referenceTable.data);
                return state;
            }

            let array = (state[WAITING_FETCHS_SYMBOL][action.key] || []);
            array = array.concat({
                resolved: action.resolved,
                rejected: action.rejected
            });

            let newState = state.setIn([WAITING_FETCHS_SYMBOL, action.key], array);
            return newState;
        }

        default:
            return state;
    }
}

function _constructKey(id, parameters, api) {
    if (!parameters && !api) {
        return id;
    }
    return id + ":" + (JSON.stringify(parameters) || ""); // + ":" + (api || "");
}

// Actions
function _fetchReferenceTable(id, parameters, api) {
    let key = _constructKey(id, parameters, api);

    const refApi = config.apis ? config.apis[api || config.masterApi] : {};
    return {
        types: [FETCH, FETCH_SUCCESS, FETCH_FAIL],
        promise: (client) => client.get(refApi.refTableApi || '/referencetable', {
            params: {table: id, ...parameters},
            api: api
        }),
        key: key
    };
}

/**
 *
 * @param {*} state
 * @param {string} id
 * @param {Object} [parameters]
 * @param {string} [api]
 * @returns {*} A table structure
 */
export function getReferenceTable(state, id, parameters, api) {
    let key = _constructKey(id, parameters, api);

    return state.referenceTables[key] || Immutable(initialTable);
}

/**
 *
 * @param {string} id
 * @param {string} api
 * @returns {*}
 */
export function fetchReferenceTable(id, api) {
    return fetchReferenceTableWithParams(id, null, api);
}

export function fetchReferenceTableWithParams(id, parameters, api) {
    return (dispatch, getState) => {
        let key = _constructKey(id, parameters, api);

        let reference = getState().referenceTables[key];
        if (!reference) {
            return dispatch(_fetchReferenceTable(id, parameters, api));
        }
        if (reference.loaded) {
            return Promise.resolve(reference);
        }
        if (reference.isLoading) {
            let promise = new Promise((resolved, rejected) => {
                // debug("fetchReferenceTableWithParams", "key=", key, "Promise created");

                return dispatch({
                    type: WAITING_FETCH_REGISTRATION,
                    key: key,
                    resolved,
                    rejected
                });
            });

            return promise;
        }

        return dispatch(_fetchReferenceTable(id, parameters, api));
    };
}

export function promiseReferenceTable(id, parameters, api, dispatch) {
    if (arguments.length === 3 && typeof(api) === "function") {
        dispatch = api;
        api = undefined;
    }
    if (arguments.length === 2 && typeof(parameters) === "function") {
        dispatch = parameters
        parameters = undefined;
    }

    let f = fetchReferenceTableWithParams(id, parameters, api);

    let promise = dispatch(f);

    return promise;
}
