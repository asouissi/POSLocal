'use strict'
import React from "react";
import {connect} from "react-redux";
import {injectIntl, defineMessages, FormattedMessage} from "react-intl";
import {Field, formValueSelector, arrayRemove} from "redux-form";
import {tables} from "../../../../core/reducers/referenceTable";
import SelectField from "../../../../core/components/lib/SelectField";
import TextEntry from "../../../../core/components/lib/TextEntry";
import DateEntry from "../../../../core/components/lib/DateEntry";
import Box from "../../../../core/components/lib/Box";
import CheckboxEntry from "../../../../core/components/lib/CheckboxEntry";
import {setCustomerFullName, setGenderType, setPostalcode, appendNewActor2} from "../reducers/actions";
import {normalizeFirstName, normalizeToUppercase, normalizeTradeName} from "../../../../core/utils/ValidationUtils";
import {CUSTOMER_TYPE_CORPORATE, CUSTOMER_TYPE_INDIVIDUAL} from "../../../../common/actor/actorUtils";
import {COCLIEN, COBORROWER} from "../../utils/dealUtils";

const DEFAULT_NULL = null;
const DEALTYPE_TTRNOM = 'DEALTYPE';

const messages = defineMessages({
    dealTypePlaceHolder: {
        id: "pos.deal.client.customerinfo.dealtype.placeholder",
        defaultMessage: 'Select a Deal Type'
    },
    assetUsagePlaceHolder: {
        id: "pos.deal.client.customerinfo.assetusage.placeholder",
        defaultMessage: 'Select an Asset Usage'
    },
    customerTypePlaceHolder: {
        id: "pos.deal.client.customerinfo.customertype.placeholder",
        defaultMessage: 'Select Customer type'
    },
    titlePlaceHolder: {id: "pos.deal.client.customerinfo.title.placeholder", defaultMessage: 'Select'},
    countryPlaceHolder: {id: "pos.deal.client.customerinfo.country.placeholder", defaultMessage: 'Select a country'},
    companyTypePlaceHolder: {
        id: "pos.deal.client.customerinfo.companytype.placeholder",
        defaultMessage: 'Select a Company type'
    },
    cspCategoryPlaceHolder: {
        id: "pos.deal.client.customerinfo.cspCategory.placeholder",
        defaultMessage: 'Select a CSP category'
    },
    fiscalStatusPlaceHolder: {
        id: "pos.deal.client.customerinfo.fiscalstatus.placeholder",
        defaultMessage: 'Select a Fiscal status'
    },
    apePlaceHolder: {id: "pos.deal.client.customerinfo.ape.placeholder", defaultMessage: 'Select an APE'},
});
class CustomerInformation extends React.Component {

    constructor(props) {
        super(props);
        this.dispatch = props.dispatch;
    }

    handleLastNameChange = (evt) => {
        this.dispatch(setCustomerFullName(this.props.form, this.props.actnom2 + " " + evt.target.value, this.props.actorIndex, 'apanommarital', evt.target.value));
    }

    handleFirstNameChange = (evt) => {
        this.dispatch(setCustomerFullName(this.props.form, evt.target.value + " " + this.props.actnom, this.props.actorIndex, 'apaprenom', evt.target.value));
    }

    handleTradeNameChange = (evt) => {
        this.dispatch(setCustomerFullName(this.props.form, evt.target.value, this.props.actorIndex));
    }

    handleTitleChange = (value) => {
        if (value) {
            this.dispatch(setGenderType(this.props.form, value.code, this.props.actorIndex));
        }
    }

    handlePostCodeChanged = (event) => {
        this.props.dispatch(setPostalcode(this.props.form, this.props.actorIndex, event.target.value));
    }

    handleCoContractantChecked = (event) => {
        if (event.target.checked && this.props.coCustomerIndex == -1) {
            this.props.dispatch(appendNewActor2(this.props.coCustomerRolcode));
        }
        else {
            this.props.dispatch(arrayRemove(this.props.form, 'listActor', this.props.coCustomerIndex));
        }
    }

    get currentActor() {
        return 'listActor[' + this.props.actorIndex + '].actor';
    }

    render() {
        let {accessKeys, ...props} = this.props;

        let coCustomerTitle =
            <FormattedMessage id="pos.deal.client.customerinfo.cocustomer.title"
                              defaultMessage="Presence of Co - Customer"/>;
        let coContractantChkBox = (
            <div className="col-md-4">
                <Field name="cocustomer" component={CheckboxEntry}
                       checked={this.props.coCustomerIndex != -1}
                       onChange={this.handleCoContractantChecked}
                       {...accessKeys['cocustomer']}>
                    {coCustomerTitle}
                </Field>
            </div>
        );

        let title = DEFAULT_NULL;
        let customerInformation = DEFAULT_NULL;
        let individualLastSection = DEFAULT_NULL;
        let maidenName = DEFAULT_NULL;

        if (this.props.acttype == CUSTOMER_TYPE_INDIVIDUAL) {
            title = (<Field name={`${this.currentActor}.apatitre`}
                            component={SelectField}
                            onChange={this.handleTitleChange}
                            placeholder={this.props.intl.formatMessage(messages.titlePlaceHolder)}
                            options={tables.LANTUSPARAM} refParams={{tusnom: 'TITRE'}}
                            title={<FormattedMessage id="pos.deal.client.customerinfo.titre.title"
                                                     defaultMessage="Title"/>}
                            {...accessKeys[`${this.currentActor}.apatitre`]}/>);

            if (this.props.apasexe == 2) {
                maidenName = (<Field name={`${this.currentActor}.apanompatronymique`}
                                     component={TextEntry} normalize={normalizeToUppercase}
                                     title={<FormattedMessage id="pos.deal.client.customerinfo.maidenname.title"
                                                              defaultMessage="Maiden name"/>}
                                     {...accessKeys[`${this.currentActor}.apanompatronymique`]}/>);
            }

            customerInformation = [
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
                                       title={<FormattedMessage id="pos.deal.client.customerinfo.lastname.title"
                                                                defaultMessage="Last name"/>}
                                       {...accessKeys[`${this.currentActor}.actnom`]}/>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <Field name={`${this.currentActor}.actnom2`}
                               component={TextEntry}
                               normalize={normalizeFirstName} onChange={this.handleFirstNameChange}
                               title={<FormattedMessage id="pos.deal.client.customerinfo.firstname.title"
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
                               title={<FormattedMessage id="pos.deal.client.customerinfo.birthdate.title"
                                                        defaultMessage="Birth date"/>}
                               {...accessKeys[`${this.currentActor}.apadtnaiss`]}/>
                    </div>
                    <div className="col-md-4">
                        <Field
                            name={`${this.currentActor}.apadeptnaissval`}
                            component={TextEntry} onChange={this.handlePostCodeChanged}
                            title={<FormattedMessage id="pos.deal.client.customerinfo.postcode.title"
                                                     defaultMessage="Code postal"/>}
                            {...accessKeys[`${this.currentActor}.apadeptnaissval`]}/>
                    </div>
                    <div className="col-md-4">
                        <Field name={`${this.currentActor}.apavillenaiss`}
                               component={TextEntry}
                               title={<FormattedMessage id="pos.deal.client.customerinfo.birthplace.title"
                                                        defaultMessage="Birth place"/>}
                               {...accessKeys[`${this.currentActor}.apavillenaiss`]}/>
                    </div>
                </div>];

            individualLastSection = (
                <div className="col-md-4">
                    <Field name={`${this.currentActor}.paycode`}
                           component={SelectField}
                           options={tables.PAYS}
                           placeholder={this.props.intl.formatMessage(messages.countryPlaceHolder)}
                           title={<FormattedMessage id="pos.deal.client.customerinfo.nationality.title"
                                                    defaultMessage="Nationality"/>}
                           {...accessKeys[`${this.currentActor}.paycode`]}/>
                </div>
            );
        }
        else if (this.props.acttype == CUSTOMER_TYPE_CORPORATE) {
            customerInformation = [
                <div className="row">
                    <div className="col-md-4">
                        <Field name={`${this.currentActor}.actlibcourt`} normalize={normalizeTradeName}
                               component={TextEntry} onChange={this.handleTradeNameChange}
                               title={<FormattedMessage id="pos.deal.client.customerinfo.tradename.title"
                                                        defaultMessage="Trade name"/>}
                               {...accessKeys[`${this.currentActor}.actlibcourt`]}/>
                    </div>
                    <div className="col-md-4">
                        <Field name={`${this.currentActor}.actsiret`}
                               component={TextEntry}
                               title={<FormattedMessage id="pos.deal.client.customerinfo.siren.title"
                                                        defaultMessage="SIREN"/>}
                               {...accessKeys[`${this.currentActor}.actsiret`]}/>
                    </div>
                    <div className="col-md-4">
                        <Field name={`${this.currentActor}.aparegimematrim`}
                               component={SelectField}
                               options={tables.LANTUSPARAM} refParams={{tusnom: 'REGFISC'}}
                               placeholder={this.props.intl.formatMessage(messages.fiscalStatusPlaceHolder)}
                               title={<FormattedMessage id="pos.deal.client.customerinfo.fiscalstatus.title"
                                                        defaultMessage="Fiscal status"/>}
                               {...accessKeys[`${this.currentActor}.aparegimematrim`]}/>
                    </div>
                </div>,
                <div className="row">
                    <div className="col-md-4">
                        <Field name={`${this.currentActor}.nafcode`}
                               component={SelectField}
                               options={tables.LANNAF}
                               placeholder={this.props.intl.formatMessage(messages.apePlaceHolder)}
                               title={<FormattedMessage id="pos.deal.client.customerinfo.ape.title"
                                                        defaultMessage="APE"/>}
                               {...accessKeys[`${this.currentActor}.nafcode`]}/>
                    </div>
                    <div className="col-md-4">
                        <Field name={`${this.currentActor}.actdtimmatriculation`}
                               component={DateEntry}
                               title={<FormattedMessage id="pos.deal.client.customerinfo.foundingdate.title"
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
                            <Field name="deal.dealextrainfo.dcodealtype" required
                                   component={SelectField}
                                   options={tables.LANTTRPARAM} refParams={{ttrnom: DEALTYPE_TTRNOM}}
                                   placeholder={this.props.intl.formatMessage(messages.dealTypePlaceHolder)}
                                   title={<FormattedMessage id="pos.deal.client.customerinfo.dealtype.title"
                                                            defaultMessage="Deal type"/>}
                                   {...accessKeys['deal.dealextrainfo.dcodealtype']}/>
                        </div>
                        <div className="col-md-4">
                            <Field name="deal.dprassetusage"
                                   component={SelectField}
                                   options={tables.LANTUSPARAM} refParams={{tusnom: 'ASSETUSAGE'}}
                                   placeholder={this.props.intl.formatMessage(messages.assetUsagePlaceHolder)}
                                   title={<FormattedMessage id="pos.deal.client.customerinfo.assetUsage.title"
                                                            defaultMessage="Asset usage"/>}
                                   {...accessKeys['deal.dprassetusage']}/>
                        </div>
                    </div>
                </Box>
                <Box type="panel" withBorder="true" className="separator">
                    <div className="row">
                        <div className="col-md-4">
                            <Field name={`${this.currentActor}.acttype`} disabled={true}
                                   component={SelectField}
                                   options={tables.LANTTRPARAM} refParams={{ttrnom: 'FRONTTYPECLIENT'}}
                                   placeholder={this.props.intl.formatMessage(messages.customerTypePlaceHolder)}
                                   title={<FormattedMessage id="pos.deal.client.customerinfo.customertype.title"
                                                            defaultMessage="Type"/>}
                                   {...accessKeys[`${this.currentActor}.acttype`]}/>
                        </div>
                        <div className="col-md-4">
                            <Field name={`${this.currentActor}.cjucode`}
                                   component={SelectField}
                                   options={tables.CATJURIDIQUE} refParams={{actortype: this.props.acttype}}
                                   placeholder={(this.props.acttype === CUSTOMER_TYPE_CORPORATE ?
                                       this.props.intl.formatMessage(messages.companyTypePlaceHolder) :
                                       this.props.intl.formatMessage(messages.cspCategoryPlaceHolder))}
                                   title={(this.props.acttype === CUSTOMER_TYPE_CORPORATE ?
                                       <FormattedMessage id="pos.deal.client.customerinfo.companytype.title"
                                                         defaultMessage="Company type"/> :
                                       <FormattedMessage id="pos.deal.client.customerinfo.cspcategory.title"
                                                         defaultMessage="CSP category"/>)}
                                   {...accessKeys[`${this.currentActor}.cjucode`]}/>
                        </div>
                    </div>
                    {customerInformation}
                    <div className="row">
                        {coContractantChkBox}
                        {individualLastSection}
                    </div>
                </Box>
            </div>
        )
    }
}

const selector = formValueSelector('dealForm');
const mapStateToProps = (state, props) => {
    const listActor = selector(state, 'listActor');
    const coCustomerIndex = listActor.findIndex((actor) => actor.rolcode == COCLIEN || actor.rolcode == COBORROWER);

    return {
        acttype: selector(state, 'listActor[' + props.actorIndex + '].actor.acttype'),
        actnom: selector(state, 'listActor[' + props.actorIndex + '].actor.actnom'),
        actnom2: selector(state, 'listActor[' + props.actorIndex + '].actor.actnom2'),
        apasexe: selector(state, 'listActor[' + props.actorIndex + '].actor.apasexe'),
        coCustomerIndex
    }
};

export default connect(
    mapStateToProps
)(injectIntl(CustomerInformation));
