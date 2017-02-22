import {createSelectorCreator, defaultMemoize} from "reselect";
import isEqual from "lodash/isEqual";

/**
 * Motivation : We do that because of polling.
 * When we receive a new array of timeline item we won't re-render if the items are the same.
 * This selector allows to compare all items one by one and pass the newline to react only when there are new elements.
 */

const EMPTY_OBJECT = {}; // to return always the same empty object (ok there is _.Equal so... quite useless)

const createDeepEqualSelector = createSelectorCreator(
    defaultMemoize,
    isEqual
);

const getAccessKeys = (route, keys, values) => {
    if (!route) return EMPTY_OBJECT;

    let routeAccessKey = keys.find(item => {
        return route.match(item.key)
    });
    if (!values || !routeAccessKey ) return EMPTY_OBJECT;


    var customFields = routeAccessKey.customFields || [];
    var rules2 =  routeAccessKey.rules || [];
    let rules = [ ...rules2,  ...customFields]
    if (!rules.length) return EMPTY_OBJECT;
    let result = {};
    rules.forEach(rule => {
        if (rule.component){
            result[rule.component] = evalAccessKey(rule, values, {})
        } else {
            var fieldPath = rule.field.split(/[\].]+/);
            result = getFieldRules(result, rule, values, fieldPath, fieldPath[0], values, {})
        }
    });

    return result
}

//todo : listcustomcharacteristic should be a var in keys, and we can add addtional everywhere in the values object.
const getAdditionalKeys = (route, keys, values) => {


    if (!route) return [];
    let routeAccessKey = keys.find(item => {
        return route.match(item.key)
    });

    if (!values || !routeAccessKey || !routeAccessKey.customFields) return [];
    let customFields = [];

    let countSize = 0;
    routeAccessKey.customFields.forEach(customField => {
        var fieldPath = customField.field.split(/[\][.]+/);
        let listName = fieldPath.shift();
        let listSpec = fieldPath.shift().split(':');
        let fieldName = fieldPath.shift();

        let listSize = values[listName].length;

        let index = values[listName].findIndex(customfielditem=> {
             return customfielditem && customfielditem[listSpec[0]] == listSpec[1]
        });

        index = (index == -1 ) ? listSize + countSize++ : index;

        let field = listName + "[" + index + "]." + fieldName;
        customFields.push({...customField, field, [listSpec[0]]:listSpec[1]})
    });
    return customFields
}

const evalAccessKey = (rule, values, indexes)=> {
    let {mandatory, disabled, hidden, field, ...rest} = rule;

        var indexKeys = Object.keys(indexes) || [];
        var indexValues = Object.values(indexes) || [];

        if (typeof mandatory === 'string') {
            mandatory = doEval(values, indexKeys, indexValues, mandatory);
        }
        if (typeof disabled === 'string') {
            disabled = doEval(values, indexKeys, indexValues, disabled);
        }

        if (typeof hidden === 'string') {
            hidden = doEval(values, indexKeys, indexValues, hidden);
        }

    return {hidden, disabled, mandatory, ...rest}
}

const doEval = (values, indexKeys, indexValues, expression) => {
    try {
        let fn = new Function('values', 'conf', ...indexKeys, "return (" + expression + ")")
        let result = fn.apply(null, [values, {}, ...indexValues])
        return result(values, {}, ...indexValues);
    } catch (ex) {
        alert(ex)
    }
}


const getFieldRules = (accessKeys, rule, object, fieldPath, key, values, indexes) => {
    let value = fieldPath[0];

    if (fieldPath.length === 1) {//end of fieldPath

        accessKeys[key] = evalAccessKey(rule, values, indexes);

        return accessKeys;
    }

    var endPath = fieldPath.slice(1, fieldPath.length); // we delete the first element to reduce fieldPath during this loop
    if (value.indexOf('[') !== -1) { //case array
        let arraySpec = value.split('[');
        var listName = arraySpec[0];
        var listKeyValue = arraySpec[1];

        if (!object[listName]) {
            console.warn("An access key rules is defined but field does not exist:", listName);
            return accessKeys;
        }

        if (listKeyValue.indexOf(':') !== -1) {
            let keyVal = listKeyValue.split(':');
            let listKey = keyVal[0];
            let listValue = keyVal[1];
            let indexList = object[listName].findIndex(o => o[listKey] == listValue);
            if (indexList == -1) {
                console.warn("An access key rules is defined but field does not exist:", object[listName], listKey, listValue)
            } else {
                accessKeys = getFieldRules(accessKeys, rule, object[listName][0], endPath,
                    key.replace(listKeyValue, "") + indexList + '].' + endPath[0], values, indexes)
            }
        } else { //if (listKeyValue.indexOf('$') === 0) { //array with index

            object[listName].forEach((value, index)=> {
                if (listKeyValue) indexes[`${listKeyValue}`] = index;
                key = key.replace(listKeyValue, "");
                accessKeys = getFieldRules(accessKeys, rule, value, endPath, key + index + '].' + endPath[0], values, indexes)
            })
        }
    } else { //case object
        if (!object[value]) {
            console.warn("An access key rules is defined but field does not exist:", value);
            return accessKeys;
        }

        accessKeys = getFieldRules(accessKeys, rule, object[value], endPath, key + '.' + endPath[0], values, indexes)
    }

    return accessKeys;
};


export const additionalAccessKeysSelector = () => {
    return createDeepEqualSelector(getAdditionalKeys, (customFields) => customFields);
}

export const accessKeysSelector = () => {
    return createDeepEqualSelector(
        getAccessKeys,
        (accessKeys) => {
            return accessKeys
        }
    );
}

export const getRouteAccessKeys = (state, route) => {
    const accessKeys = state.authentication.accesskeys.find(item => {
        return route.match(item.key)
    });
    return accessKeys || [];
}

export const getComponentAccessKeys = (accessKeys, componentId) => {
    return accessKeys && accessKeys.rules && accessKeys.rules.find(r => r["component"] === componentId) || [];
}