import {GlobalMessages} from "../../core/intl/GlobalMessages";
import setIn from "redux-form/lib/structure/plain/setIn";
import getIn from "redux-form/lib/structure/plain/getIn";


const validate = (values, props) => {
    let errors = {};
    const accessKeys = props.accessKeys;

    accessKeys && Object.keys(accessKeys).forEach(key => {
        var rule = accessKeys[key];
        if (!rule.mandatory || rule.disabled || rule.hidden) return; //continue
        errors = getFieldError(errors, values, key)
    });

    return errors;
};

const getFieldError = (errors, values, key) => {
    let value = getIn(values, key)

    if (!value) {
        errors = setIn(errors, key, GlobalMessages.fieldRequire);
    }
    return errors;
};

export default {validate}

