import React from "react";
import {connect} from "react-redux";
import {injectIntl, defineMessages, FormattedMessage} from "react-intl";
import {Field, formValueSelector, change, arrayPop, arrayPush} from "redux-form";
import {tables} from "../../../../core/reducers/referenceTable";
import Box from "../../../../core/components/lib/Box";
import SelectField from "../../../../core/components/lib/SelectField";
import TextEntry from "../../../../core/components/lib/TextEntry";
import DateEntry from "../../../../core/components/lib/DateEntry";
import CheckboxEntry from "../../../../core/components/lib/CheckboxEntry";
import {Checkbox} from "react-bootstrap";
import actorUtils from "../../../../common/actor/actorUtils";
import {normalizePhone} from "../../../../core/utils/ValidationUtils";
import {changeIbanStatus} from "../reducers/actions";
import {ACTION_MODE_MODIFICATION} from "../../../../core/utils/sharedUtils";

const messages = defineMessages({
    countryPlaceHolder: {id: "pos.deal.client.contactreferences.country.placeholder", defaultMessage: 'Select country'},
    mainAddresPlaceHolder: {
        id: "pos.deal.client.contactreferences.mainaddress.placeholder",
        defaultMessage: 'Select Yes/No'
    }
});

class ContactReferences extends React.Component {

    componentWillMount() {
        if (this.props.actor && this.props.actor.listactorbankaccount && this.props.actor.listactorbankaccount.length == 1 && this.props.actor.listactorbankaccount[0].ribid) {
            this.props.dispatch(changeIbanStatus(true));//flag set to disable IBAN related fields of existing IBAN account
        }
    }

    handleMainAddressChange = (event) => {
        this.props.dispatch(change(this.props.form, this.currentActorAddress + ".aadflagsiege", event.target.checked));
        this.props.dispatch(change(this.props.form, this.currentActorAddress + ".aadflagcourrier", event.target.checked));
        this.props.dispatch(change(this.props.form, this.currentActorAddress + ".aadflagfacturation", event.target.checked));
        this.props.dispatch(change(this.props.form, this.currentActorAddress + ".aadflaglivraison", event.target.checked));
    }

    handleIbanChanged = (event) => {
        if (this.props.actor.listactorbankaccount.length == 1) {
            //To handle on java side
            this.props.dispatch(change(this.props.form, this.currentActor + '.listactorbankaccount[0].paycode', this.props.actor.paycode));
        }
    }

    handleIbanAccountSelection = (event) => {
        if (event.target.checked) {
            //add new iban account and make aridtremplace of prevoius account to sysdate
            this.props.dispatch(arrayPush(this.props.form, `${this.currentActor}.listactorbankaccount`, {
                paycode: this.props.actor.paycode
            }));
            this.props.dispatch(change(this.props.form, this.currentActor + '.listactorbankaccount[0].aridtremplace', new Date().getTime()));
            this.props.dispatch(change(this.props.form, this.currentActor + '.listactorbankaccount[0].actionMode',ACTION_MODE_MODIFICATION ));
        }
        else {
            //remove newly added object from listactorbankaccount and again set aridtremplace to null
            this.props.dispatch(arrayPop(this.props.form, `${this.currentActor}.listactorbankaccount`));
            this.props.dispatch(change(this.props.form, this.currentActor + '.listactorbankaccount[0].aridtremplace', null));
            this.props.dispatch(change(this.props.form, this.currentActor + '.listactorbankaccount[0].actionMode',null ));
        }
        //to maintain state of checkbox
        this.props.dispatch(change(this.props.form, 'changeIban', event.target.checked));
    }

    get currentActor() {
        return 'listActor[' + this.props.actorIndex + '].actor';
    }

    get currentActorAddress() {
        return 'listActor[' + this.props.actorIndex + '].actor.listactoraddress[0]';
    }

    render() {
        const {accessKeys, actor, ...props} = this.props;

        let listActorTelecom = this.props.actor ? this.props.actor.listactortelecom : [];
        let {phone, mail, mobile} = listActorTelecom ? actorUtils.computeTelecomFields(listActorTelecom) : [];

        //If actor has existing valid iban than disable fields of existing iban and enable checkbox
        let isIbanFieldsDisabled = actor && actor.listactorbankaccount && actor.listactorbankaccount.length == 1 && actor.listactorbankaccount[0].ribid ? true : false;
        let isIbanLinked = isIbanFieldsDisabled && actor.listactorbankaccount[0].actid ? true : false;
        let currentIbanIndex = actor && actor.listactorbankaccount && actor.listactorbankaccount.length > 0 ? actor.listactorbankaccount.length - 1 : 0;

        //If actor has no iban account then disable checkbox
        let checkboxSectionStyle = (actor && actor.listactorbankaccount &&
        ((actor.listactorbankaccount.length == 0)||(actor.listactorbankaccount.length == 1 && !actor.listactorbankaccount[0].ribid)))? 'iban-section' : null;

        return (
            <div>
                <Box type="panel" withBorder="true" className="separator">
                    <div className="row">
                        <div className="col-md-8">
                            <Field name={`${this.currentActorAddress}.aadflagsiege`} component={CheckboxEntry}
                                   onChange={this.handleMainAddressChange}>Main address</Field>
                        </div>

                        <div className={"col-md-4 " + checkboxSectionStyle}>
                            <Field name="changeIban" component={CheckboxEntry}
                                   onChange={this.handleIbanAccountSelection}>Change IBAN account</Field>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-4">
                            <Field
                                name={`${this.currentActorAddress}.adrvoie`}   // mapping not finalized yet
                                component={TextEntry}
                                title={<FormattedMessage id="pos.deal.client.contactreferences.addressline1.title"
                                                         defaultMessage="Address line 1"/>}
                                {...accessKeys[`${this.currentActorAddress}.adrvoie`]}/>
                        </div>

                        <div className="col-md-4">
                            <Field name={`${this.currentActorAddress}.paycode`}
                                   component={SelectField}
                                   options={tables.PAYS}
                                   placeholder={this.props.intl.formatMessage(messages.countryPlaceHolder)}
                                   title={<FormattedMessage id="pos.deal.client.contactreferences.country.title"
                                                            defaultMessage="Country"/>}
                                   {...accessKeys[`${this.currentActorAddress}.paycode`]}/>
                        </div>
                        <div className="col-md-4">
                            <Field name={this.currentActor + '.listactorbankaccount['+ currentIbanIndex +'].iban'}
                                   component={TextEntry}
                                   disabled={isIbanFieldsDisabled}
                                   onChange={this.handleIbanChanged}
                                   title={<FormattedMessage id="pos.deal.client.contactreferences.iban.title"
                                                            defaultMessage="IBAN"/>}
                                   {...accessKeys['iban']}/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-4">
                            <Field name={`${this.currentActorAddress}.adrlieudit`}
                                   component={TextEntry}
                                   title={<FormattedMessage id="pos.deal.client.contactreferences.addressline2.title"
                                                            defaultMessage="Address line 2"/>}
                                   {...accessKeys[`${this.currentActorAddress}.adrlieudit`]}/>
                        </div>
                        <div className="col-md-4">
                            <Field name={`${this.currentActorAddress}.adrville`}
                                   component={TextEntry}
                                   title={<FormattedMessage id="pos.deal.client.contactreferences.city.title"
                                                            defaultMessage="City"/>}
                                   {...accessKeys[`${this.currentActorAddress}.adrville`]}/>
                        </div>
                        <div className="col-md-4">
                            <Field name= {this.currentActor + '.listactorbankaccount['+ currentIbanIndex +'].bgucodeinterbancaire'}
                                   component={TextEntry}
                                   disabled={isIbanFieldsDisabled}
                                   title={<FormattedMessage id="pos.deal.client.contactreferences.bic.title"
                                                            defaultMessage="BIC"/>}
                                   {...accessKeys['bic']}/>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-4">
                            <Field name={`${this.currentActorAddress}.adrcodepost`}
                                   component={TextEntry}
                                   title={<FormattedMessage id="pos.deal.client.contactreferences.codepostal.title"
                                                            defaultMessage="Code postal"/>}
                                   {...accessKeys[`${this.currentActorAddress}.adrcodepost`]}/>
                        </div>
                        <div className="col-md-4">
                            <Field name={this.currentActor + "." + mail}
                                   component={TextEntry} type="email"
                                   title={<FormattedMessage id="pos.deal.client.contactreferences.email.title"
                                                            defaultMessage="Email"/>}
                                   {...accessKeys[`${this.currentActor}.` + `${mail}`]}/>
                        </div>
                        <div className="col-md-4">
                            <Field name= {this.currentActor + '.listactorbankaccount['+ currentIbanIndex +'].ribintitule'}
                                   component={TextEntry}
                                   onChange={this.handleAccHolderNameChanged}
                                   title={<FormattedMessage id="pos.deal.client.contactreferences.accountholder.title"
                                                            defaultMessage="Account holder"/>}
                                   {...accessKeys['accholder']}/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-4">
                            <Field name={this.currentActor + "." + phone}
                                   component={TextEntry} normalize={normalizePhone}
                                   title={<FormattedMessage id="pos.deal.client.contactreferences.telephone.title"
                                                            defaultMessage="Telephone"/>}
                                   {...accessKeys[`${this.currentActor}.` + `${phone}`]}/>
                        </div>
                        <div className="col-md-4">
                            <Field name={this.currentActor + "." + mobile}
                                   component={TextEntry} normalize={normalizePhone}
                                   title={<FormattedMessage id="pos.deal.client.contactreferences.mobile.title"
                                                            defaultMessage="Mobile"/>}
                                   {...accessKeys[`${this.currentActor}.` + `${mobile}`]}/>
                        </div>
                        <div className="col-md-4">
                            <Field name={this.currentActor + '.listactorbankaccount['+ currentIbanIndex +'].aridtdeb'}
                                   component={DateEntry}
                                   disabled={isIbanLinked}
                                   title={<FormattedMessage
                                       id="pos.deal.client.contactreferences.accoountpeningdate.title"
                                       defaultMessage="Opening date of account"/>}
                                   {...accessKeys['accopeningdate']}/>
                        </div>
                    </div>
                </Box>
            </div>
        )
    }
}

const selector = formValueSelector('dealForm');
const mapStateToProps = (state, props) => {
    return {
        actor: selector(state, "listActor[" + props.actorIndex + "].actor"),
        flagDisableIbanField: selector(state, 'changeIban')
    }
};


export default connect(
    mapStateToProps
)(injectIntl(ContactReferences));
