// Component for The new Actor page

'use strict'
import React, {Component} from "react";
import {connect} from "react-redux";
import {injectIntl} from "react-intl";
import {formValueSelector} from "redux-form";
import {GlobalMessages} from "../../../core/intl/GlobalMessages";
import ActorIdentity from "./ActorIdentity";
import ActorAddress from "./ActorAddress";
import ActorContact from "./ActorContact";
import setIn from "redux-form/lib/structure/plain/setIn";
import {isValidTelephoneNo, isValidEmailAddress} from '../../../core/utils/ValidationUtils';


export const validate = (values, props) => {
    let errors = {}

    //here strict validation of ksiop object, field really mandatory can't be override by accesskeys
    if (!values.actnom) {
        errors.actnom = GlobalMessages.fieldRequire;
    }

    if (!values.actlibcourt) {
        errors.actlibcourt = GlobalMessages.fieldRequire;
    }
    if (values.listactortelecom) {
        let tel = values.listactortelecom.find(item => item.atetype == 'TEL');
        if (tel && tel.atenum && !isValidTelephoneNo(tel.atenum)) {
            let telIndex = values.listactortelecom.findIndex(item => item.atetype == 'TEL');
            errors = setIn(errors, `listactortelecom.${telIndex}.atenum`, GlobalMessages.invalidPhoneNo);
        }

        let mob = values.listactortelecom.find(item => item.atetype == 'MOB');
        if (mob && mob.atenum && !isValidTelephoneNo(mob.atenum)) {
            let mobIndex = values.listactortelecom.findIndex(item => item.atetype == 'MOB');
            errors = setIn(errors, `listactortelecom.${mobIndex}.atenum`, GlobalMessages.invalidMobileNo);
        }

        let mail = values.listactortelecom.find(item => item.atetype == 'NET');
        if (mail && mail.atenum && isValidEmailAddress(mail.atenum)) {
            let mailIndex = values.listactortelecom.findIndex(item => item.atetype == 'NET');
            errors = setIn(errors, `listactortelecom.${mailIndex}.atenum`, GlobalMessages.invalidEmail);
        }
    }
    if (values.listactoraddress) {
        values.listactoraddress.forEach((address) => {
            let adrIndex = values.listactoraddress.indexOf(address);
            if (!address.adrvoie) {
                errors = setIn(errors, 'listactoraddress.[' + adrIndex + '].adrvoie', GlobalMessages.fieldRequire);
            }
            if (!address.paycode) {
                errors = setIn(errors, 'listactoraddress.[' + adrIndex + '].paycode', GlobalMessages.fieldRequire);
            }
        })
    }
    return errors;
};

class ActorCreationContainer extends Component {
    constructor(p_props) {
        super(p_props);
    }

    render() {
        const {
            listactoraddress, listActorTelecom, accessKeys, intl
        } = this.props;

        return (
            <div className="row">
                <div className="col-md-4 sectionTab">
                    <ActorIdentity {...this.props}/>
                </div>
                <div className="col-md-4 sectionTab">
                    <ActorContact {...this.props}/>
                </div>
                <div className="col-md-4 sectionTab">
                    <ActorAddress {...this.props}/>
                </div>
            </div>
        );
    }
}

const selector = formValueSelector('actor');
const mapStateToProps = (state) => {
    return {
        acttype: selector(state, 'acttype'),
        apaprenom: selector(state, 'apaprenom'),
        actnom2: selector(state, 'actnom2'),
        listactoraddress: selector(state, 'listactoraddress'),
        listActorTelecom: selector(state, 'listactortelecom'),
    }
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)
(injectIntl(ActorCreationContainer, {withRef: true}));
