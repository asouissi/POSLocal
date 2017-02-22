/**
 * Created by PrashantK on 02-12-2016.
 */


export function isValidTelephoneNo(atenum) {
    return atenum[0] == '+' ? atenum.length <= 12 : atenum.length <= 11;
}

export function normalizePhone(value) {
    let normalizedValue = '';
    if (value && value.length > 0) {
        normalizedValue = value[0] === '+' ? '+' : '';
        normalizedValue += value.replace(/[^0-9]+/g, '');
    }
    return normalizedValue;
}

export function normalizeFirstName(input) {
    if (input) {
        input = input.replace(/[^A-Za-z àâäèéêëîïôœùûüÿçÀÂÄÈÉÊËÎÏÔŒÙÛÜŸÇ] \\' /g, '');
        input = input.length > 0 ? input.replace(input[0], input[0].toUpperCase()) : '';
    }
    return input;
}

export function normalizeToUppercase(input) {
    if (input) {
        input = input.replace(/[^A-Za-z- ]/g, '');
        input = input.toUpperCase();
    }
    return input;
}

export function normalizeTradeName(input) {
    if (input) {
        input = input.replace(/[^A-Za-z0-9- ]/g, '');
        input = input.toUpperCase();
    }
    return input;
}

export function isValidAge(birthDate, validAge = 18) {
    return Math.floor((new Date() - birthDate) / 31556952000) < validAge;
}

export function isValidEmailAddress(email) {
    return !(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email));
}