import isNaN from 'lodash/isNaN'

export function parseFloatOrEmpty(value) {
    let parsedValue = parseFloat(value);
    if (isNaN(parsedValue)) return undefined;
    return parsedValue;
}

export function parseIntOrEmpty(value) {
    let parsedValue = parseInt(value);
    if (isNaN(parsedValue)) return undefined;
    return parsedValue;
}
export function parseIntOrZero(value) {
    let parsedValue = parseInt(value);
    if (isNaN(parsedValue)) return 0;
    return parsedValue;
}

export function getStepStyle(code) {
    switch (code) {
        case 'D_CREE':
            return 'badge bg-blue';
        case 'D_WDEC2':
        case 'D_WTDEC':
            return 'badge bg-gray';
        case 'D_MINFO':
            return 'badge bg-orange';
        case 'EMAILS':
        case 'VALID':
        case 'D_VALID':
        case 'TRANSOK':
            return 'badge bg-green';
        case 'TRAKO':
        case 'D_SSUIT':
            return 'badge bg-red';
        default:
            return 'badge bg-blue';
    }
}

export function getBootstrapResolution(resolution) {
    var res = -1;
    switch (resolution) {
        case "xs":      //less than

        case "sm":      //more than
            res = 768;
            break;
        case "md":      //more than
            res = 970;
            break;
        case "lg":      //more than
            res = 1170;
            break;
    }
    if (res == -1)
        return false;
    else
        return res + "px";
}

export function transformObject(object, structure) {
    let keys = Object.keys(structure) ;
    var obj = {};
    keys.forEach(function(data){
        obj[data] = object[data] || null;
    });
    return obj;
}