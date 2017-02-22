import merge from 'lodash/merge'
import Immutable from 'seamless-immutable'

import {removeCache} from './authentication';
import config from "./config"
export const FETCH_LOCALE = 'locale/FETCH';
export const FETCH_LOCALE_SUCCESS = 'locale/FETCH_SUCCESS';
export const FETCH_LOCALE_FAIL = 'locale/FETCH_FAIL';

export const FETCH_OVERRIDE_LOCALE = 'locale/override/FETCH';
export const FETCH_OVERRIDE_LOCALE_SUCCESS = 'locale/override/FETCH_SUCCESS';
export const FETCH_OVERRIDE_LOCALE_FAIL = 'locale/override/FETCH_FAIL';

export const SET_CURRENCY_CODE = 'locale/SET_CURRENCY_CODE'

const initialState = {
    currencyCode: null,
    lang: 'en-US',
    key: 'en',
    messages: {}
};

// Reducer
export default function reducer(state = Immutable(initialState), action) {
    switch (action.type) {

        case FETCH_LOCALE_SUCCESS:
            console.log(action);
            return state.merge({
                lang: action.locale.replace('_', '-'),
                key: action,
                messages: action.result.data
            });


        case FETCH_OVERRIDE_LOCALE_SUCCESS:
            if (!action.result.data) {
                return state;
            }

            return state.merge({
                key: action.locale + '-override',
                messages: merge(state.messages.asMutable(), action.result.data)
            })

        case SET_CURRENCY_CODE:
            return Immutable.set(state, "currencyCode", action.currencyCode)

        default:
            return state;
    }
}

export function fetchLocale(locale) {
    if (!locale)
        locale = navigator.language;
    locale = locale.replace('-', '_');

    const newLocaleObject = config.localeCorrespondances.find(value => value.localeToChange == locale);
    const localeAfterTranslation = newLocaleObject ? newLocaleObject.baseFrom : locale;
    const useOverride = newLocaleObject && newLocaleObject.useOverride;

    return {
        types: [FETCH_LOCALE, FETCH_LOCALE_SUCCESS, FETCH_LOCALE_FAIL],
        promise: (client) => client.get(window.location.protocol + '//' + window.location.host + window.location.pathname + 'i18n/' + localeAfterTranslation + '.json'),
        locale,
        afterSuccess: (dispatch, getState, response) => {
            dispatch(fetchOverrideLocale(localeAfterTranslation));
            dispatch(removeCache());
            useOverride ? dispatch(fetchOverrideLocale(locale)) : "";
        },
        afterError: (dispatch, getState, error) => {
            dispatch(fetchLocaleFallBack(locale));
            useOverride ? dispatch(fetchOverrideLocale(locale)) : "";
        }
    };
}

function fetchLocaleFallBack(locale) {
    return {
        types: [FETCH_LOCALE, FETCH_LOCALE_SUCCESS, FETCH_LOCALE_FAIL],
        promise: (client) => client.get(window.location.protocol + '//' + window.location.host + window.location.pathname + 'i18n/en_US.json'),
        locale,
        afterSuccess: (dispatch, getState, response) => {
            dispatch(fetchOverrideLocale('en_US'));
        }
    };
}


export function fetchOverrideLocale(locale) {
    return {
        types: [FETCH_LOCALE, FETCH_OVERRIDE_LOCALE_SUCCESS, FETCH_OVERRIDE_LOCALE_FAIL],
        promise: (client) => client.get(window.location.origin + window.location.pathname + 'i18n/' + locale + '-override.json'),
        locale
    };
}

export function setCurrencyCode(currencyCode) {
    return {
        type : SET_CURRENCY_CODE,
        currencyCode
    }
}

