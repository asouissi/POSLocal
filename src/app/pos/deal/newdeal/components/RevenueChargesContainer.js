'use strict'
import React from "react";
import {connect} from "react-redux";
import {injectIntl, defineMessages, FormattedMessage} from "react-intl";
import {Field, formValueSelector} from "redux-form";
import {tables} from "../../../../core/reducers/referenceTable";
import Box from "../../../../core/components/lib/Box";
import CurrencyEntry from "../../../../core/components/lib/CurrencyEntry";
import SelectField from "../../../../core/components/lib/SelectField";
import TextEntry from "../../../../core/components/lib/TextEntry";
import DateEntry from "../../../../core/components/lib/DateEntry";
import {CUSTOMER_TYPE_INDIVIDUAL} from "../../../../common/actor/actorUtils";

const messages = defineMessages({
    jobDescriptionPlaceHolder: {
        id: "pos.deal.client.revenuescharges.jobdescription.placeholder",
        defaultMessage: 'Select job description'
    },
    contractOfEmploymentPlaceHolder: {
        id: "pos.deal.client.revenuescharges.contractofemployment.placeholder",
        defaultMessage: 'Select contract of employment'
    },
    employedDatePlaceHolder: {
        id: "pos.deal.client.revenuescharges.employeddate.placeholder",
        defaultMessage: 'MM/YYYY'
    },
    familystatusPlaceHolder: {
        id: "pos.deal.client.revenuescharges.familystatus.placeholder",
        defaultMessage: 'Select family status'
    },
    paymentDatePlaceHolder: {
        id: "pos.deal.client.revenuescharges.paymentdate.placeholder",
        defaultMessage: 'Select date (1-5-15-20-25)'
    },
    countryPlaceHolder: {id: "pos.deal.client.revenuescharges.country.placeholder", defaultMessage: 'Select country'},
});


class RevenueCharges extends React.Component {
    constructor(props) {
        super(props);
        this.dispatch = props.dispatch;
    }

    get currentActor() {
        return 'listActor[' + this.props.actorIndex + '].actor';
    }

    render() {
        let {accessKeys, ...props} = this.props;
        let jobDescription = null;
        if (this.props.acttype === CUSTOMER_TYPE_INDIVIDUAL) {
            jobDescription = (<div className="col-md-4">
                <Field name="job"
                       component={SelectField}
                       placeholder={this.props.intl.formatMessage(messages.jobDescriptionPlaceHolder)}
                       title={<FormattedMessage id="pos.deal.client.revenuescharges.jobdescription.title"
                                                defaultMessage="Job description"/>}
                       {...accessKeys['job']}/>
            </div>);
        }

        return (
            <div>
                <Box type="panel" withBorder="true" className="separator">

                    <div className="row">
                        <div className="col-md-4">
                            <Field name="propertycosts"
                                   component={TextEntry}
                                   title={<FormattedMessage id="pos.deal.client.revenuescharges.propertycosts.title"
                                                            defaultMessage="Property costs"/>}
                                   {...accessKeys['propertycosts']}/>
                        </div>
                        <div className="col-md-4">
                            <Field name="contractOfEmployment"
                                   component={SelectField}
                                   placeholder={this.props.intl.formatMessage(messages.contractOfEmploymentPlaceHolder)}
                                   title={<FormattedMessage
                                       id="pos.deal.client.revenuescharges.contractofemployment.title"
                                       defaultMessage="Contract of employment"/>}
                                   {...accessKeys['contractOfEmployment']}/>
                        </div>
                        <div className="col-md-4">
                            <Field name="othercosts"
                                   component={TextEntry}
                                   title={<FormattedMessage id="pos.deal.client.revenuescharges.othercosts.title"
                                                            defaultMessage="Other costs"/>}
                                   {...accessKeys['othercosts']}/>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-4">
                            <Field name="paymentdate"
                                   component={DateEntry}
                                   placeholder={this.props.intl.formatMessage(messages.paymentDatePlaceHolder)}
                                   title={<FormattedMessage id="pos.deal.client.revenuescharges.paymentdate.title"
                                                            defaultMessage="Payment date"/>}
                                   {...accessKeys['paymentdate']}/>
                        </div>
                        <div className="col-md-4">
                            <Field name="adrline1"
                                   component={TextEntry}
                                   title={<FormattedMessage id="pos.deal.client.revenuescharges.addresline1.title"
                                                            defaultMessage="Address line 1"/>}
                                   {...accessKeys['adrline1']}/>
                        </div>
                        <div className="col-md-4">
                            <Field name={`${this.currentActor}.actdtexthiring`}
                                   component={DateEntry}
                                   placeholder={this.props.intl.formatMessage(messages.employedDatePlaceHolder)}
                                   title={<FormattedMessage id="pos.deal.client.revenuescharges.hiredate.title"
                                                            defaultMessage="Hire date"/>}
                                   {...accessKeys[`${this.currentActor}.actdtexthiring`]}/>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-4">
                            <Field name={`${this.currentActor}.apasitfam`}
                                   component={SelectField}
                                   options={tables.LANTUSPARAM} refParams={{tusnom: 'SITFAM'}}
                                   placeholder={this.props.intl.formatMessage(messages.familystatusPlaceHolder)}
                                   title={<FormattedMessage id="pos.deal.client.revenuescharges.familystatus.title"
                                                            defaultMessage="Family status"/>}
                                   {...accessKeys[`${this.currentActor}.apasitfam`]}/>
                        </div>
                        <div className="col-md-4">
                            <Field name="adrline2"
                                   component={TextEntry}
                                   title={<FormattedMessage id="pos.deal.client.revenuescharges.addresline2.title"
                                                            defaultMessage="Address line 2"/>}
                                   {...accessKeys['adrline2']}/>
                        </div>
                        <div className="col-md-4">
                            <Field name="employer"
                                   component={TextEntry}
                                   title={<FormattedMessage id="pos.deal.client.revenuescharges.employer.title"
                                                            defaultMessage="Employer"/>}
                                   {...accessKeys['employer']}/>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-4">
                            <Field name={`${this.currentActor}.apanbenfant`}
                                   component={TextEntry}
                                   title={<FormattedMessage id="pos.deal.client.revenuescharges.numberofchildren.title"
                                                            defaultMessage="Number of children"/>}
                                   {...accessKeys[`${this.currentActor}.apanbenfant`]}/>
                        </div>
                        <div className="col-md-4">
                            <Field name="country"
                                   component={SelectField}
                                   options={tables.PAYS}
                                   placeholder={this.props.intl.formatMessage(messages.countryPlaceHolder)}
                                   title={<FormattedMessage id="pos.deal.client.revenuescharges.country.title"
                                                            defaultMessage="Country"/>}
                                   {...accessKeys['country']}/>
                        </div>
                        <div className="col-md-4">
                            <Field name="salary"
                                   component={CurrencyEntry} prefix="€"
                                   title={<FormattedMessage id="pos.deal.client.revenuescharges.salary.title"
                                                            defaultMessage="Salary"/>}
                                   {...accessKeys['salary']}/>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-4">
                            <Field name={`${this.currentActor}.apapancard`}
                                   component={TextEntry}
                                   title={<FormattedMessage
                                       id="pos.deal.client.revenuescharges.socialsecuritynumber.title"
                                       defaultMessage="Social security number "/>}
                                   {...accessKeys['socialsecnum']}/>
                        </div>
                        <div className="col-md-4">
                            <Field name="codepostal1"
                                   component={TextEntry}
                                   title={<FormattedMessage id="pos.deal.client.revenuescharges.codepostal.title"
                                                            defaultMessage="Code postal"/>}
                                   {...accessKeys['codepostal1']}/>
                        </div>
                        <div className="col-md-4">
                            <Field name="otherincome"
                                   component={CurrencyEntry} prefix="€"
                                   title={<FormattedMessage id="pos.deal.client.revenuescharges.otherincome.title"
                                                            defaultMessage="Other income"/>}
                                   {...accessKeys['otherincome']}/>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-4">
                            <Field name="telephonenum"
                                   component={TextEntry}
                                   title={<FormattedMessage id="pos.deal.client.revenuescharges.telephonenumber.title"
                                                            defaultMessage="Telephone"/>}
                                   {...accessKeys['telephonenum']}/>
                        </div>
                        <div className="col-md-4">
                            <Field name="city1"
                                   component={TextEntry}
                                   title={<FormattedMessage id="pos.deal.client.revenuescharges.city.title"
                                                            defaultMessage="City"/>}
                                   {...accessKeys['city1']}/>
                        </div>
                        {jobDescription}
                    </div>

                </Box>
            </div>
        )
    }
}


const mapStateToProps = (state, props) => {
    const selector = formValueSelector(props.form);

    return {
        acttype: selector(state, 'listActor[' + props.actorIndex + '].actor.acttype')
    }
};


export default connect(
    mapStateToProps
)(injectIntl(RevenueCharges));
