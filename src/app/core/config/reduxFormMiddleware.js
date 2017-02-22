import * as actionTypes from "redux-form/lib/actionTypes";
import * as actions from "redux-form/lib/actions";
import setIn from "redux-form/lib/structure/plain/setIn";
import {SubmissionError} from "redux-form";
import {GlobalMessages as GlobalMeassage} from "../intl/GlobalMessages";

export default function reduxFormMiddleware({dispatch, getState}) {
    return next => action => {

        const {type, meta, payload, ...rest} = action;

        if (actionTypes.TOUCH === type) {
            let formState = getState().form[meta.form];

            let showFields = getState().authentication.showFields;
            if (showFields && formState && formState.registeredFields) { //debug mode
                let errors = {}
                formState.registeredFields.forEach(field => {
                    if (field.name)
                    errors = setIn(errors, field.name, {id: 'admin.debug', defaultMessage: field.name});
                })


                //dispatch(actions.setSubmitFailed(meta.form, formState.registeredFields))
                dispatch(actions.updateSyncErrors(meta.form, errors, [GlobalMeassage.fieldsRequire]));
                //return (next(actions.stopSubmit(meta.form, {_error:[{id:"pos.deal.errors.fields", defaultMessage:"Check required fields"}]})));
                next(action);
                throw new SubmissionError()
            }

            if(formState && formState.registeredFields){
                action.meta.fields = formState.registeredFields.map(field => field.name);
            }
        }

        return next(action);
    };
}
