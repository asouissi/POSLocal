import {defineMessages} from 'react-intl';

const GlobalMessages = defineMessages({
    fieldRequire: {id: "core.forms.validation.field.require", defaultMessage: 'Required'},
    duplicateUsername: {id: "core.forms.login.duplicateusername", defaultMessage: 'The username is not available'},
    invalidUsername: {id: "core.forms.login.invalidUsername", defaultMessage: 'Invalid username or password'},
    notConnected: {id: "core.forms.login.notConnected", defaultMessage: 'You are not connected'},
    fieldsRequire: {id:"core.forms.errors.fields.required", defaultMessage:"Check required fields"},
    invalidEmail: {id: "core.forms.validation.invalidEmail", defaultMessage: 'Invalid email address'},
    invalidPhoneNo: {id: "core.forms.validation.invalidPhoneNo", defaultMessage: 'Phone no. must be less than 11 digits'},
    invalidMobileNo: {id: "core.forms.validation.invalidMobileNo", defaultMessage: 'Mobile no. must be less than 11 digits'},
    verifyPassword: {id: "core.forms.validation.verifyPassword", defaultMessage: 'Password entered must be same'},
    InvalidAge: {id: "core.forms.validation.invalidAge", defaultMessage: 'Age must be greater than 18'},
    InvalidCodePostal: {id: "core.forms.validation.invalidCodePostal", defaultMessage: 'Only 5 characters are allowed'},

});


export {
    GlobalMessages
}