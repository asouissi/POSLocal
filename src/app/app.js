import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {Router, hashHistory} from 'react-router';
import initRouter from './router';
import { syncHistoryWithStore } from 'react-router-redux'

import {bindActionCreators} from 'redux';
import {redirectToLoginWithMessage, logout, showFields} from './core/reducers/authentication';
import {setupAxiosInterceptors} from './core/config/axios';
import config from './config'

import {GlobalMessages} from './core/intl/GlobalMessages';

import { addLocaleData, FormattedMessage  } from 'react-intl';
import LocalesProviderContainer from './core/LocalesProviderContainer';
import en from 'react-intl/locale-data/en';
import fr from 'react-intl/locale-data/fr';
import pt from 'react-intl/locale-data/pt';
import es from 'react-intl/locale-data/es';
import de from 'react-intl/locale-data/de';
import it from 'react-intl/locale-data/it';


addLocaleData([...en, ...es, ...fr, ...pt, ...de, ...it]);


import configureStore from './core/config/configureStore';
import jQuery from 'jquery';

// import {whyDidYouUpdate} from 'why-did-you-update'
// if (process.env.NODE_ENV !== 'production') {
//     whyDidYouUpdate(React) // use for debug and improve perf, before use it => npm i why-did-you-update
// }

window.jQuery = window.$ = jQuery;

//import bootstrap from 'bootstrap';


import styles from './core/less/index.less';

const DASHBOARD = '/dashboard';


import pos from './pos'
import wholesale from './wholesale'
import common from './common'
import portal from './portal'
import mymodule from './mymodule'

const modules = [common, pos, wholesale, portal, mymodule];
var modulesReducers = {};
var menuItems = [
    {
        route: DASHBOARD,
        title: <FormattedMessage id="core.main.dashboard" defaultMessage="Dashboard"/>,
        icon: 'fa fa-dashboard',
        active: true,
        visible: false,
        subItems: null
    }];

modules.forEach((module) => {
    modulesReducers = {...modulesReducers, ...module.reducers};
    if (module.menuItems) {
        menuItems = [...menuItems, ...module.menuItems];
    }

});



const state = {navigation: {menuItems: menuItems}};
const store = configureStore(state, modulesReducers);

const actions = bindActionCreators({redirectToLoginWithMessage, logout, showFields}, store.dispatch);
setupAxiosInterceptors(config, () => actions.redirectToLoginWithMessage(GlobalMessages.notConnected));
const history = syncHistoryWithStore(hashHistory, store);

const router = initRouter(history, actions.logout, modules, store);
const root = document.getElementById('app-content');

window.showFields = actions.showFields;

const run = () => {
    ReactDOM.render(
        <Provider store={store}>
            <LocalesProviderContainer>
                {router}
            </LocalesProviderContainer>
        </Provider>,
        root
    );
}
if (!window.Intl || window.navigator.appVersion.indexOf("MSIE 10.0")!= -1) {
    require.ensure([
        'intl',
        'intl/locale-data/jsonp/en.js',
        'intl/locale-data/jsonp/es.js',
        'intl/locale-data/jsonp/fr.js',
        'intl/locale-data/jsonp/pt.js',
        'intl/locale-data/jsonp/de.js',
        'intl/locale-data/jsonp/it.js',

    ], (require) => {
        require('intl');
        require('intl/locale-data/jsonp/en.js');
        require('intl/locale-data/jsonp/es.js');
        require('intl/locale-data/jsonp/fr.js');
        require('intl/locale-data/jsonp/pt.js');
        require('intl/locale-data/jsonp/de.js');
        require('intl/locale-data/jsonp/it.js');
            run();
    });
} else {
    run();
}
