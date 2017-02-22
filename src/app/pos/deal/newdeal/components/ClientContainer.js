import React, {Component} from "react";
import {connect} from "react-redux";
import {formValueSelector} from "redux-form";
import {FormattedMessage} from "react-intl";
import "../../../../core/components/lib/prog-tracker.css";
import CustomerInformationContainer from "./CustomerInformationContainer";
import ContactReferencesContainer from "./ContactReferencesContainer";
import RevenueChargesContainer from "./RevenueChargesContainer";
import CoContractantContainer from "./CoContractantContainer";
import NavTabs from "../../../../core/components/lib/NavTabs";
import {clientTabChange} from "../reducers/actions";
import setIn from "redux-form/lib/structure/plain/setIn";
import {GlobalMessages} from "../../../../core/intl/GlobalMessages";
import {isValidAge, isValidEmailAddress, isValidTelephoneNo} from "../../../../core/utils/ValidationUtils";
import actorUtils, {CUSTOMER_TYPE_CORPORATE, CUSTOMER_TYPE_INDIVIDUAL} from "../../../../common/actor/actorUtils";
import {CLIENT, COCLIEN, BORROWER, COBORROWER} from "../../utils/dealUtils";
const FORM_NAME = "dealForm";

export const validateCustomer = (values, props, errors) => {
    let {listActor}=values;
    if (listActor) {
        for (let actorIndex = 0; actorIndex < listActor.length; actorIndex++) {
            let actor = listActor[actorIndex].actor;
            let currentActor = 'listActor[' + actorIndex + '].actor';

            if (!actor.acttype) {
                errors = setIn(errors, `${currentActor}.acttype`, GlobalMessages.fieldRequire);
            }
            if (!actor.cjucode) {
                errors = setIn(errors, `${currentActor}.cjucode`, GlobalMessages.fieldRequire);
            }

            else if (actor.acttype == CUSTOMER_TYPE_INDIVIDUAL) {
                if (!actor.apatitre) {
                    errors = setIn(errors, `${currentActor}.apatitre`, GlobalMessages.fieldRequire);
                }
                if (actor.apasexe == 2) {
                    if (!actor.apanompatronymique) {
                        errors = setIn(errors, `${currentActor}.apanompatronymique`, GlobalMessages.fieldRequire);
                    }
                }
                if (!actor.apadtnaiss) {
                    errors = setIn(errors, `${currentActor}.apadtnaiss`, GlobalMessages.fieldRequire);
                } else if (isValidAge(actor.apadtnaiss, 18)) {
                    errors = setIn(errors, `${currentActor}.apadtnaiss`, GlobalMessages.InvalidAge);
                }
                if (!actor.apadeptnaissval) {
                    errors = setIn(errors, `${currentActor}.apadeptnaissval`, GlobalMessages.fieldRequire);
                } else if (actor.apadeptnaissval.length > 5) {
                    errors = setIn(errors, `${currentActor}.apadeptnaissval`, GlobalMessages.InvalidCodePostal);
                }
                if (!actor.apavillenaiss) {
                    errors = setIn(errors, `${currentActor}.apavillenaiss`, GlobalMessages.fieldRequire);
                }
            }
            else if (actor.acttype == CUSTOMER_TYPE_CORPORATE) {
                if (!actor.actsiret) {
                    errors = setIn(errors, `${currentActor}.actsiret`, GlobalMessages.fieldRequire);
                }
                if (!actor.aparegimematrim) {
                    errors = setIn(errors, `${currentActor}.aparegimematrim`, GlobalMessages.fieldRequire);
                }
                if (!actor.nafcode) {
                    errors = setIn(errors, `${currentActor}.nafcode`, GlobalMessages.fieldRequire);
                }
                if (!actor.actdtimmatriculation) {
                    errors = setIn(errors, `${currentActor}.actdtimmatriculation`, GlobalMessages.fieldRequire);
                }
            }

            if (actor.listactortelecom) {
                let emailIndex = actorUtils.getTelecomFieldErrorIndex(actor.listactortelecom, "NET");
                if (emailIndex != -1) {
                    if (!actor.listactortelecom[emailIndex].atenum) {
                        errors = setIn(errors, `${currentActor}.listactortelecom[${emailIndex}].atenum`, GlobalMessages.fieldRequire);
                    } else if (isValidEmailAddress(actor.listactortelecom[emailIndex].atenum)) {
                        errors = setIn(errors, `${currentActor}.listactortelecom[${emailIndex}].atenum`, GlobalMessages.invalidEmail);
                    }
                }

                let telIndex = actorUtils.getTelecomFieldErrorIndex(actor.listactortelecom, "TEL");
                if (telIndex != -1) {
                    if (!actor.listactortelecom[telIndex].atenum) {
                        errors = setIn(errors, `${currentActor}.listactortelecom[${telIndex}].atenum`, GlobalMessages.fieldRequire);
                    } else if (!isValidTelephoneNo(actor.listactortelecom[telIndex].atenum)) {
                        errors = setIn(errors, `${currentActor}.listactortelecom[${telIndex}].atenum`, GlobalMessages.invalidMobileNo);
                    }
                }

                /*let mobIndex = dealUtils.getTelecomFieldErrorIndex(actor.listactortelecom, "MOB");
                 if (mobIndex != -1) {
                 if (!actor.listactortelecom[mobIndex].atenum) {
                 errors = setIn(errors, `${currentActor}.listactortelecom[${mobIndex}].atenum`, GlobalMessages.fieldRequire);
                 } else if (!isValidTelephoneNo(actor.listactortelecom[mobIndex].atenum)) {
                 errors = setIn(errors, `${currentActor}.listactortelecom[${mobIndex}].atenum`, GlobalMessages.invalidPhoneNo);
                 }
                 }*/

            }
            //if User wants to change existing IBAN,than IBAN field must be compulsory
            if (actor.listactorbankaccount) {
                if (values.changeIban && actor.listactorbankaccount.length > 1 && !actor.listactorbankaccount[1].iban) {
                    errors = setIn(errors, 'listActor[' + actorIndex + '].actor.listactorbankaccount[1].iban', GlobalMessages.fieldRequire);
                }
                if (actor.listactorbankaccount.length > 0) {
                    let ibanIndex = actor.listactorbankaccount.length - 1;
                    if (actor.listactorbankaccount[ibanIndex] && actor.listactorbankaccount[ibanIndex].iban && actor.listactorbankaccount[ibanIndex].bgucodeinterbancaire
                        && actor.listactorbankaccount[ibanIndex].ribintitule && !actor.listactorbankaccount[ibanIndex].aridtdeb) {
                        errors = setIn(errors, 'listActor[' + actorIndex + '].actor.listactorbankaccount[' + ibanIndex + '].aridtdeb', GlobalMessages.fieldRequire);
                    }
                }
            }
        }
    }
    return errors;
}
export class Client extends Component {

    handleTabChange = (key) => {
        this.props.clientTabChange(key);
    }

    render() {
        let {accessKeys, ...props} = this.props;

        var tabs = [{
            key: 'customerinformation',
            title: <FormattedMessage id="pos.deal.step.client.step.customerinformation"
                                     defaultMessage='Customer information'/>,
            body: <CustomerInformationContainer form={FORM_NAME} actorIndex={this.props.customerIndex}
                                                coCustomerRolcode={this.props.customerRolcode == CLIENT ? COCLIEN : COBORROWER}
                                                accessKeys={accessKeys}/>,
            active: false
        }, {
            key: 'contactreferences',
            title: <FormattedMessage id="pos.deal.step.client.step.contactreferences"
                                     defaultMessage='Contact references'/>,
            body: <ContactReferencesContainer form={FORM_NAME} actorIndex={this.props.customerIndex}
                                              accessKeys={accessKeys}/>,
            active: false
        }];

        if (this.props.acttype !== CUSTOMER_TYPE_CORPORATE) {
            tabs.push({
                key: 'revenuecharges',
                title: <FormattedMessage id="pos.deal.step.client.step.revenuecharges"
                                         defaultMessage='Revenues charges'/>,
                body: <RevenueChargesContainer form={FORM_NAME} actorIndex={this.props.customerIndex}
                                               accessKeys={accessKeys}/>,
                active: false
            })
        }

        if (this.props.coCustomerIndex != -1) {
            tabs.push({
                key: 'contractant',
                title: <FormattedMessage id="pos.deal.step.client.step.contractant" defaultMessage='Co-Contractant'/>,
                body: <CoContractantContainer form={FORM_NAME} actorIndex={this.props.coCustomerIndex}
                                              accessKeys={accessKeys}/>,
                active: false
            })
        }
        let currentTab = tabs.find((tab) => tab.key === this.props.clientTabKey);
        if (currentTab) {
            currentTab.active = true;
        }

        return (
            <NavTabs className="summary" tabs={tabs} handleTabChange={this.handleTabChange}/>
        );
    }
}


const selector = formValueSelector('dealForm');
const mapStateToProps = (state, props) => {
    const listactor = selector(state, 'listActor');
    let customerIndex = listactor.findIndex((actor) => actor.rolcode == CLIENT || actor.rolcode == BORROWER);
    let coCustomerIndex = listactor.findIndex((actor) => actor.rolcode == COCLIEN || actor.rolcode == COBORROWER);

    const customerRolcode = listactor[customerIndex] ? listactor[customerIndex].rolcode : undefined;
    return {
        clientTabKey: state.newdeal.clientTabKey,
        acttype: selector(state, 'listActor[' + customerIndex + '].actor.acttype'), //TODO: or rolcode equal CLIENT
        customerIndex,
        coCustomerIndex,
        customerRolcode,
    }
};

export default connect(
    mapStateToProps, {clientTabChange}
)(Client);