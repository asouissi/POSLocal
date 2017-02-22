/**
 * Created by zos on 12/09/2016.
 */

import React, {Component} from 'react'
import {connect} from 'react-redux'
import {injectIntl, defineMessages, FormattedMessage} from 'react-intl';
import {reduxForm, formValueSelector, Field} from 'redux-form'
import {GlobalMessages} from '../../../core/intl/GlobalMessages';

import {hashHistory} from 'react-router';
import {Row, Col} from 'react-bootstrap';
import Box from '../../../core/components/lib/Box';
import SelectField from '../../../core/components/lib/SelectField';
import DateEntry from '../../../core/components/lib/DateEntry';
import CurrencyEntry from '../../../core/components/lib/CurrencyEntry';
import Breadcrumbs from 'react-breadcrumbs'
import {fetchReferenceTableWithParams, tables, getReferenceTable} from '../../../core/reducers/referenceTable'
import {computeFees, computeOutstandingAmount, executeConvertEvent, fetchInterestPayment, getListAssetStateForConversion,getListCreditLineForConversion,getListScaleConversion} from '../reducers/actions'
import  {CREDITLINES, CONTRACT} from '../../index';
import {Link} from 'react-router';
import AssetInformationContainer from './AssetInformationContainer';
import CreditlineTable  from '../../creditlines/components/CreditlineTable';
import {notify} from '../../../core/components/lib/notify';
import InterestTable from './InterestTable';

const validate = values => {
    const errors = {}
    if (!values.convertdate) {
        errors.convertdate = GlobalMessages.fieldRequire;
    }
    if (!values.convertreason) {
        errors.convertreason = GlobalMessages.fieldRequire;
    }
    if (!values.convertto) {
        errors.convertto = GlobalMessages.fieldRequire;
    }
    if (!values.convertfinancialscale) {
        errors.convertfinancialscale = GlobalMessages.fieldRequire;
    }
    return errors
};
const messages = defineMessages({
    btnCancel: {id: "wholesale.contract.convert.form.cancel.btn", defaultMessage: 'Cancel'},
    btnConfirm: {id: "wholesale.contract.convert.form.confirm.btn", defaultMessage: 'Confirm'},
    reasonPlaceHolder: {id: "wholesale.contract.convert.form.reason.placeholder", defaultMessage: 'Select a reason'},
    creditlinePlaceHolder: {
        id: "wholesale.contract.convert.form.creditline.placeholder",
        defaultMessage: 'Select a credit line'
    },
    scalePlaceHolder: {
        id: "wholesale.contract.convert.form.scale.placeholder",
        defaultMessage: 'Select a financial scale'
    },
    convertSuccess: {id: "wholesale.contract.convert.form.success", defaultMessage: 'Convert succeed'},
    convertFail: {id: "wholesale.contract.convert.form.fail", defaultMessage: 'Convert failed'}
});

export class ContractConvertFormContainer extends Component {
    componentWillMount() {
        this.props.dispatch(fetchReferenceTableWithParams(tables.LANTUSPARAM, {'tusnom': 'MOTTERRACTOT'}));
        this.props.dispatch(fetchReferenceTableWithParams(tables.FINANCIALSCALE, {'dosid': this.props.params.dosid}));
        this.props.dispatch(getListAssetStateForConversion(this.props.params.contractId));

    }

    handleConvertEvent = (data) => {

        this.props.dispatch(executeConvertEvent({
            idcreditline: this.props.params.dosid,
            id: this.props.params.contractId,
            ...data
        }, this.notifySuccess, this.notifyFail));

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.chosenScale) {
            this.props.dispatch(fetchInterestPayment(nextProps.chosenScale));
        }
    }

    notifySuccess = (status) => {
        if (status == 'OK') {
            notify.show(this.props.intl.formatMessage(messages.convertSuccess), 'success');
            hashHistory.push(CREDITLINES + '/' + this.props.params.dosid);
        }
        if (status == 'TODO') {
            notify.show('Convert not available !', 'warning');
        }
    };
    notifyFail = () => {
        notify.show(this.props.intl.formatMessage(messages.convertFail), 'error');
    };


    handleAssetStateChange = (value) => {

        this.props.dispatch(getListCreditLineForConversion(parseInt(this.props.params.contractId), value.code));

    };

    handleMasterFacilityChange = (value) => {

        this.props.dispatch(getListScaleConversion(parseInt(this.props.params.contractId), value.code));
    };


    render() {
        let actionButtons = this.renderActionButtons();
        const {
            handleSubmit, submitting, pristine
            } = this.props;


        return (
            <div className="contract-content">
                <Breadcrumbs
                    routes={this.props.routes}
                    params={this.props.params} excludes={['app', '/']}/>
                <Row>
                    <Col md={8}>
                        <Box type="primary" title={<FormattedMessage id="wholesale.contract.convert.title"
                                                                     defaultMessage="Asset conversion"/>}>
                            <form>
                                <Row>
                                    <Col md={12}>
                                        <Field
                                            name="convertdate"
                                            component={DateEntry}
                                            title={<FormattedMessage id="wholesale.contract.convert.form.startdate"
                                                                     defaultMessage="Conversion date"/>}
                                            />
                                        <Field
                                            name="assetstate"
                                            component={SelectField}
                                            options={this.props.listAssetstate}
                                            onChange={this.handleAssetStateChange}
                                            title={<FormattedMessage id="wholesale.contract.convert.form.assetstate"
                                                                     defaultMessage="Asset state"/>}
                                            />
                                        <Field name="convertto"
                                               component={SelectField}
                                               options={this.props.convertTo}
                                               onChange={this.handleMasterFacilityChange}
                                               title={<FormattedMessage id="wholesale.contract.convert.form.convertto"
                                                                        defaultMessage="Conversion to"/>}
                                               placeholder={this.props.intl.formatMessage(messages.creditlinePlaceHolder)}
                                            />
                                        <Field name="convertfinancialscale"
                                               component={SelectField}
                                               options={this.props.listScale}
                                               title={<FormattedMessage id="wholesale.contract.convert.form.scale"
                                                                        defaultMessage="Financial scale"/>}
                                               placeholder={this.props.intl.formatMessage(messages.scalePlaceHolder)}
                                            />
                                        <Field name="convertreason"
                                               component={SelectField}
                                               options={this.props.listReason}
                                               title={<FormattedMessage id="wholesale.contract.convert.form.reason"
                                                                        defaultMessage="Reason"/>}
                                               placeholder={this.props.intl.formatMessage(messages.reasonPlaceHolder)}
                                            />

                                        <div className="form-action">
                                            <button type="submit" className="btn btn-primary"
                                                    onClick={handleSubmit(this.handleConvertEvent)}
                                                    disabled={pristine || submitting}>
                                                {this.props.intl.formatMessage(messages.btnConfirm)}

                                            </button>

                                            <Link
                                                to={CREDITLINES + '/'+this.props.params.dosid+'/contract/'+this.props.params.contractId}>
                                                <button
                                                    className="btn btn-danger">{this.props.intl.formatMessage(messages.btnCancel)}</button>
                                            </Link>
                                        </div>

                                    </Col>
                                </Row>

                            </form>
                        </Box>
                    </Col>
                    <Col md={4}>
                        <Box type="primary"
                             title={<FormattedMessage id="wholesale.contract.convert.summary.box.title"
                                                      defaultMessage="Summary"/>}>

                            <Box title={<FormattedMessage id="wholesale.contract.convert.dealer.situation.box.title"
                                                          defaultMessage="Dealer Situation"/>}>
                                <CreditlineTable rows={this.props.creditLines} showLinkDisplay={false}
                                                 showSummary={true}
                                                 filter={false}
                                                 reduced={true}/>
                            </Box>
                            <Box
                                title={<FormattedMessage id="wholesale.contract.convert.interest.box.title"
                                                         defaultMessage=" Interest payments"/>}>
                                <InterestTable
                                    rows={this.props.interest}
                                    />
                            </Box>
                            <AssetInformationContainer
                                parentDosId={this.props.params.dosid}
                                contractId={this.props.params.contractId}>
                                {actionButtons}
                            </AssetInformationContainer>
                        </Box>

                    </Col>
                </Row>
            </div>
        );
    }

    renderActionButtons() {
        let disabled = this.props.readonly === "1" ? "disabled" : "";
        return (
            <div className="text-center">


                <span className="btn-icon">
                    <Link to={{
                        pathname: CREDITLINES + '/' + this.props.params.dosid +
                        CONTRACT + '/' + this.props.params.contractId
                    }} className="glyphicon glyphicon-zoom-in">

                    </Link>
                    <FormattedMessage id="wholesale.contract.convert.link.edit"
                                      defaultMessage="Show asset details"/>
                </span>
                <span className={this.props.readonly === "1" ? 'btn-icon  link-disable' : 'btn-icon'}>
                    <Link to={{
                        pathname: CREDITLINES + '/' + this.props.params.dosid +
                        CONTRACT + '/' + this.props.params.contractId
                        + '/documents'
                    }} className="glyphicon glyphicon-folder-open">

                    </Link>
                    <FormattedMessage id="wholesale.contract.convert.link.documents"
                                      defaultMessage="Documents"/>
                </span>
                <span
                    className={this.props.isSettled || (this.props.readonly === "1") ? 'btn-icon  link-disable' : 'btn-icon'}>
                    <Link to={{
                        pathname: CREDITLINES + '/' + this.props.params.dosid +
                        CONTRACT + '/' + this.props.params.contractId
                        + '/settle'
                    }} className="fa fa-legal">
                    </Link>
                    <FormattedMessage id="wholesale.contract.convert.link.settle"
                                      defaultMessage="Settle"/>
                </span>

            </div>
        );
    }
}
ContractConvertFormContainer = reduxForm({
        form: 'convertForm',
        validate,
    }
)(injectIntl(ContractConvertFormContainer));

const selector = formValueSelector('convertForm');
const mapStateToProps = (state, routeProps) => {
    var scale = selector(state, 'convertfinancialscale');
    var parentDosId = routeProps.params.dosid;
    return {
        listReason: getReferenceTable(state, tables.LANTUSPARAM, {'tusnom': 'MOTTERRACTOT'}).data,
        creditLines: state.creditLines.creditLines,
        convertTo: state.contracts.convertTo,
        listScale: state.contracts.listScale,
        listAssetstate: state.contracts.listAssetstate,
        interest: state.contracts.interest,
        chosenScale: scale,
        readonly: state.authentication.user.readonly
    }


};
const mapDispatchToProps = {
    computeFees,
    computeOutstandingAmount,
    executeConvertEvent,
    fetchInterestPayment
};

export default connect(
    mapStateToProps, mapDispatchToProps
)(ContractConvertFormContainer);