'use strict'
import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {Field, formValueSelector, change, arrayRemove} from "redux-form";
import {tables} from "../../../../core/reducers/referenceTable";
import Box from "../../../../core/components/lib/Box";
import TextEntry from "../../../../core/components/lib/TextEntry";
import SearchEntry from "../../../../core/components/lib/SearchEntry";
import DateEntry from "../../../../core/components/lib/DateEntry";
import SelectField from "../../../../core/components/lib/SelectField";
import CheckboxEntry from "../../../../core/components/lib/CheckboxEntry";
import actors from "../../../../common/actor";
import {injectIntl, defineMessages, FormattedMessage} from "react-intl";
import {
    normalizePhone,
    isValidEmailAddress,
    isValidTelephoneNo,
    normalizeFirstName,
    normalizeToUppercase,
    normalizeTradeName,
    isValidAge
} from "../../../../core/utils/ValidationUtils";
import {appendNewActor2, fetchActor, setGenderType, setCustomerFullName, setTpgcode} from ".././reducers/actions";
import Immutable from "seamless-immutable";
import {GlobalMessages} from "../../../../core/intl/GlobalMessages";
import setIn from "redux-form/lib/structure/plain/setIn";
import actorUtils, {CUSTOMER_TYPE_CORPORATE, CUSTOMER_TYPE_INDIVIDUAL} from "../../../../common/actor/actorUtils";
import {COCLIEN, COBORROWER} from "../../utils/dealUtils";

const messages = defineMessages({
    customertypePlaceHolder: {id: "pos.deal.prospect.type.placeholder", defaultMessage: 'Select a customer type'},
    customernumberPlaceHolder: {id: "pos.deal.prospect.number.placeholder", defaultMessage: 'Number'},
    customernamePlaceHolder: {id: "pos.deal.prospect.name.placeholder", defaultMessage: 'Name'},
    customeridPlaceHolder: {id: "pos.deal.prospect.id.placeholder", defaultMessage: 'Actor ID'},
    customernumberTitle: {id: "pos.deal.prospect.number.title", defaultMessage: 'Number'},
    customernameTitle: {id: "pos.deal.prospect.name.title", defaultMessage: 'Name'},
    customeridTitle: {id: "pos.deal.prospect.id.title", defaultMessage: 'Actor ID'},
    dealTypePlaceHolder: {id: "pos.deal.prospect.dealtype.placeholder", defaultMessage: 'Select a deal type'},
    assetUsagePlaceHolder: {id: "pos.deal.prospect.assetusage.placeholder", defaultMessage: 'Select an asset usage'},
    titrePlaceHolder: {id: "pos.deal.prospect.titretype.placeholder", defaultMessage: "Select title"},
    cspCategoryPlaceHolder: {id: "pos.deal.prospect.cspcategory.placeholder", defaultMessage: "Select CSP category"},
    fiscalStatusPlaceHolder: {id: "pos.deal.prospect.fiscalstatus.placeholder", defaultMessage: "Select fiscal status"},
    companyTypePlaceHolder: {id: "pos.deal.prospect.companytype.placeholder", defaultMessage: "Select company type"},
    apePlaceHolder: {id: "pos.deal.prospect.ape.placeholder", defaultMessage: "Select an APE"},
    tradenamePlaceHolder: {id: "pos.deal.prospect.tradename.placeholder", defaultMessage: "Select tradename"},
    lastNamePlaceHolder: {id: "pos.deal.prospect.lastname.placeholder", defaultMessage: "Select last name"}

});

const {ActorSearchPopup} = actors.components;
const DEFAULT_NULL = null;
const EMAIL_TYPE = 'NET';
const PHONE_TYPE = 'TEL';

export const validateProspect = (values, props, errors) => {
    let {listActor, deal} = values;

    if (!deal.dprassetusage) {
        errors = setIn(errors, 'deal.dprassetusage', GlobalMessages.fieldRequire);
    }

    if (listActor) {
        for (let actorIndex = 0; actorIndex < listActor.length; actorIndex++) {
            const actor = listActor[actorIndex].actor;
            if (actor) {
                let currentActor = 'listActor[' + actorIndex + '].actor';
                if (!actor.actid) {
                    if (!actor.acttype) {
                        errors = setIn(errors, `${currentActor}.acttype`, GlobalMessages.fieldRequire);
                    }
                    if (!actor.cjucode) {
                        errors = setIn(errors, `${currentActor}.cjucode`, GlobalMessages.fieldRequire);
                    }
                    let phoneIndex = actorUtils.getTelecomFieldErrorIndex(actor.listactortelecom, PHONE_TYPE);
                    if (phoneIndex != -1) {
                        let tel = actor.listactortelecom[phoneIndex];
                        if (!tel.atenum) {
                            errors = setIn(errors, `${currentActor}.listactortelecom[${phoneIndex}].atenum`, GlobalMessages.fieldRequire);
                        }
                        else {
                            if (tel.atenum && !isValidTelephoneNo(tel.atenum)) {
                                errors = setIn(errors, `${currentActor}.listactortelecom[${phoneIndex}].atenum`, GlobalMessages.invalidPhoneNo);
                            }
                        }
                    }
                    let emailIndex = actorUtils.getTelecomFieldErrorIndex(actor.listactortelecom, EMAIL_TYPE);
                    if (emailIndex != -1) {
                        let net = actor.listactortelecom[emailIndex];
                        if (!net.atenum) {
                            errors = setIn(errors, `${currentActor}.listactortelecom[${emailIndex}].atenum`, GlobalMessages.fieldRequire);
                        }
                        else if (isValidEmailAddress(actor.listactortelecom[emailIndex].atenum)) {
                            errors = setIn(errors, `${currentActor}.listactortelecom[${emailIndex}].atenum`, GlobalMessages.invalidEmail);
                        }
                    }
                    //Validation for private individual fields
                    if (actor.acttype == CUSTOMER_TYPE_INDIVIDUAL) {
                        if (!actor.apaprenom) {
                            errors = setIn(errors, `${currentActor}.apaprenom`, GlobalMessages.fieldRequire);
                        }
                        if (!actor.apatitre) {
                            errors = setIn(errors, `${currentActor}.apatitre`, GlobalMessages.fieldRequire);
                        }
                        if (!actor.apadtnaiss) {
                            errors = setIn(errors, `${currentActor}.apadtnaiss`, GlobalMessages.fieldRequire);
                        } else if (isValidAge(actor.apadtnaiss, 18)) {
                            errors = setIn(errors, `${currentActor}.apadtnaiss`, GlobalMessages.InvalidAge);
                        }

                    }
                    //Validation for Company fields
                    if (actor.acttype == CUSTOMER_TYPE_CORPORATE) {
                        if (!actor.actsiret) {
                            errors = setIn(errors, `${currentActor}.actsiret`, GlobalMessages.fieldRequire);
                        }
                        if (!actor.aparegimematrim) {
                            errors = setIn(errors, `${currentActor}.aparegimematrim`, GlobalMessages.fieldRequire);
                        }
                        if (!actor.nafcode) {
                            errors = setIn(errors, `${currentActor}.nafcode`, GlobalMessages.fieldRequire);
                        }
                    }
                }
            }
        }
    }
    return errors;
}


class Prospect extends React.Component {

    componentWillMount() {
        if (this.props.actor.rolcode) return; //actor is load or init
        this.props.dispatch(appendNewActor2(this.props.rolcode))
    }

    handleCoCustomerSelection = (event) => {
        if (!event.target.checked && this.props.coCustomerIndex != -1) {
            this.props.dispatch(arrayRemove(this.props.form, 'listActor', this.props.coCustomerIndex));
        }
        this.props.dispatch(change(this.props.form, 'cocustomer', event.target.checked));
    }

    handleFirstNameChange = (event) => {
        if (event) {
            var apaprenom = event.target.value;
            this.props.dispatch(change(this.props.form, `${this.currentProspect}.actnom2`, apaprenom));
            var actnom = this.props.actor.actor.actnom ? this.props.actor.actor.actnom : '';
            this.props.dispatch(setCustomerFullName(this.props.form, apaprenom + " " + actnom, this.props.prospectIndex));
        }
    }

    handleLastNameChange = (value) => {
        if (value) {
            var apaprenom = this.props.actor.actor.apaprenom ? this.props.actor.actor.apaprenom : '';
            this.props.dispatch(setCustomerFullName(this.props.form, apaprenom + " " + value, this.props.prospectIndex));
            this.props.dispatch(change(this.props.form, `${this.currentProspect}.apanompatronymique`, value.trim()));
        }
    }

    handleTradenameChange = (value) => {
        if (value) {
            this.props.dispatch(change(this.props.form, `${this.currentProspect}.actlibcourt`, value.trim()));
        }
    }

    handleActorSearch = () => {
        this.refs.actorPop.toggle();
    }

    handleCustomerTypeChange = (value) => {
        this.props.dispatch(change(this.props.form, 'deal.dealextrainfo.dcoclienttype', value.code));
    }

    onActorSelected = (actor) => {
        this.refs.actorPop.toggle();
        var currentProspect = this.props.actor.actor;
        if (currentProspect.actcode === actor.actcode) {
            return;
        }
        let fetchActorAction = bindActionCreators(fetchActor, this.props.dispatch);
        fetchActorAction(actor.actid, this.props.rolcode, {skipAssignment: true}).then(actorVo => {
            actorVo = actorUtils.addMissingTelecomFields(actorVo);
            if (!actorVo.listactorrole.find(role => role.rolcode == this.props.rolcode)) {
                actorVo = Immutable.setIn(actorVo, ['listactorrole', actorVo.listactorrole.length], {
                    actionMode: "+",
                    rolcode: this.props.rolcode
                });
            }
            this.props.dispatch(change(this.props.form, this.currentProspect, actorVo));
        })
    }

    handleTitleChange = (value) => {
        if (value) {
            this.props.dispatch(setGenderType(this.props.form, value.code, this.props.prospectIndex));
        }
    }

    handleAssetUsageChanged = () => {
        this.props.dispatch(setTpgcode(null));
    }

    get currentProspect() {
        return 'listActor[' + this.props.prospectIndex + '].actor';
    }

    render() {
        let {actor, intl, prospectIndex, accessKeys, ...props} = this.props;
        actor = actor.actor || {};
        let {mail, phone} = actor.listactortelecom ? actorUtils.computeTelecomFields(actor.listactortelecom, prospectIndex) : {};
        const {formatMessage} = intl;
        let clReadOnly = this.props.readOnly ? 'read-only' : '';
        let actorPop = (<ActorSearchPopup ref="actorPop" rolcode={this.props.rolcode}
                                          acttype={actor.acttype}
                                          actnom={actor.actnom}
                                          route={this.props.route}
                                          onActorClick={this.onActorSelected}
                                          searchTitle={this.props.searchTitle}
                                          hideAddButton={true}
                                          accessKeys={accessKeys}/>);

        let coCustomerTitle =
            <FormattedMessage id="pos.deal.client.prospectinfo.cocustomer.title"
                              defaultMessage="Presence of Co - Customer"/>;
        let coCustomerSelectionSection = (
            <div className="col-md-6">
                <Field name="cocustomer" component={CheckboxEntry}
                       checked={this.props.coCustomerIndex != -1}
                       onChange={this.handleCoCustomerSelection}
                       {...accessKeys['coCustomer']}>
                    {coCustomerTitle}
                </Field>
            </div>
        );

        let dealSection = (
            <Box type="primary" withBoder="true">
                <div className="row">
                    <div className="col-md-6">
                        <Field name="deal.dealextrainfo.dcodealtype"
                               component={SelectField}
                               options={tables.LANTTRPARAM } refParams={{ttrnom: 'DEALTYPE'}}
                               placeholder={formatMessage(messages.dealTypePlaceHolder)}
                               title={<FormattedMessage id="pos.deal.prospectinfo.dealtype.title"
                                                        defaultMessage="Deal type"/>}
                               {...accessKeys['deal.dealextrainfo.dcodealtype']}/>
                    </div>
                    <div className="col-md-6">
                        <Field name="deal.dprassetusage"
                               component={SelectField}
                               onChange={this.handleAssetUsageChanged}
                               options={tables.LANTUSPARAM } refParams={{tusnom: 'ASSETUSAGE'}}
                               placeholder={formatMessage(messages.assetUsagePlaceHolder)}
                               title={<FormattedMessage id="pos.deal.prospectinfo.assetusage.title"
                                                        defaultMessage="Asset usage"/>}
                               {...accessKeys['deal.dprassetusage']}/>
                    </div>
                </div>
            </Box>
        );

        if (this.props.coCustomerStatus && (this.props.rolcode == COCLIEN || this.props.rolcode == COBORROWER )) {
            coCustomerSelectionSection = null;
            dealSection = null;
        }

        let corporateSection1 = (
            <div className="col-md-6">
                <Field name={`${this.currentProspect}.cjucode`}
                       component={SelectField}
                       options={tables.CATJURIDIQUE} refParams={{actortype: actor.acttype}}
                       placeholder={formatMessage(messages.companyTypePlaceHolder)}
                       title={<FormattedMessage id="pos.deal.prospectinfo.companytype.title"
                                                defaultMessage="Company type"/>}
                       {...accessKeys[`${this.currentProspect}.cjucode`]}/>
            </div>
        );

        let corporateSection2 = (
            <div className="row">
                <div className="col-md-6">
                    <Field name={`${this.currentProspect}.actnom`}
                           component={SearchEntry}
                           normalize={normalizeTradeName}
                           onChange={this.handleTradenameChange}
                           onSearchClick={this.handleActorSearch}
                           placeholder={formatMessage(messages.tradenamePlaceHolder)}
                           title={<FormattedMessage id="pos.deal.prospectinfo.tradename.title"
                                                    defaultMessage="Trade name"/>}
                           {...accessKeys[`${this.currentProspect}.actnom`]}/>
                </div>
                <div className="col-md-6">
                    <Field name={`${this.currentProspect}.actsiret`}
                           component={TextEntry}
                           title={<FormattedMessage id="pos.deal.prospectinfo.siren.title"
                                                    defaultMessage="Siren"/>}
                           {...accessKeys[`${this.currentProspect}.actsiret`]}/>
                </div>
            </div>
        );

        let corporateSection3 = (
            <div className="col-md-6">
                <Field name={`${this.currentProspect}.aparegimematrim`}
                       component={SelectField}
                       options={tables.LANTUSPARAM} refParams={{tusnom: 'REGFISC'}}
                       placeholder={formatMessage(messages.fiscalStatusPlaceHolder)}
                       title={<FormattedMessage id="pos.deal.prospectinfo.fiscalstatus.title"
                                                defaultMessage="Fiscal status"/>}
                       {...accessKeys[`${this.currentProspect}.aparegimematrim`]}/>
            </div>,
                <div className="col-md-6">
                    <Field name={`${this.currentProspect}.nafcode`}
                           component={SelectField}
                           options={tables.LANNAF}
                           placeholder={formatMessage(messages.apePlaceHolder)}
                           title={<FormattedMessage id="pos.deal.prospectinfo.ape.title"
                                                    defaultMessage="APE"/>}
                           {...accessKeys[`${this.currentProspect}.nafcode`]}/>
                </div>
        );

        let individualSection1 = (
            <div className="col-md-6">
                <Field name={`${this.currentProspect}.cjucode`}
                       component={SelectField}
                       options={tables.CATJURIDIQUE} refParams={{actortype: actor.acttype}}
                       placeholder={formatMessage(messages.cspCategoryPlaceHolder)}
                       title={<FormattedMessage id="pos.deal.prospectinfo.cspcategory.title"
                                                defaultMessage="CSP category"/>}
                       {...accessKeys[`${this.currentProspect}.cjucode`]}/>
            </div>
        );

        let individualSection2 = (
            <div className="row">
                <div className="col-md-2">
                    <Field name={`${this.currentProspect}.apatitre`}
                           component={SelectField}
                           onChange={this.handleTitleChange}
                           placeholder={formatMessage(messages.titrePlaceHolder)}
                           options={tables.LANTUSPARAM} refParams={{tusnom: 'TITRE'}}
                           title={<FormattedMessage id="pos.deal.prospectinfo.titre.title"
                                                    defaultMessage="Title"/>}
                           {...accessKeys[`${this.currentProspect}.apatitre`]}/>
                </div>
                <div className="col-md-4">
                    <Field name={`${this.currentProspect}.apaprenom`}
                           component={TextEntry}
                           normalize={normalizeFirstName}
                           onChange={this.handleFirstNameChange}
                           title={<FormattedMessage id="pos.deal.prospectinfo.firstname.title"
                                                    defaultMessage="First name"/>}
                           {...accessKeys[`${this.currentProspect}.apaprenom`]}/>
                </div>
                <div className="col-md-6">
                    <Field name={`${this.currentProspect}.actnom`}
                           component={SearchEntry}
                           normalize={normalizeToUppercase}
                           onChange={this.handleLastNameChange}
                           onSearchClick={this.handleActorSearch}
                           placeholder={formatMessage(messages.lastNamePlaceHolder)}
                           title={<FormattedMessage id="pos.deal.prospectinfo.lastname.title"
                                                    defaultMessage="Last name"/>}
                           {...accessKeys[`${this.currentProspect}.actnom`]}/>
                </div>
            </div>
        );

        let individualSection3 = (
            <div className="col-md-6">
                <Field name={`${this.currentProspect}.apadtnaiss`}
                       component={DateEntry}
                       title={ <FormattedMessage id="pos.deal.prospectinfo.birthdate.title"
                                                 defaultMessage="Date of birth"/>}
                       {...accessKeys[`${this.currentProspect}.apadtnaiss`]}/>
            </div>
        );

        let commonSection = (
            <div className="row">
                <div className="col-md-6">
                    <Field name={this.currentProspect + "." + phone}
                           component={TextEntry}
                           normalize={normalizePhone}
                           title={<FormattedMessage id="pos.deal.prospectinfo.phoneno.title"
                                                    defaultMessage="Phone number"/>}
                           {...accessKeys[`${this.currentProspect}.` + `${phone}`]}/>
                </div>
                <div className="col-md-6">
                    <Field name={this.currentProspect + "." + mail}
                           component={TextEntry}
                           type="email"
                           title={<FormattedMessage id="pos.deal.prospectinfo.email.title"
                                                    defaultMessage="Email"/>}
                           {...accessKeys[`${this.currentProspect}.` + `${mail}`]}/>
                </div>
            </div>
        );

        if (!actor.acttype) {
            individualSection1 = DEFAULT_NULL;
            individualSection2 = DEFAULT_NULL;
            individualSection3 = DEFAULT_NULL;
            corporateSection1 = DEFAULT_NULL;
            corporateSection2 = DEFAULT_NULL;
            corporateSection3 = DEFAULT_NULL;
            commonSection = DEFAULT_NULL;
            coCustomerSelectionSection = DEFAULT_NULL;
        }
        else if (actor.acttype == CUSTOMER_TYPE_CORPORATE) {
            individualSection1 = DEFAULT_NULL;
            individualSection2 = DEFAULT_NULL;
            individualSection3 = DEFAULT_NULL;
        }
        else if (actor.acttype == CUSTOMER_TYPE_INDIVIDUAL) {
            corporateSection1 = DEFAULT_NULL;
            corporateSection2 = DEFAULT_NULL;
            corporateSection3 = DEFAULT_NULL;
        }

        return (
            <div className={"customer " + clReadOnly}>
                {actorPop}
                {dealSection}
                <Box type="primary" title={this.props.boxTitle} withBoder="true">
                    <div className="row">
                        <div className="col-md-6">
                            <Field name={`${this.currentProspect}.acttype`}
                                   component={SelectField}
                                   options={tables.LANTTRPARAM} refParams={{ttrnom: 'FRONTTYPECLIENT'}}
                                   onChange={this.handleCustomerTypeChange}
                                   placeholder={this.props.intl.formatMessage(messages.customertypePlaceHolder)}
                                   title={<FormattedMessage id="pos.deal.prospectinfo.customertype.title"
                                                            defaultMessage="Customer type"/>}
                                   {...accessKeys[`${this.currentProspect}.acttype`]}/>
                        </div>
                        {individualSection1}
                        {corporateSection1}
                    </div>
                    {individualSection2}
                    {corporateSection2}
                    {commonSection}
                    <div className="row">
                        {corporateSection3}
                        {coCustomerSelectionSection}
                        {individualSection3}
                    </div>
                </Box>
            </div>)
    }
}

const mapStateToProps = (state, props) => {
    const selector = formValueSelector(props.form);
    var listActor = selector(state, 'listActor');
    var prospectIndex = props.actorIndex;
    var coCustomerIndex = listActor.findIndex((actor) => actor.rolcode == COCLIEN || actor.rolcode == COBORROWER);

    const actor = selector(state, 'listActor[' + prospectIndex + ']') || {};
    return {
        readOnly: state.newdeal.readOnly,
        coCustomerStatus: selector(state, 'cocustomer'),
        actor, listActor, prospectIndex, coCustomerIndex
    }
};

export default connect(
    mapStateToProps
)(injectIntl(Prospect));