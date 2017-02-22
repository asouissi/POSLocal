import React, {Component} from 'react'
import {connect} from 'react-redux'
import {reduxForm, Field, formValueSelector, change} from 'redux-form'
import {Row, Col} from 'react-bootstrap';
import {injectIntl, defineMessages, FormattedMessage} from 'react-intl';
import {GlobalMessages} from '../../../core/intl/GlobalMessages';
import {Link} from 'react-router';
import {notify} from '../../../core/components/lib/notify';
import Box from '../../../core/components/lib/Box';
import SelectField from '../../../core/components/lib/SelectField';
import TextEntry from '../../../core/components/lib/TextEntry';
import CurrencyEntry from '../../../core/components/lib/CurrencyEntry';
import NumberEntry from '../../../core/components/lib/NumberEntry';
import DateEntry from '../../../core/components/lib/DateEntry';
import  {CREDITLINEDETAIL, CONTRACT} from '../../index';
import ContractTabsContainer from "./ContractTabsContainer";
import InterestTable from './InterestTable';
import RepayementTable from './RepayementTable';
import AssetInformationContainer from './AssetInformationContainer';
import {
    fetchReferenceTable,
    fetchReferenceTableWithParams,
    tables,
    getReferenceTable
} from '../../../core/reducers/referenceTable'
import {getStepStyle} from '../../../core/utils/Utils';
import Breadcrumbs from 'react-breadcrumbs'
import {
    saveContract,
    fetchContract,
    initContract,
    fetchVariant,
    fetchInterestPayment,
    fetchPrincipalRepayment,
    isSettled,
    canBeConverted
} from '../reducers/actions'
const DEFAULT_EMPTY = [];

const messages = defineMessages({
    financialScalePlaceholder: {
        id: "wholesale.contacts.form.scale.placeholder",
        defaultMessage: 'Select financial scale'
    },
    makePlaceholder: {id: "wholesale.contacts.form.make.placeholder", defaultMessage: 'Select make'},
    modelPlaceholder: {id: "wholesale.contacts.form.model.placeholder", defaultMessage: 'Select model'},
    colorPlaceholder: {id: "wholesale.contacts.form.color.placeholder", defaultMessage: 'Select color'},
    trimPlaceholder: {id: "wholesale.contacts.form.trim.placeholder", defaultMessage: 'Select trim'},
    typePlaceholder: {id: "wholesale.contacts.form.assettype.placeholder", defaultMessage: 'Select asset type'},
    statePlaceholder: {id: "wholesale.contacts.form.assetstate.placeholder", defaultMessage: 'Select asset state'},
    siretPlaceholder: {id: "wholesale.contacts.form.siret.placeholder", defaultMessage: 'SIRET'},
    onSuccess: {
        id: "wholesale.contract.saved.success",
        defaultMessage: "Asset {dosnum} saved"
    },
    onFailure: {
        id: "wholesale.contract.saved.failed",
        defaultMessage: "Asset save failed"
    }
});

const validate = values => {
    const errors = {};

    if (!values.dosidtemplate) {
        errors.dosidtemplate = GlobalMessages.fieldRequire
    }

    if (!values.dosmtproduct) {
        errors.dosmtproduct = GlobalMessages.fieldRequire
    }

    if (!values.dosdtdeb) {
        errors.dosdtdeb = GlobalMessages.fieldRequire
    }
    if (!values.makid) {
        errors.makid = GlobalMessages.fieldRequire
    }
    if (!values.mmocode) {
        errors.mmocode = GlobalMessages.fieldRequire
    }
    if (!values.mmtcode) {
        errors.mmtcode = GlobalMessages.fieldRequire
    }

    if (!values.napcode) {
        errors.napcode = GlobalMessages.fieldRequire
    }
    if (!values.acacode) {
        errors.acacode = GlobalMessages.fieldRequire
    }
    if (!values.iruserialnumber) {
        errors.iruserialnumber = GlobalMessages.fieldRequire
    }
    if (!values.dosexternalref) {
        errors.dosexternalref = GlobalMessages.fieldRequire
    }

    return errors
};


export class ContractFormContainer extends Component {

    componentWillMount() {
        const dosId = parseInt(this.props.params.contractId);
        const parentDosId = parseInt(this.props.params.dosid);

        if (dosId) {
            this.props.dispatch(fetchContract(dosId, parentDosId));
            this.props.dispatch(isSettled(dosId));
            this.props.dispatch(canBeConverted(dosId));
        } else {
            this.props.dispatch(initContract({dosidrefinance: parentDosId}));
        }

        this.props.dispatch(fetchReferenceTableWithParams(tables.LANMAKE, {'dosid': parentDosId}));
        this.props.dispatch(fetchReferenceTableWithParams(tables.LANPHASE, {'phadest': 'DOSSIER'}));
        this.props.dispatch(fetchReferenceTableWithParams(tables.LANNAP, {'dosid': parentDosId}));
        this.props.dispatch(fetchReferenceTableWithParams(tables.LANASSETCATEGORY, {'dosid': parentDosId}));
        this.props.dispatch(fetchReferenceTableWithParams(tables.LANTUSPARAM, {'tusnom': 'COLOR'}));
        this.props.dispatch(fetchReferenceTableWithParams(tables.SIRET,{'dosid': parentDosId}));
    }

    componentWillUnmount() {
        this.props.dispatch(initContract());
    }

    componentWillReceiveProps(nextProps) {
        nextProps.makId && nextProps.makId != this.props.makId && this.props.dispatch(fetchReferenceTableWithParams(tables.LANMAKEMODEL, {'makid': nextProps.makId}));
        nextProps.makId && nextProps.mmoCode && nextProps.mmoCode != this.props.mmoCode && this.props.dispatch(fetchReferenceTableWithParams(tables.LANMAKMODTRIMLEVEL, {
            'makid': nextProps.makId,
            'mmocode': nextProps.mmoCode
        }));


        if (nextProps.makId && nextProps.mmoCode && nextProps.mmtCode
            && (nextProps.mmtCode != this.props.mmtCode || nextProps.mmoCode != this.props.mmoCode || nextProps.makId != this.props.makId )) {

            this.props.dispatch(fetchReferenceTableWithParams(tables.FINANCIALSCALE, {
                'dosid': parseInt(this.props.params.dosid),
                'makid': nextProps.makId,
                'mmocode': nextProps.mmoCode,
                'mmtcode': nextProps.mmtCode
            }));
        }

        if (!_(nextProps.formValues).isEqual(this.props.formValues) && !this.props.isLoading) {
            this.checkUpdatePayment(nextProps.formValues, this.props.formValues);
            this.checkUpdateVariant(nextProps.formValues, this.props.formValues)
        }
    }

    checkUpdateVariant(newValues, oldValues) {
        let {makid, mmocode, mmtcode} = newValues;
        if (makid && mmtcode && mmtcode && mmtcode !== oldValues.mmtcode) {
            this.props.dispatch(fetchVariant({makid, mmocode, mmtcode}, (varId) => {
                this.props.dispatch(change('contract', 'varid', varId))
            }));
        }
    }

    checkUpdatePayment(newValues, oldValues) {

        if (!newValues.dosidtemplate) {
            return;
        }

        if (newValues.dosidtemplate !== oldValues.dosidtemplate) {
            this.props.dispatch(fetchInterestPayment(newValues.dosid || newValues.dosidtemplate));
        }

        if (( newValues.dosidtemplate !== oldValues.dosidtemplate)
            || newValues.dosmtproduct && newValues.dosmtproduct !== oldValues.dosmtproduct
            || newValues.dosdtdeb && newValues.dosdtdeb !== oldValues.dosdtdeb) {
            this.props.dispatch(fetchPrincipalRepayment(newValues.dosidtemplate, newValues.dosid, newValues.dosmtproduct, newValues.dosdtdeb));
        }
    }

    handleSaveEvent = (data) => {
        let {formatMessage} = this.props.intl
        this.props.dispatch(saveContract(data,
                (deal)=> {
                    notify.show(formatMessage(messages.onSuccess, {dosnum: deal.dosnum}), 'success');
                },
                (error) => {
                    notify.show(formatMessage(messages.onFailure), 'error');
                })
        )
    };

    handleMakChange = (value) => {
        this.props.dispatch(this.props.change('mmocode', null));
        this.props.dispatch(this.props.change('mmtcode', null));
    };

    handleModelChange = (value) => {
        this.props.dispatch(this.props.change('mmtcode', null));
    };
    handleDueDateChange = (value) => {
        this.props.dispatch(fetchPrincipalRepayment(this.props.formValues.dosidtemplate, this.props.formValues.dosid, this.props.formValues.dosmtproduct, value.target.value));

        if (this.props.repayment && this.props.repayment[0]) {
            this.props.dispatch(this.props.change('dosdtfin', this.props.repayment[0].duedate));
        }
    };

    render() {
        const {
             submitFailed, accessKeys, error,params, ...props
            } = this.props;
        const form = this.renderForm();

        let {phacode} = this.props.contract;
        let {listPhase} = this.props;
        let phaseBadge = undefined;
        if (phacode && listPhase && listPhase.length) {
            let phase = listPhase && listPhase.find(item => item.code === phacode);
            phaseBadge = <span className={getStepStyle(phacode)}>{phase ? phase.label : phacode}</span>
        }
        return (
            <div className="contract-content">
                <Breadcrumbs
                    routes={this.props.routes}
                    params={this.props.params} excludes={['app', '/']}/>
                <Row>
                    <Col md={8}>
                        <Box type="primary" loading={this.props.isLoading} readOnly={this.props.formValues.dosid}
                             title={<FormattedMessage id="wholesale.contract.container.title"
                                                      defaultMessage="Asset"/>}
                            >
                            <div className="phase-container">
                                {phaseBadge}
                            </div>
                            {form}
                        </Box>
                    </Col>
                    <Col md={4}>
                        <ContractTabsContainer submitFailed={submitFailed} syncErrors={props.errors} error={error}
                                               accessKey={accessKeys} params={params}/>
                    </Col>
                </Row>
            </div>
        );
    }

    renderForm() {
        const {
            handleSubmit, submitting, pristine, contract, reset
            } = this.props;

        let buttons = !contract.dosid ? [<button type="button" className="btn btn-danger" onClick={reset}
                                                 disabled={pristine || submitting}>
            <FormattedMessage id="wholesale.contract.form.btn.reset" defaultMessage="Reset"/></button>] : DEFAULT_EMPTY;

        return (
            <form className="contract-form">
                <Box type="panel"
                     title={<FormattedMessage id="wholesale.contacts.form.title.asset.information"
                                              defaultMessage="Asset information"/>}>
                    <Row>
                        <Col md={6}>
                            <Field name="makid" component={SelectField}
                                   title={<FormattedMessage id="wholesale.contacts.form.make"
                                                            defaultMessage="Make"/>}
                                   placeholder={this.props.intl.formatMessage(messages.makePlaceholder)}
                                   options={this.props.listMake.data}
                                   isLoading={this.props.listMake.isLoading}
                                   onChange={this.handleMakChange}
                                />

                            <Field name="mmocode" component={SelectField}
                                   title={<FormattedMessage id="wholesale.contacts.form.model"
                                                            defaultMessage="Model"/>}
                                   placeholder={this.props.intl.formatMessage(messages.modelPlaceholder)}
                                   options={this.props.listModel.data}
                                   isLoading={this.props.listModel.isLoading}
                                   onChange={this.handleModelChange}

                                />

                            <Field name="mmtcode" component={SelectField}
                                   title={<FormattedMessage id="wholesale.contacts.form.trim"
                                                            defaultMessage="Trim"/>}
                                   placeholder={this.props.intl.formatMessage(messages.trimPlaceholder)}
                                   options={this.props.listTrim.data}
                                   isLoading={this.props.listTrim.isLoading}
                                />

                            <Field name="irccolor"
                                   component={SelectField}
                                   options={this.props.listColor.data}
                                   title={<FormattedMessage id="wholesale.contacts.form.color"
                                                            defaultMessage="Color"/>}
                                   placeholder={this.props.intl.formatMessage(messages.colorPlaceholder)}
                                />

                            <Field name="iruserialnumber"
                                   component={TextEntry}
                                   title={<FormattedMessage id="wholesale.contacts.form.vin"
                                                            defaultMessage="Vin"/>}
                                />
                        </Col>

                        <Col md={6}>
                            <Field name="napcode" component={SelectField}
                                   title={<FormattedMessage id="wholesale.contacts.form.assettype"
                                                            defaultMessage="Asset type"/>}
                                   placeholder={this.props.intl.formatMessage(messages.typePlaceholder)}
                                   options={this.props.listNap.data}
                                />

                            <Field name="acacode" component={SelectField}
                                   title={<FormattedMessage id="wholesale.contacts.form.assetstate"
                                                            defaultMessage="Asset state"/>}
                                   placeholder={this.props.intl.formatMessage(messages.statePlaceholder)}
                                   options={this.props.listState.data}
                                />

                            <Field name="irimileage"
                                   component={NumberEntry} suffix="km"
                                   title={<FormattedMessage id="wholesale.contacts.form.mileage"
                                                            defaultMessage="Mileage"/>}
                                />

                            <Field
                                name="iriimmat"
                                component={TextEntry}
                                title={<FormattedMessage id="wholesale.contacts.form.registration"
                                                         defaultMessage="Registration"/>}
                                />

                            <Field
                                name="iridtctgrise"
                                component={DateEntry}
                                title={<FormattedMessage id="wholesale.contacts.form.rgdate"
                                                         defaultMessage="Registr. date"/>}
                                />

                        </Col>
                    </Row>
                </Box>
                <Box type='panel' className="financial-detail"
                     title={<FormattedMessage id="wholesale.contacts.form.title.financials"
                                              defaultMessage="Financials detail"/>}>
                    <Row>
                        <Col md={6}>
                            <Field name="dosnum"
                                   component={TextEntry}
                                   title={<FormattedMessage id="wholesale.contacts.form.dosnum"
                                                            defaultMessage="Contract"/>}
                                   disabled={true}
                                />

                            <Field name="dosexternalref"
                                   component={TextEntry}
                                   title={<FormattedMessage id="wholesale.contacts.form.invoice"
                                                            defaultMessage="Invoice"/>}
                                />

                            <Field name="dosmtproduct"
                                   component={CurrencyEntry}
                                   title={<FormattedMessage id="wholesale.contacts.form.amount"
                                                            defaultMessage="Amount"/>}
                                />
                            <Field name="dossiret" component={SelectField}
                                   title={<FormattedMessage id="wholesale.contacts.form.siret"
                                                            defaultMessage="SIRET"/>}
                                   placeholder={this.props.intl.formatMessage(messages.siretPlaceholder)}
                                   options={this.props.listSiret.data}
                                   isLoading={this.props.listSiret.isLoading}
                                />
                        </Col>

                        <Col md={6}>

                            <Field name="dosidtemplate" component={SelectField}
                                   title={<FormattedMessage id="wholesale.contacts.form.scale"
                                                            defaultMessage="Financial scale"/>}
                                   placeholder={this.props.intl.formatMessage(messages.financialScalePlaceholder)}
                                   options={this.props.listScale.data}

                                />

                            <Field
                                name="dosdtdeb"
                                component={DateEntry}
                                title={<FormattedMessage id="wholesale.contacts.form.startdate"
                                                         defaultMessage="Start date"/>}
                                onChange={this.handleDueDateChange}
                                />

                            <Field
                                name="dosdtfin"
                                component={DateEntry}
                                disabled={true}
                                title={<FormattedMessage id="wholesale.contacts.form.enddate"
                                                         defaultMessage="End date"/>}
                                />
                        </Col>
                    </Row>
                </Box>

                <div className="form-action">
                    <button type="submit" className="btn btn-primary" disabled={pristine || submitting}
                            onClick={handleSubmit(this.handleSaveEvent)}>

                        {<FormattedMessage id="wholesale.contacts.form.btn.save"
                                           defaultMessage="Final save"/>}
                    </button>
                    {buttons}
                </div>
            </form>

        )
    }


}

ContractFormContainer = reduxForm({
        form: 'contract',
        validate,
        enableReinitialize: true
    }
)(injectIntl(ContractFormContainer));

const selector = formValueSelector('contract');
const mapStateToProps = (state, routeProps) => {
    var mmtCode = selector(state, 'mmtcode');
    var mmoCode = selector(state, 'mmocode');
    var makId = selector(state, 'makid');
    var acacode = selector(state, 'acacode');

    var parentDosId = parseInt(routeProps.params.dosid);
    return {
        isLoading: state.contracts.isLoading,
        isSettled: state.contracts.isSettled,
        canBeConverted: state.contracts.canBeConverted,
        contract: state.contracts.contract,
        readonly: state.authentication.user.readonly,
        initialValues: state.contracts.contract,
        interest: state.contracts.interest,
        repayment: state.contracts.repayment,
        control: state.contracts.control,
        listScale: getReferenceTable(state, tables.FINANCIALSCALE, {
            'dosid': parentDosId,
            'makid': makId,
            'mmocode': mmoCode,
            'mmtcode': mmtCode
        }),
        listNap: getReferenceTable(state, tables.LANNAP, {'dosid': parentDosId}),
        listState: getReferenceTable(state, tables.LANASSETCATEGORY, {'dosid': parentDosId}),
        listPhase: getReferenceTable(state, tables.LANPHASE, {'phadest': 'DOSSIER'}),
        listMake: getReferenceTable(state, tables.LANMAKE, {'dosid': parentDosId}),
        listModel: getReferenceTable(state, tables.LANMAKEMODEL, {'makid': makId}),
        listColor: getReferenceTable(state, tables.LANTUSPARAM, {'tusnom': 'COLOR'}),
        listTrim: getReferenceTable(state, tables.LANMAKMODTRIMLEVEL, {
            'makid': makId,
            'mmocode': mmoCode
        }),
        listSiret: getReferenceTable(state, tables.SIRET, {'dosid': parentDosId}),
        makId,
        mmoCode,
        mmtCode,
        acacode,
        formValues: selector(state, 'makid', 'mmocode', 'mmtcode',
            'dosmtproduct', 'dosidtemplate', 'dosdtdeb', 'dosid', 'irccolor', 'iruserialnumber')
    }
};
const mapDispatchToProps = {};

export default connect(
    mapStateToProps, mapDispatchToProps
)(ContractFormContainer);