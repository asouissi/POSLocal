// The file aggregates all reducers in one rootReducer and exports it
// When adding a new reducer, it needs to be imported and added to the rootReducer in this file

import { routerReducer } from 'react-router-redux';
import {reducer as formReducer} from 'redux-form';
import authentication from './authentication';
import navigation from './navigation';
import locales from './locales';
import dashboardsReducer from '../dashboards/dashboardReducer';

import referenceTables from './referenceTable';
import {enableBatching} from 'redux-batched-actions';
import {combineReducers} from 'redux';
import  timeline from "../../common/timeline/reducers/timeline"
const rootReducer = {
    routing: routerReducer,
    form: enableBatching(formReducer),
    authentication,
    navigation,
    locales,
    dashboardsReducer,
    referenceTables,
};

export default function createReducer(asyncReducer) {
    return combineReducers({
        ...rootReducer,
        ...asyncReducer
    })

};