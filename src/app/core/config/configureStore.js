import {createStore, applyMiddleware, compose} from 'redux';

import promiseMiddleware from './promiseMiddleware';
import reduxFormMiddleware from './reduxFormMiddleware';
import createReducer from '../reducers/index';
import {routerMiddleware} from 'react-router-redux'
import {hashHistory} from 'react-router'

// const reduxRouterMiddleware = routerMiddleware(hashHistory);
const createStoreWithMiddleware = applyMiddleware()(createStore);

export default function configureStore(initialState, modulesReducers) {


    const middlewares = [
        promiseMiddleware,
        reduxFormMiddleware,
        routerMiddleware(history),
    ];

    const enhancers = [
        applyMiddleware(...middlewares),
    ];

    const composeEnhancers =
        process.env.NODE_ENV !== 'production' &&
        typeof window === 'object' &&
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
            window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : compose;


    // Async reducer registry

    const store = createStore(
        createReducer(modulesReducers),
        initialState,
        composeEnhancers(...enhancers)
    );

    store.asyncReducers = {...modulesReducers};


    if (module.hot) {
        module.hot.accept('../reducers/index', () => {
            System.import('../reducers.index').then((reducerModule) => {
                const createReducers = reducerModule.default;
                const nextReducers = createReducers(store.asyncReducers);

                store.replaceReducer(nextReducers);
            });
        });
    }

    // const store = createStoreWithMiddleware(combineReducers({...rootReducer, ...modulesReducers}), initialState, window.devToolsExtension ? window.devToolsExtension() : f => f);

    return store;
}
