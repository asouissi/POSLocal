/**
 * Created by zos on 08/08/2016.
 */
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {injectIntl, defineMessages, FormattedMessage} from 'react-intl';
import {reduxForm, Field} from 'redux-form'
import {GlobalMessages} from '../../../core/intl/GlobalMessages';

import {hashHistory} from 'react-router';
import {Row, Col} from 'react-bootstrap';
import Box from '../../../core/components/lib/Box';
import SelectField from '../../../core/components/lib/SelectField';
import DateEntry from '../../../core/components/lib/DateEntry';
import CurrencyEntry from '../../../core/components/lib/CurrencyEntry';
import Breadcrumbs from 'react-breadcrumbs'
import {fetchReferenceTableWithParams, tables, getReferenceTable} from '../../../core/reducers/referenceTable'
import {computeOutstandingAmount, executeSettleEvent} from '../reducers/actions'
import  {CREDITLINEDETAIL, CONTRACT} from '../../index';
import {Link} from 'react-router';
import AssetInformationContainer from './AssetInformationContainer';
import CreditlineTable  from '../../creditlines/components/CreditlineTable';
import {fetchCreditLines} from '../../creditlines/reducers/actions'
import {notify} from '../../../core/components/lib/notify';


const validate = values => {
    const errors = {}
    if (!values.settledate) {
        errors.settledate = GlobalMessages.fieldRequire;
    }
    if (!values.settlereason) {
        errors.settlereason = GlobalMessages.fieldRequire;
    }

    return errors
};
const messages = defineMessages({
    btnCancel: {id: "wholesale.contract.settle.form.cancel.btn", defaultMessage: 'Cancel'},
    btnConfirm: {id: "wholesale.contract.settle.form.confirm.btn", defaultMessage: 'Confirm'},
    reasonPlaceHolder :{id:"wholesale.contract.settle.form.reason.placeholder", defaultMessage:'Select a reason'},
    settleSuccess :{id:"wholesale.contract.settle.form.success", defaultMessage:'Settle succeed'},
    settleFail :{id:"wholesale.contract.settle.form.fail", defaultMessage:'Settle failed'}
});

export class ContractSettlementFormContainer extends Component {
    componentWillMount() {
        this.props.dispatch(fetchReferenceTableWithParams(tables.LANTUSPARAM,{'tusnom': 'MOTTERRACTOT'}));
        this.props.dispatch(fetchCreditLines());
    }
    handleSettleDateChange = (value) => {
        this.props.dispatch(computeOutstandingAmount(this.props.params.contractId, value.target.value));
    };
    handleSettleEvent = (data) => {
       this.props.dispatch(executeSettleEvent({
            idcreditline: this.props.params.dosid,
            id : this.props.params.contractId,
            ...data}, this.notifySuccess, this.notifyFile));



    };
    notifySuccess = (status) => {
        if(status == 'OK'){
            notify.show(this.props.intl.formatMessage(messages.settleSuccess), 'success');

            hashHistory.push(CREDITLINEDETAIL + '/'+this.props.params.dosid);
        }
    };
    notifyFile = () => {
        notify.show(this.props.intl.formatMessage(messages.settleFail), 'error');
    };
    render(){

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
                        <Box type="primary" title={<FormattedMessage id="wholesale.contract.settle.title"
                                                             defaultMessage="Early settlement"/>}>
                            <form>
                                <Row>
                                    <Col md={12}>
                                        <Field
                                            name="settledate"
                                            component={DateEntry}
                                            title={<FormattedMessage id="wholesale.contract.settle.form.startdate"
                                                                 defaultMessage="Settlement date"/>}
                                            onChange={this.handleSettleDateChange}
                                        />
                                        <Field name="settlereason"
                                               component={SelectField}
                                               options={this.props.listReason}
                                               title={<FormattedMessage id="wholesale.contract.settle.form.reason"
                                                                    defaultMessage="Reason"/>}
                                               placeholder={this.props.intl.formatMessage(messages.reasonPlaceHolder)}
                                        />
                                        <CurrencyEntry value={this.props.outstandingAmount}

                                               title={<FormattedMessage id="wholesale.contract.settle.form.amount"
                                                                    defaultMessage="Outstanding amount"/>}
                                               readOnly={true}
                                        />

                                        <div className="form-action">
                                            <button type="submit" className="btn btn-primary"
                                                    onClick={handleSubmit(this.handleSettleEvent)}  disabled={pristine || submitting}>
                                                {this.props.intl.formatMessage(messages.btnConfirm)}

                                            </button>

                                            <Link
                                                to={CREDITLINEDETAIL + '/'+this.props.params.dosid+'/contract/'+this.props.params.contractId}>
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
                             title={<FormattedMessage id="wholesale.contract.settle.summary.box.title"
                                                      defaultMessage="Summary"/>}>

                            <Box title={<FormattedMessage id="wholesale.contract.dealer.situation.box.title"
                                                      defaultMessage="Dealer Situation"/>}>
                                <CreditlineTable rows={this.props.creditLines} showLinkDisplay={false}
                                                 showSummary={true}
                                                 filter={false}
                                                 reduced={true}/>


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
                        pathname: CREDITLINEDETAIL + '/' + this.props.params.dosid +
                        CONTRACT + '/' + this.props.params.contractId
                    }} className="glyphicon glyphicon-zoom-in">

                    </Link>
                    <FormattedMessage id="wholesale.contract.settle.link.edit"
                                      defaultMessage="Show asset details"/>
                </span>
                <span className={this.props.readonly === "1" ? 'btn-icon  link-disable' : 'btn-icon'}>
                    <Link to={{
                        pathname: CREDITLINEDETAIL + '/' + this.props.params.dosid +
                        CONTRACT + '/' + this.props.params.contractId
                        + '/documents'
                    }} className="glyphicon glyphicon-folder-open">

                    </Link>
                    <FormattedMessage id="wholesale.contract.settle.link.documents"
                                      defaultMessage="Documents"/>
                </span>
                <span className={!this.props.canBeConverted || this.props.readonly === "1" ? 'btn-icon  link-disable' : 'btn-icon'}>
                    <Link to={{
                        pathname: CREDITLINEDETAIL + '/' + this.props.params.dosid +
                        CONTRACT + '/' + this.props.params.contractId
                        + '/convert'
                    }} className="fa fa-refresh">
                    </Link>
                    <FormattedMessage id="wholesale.contract.settle.link.convert"
                                      defaultMessage="Convert"/>
                </span>

            </div>
        );
    }
}

ContractSettlementFormContainer = reduxForm({
        form: 'settleForm',
        validate,
    }
)(injectIntl(ContractSettlementFormContainer));

const mapStateToProps = (state) => {
    return {
        outstandingAmount : state.contracts.settle.outstandingAmount,
        listReason: getReferenceTable(state, tables.LANTUSPARAM, {'tusnom': 'MOTTERRACTOT'}).data,
        creditLines: state.creditLines.creditLines,
        settleSuccess :state.contracts.settleSuccess,
        canBeConverted: state.contracts.canBeConverted,
        readonly: state.authentication.user.readonly
    }
};

const mapDispatchToProps = { computeOutstandingAmount, executeSettleEvent, fetchCreditLines};

export default connect(
    mapStateToProps, mapDispatchToProps
)(ContractSettlementFormContainer);
