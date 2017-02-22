'use strict'
import React from "react";
import {connect} from "react-redux";
import {injectIntl, defineMessages, FormattedMessage} from "react-intl";
import {Field, formValueSelector} from "redux-form";
import {tables} from "../../../../core/reducers/referenceTable";
import {Checkbox} from "react-bootstrap";
import {
    handleSameAddress,
    handleSameBankAccount,
    setCustomerFullName,
    setGenderType,
    setPostalcode,
    resetSpecificFields
} from "../reducers/actions";
import Box from "../../../../core/components/lib/Box";
import CurrencyEntry from "../../../../core/components/lib/CurrencyEntry";
import SelectField from "../../../../core/components/lib/SelectField";
import TextEntry from "../../../../core/components/lib/TextEntry";
import DateEntry from "../../../../core/components/lib/DateEntry";
import actorUtils, {
    CUSTOMER_TYPE_CORPORATE,
    CUSTOMER_TYPE_INDIVIDUAL,
    CUSTOMER_INDIVIDUAL_FIELDS,
    CUSTOMER_CORPORATE_FIELDS
} from "../../../../common/actor/actorUtils";
import {normalizeFirstName, normalizeToUppercase} from "../../../../core/utils/ValidationUtils";
const DEFAULT_NULL = null;

const messages = defineMessages({
    privateIndividualPlaceHolder: {
        id: "pos.deal.client.cocontractant.actortype.placeholder",
        defaultMessage: 'Select Co-Contractant type'
    },
    titlePlaceHolder: {id: "pos.deal.client.cocontractant.titre.placeholder", defaultMessage: 'Select'},
    relationshipWithCustomerPlaceHolder: {
        id: "pos.deal.client.cocontractant.relationshipwithcustomer.placeholder",
        defaultMessage: 'Select relationship'
    },
    countryPlaceHolder: {id: "pos.deal.client.cocontractant.country.placeholder", defaultMessage: 'Select a country'},
    jobDescriptionPlaceHolder: {
        id: "pos.deal.client.cocontractant.jobdescription.placeholder",
        defaultMessage: 'Select job description'
    },
    contractOfEmploymentPlaceHolder: {
        id: "pos.deal.client.cocontractant.contractofemployment.placeholder",
        defaultMessage: 'Select contract of employment'
    },
    employedDatePlaceHolder: {id: "pos.deal.client.cocontractant.employeddate.placeholder", defaultMessage: 'MM/YYYY'},
    familystatusPlaceHolder: {
        id: "pos.deal.client.cocontractant.familystatus.placeholder",
        defaultMessage: 'Select family status'
    },
    paymentDatePlaceHolder: {
        id: "pos.deal.client.cocontractant.paymentdate.placeholder",
        defaultMessage: 'Select date (1-5-15-20-25)'
    },
    companyTypePlaceHolder: {
        id: "pos.deal.client.cocontractant.companytype.placeholder",
        defaultMessage: 'Select a company type'
    },
    cspCategoryPlaceHolder: {
        id: "pos.deal.client.cocontractant.cspCategory.placeholder",
        defaultMessage: 'Select a CSP category'
    },
    fiscalStatusPlaceHolder: {
        id: "pos.deal.client.cocontractant.fiscalstatus.placeholder",
        defaultMessage: 'Select a fiscal status'
    },
    apePlaceHolder: {id: "pos.deal.client.cocontractant.ape.placeholder", defaultMessage: 'Select an APE'},
});

class CoContractant extends React.Component {

    get currentActor() {
        return 'listActor[' + this.props.actorIndex + '].actor';
    }

    get currentActorAddress() {
        return 'listActor[' + this.props.actorIndex + '].actor.listactoraddress[0]';
    }

    handleSameAddressChecked = (event) => {
        this.props.dispatch(handleSameAddress(event.target.checked));
    }

    handleSameBankAccountChecked = (event) => {
        this.props.dispatch(handleSameBankAccount(event.target.checked));
    }

    handleLastNameChange = (evt) => {
        this.props.dispatch(setCustomerFullName(this.props.form, this.props.actnom2 + " " + evt.target.value, this.props.actorIndex, 'apanommarital', evt.target.value));
    }

    handleFirstNameChange = (evt) => {
        this.props.dispatch(setCustomerFullName(this.props.form, evt.target.value + " " + this.props.actnom, this.props.actorIndex, 'apaprenom', evt.target.value));
    }

    handleTradeNameChange = (evt) => {
        this.props.dispatch(setCustomerFullName(this.props.form, evt.target.value, this.props.actorIndex));
    }

    handleTitleChange = (value) => {
        if (value) {
            this.props.dispatch(setGenderType(this.props.form, value.code, this.props.actorIndex));
        }
    }

    handlePostCodeChanged = (event) => {
        this.props.dispatch(setPostalcode(this.props.form, this.props.actorIndex, event.target.value));
    }

    handleActorTypeChange = (value) => {
        this.props.dispatch(resetSpecificFields(this.props.form, `${this.currentActor}`, value.code == CUSTOMER_TYPE_INDIVIDUAL ? CUSTOMER_CORPORATE_FIELDS : CUSTOMER_INDIVIDUAL_FIELDS));
    }

    render() {
        let {accessKeys, ...props} = this.props;
        let listActorTelecom = this.props.actor.listactortelecom;
        let {phone, mail, mobile} = listActorTelecom ? actorUtils.computeTelecomFields(listActorTelecom) : [];

        let relationshipWithCustomer = null;
        if (this.props.actor && this.props.actor.actid) {
            relationshipWithCustomer = (<Field name="relationshipwithcustomer"
                                               component={SelectField}
                                               placeholder={this.props.intl.formatMessage(messages.relationshipWithCustomerPlaceHolder)}
                                               title={<FormattedMessage
                                                   id="pos.deal.client.cocontractant.relationshipwithcustomer.title"
                                                   defaultMessage="Relationship with customer"/>}
                                               {...accessKeys['relationshipwithcustomer']}/>);
        }

        let title = DEFAULT_NULL;
        let coContractantInformation = DEFAULT_NULL;

        if (this.props.acttype == CUSTOMER_TYPE_INDIVIDUAL) {
            title = (<Field name={`${this.currentActor}.apatitre`}
                            component={SelectField}
                            onChange={this.handleTitleChange}
                            placeholder={this.props.intl.formatMessage(messages.titlePlaceHolder)}
                            options={tables.LANTUSPARAM} refParams={{tusnom: 'TITRE'}}
                            title={<FormattedMessage id="pos.deal.client.cocontractant.titre.title"
                                                     defaultMessage="Title"/>}
                            {...accessKeys[`${this.currentActor}.apatitre`]}/>);

            let maidenName = DEFAULT_NULL;
            if (this.props.actor.apasexe == 2) {
                maidenName = (<Field name={`${this.currentActor}.apanompatronymique`}
                                     component={TextEntry} normalize={normalizeToUppercase}
                                     title={<FormattedMessage id="pos.deal.client.cocontractant.maidenname.title"
                                                              defaultMessage="Maiden name"/>}
                                     {...accessKeys[`${this.currentActor}.apanompatronymique`]}/>);
            }

            coContractantInformation = [
                <div className="row">
                    <div className="col-md-4">
                        <div className="row">
                            <div className="col-md-5">
                                {title}
                            </div>
                            <div className="col-md-7">
                                <Field name={`${this.currentActor}.actnom`}
                                       component={TextEntry} normalize={normalizeToUppercase}
                                       onChange={this.handleLastNameChange}
                                       title={<FormattedMessage id="pos.deal.client.cocontractant.lastname.title"
                                                                defaultMessage="Last name"/>}
                                       {...accessKeys[`${this.currentActor}.actnom`]}/>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <Field name={`${this.currentActor}.actnom2`}
                               component={TextEntry}
                               normalize={normalizeFirstName} onChange={this.handleFirstNameChange}
                               title={<FormattedMessage id="pos.deal.client.cocontractant.firstname.title"
                                                        defaultMessage="First name"/>}
                               {...accessKeys[`${this.currentActor}.actnom2`]}/>
                    </div>
                    <div className="col-md-4">
                        {maidenName}
                    </div>
                </div>,
                <div className="row">
                    <div className="col-md-4">
                        <Field name={`${this.currentActor}.apadtnaiss`}
                               component={DateEntry}
                               title={<FormattedMessage id="pos.deal.client.cocontractant.birthdate.title"
                                                        defaultMessage="Birth date"/>}
                               {...accessKeys[`${this.currentActor}.apadtnaiss`]}/>
                    </div>
                    <div className="col-md-4">
                        <Field
                            name={`${this.currentActor}.apadeptnaissval`}
                            component={TextEntry} onChange={this.handlePostCodeChanged}
                            title={<FormattedMessage id="pos.deal.client.cocontractant.postcode.title"
                                                     defaultMessage="Code postal"/>}
                            {...accessKeys[`${this.currentActor}.apadeptnaissval`]}/>
                    </div>
                    <div className="col-md-4">
                        <Field name={`${this.currentActor}.apavillenaiss`}
                               component={TextEntry}
                               title={<FormattedMessage id="pos.deal.client.cocontractant.birthplace.title"
                                                        defaultMessage="Birth place"/>}
                               {...accessKeys[`${this.currentActor}.apavillenaiss`]}/>
                    </div>
                </div>,
                <div className="row">
                    <div className="col-md-4">
                        <Field name={`${this.currentActor}.paycode`}
                               component={SelectField}
                               options={tables.PAYS}
                               placeholder={this.props.intl.formatMessage(messages.countryPlaceHolder)}
                               title={<FormattedMessage id="pos.deal.client.cocontractant.nationality.title"
                                                        defaultMessage="Nationality"/>}
                               {...accessKeys[`${this.currentActor}.paycode`]}/>
                    </div>
                </div>];

        }
        else if (this.props.acttype == CUSTOMER_TYPE_CORPORATE) {
            coContractantInformation = [
                <div className="row">
                    <div className="col-md-4">
                        <Field name={`${this.currentActor}.actnom`}
                               component={TextEntry} onChange={this.handleTradeNameChange}
                               title={<FormattedMessage id="pos.deal.client.cocontractant.tradename.title"
                                                        defaultMessage="Trade name"/>}
                               {...accessKeys[`${this.currentActor}.actnom`]}/>
                    </div>
                    <div className="col-md-4">
                        <Field name={`${this.currentActor}.actsiret`}
                               component={TextEntry}
                               title={<FormattedMessage id="pos.deal.client.cocontractant.siren.title"
                                                        defaultMessage="SIREN"/>}
                               {...accessKeys[`${this.currentActor}.actsiret`]}/>
                    </div>
                    <div className="col-md-4">
                        <Field name={`${this.currentActor}.aparegimematrim`}
                               component={SelectField}
                               placeholder={this.props.intl.formatMessage(messages.fiscalStatusPlaceHolder)}
                               options={tables.LANTUSPARAM} refParams={{tusnom: 'REGFISC'}}
                               title={<FormattedMessage id="pos.deal.client.cocontractant.fiscalstatus.title"
                                                        defaultMessage="Fiscal status"/>}
                               {...accessKeys[`${this.currentActor}.aparegimematrim`]}/>
                    </div>
                </div>,
                <div className="row">
                    <div className="col-md-4">
                        <Field name={`${this.currentActor}.nafcode`}
                               component={SelectField}
                               placeholder={this.props.intl.formatMessage(messages.apePlaceHolder)}
                               options={tables.LANNAF}
                               title={<FormattedMessage id="pos.deal.client.cocontractant.ape.title"
                                                        defaultMessage="APE"/>}
                               {...accessKeys[`${this.currentActor}.nafcode`]}/>
                    </div>
                    <div className="col-md-4">
                        <Field name={`${this.currentActor}.actdtimmatriculation`}
                               component={DateEntry}
                               title={<FormattedMessage id="pos.deal.client.cocontractant.foundingdate.title"
                                                        defaultMessage="Founding date"/>}
                               {...accessKeys[`${this.currentActor}.actdtimmatriculation`]}/>
                    </div>
                </div>];

        }

        return (
            <div>
                <Box type="panel" withBorder="true" className="separator">
                    <div className="row">
                        <div className="col-md-4">
                            <Field name={`${this.currentActor}.acttype`}
                                   component={SelectField} disabled={this.props.actor.actid}
                                   options={tables.LANTTRPARAM} refParams={{ttrnom: 'FRONTTYPECLIENT'}}
                                   onChange={this.handleActorTypeChange}
                                   placeholder={this.props.intl.formatMessage(messages.privateIndividualPlaceHolder)}
                                   title={<FormattedMessage id="pos.deal.client.cocontractant.privateindividual.title"
                                                            defaultMessage="Type"/>}
                                   {...accessKeys[`${this.currentActor}.acttype`]}/>
                        </div>
                        <div className="col-md-4">
                            <Field name={`${this.currentActor}.cjucode`}
                                   component={SelectField}
                                   options={tables.CATJURIDIQUE} refParams={{actortype: this.props.actor.acttype}}
                                   placeholder={(this.props.acttype === CUSTOMER_TYPE_CORPORATE ?
                                       this.props.intl.formatMessage(messages.companyTypePlaceHolder):
                                       this.props.intl.formatMessage(messages.cspCategoryPlaceHolder))}
                                   title={(this.props.acttype === CUSTOMER_TYPE_CORPORATE ?
                                       <FormattedMessage id="pos.deal.client.cocontractant.companytype.title"
                                                         defaultMessage="Company type"/>:
                                       <FormattedMessage id="pos.deal.client.cocontractant.cspcategory.title"
                                                         defaultMessage="CSP category"/>)}
                                   {...accessKeys[`${this.currentActor}.cjucode`]}/>
                        </div>
                        <div className="col-md-4">
                            {relationshipWithCustomer}
                        </div>
                    </div>
                </Box>
                <Box type="panel" withBorder="true" className="separator">
                    {coContractantInformation}
                </Box>
                <Box type="panel" withBorder="true" className="separator">
                    <div className="row">
                        <div className="col-md-8">
                            <Checkbox onChange={this.handleSameAddressChecked}>
                                Same address
                            </Checkbox>
                        </div>
                        <div className="col-md-4">
                            <Checkbox onChange={this.handleSameBankAccountChecked}>
                                Same bank account
                            </Checkbox>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-4">
                            <Field name={`${this.currentActorAddress}.adrvoie`}
                                   component={TextEntry} disabled={this.props.coContractantSameAddress}
                                   title={<FormattedMessage id="pos.deal.client.cocontractant.adressline1.title"
                                                            defaultMessage="Adress line 1"/>}
                                   {...accessKeys[`${this.currentActorAddress}.adrvoie`]}/>
                        </div>
                        <div className="col-md-4">
                            <Field name={`${this.currentActorAddress}.paycode`}
                                   component={SelectField} disabled={this.props.coContractantSameAddress}
                                   options={tables.PAYS}
                                   placeholder={this.props.intl.formatMessage(messages.countryPlaceHolder)}
                                   title={<FormattedMessage id="pos.deal.client.cocontractant.country.title"
                                                            defaultMessage="Country"/>}
                                   {...accessKeys[`${this.currentActorAddress}.paycode`]}/>
                        </div>
                        <div className="col-md-4">
                            <Field name={this.currentActor + '.listactorbankaccount[0].iban'}
                                   component={TextEntry} disabled={this.props.coContractantSameBankAccount}
                                   title={<FormattedMessage id="pos.deal.client.cocontractant.iban.title"
                                                            defaultMessage="IBAN"/>}
                                   {...accessKeys['iban1']}/>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-4">
                            <Field name={`${this.currentActorAddress}.adrlieudit`}
                                   component={TextEntry} disabled={this.props.coContractantSameAddress}
                                   title={<FormattedMessage id="pos.deal.client.cocontractant.adressline2.title"
                                                            defaultMessage="Adress line 2"/>}
                                   {...accessKeys[`${this.currentActorAddress}.adrlieudit`]}/>
                        </div>
                        <div className="col-md-4">
                            <Field name="mainresidence"
                                   component={SelectField}
                                   options={tables.PAYS} disabled={this.props.coContractantSameAddress}
                                   placeholder={this.props.intl.formatMessage(messages.countryPlaceHolder)}
                                   title={<FormattedMessage id="pos.deal.client.cocontractant.mainresidence.title"
                                                            defaultMessage="Main residence"/>}
                                   {...accessKeys['mainresidence']}/>
                        </div>
                        <div className="col-md-4">
                            <Field name={this.currentActor + '.listactorbankaccount[0].bgucodeinterbancaire'}
                                   component={TextEntry} disabled={this.props.coContractantSameBankAccount}
                                   title={<FormattedMessage id="pos.deal.client.cocontractant.bic.title"
                                                            defaultMessage="BIC"/>}
                                   {...accessKeys['bic1']}/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-4">
                            <Field name={`${this.currentActorAddress}.adrcodepost`}
                                   component={TextEntry} disabled={this.props.coContractantSameAddress}
                                   title={<FormattedMessage id="pos.deal.client.cocontractant.codepostal.title"
                                                            defaultMessage="Code postal"/>}
                                   {...accessKeys[`${this.currentActorAddress}.adrcodepost`]}/>
                        </div>
                        <div className="col-md-4">
                            <Field name={`${this.currentActorAddress}.adrville`}
                                   component={TextEntry} disabled={this.props.coContractantSameAddress}
                                   title={<FormattedMessage id="pos.deal.client.cocontractant.city.title"
                                                            defaultMessage="City"/>}
                                   {...accessKeys[`${this.currentActorAddress}.adrville`]}/>
                        </div>
                        <div className="col-md-4">
                            <Field name={this.currentActor + '.listactorbankaccount[0].ribintitule'}
                                   component={TextEntry} disabled={this.props.coContractantSameBankAccount}
                                   title={<FormattedMessage id="pos.deal.client.cocontractant.accountholder.title"
                                                            defaultMessage="Account holder"/>}
                                   {...accessKeys['accountholder']}/>
                        </div>

                    </div>
                    <div className="row">
                        <div className="col-md-4">
                            <Field name={this.currentActor + "." + phone}
                                   component={TextEntry}
                                   title={<FormattedMessage id="pos.deal.client.cocontractant.telephone.title"
                                                            defaultMessage="Telephone"/>}
                                   {...accessKeys[`${this.currentActor}.` + `${phone}`]}
                            />
                        </div>
                        <div className="col-md-4">
                            <Field name={this.currentActor + "." + mobile}
                                   component={TextEntry}
                                   title={<FormattedMessage id="pos.deal.client.cocontractant.mobile.title"
                                                            defaultMessage="Mobile"/>}
                                   {...accessKeys[`${this.currentActor}.` + `${mobile}`]}
                            />
                        </div>
                        <div className="col-md-4">
                            <Field name={this.currentActor + '.listactorbankaccount[0].aridtdeb'}
                                   component={DateEntry} disabled={this.props.coContractantSameBankAccount}
                                   title={<FormattedMessage
                                       id="pos.deal.client.cocontractant.openingdateofaccount.title"
                                       defaultMessage="Opening date of account"/>}
                                   {...accessKeys['openingdateofaccount']}/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-4">
                            <Field name={this.currentActor + "." + mail} type="email"
                                   component={TextEntry}
                                   title={<FormattedMessage id="pos.deal.client.cocontractant.email.title"
                                                            defaultMessage="Email"/>}
                                   {...accessKeys[`${this.currentActor}.` + `${mail}`]}
                            />
                        </div>

                    </div>
                </Box>

                <Box type="panel" title={<FormattedMessage id="pos.deal.client.cocontractant.box1.title"
                                                           defaultMessage="Revenues charges"/>} withBorder="true"
                     className="separator">
                    <div className="row">
                        <div className="col-md-4">
                            <Field name="propertycost"
                                   component={TextEntry}
                                   title={<FormattedMessage id="pos.deal.client.cocontractant.propertycost.title"
                                                            defaultMessage="Property costs"/>}
                                   {...accessKeys['propertycost']}
                            />
                        </div>
                        <div className="col-md-4">
                            <Field name="jobdesc"
                                   component={SelectField}
                                   placeholder={this.props.intl.formatMessage(messages.jobDescriptionPlaceHolder)}
                                   title={<FormattedMessage id="pos.deal.client.cocontractant.jobdescription.title"
                                                            defaultMessage="Job description"/>}
                                   {...accessKeys['jobdesc']}
                            />
                        </div>
                        <div className="col-md-4">
                            <Field name="contractofemployment"
                                   component={SelectField}
                                   placeholder={this.props.intl.formatMessage(messages.contractOfEmploymentPlaceHolder)}
                                   title={<FormattedMessage
                                       id="pos.deal.client.cocontractant.contractofemployment.title"
                                       defaultMessage="Contract of employment"/>}
                                   {...accessKeys['contractofemployment']}/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-4">
                            <Field name="othercosts1"
                                   component={TextEntry}
                                   title={<FormattedMessage id="pos.deal.client.cocontractant.othercosts.title"
                                                            defaultMessage="Other costs"/>}
                                   {...accessKeys['othercosts1']}/>
                        </div>
                        <div className="col-md-4">
                            <Field name="adrline1"
                                   component={TextEntry}
                                   title={<FormattedMessage id="pos.deal.client.cocontractant.addresline1.title"
                                                            defaultMessage="Address line 1"/>}
                                   {...accessKeys['adrline1']}/>
                        </div>
                        <div className="col-md-4">
                            <Field name={`${this.currentActor}.actdtexthiring`}
                                   component={DateEntry}
                                   placeholder={this.props.intl.formatMessage(messages.employedDatePlaceHolder)}
                                   title={<FormattedMessage id="pos.deal.client.cocontractant.employeddate.title"
                                                            defaultMessage="Hire date"/>}
                                   {...accessKeys[`${this.currentActor}.actdtexthiring`]}/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-4">
                            <Field name={`${this.currentActor}.apasitfam`}
                                   component={SelectField}
                                   placeholder={this.props.intl.formatMessage(messages.familystatusPlaceHolder)}
                                   title={<FormattedMessage id="pos.deal.client.cocontractant.familystatus.title"
                                                            defaultMessage="Family status"/>}
                                   {...accessKeys[`${this.currentActor}.apasitfam`]}/>
                        </div>
                        <div className="col-md-4">
                            <Field name="adrline2"
                                   component={TextEntry}
                                   title={<FormattedMessage id="pos.deal.client.cocontractant.addresline2.title"
                                                            defaultMessage="Address line 2"/>}
                                   {...accessKeys['adrline2']}/>
                        </div>
                        <div className="col-md-4">
                            <Field name="employer"
                                   component={TextEntry}
                                   title={<FormattedMessage id="pos.deal.client.cocontractant.employer.title"
                                                            defaultMessage="Employer"/>}
                                   {...accessKeys['employer']}/>
                        </div>

                    </div>
                    <div className="row">
                        <div className="col-md-4">
                            <Field name={`${this.currentActor}.apanbenfant`}
                                   component={TextEntry}
                                   title={<FormattedMessage id="pos.deal.client.cocontractant.numberofchildren.title"
                                                            defaultMessage="Number of children"/>}
                                   {...accessKeys[`${this.currentActor}.apanbenfant`]}
                            />
                        </div>
                        <div className="col-md-4">
                            <Field name="codepostal1"
                                   component={TextEntry}
                                   title={<FormattedMessage id="pos.deal.client.cocontractant.codepostal.title"
                                                            defaultMessage="Code postal"/>}
                                   {...accessKeys['codepostal1']}/>
                        </div>
                        <div className="col-md-4">
                            <Field name="salary"
                                   component={CurrencyEntry} prefix="€"
                                   title={<FormattedMessage id="pos.deal.client.cocontractant.salary.title"
                                                            defaultMessage="Salary"/>}
                                   {...accessKeys['salary']}/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-4"></div>
                        <div className="col-md-4">
                            <Field name="country"
                                   component={SelectField}
                                   options={tables.PAYS}
                                   placeholder={this.props.intl.formatMessage(messages.countryPlaceHolder)}
                                   title={<FormattedMessage id="pos.deal.client.cocontractant.country.title"
                                                            defaultMessage="Country"/>}
                                   {...accessKeys['country']}/>
                        </div>
                        <div className="col-md-4">
                            <Field name={`${this.currentActor}.apapancard`}
                                   component={TextEntry}
                                   title={<FormattedMessage
                                       id="pos.deal.client.cocontractant.socialsecuritynumber.title"
                                       defaultMessage="Social security number "/>}
                                   {...accessKeys['socialsecnum']}/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-4"></div>
                        <div className="col-md-4">
                            <Field name="city1"
                                   component={TextEntry}
                                   title={<FormattedMessage id="pos.deal.client.cocontractant.city.title"
                                                            defaultMessage="City"/>}
                                   {...accessKeys['city1']}/>
                        </div>
                        <div className="col-md-4">
                            <Field name="otherincome"
                                   component={CurrencyEntry} prefix="€"
                                   title={<FormattedMessage id="pos.deal.client.cocontractant.otherincome.title"
                                                            defaultMessage="Other income"/>}
                                   {...accessKeys['otherincome']}/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-4">
                        </div>
                        <div className="col-md-4">
                            <Field name="telephonenum"
                                   component={TextEntry}
                                   title={<FormattedMessage id="pos.deal.client.cocontractant.telephonenumber.title"
                                                            defaultMessage="Telephone"/>}
                                   {...accessKeys['telephonenum']}/>
                        </div>
                        <div className="col-md-4">
                            <Field name="paymentdate"
                                   component={DateEntry}
                                   placeholder={this.props.intl.formatMessage(messages.paymentDatePlaceHolder)}
                                   title={<FormattedMessage id="pos.deal.client.cocontractant.paymentdate.title"
                                                            defaultMessage="Payment date"/>}
                                   {...accessKeys['paymentdate']}/>
                        </div>
                    </div>
                </Box>
            </div >
        )
    }
}

const mapStateToProps = (state, props) => {
    const selector = formValueSelector(props.form);

    return {
        coContractantSameAddress: state.newdeal.coContractantSameAddress,
        coContractantSameBankAccount: state.newdeal.coContractantSameBankAccount,
        acttype: selector(state, 'listActor[' + props.actorIndex + '].actor.acttype'),
        actor: selector(state, "listActor[" + props.actorIndex + "]").actor,
        actnom: selector(state, 'listActor[' + props.actorIndex + '].actor.actnom'),
        actnom2: selector(state, 'listActor[' + props.actorIndex + '].actor.actnom2'),
    }
};

export default connect(
    mapStateToProps
)(injectIntl(CoContractant));
