import {conformsTo, isEmpty, isFunction, isObject, isString} from "lodash";
import invariant from "invariant";
import createReducer from "../reducers";

/**
 * Validate the shape of redux store
 */
export function checkStore(store) {
    const shape = {
        dispatch: isFunction,
        subscribe: isFunction,
        getState: isFunction,
        replaceReducer: isFunction,
        asyncReducers: isObject,
    };
    invariant(
        conformsTo(store, shape),
        '(app/core/utils...) asyncInjectors: Expected a valid redux store'
    );
}

/**
 * Inject an asynchronously loaded reducer
 */
export function injectAsyncReducer(store, isValid) {
    return function injectReducer(...reducers) {
        if (!isValid) checkStore(store);

        let newAsyncReducers = [];
        if (reducers[0] && !isObject(reducers[0])) {
            for (let i = 0; i < reducers.length; i += 2) {
                let name = reducers[i];
                let reducer = reducers[i + 1];
                newAsyncReducers.push({name, reducer})
            }
        } else {
            newAsyncReducers = reducers;
        }

        let update = false;
        newAsyncReducers.forEach(reducer => {
            invariant(
                isString(reducer.name) && !isEmpty(reducer.name) && isFunction(reducer.reducer),
                '(app/core/config...) injectAsyncReducer: Expected `asyncReducer` to be a reducer function'
            );

            if (Reflect.has(store.asyncReducers, reducer.name)) return;
            update = true
            store.asyncReducers[reducer.name] = reducer.reducer;

        });

        if (update) store.replaceReducer(createReducer(store.asyncReducers));
    }
}


/**
 * Helper for creating injectors
 */
export function getAsyncInjectors(store) {
    checkStore(store);

    return {
        injectReducer: injectAsyncReducer(store, true)
    };
}