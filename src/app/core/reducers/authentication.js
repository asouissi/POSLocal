import config from "./config";
import {hashHistory} from "react-router";
import Immutable from "seamless-immutable";
import {fetchLocale, FETCH_LOCALE, FETCH_OVERRIDE_LOCALE_FAIL, FETCH_OVERRIDE_LOCALE_SUCCESS} from "./locales";
import {notify} from "../components/lib/notify";
import axios from "axios";
import {GlobalMessages} from "../intl/GlobalMessages";
import querystring from 'querystring';

const LOGIN = 'authentication/LOGIN';
const LOGIN_SUCCESS = 'authentication/LOGIN_SUCCESS';
const LOGIN_FAIL = 'authentication/LOGIN_FAIL';
const SESSION_FAIL = 'authentication/SESSION_FAIL';
const SET_CAPTCHA = 'authentication/SET_CAPTCHA';

export const LOGOUT = 'authentication/LOGOUT';
const LOGOUT_SUCCESS = 'authentication/LOGOUT_SUCCESS';
const LOGOUT_FAIL = 'authentication/LOGOUT_FAIL';

const ERROR_MESSAGE = 'authentication/ERROR_MESSAGE';

const CONFIGURATON = 'authentication/CONFIGURATON';
export const CONFIGURATON_SUCCESS = 'authentication/CONFIGURATON_SUCCESS';
const CONFIGURATON_FAIL = 'authentication/CONFIGURATON_FAIL';

export const CLEAR_CACHE = 'all/CLEAR_CACHE';

export const REGISTER_USER = "authentication/REGISTER_USER";
export const REGISTER_USER_SUCCESS = "authentication/REGISTER_USER_SUCCESS";
export const REGISTER_USER_FAIL = "authentication/REGISTER_USER_FAIL";

export const CREATE_USER = "authentication/CREATE_USER";
export const CREATE_USER_SUCCESS = "authentication/CREATE_USER_SUCCESS";
export const CREATE_USER_FAIL = "authentication/CREATE_USER_FAIL";

export const GUEST_LOGIN = "authentication/GUEST_LOGIN";
export const GUEST_LOGIN_SUCCESS = "authentication/GUEST_LOGIN_SUCCESS";
export const GUEST_LOGIN_FAIL = "authentication/GUEST_LOGIN_FAIL";

const SHOW_FIELDS = "conf/SHOW_FIELDS"

const FETCH_DEALERSHIPS = 'users/FETCH_DEALERSHIPS'
const FETCH_DEALERSHIPS_SUCCESS = 'users/FETCH_DEALERSHIPS_SUCCESS'
const FETCH_DEALERSHIPS_FAIL = 'users/FETCH_DEALERSHIPS_FAIL'

const FETCH_BRANDS = 'users/FETCH_BRANDS'
const FETCH_BRANDS_SUCCESS = 'users/FETCH_BRANDS_SUCCESS'
const FETCH_BRANDS_FAIL = 'users/FETCH_BRANDS_FAIL'

const initialState = {
    isAuthenticated: false,
    loggedAsGuest: false,
    isLoading: false,
    username: null,
    errorMessage: null,
    user: {},
    skinClass: localStorage.getItem('skin') || 'skin-blue',
    showFields: false,
    options: {
        toplefttitle: 'Cassiopae POS',
        toplefttitleimage: undefined,
        toplefttitleimagemin: undefined,
        fixedLayout: true,
        showskinselector: true,
        showDashboardEditor: true,
        HideLeftBar: false,
        HideTopBar: false,
        HideRightBar: false
    },
    reCaptchaKeys: {
        siteKey: "6LdCtAsUAAAAAO__F22EyZ-ZpUSgyus1cM12-tGH", //localhost
        secretKey: "6LesswsUAAAAABQiOcnnWXlQDKn4R4DeUSGd0D4w",
    },
    networkStepSelection: 0
};

// Reducer

export default function reducer(state = Immutable(initialState), action) {
    switch (action.type) {
        case LOGIN:
        case FETCH_LOCALE:
            return state.merge({
                isLoading: true
            });

        case FETCH_OVERRIDE_LOCALE_SUCCESS:
        case FETCH_OVERRIDE_LOCALE_FAIL:
            return state.merge({
                isLoading: false
            });

        case LOGIN:
        case GUEST_LOGIN:
            return state.merge({
                isLoading: true
            });

        case LOGIN_SUCCESS:
            return state.merge({
                loggedAsGuest: false,
                errorMessage: null
            });
        case LOGIN_FAIL:
        case LOGOUT_FAIL:
            if (action.connectToSlave) {
                console.error(action.error.message, action.error);
                return state;
            }

            return state.merge({
                isAuthenticated: false,
                isLoading: false,
                username: null,
                errorMessage: (action.error.response && action.error.response.status === 401) ? GlobalMessages.invalidUsername : action.error.message
            });
        case GUEST_LOGIN_FAIL:
            return state.merge({
                isAuthenticated: false,
                isLoading: false,
                username: null,
                loggedAsGuest: false,
                errorMessage: (action.error.response && action.error.response.status === 401) ? GlobalMessages.invalidUsername : action.error.message
            });
        case LOGOUT_SUCCESS:
            return state.merge({
                isAuthenticated: false,
                loggedAsGuest: false,
                username: null
            });

        case CONFIGURATON_SUCCESS:
            return state.merge({
                isAuthenticated: true,
                loggedAsGuest: action.loggedAsGuest,
                options: {...state.options, ...action.result.data.options},
                skinClass: action.result.data.user.skin || 'skin-blue',
                username: action.result.data.user.firstname + " " + action.result.data.user.lastname,
                user: action.result.data.user,
                accesskeys: action.result.data.accesskeys.filter(m => m.visible)
            });
        case ERROR_MESSAGE: {
            return state.merge({
                errorMessage: action.message
            })
        }
        case SET_CAPTCHA:
            return state.set('reCaptchaKeys', action.reCaptchaKeys)
        case SHOW_FIELDS:
            return state.set("showFields", action.show || !state.showFields)


        case FETCH_DEALERSHIPS_SUCCESS:
            return state.merge({
                dealerships: action.result.data
            });
        case FETCH_BRANDS_SUCCESS:
            return state.merge({
                brands: action.result.data
            });

        default:
            return state;
    }
}

// Public action creators and async actions


export function displayAuthError(message) {
    return {type: ERROR_MESSAGE, message};
}

export function removeCache() {
    return {type: CLEAR_CACHE};
}

export function getSession() {
    return login(null, null, false, SESSION_FAIL)
}

export function login(username, password, apiName, failAction) {

    if (username == null && password == null && localStorage.getItem('isGuest-loggedIn')) {
        localStorage.removeItem('isGuest-loggedIn');  //todo remove this check
        hashHistory.push('logout');
        return;
    }

    const api = config.apis ? config.apis[apiName || config.masterApi] : {};
    return {
        types: [LOGIN, LOGIN_SUCCESS, failAction || LOGIN_FAIL],
        username,
        connectToSlave: apiName,
        promise: (client) => client.post(api.loginApi || '/login',
            querystring.stringify({ksiopuser: username, ksiopvalue: password}),
            {headers: {'Content-Type': 'application/x-www-form-urlencoded'}, api: apiName}),

        afterSuccess: (dispatch, getState, response) => {

            if (!apiName) {
                if (config.backServices) {
                    dispatch(login(username, password, true));
                }

                if (config.apis && Object.keys(config.apis).length > 1) {
                    for (var api in config.apis) {
                        if (api !== config.masterApi) {
                            dispatch(login(username, password, api));
                        }
                    }

                }

                dispatch(getConfiguration({setDefaultAsCurrent: true}));
            }
        },
        afterError: (dispatch, getState, response) => {
            if (!apiName) {
                dispatch(logout(true));
            }
        }
    };
}

export function logout(redirectStatus) {
    return {
        types: [LOGOUT, LOGOUT_SUCCESS, LOGOUT_FAIL],
        promise: (client) => client.get('/ksioplogout'),
        afterSuccess: (dispatch, getState, response) => {
            if (redirectStatus) {
                hashHistory.push('login');
                dispatch(removeCache())
            }
        },
        afterError: (dispatch) => {
            hashHistory.push('login');
            dispatch(removeCache())
        }

    };
}

export function loginGuest(username, password) {
    if (!username && !password) {
        username = "GUEST";
        password = "GUEST";
    }
    return {
        types: [GUEST_LOGIN, GUEST_LOGIN_SUCCESS, GUEST_LOGIN_FAIL],
        promise: (client) => client.post('/login',
            querystring.stringify({ksiopuser: username, ksiopvalue: password}),
            {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}),
        afterSuccess: (dispatch, getState, result) => {
            if (getState().authentication.loggedAsGuest) {
                return;
            }

            localStorage.setItem('isGuest-loggedIn', true);
            dispatch(getConfiguration({loggedAsGuest: true}));
        },
        afterError: (dispatch, getState, result) => {
            alert("Guest user not found");
            hashHistory.push('logout');
        }
    }

}

function setReCaptchaKeys(reCaptchaSiteKey, reCaptchaSecretKey) {
    return {
        type: SET_CAPTCHA,
        reCaptchaKeys: {siteKey: reCaptchaSiteKey, secretKey: reCaptchaSecretKey}
    }
}

export function validateUser(username) {
    return axios.get('/users/validateusername?username=' + username)
}

export function register(data, isPortalUser, onSuccess, onError) {
    return {
        types: [REGISTER_USER, REGISTER_USER_SUCCESS, REGISTER_USER_FAIL],
        promise: (client) => client.post('/users/createuser/', data),
        afterSuccess: (dispatch, getState, result) => {
            if (localStorage.getItem('isGuest-loggedIn') && result.data) {
                localStorage.removeItem('isGuest-loggedIn');
                if (!isPortalUser) {
                    hashHistory.push('logout');
                }
            }
            if (!isPortalUser) {
                hashHistory.push('login');
                notify.show('User registered successfully');
            }
        },
        afterError: (dispatch, getState, result) => {
            notify.show('User not Registered');
        }
    }
}

export function forgotPassword(data) {
    hashHistory.push('login');
    notify.show('Email sent');
}

export function fetchClientConfig(client) {
    return {
        type: "REGISTER"
    }
}

export function getConfiguration(params = {}) {
    return {
        types: [CONFIGURATON, CONFIGURATON_SUCCESS, CONFIGURATON_FAIL],
        promise: client => client.get("/userconfigurations"),
        afterSuccess: (dispatch, getState, response) => {
            dispatch(fetchLocale(response.data.user.locale));

            let masterApi = config.apis[config.masterApi];
            if (masterApi.hostname.match(window.location.host.split(':')[0])) {
                dispatch(setReCaptchaKeys(
                    masterApi.reCaptchaSiteKey || config.reCaptchaSiteKey,
                    masterApi.reCaptchaSecretKey || config.reCaptchaSecretKey));
            }

            let currentPath = getState().routing.locationBeforeTransitions.pathname;
            const routingState = getState().routing.locationBeforeTransitions.state || {};
            if (routingState.nextPathname) {
                hashHistory.push(routingState.nextPathname);
            } else if (currentPath !== 'login' && currentPath !== '/login' && currentPath !== '/') {
                hashHistory.push(currentPath);
            } else {
                hashHistory.push(response.data.options.landingpage || '');
            }

            if (params && params.setDefaultAsCurrent) {
                dispatch(updateConfiguration({
                    dealershipcurrent: response.data.user.dealershipdefault,
                    brandcurrent: response.data.user.branddefault
                }));
            }
        },
        loggedAsGuest: params.loggedAsGuest
    }
}

export function updateConfiguration(userConfiguration, callback) {
    return {
        types: [CONFIGURATON, CONFIGURATON_SUCCESS, CONFIGURATON_FAIL],
        promise: client => client.post("/userconfigurations", userConfiguration),
        afterSuccess: (dispatch, getState, response) => {
            if (callback)
                callback(dispatch);
        }
    }
}

export function redirectToLoginWithMessage(messageKey) {
    return (dispatch, getState) => {
        const currentPath = getState().routing.locationBeforeTransitions.pathname;

        if (currentPath !== "/") dispatch(displayAuthError(messageKey));

        if (currentPath !== 'login' && currentPath !== '/login') {
            hashHistory.replace({pathname: 'login', state: {nextPathname: currentPath}});
        }

    }
}


export function showFields(show) {
    return {
        type: SHOW_FIELDS,
        show
    }

}

export function fetchDealerShips() {
    return {
        types: [FETCH_DEALERSHIPS, FETCH_DEALERSHIPS_SUCCESS, FETCH_DEALERSHIPS_FAIL],
        promise: (client) => client.get('/userconfigurations/dealerships')
    };
}

export function fetchFinancialBrands(actcode) {
    return {
        types: [FETCH_BRANDS, FETCH_BRANDS_SUCCESS, FETCH_BRANDS_FAIL],
        promise: (client) => client.get('/userconfigurations/financialbrands?actcode=' + actcode)
    };
}