import axios from 'axios';
import {notify} from '../components/lib/notify';

export default function promiseMiddleware({dispatch, getState}) {
    return next => action => {

        if (typeof action === 'function') {
            return action(dispatch, getState);
        }
        if (!action) {
            debugger
        }


        const {promise, types, afterSuccess, afterError, ...rest} = action;
        if (!action.promise) {
            return next(action);
        }

        const [REQUEST, SUCCESS, FAILURE] = types;
        next({...rest, type: REQUEST});

        let pace = document.getElementById('hackpace');
        if (pace) { //hackpace
            pace.className = 'pace pace.progress';
        }

        const onFulfilled = result => {
            let pace = document.getElementById('hackpace');
            if (pace) { //hackpace
                pace.className = 'pace pace-inactive';
            }

            next({...rest, result, type: SUCCESS});

            if (afterSuccess) {
                afterSuccess(dispatch, getState, result);
            }

            return result.data;
        };
        const onRejected = (error) => {
            let pace = document.getElementById('hackpace');
            if (pace) { //hackpace
                pace.className = 'pace pace-inactive';
            }

            next({...rest, error, type: FAILURE})
            afterError && afterError(dispatch, getState, error);
            if (error.response && error.response.status === 404) {
                notify.show(error.response.status + ':' + error.response.statusText);
            }

            return Promise.reject(error);
        };
        return promise(axios, dispatch)
            .then(onFulfilled, onRejected);
            // .catch(error => {
            //     console.error('MIDDLEWARE ERROR:', error);
            //    // onRejected(error)
            // });
    };
}
