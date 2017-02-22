'use strict'
import React from "react";
import {connect} from "react-redux";
import {Field, getFormValues, formValueSelector, change} from "redux-form";
import {tables, getReferenceTable, fetchReferenceTableWithParams} from "../../../../core/reducers/referenceTable";
import {defineMessages, injectIntl, FormattedMessage} from "react-intl";
import {notify} from "../../../../core/components/lib/notify";
import SelectField from "../../../../core/components/lib/SelectField";
import Box from "../../../../core/components/lib/Box";
import CurrencyEntry from "../../../../core/components/lib/CurrencyEntry";
import IntegerEntry from "../../../../core/components/lib/IntegerEntry";
import PaymentsBox from "./PaymentsBox";
import ProfitabilityBox from "./ProfitabilityBox";
import MileageBox from "./MileageBox";
import ResidualValueBox from "./ResidualValueBox";
import FirstPaymentDepositBox from "./FirstPaymentDepositBox";
import FinancialScale from "./FinancialScale";
import DownPaymentBox from "./DownPaymentBox";
import {Row, Col} from "react-bootstrap";
import QuoteUtils, {TYPE_VERSEMENT_DOWNPAYMENTARR, TYPE_VERSEMENT_NORMAL} from "../../utils/QuoteUtils";
import {TPGTYPE, CLIENT, COCLIEN, BORROWER, COBORROWER} from "../../utils/dealUtils";
import ScaleServices from "./ScaleServices";
import CommissionTable from "./CommissionTable";
import {
    computeSchedule,
    computePayment,
    setDprNom,
    changeQuoteIndex,
    setCustomerRolecodes,
    updateCustomerRoles,
    getPossibleFinancialServices
} from "../reducers/actions";
import {changeAssetIndex} from "../../assets/reducers/actions";
import * as sharedConst from "../../../../core/utils/sharedUtils";
import {searchFirstPaymentAndCreateIt, calculateAmoutInclTaxCommission} from "./QuoteHelper";
import MultiCurrencyEntry from "../../../../core/components/lib/MultiCurrencyEntry";


const messages = defineMessages({
    paymentSuccess: {id: "pos.deal.notify.payment.success", defaultMessage: 'Payment is now'},
    paymentError: {id: "pos.deal.notify.payment.error", defaultMessage: 'No payment check your request'},
    quoteproductPlaceholder: {id: "pos.deal.financialquote.product.placeholder", defaultMessage: 'Select a product'},
    quoteunitPlaceholder: {id: "pos.deal.financialquote.unit.placeholder", defaultMessage: 'Select a unit'},
    quotescalePlaceholder: {id: "pos.deal.financialquote.scale.placeholder", defaultMessage: 'Select a scale'}
});
const DEFAULT_EMPTY = [];
class FinancialQuote extends React.Component {

    constructor(props) {
        super(props);
        this.dispatch = props.dispatch;
    }

    componentWillMount() {
        this.props.dispatch(fetchReferenceTableWithParams(tables.CURRENCY, {'tpgcode': this.props.tpgcode}));
        this.dispatch(getPossibleFinancialServices(this.props.quoteIndex));
    }

    componentDidMount() {
        searchFirstPaymentAndCreateIt(this.props.quote);
        this.props.dispatch(calculateAmoutInclTaxCommission(this.props.quote, `${this.currentQuote}`));
    }

    componentWillReceiveProps(nextProps) {

        if (nextProps.quoteIndex === this.props.quoteIndex) {
            this.checkPayment(nextProps.quote, this.props.quote);
        }

        if (nextProps.tpgcode !== this.props.tpgcode) {
            this.props.dispatch(fetchReferenceTableWithParams(tables.CURRENCY, {'tpgcode': nextProps.tpgcode}));
        }
    }


    fieldAsChange(newQuote, quote, accessor, fields, typePayment) {
        var newField = null;
        var field = null;
        if (typePayment) {
            newField = accessor(newQuote, typePayment, fields);
            field = accessor(quote, typePayment, fields);
        } else if (fields) {
            newField = accessor(newQuote, fields);
            field = accessor(quote, fields);
        } else {
            newField = accessor(newQuote);
            field = accessor(quote);
        }
        return newField && newField != field;
    }

    checkPayment(newQuote, quote) {

        let scaleIdHasChanged = this.fieldAsChange(newQuote, quote, QuoteUtils.getScaleId, null, null);
        let scaleOrderHasChanged = this.fieldAsChange(newQuote, quote, QuoteUtils.getScaleOrder, null, null);

        if (scaleIdHasChanged || scaleOrderHasChanged) {
            // Recompute schedule
            this.dispatch(computeSchedule());
            this.dispatch(getPossibleFinancialServices(this.props.quoteIndex));
        }

        let scale = QuoteUtils.getScaleId(newQuote);
        if (!scale) return; // no scale //no compute
        let kmHasChanged = this.fieldAsChange(newQuote, quote, QuoteUtils.getKilometrage);
        let uniteHasChanged = this.fieldAsChange(newQuote, quote, QuoteUtils.getKMUnite);
        let fisrtHasChanged = this.fieldAsChange(newQuote, quote, QuoteUtils.getFirtPayment);

        let rvHasChanged = this.fieldAsChange(newQuote, quote, QuoteUtils.getQuoteElementValue, 'pfrvr');
        let dpHasChanged = this.fieldAsChange(newQuote, quote, QuoteUtils.getQuotePaymentValue, 'pfvmt', TYPE_VERSEMENT_DOWNPAYMENTARR);
        let depositHasChanged = this.fieldAsChange(newQuote, quote, QuoteUtils.getPfimtdeposit);
        let discountHasChanged = this.fieldAsChange(newQuote, quote, QuoteUtils.getQuotePaymentValue, 'pfvmtdiscount', TYPE_VERSEMENT_NORMAL);
        let durationHasChanged = this.fieldAsChange(newQuote, quote, QuoteUtils.getProfile);
        if (kmHasChanged || uniteHasChanged || fisrtHasChanged || rvHasChanged || dpHasChanged || depositHasChanged || discountHasChanged || durationHasChanged) {
            this.dispatch(computePayment(
                (payment) => {
                    notify.show(this.props.intl.formatMessage(messages.paymentSuccess)
                        + this.props.intl.formatNumber(payment, {
                            ...this.props.intl.formats.number.currencyFormat,
                            currency: this.props.currencyCode
                        })

                        , 'success');


                },
                (error) => {
                    notify.show(this.props.intl.formatMessage(messages.paymentError), 'warning');
                }
            ));
        }

    }

    handleScaleChanged = (event) => {
        var value = event.code || event.target.value;
        var values = value.split("_");
        if (values.length == 2) {
            // Change the scale
            var pcrid = parseInt(values[0]);
            var pcrordre = parseInt(values[1]);
            this.dispatch(change(this.props.form, `${this.currentQuote}.pcrid`, pcrid));
            this.dispatch(change(this.props.form, `${this.currentQuote}.pcrordre`, pcrordre));
            if (this.props.quote.dpfordre) {
                this.props.dispatch(computePayment(this.props.quote.dpfordre, this.notifySuccess, this.notifyError));
            }
        }
    }
    handleProductChanged = (value) => {
        this.dispatch(setDprNom(value.label));
        this.dispatch(change(this.props.form, "deal.listdealquote[" + this.props.quoteIndex + "].tpgcode", value.code));

        let roles = DEFAULT_EMPTY;
        if (value.customFields) {
            this.dispatch(change(this.props.form, 'deal.taccode', value.customFields.taccode));
            roles = value.customFields.rolcode === CLIENT ? {
                    customerRolcode: CLIENT,
                    removeCustomerRolcode: BORROWER,
                    coCustomerRolcode: COCLIEN,
                    removeCoCustomerRolcode: COBORROWER
                } : {
                    customerRolcode: BORROWER,
                    removeCustomerRolcode: CLIENT,
                    coCustomerRolcode: COBORROWER,
                    removeCoCustomerRolcode: COCLIEN
                };

            this.dispatch(setCustomerRolecodes(roles.customerRolcode, roles.coCustomerRolcode));
            if (this.props.listActor && this.props.listActor.length == 1) {
                this.props.dispatch(updateCustomerRoles(this.props.form, this.props.listActor, roles.customerRolcode, roles.removeCustomerRolcode));
            }
            else if (this.props.listActor && this.props.listActor.length > 1) {             //updating roles of customers if there's any
                this.props.dispatch(updateCustomerRoles(this.props.form, this.props.listActor, roles.customerRolcode, roles.removeCustomerRolcode));
                this.props.dispatch(updateCustomerRoles(this.props.form, this.props.listActor, roles.coCustomerRolcode, roles.removeCoCustomerRolcode));
            }
        }

    }
    handleCurrencyChanged = (currenCyCode) => {
        this.props.dispatch(change('dealForm', 'deal.devcode', currenCyCode));

    }

    get currentQuote() {
        return 'deal.listdealquote[' + this.props.quoteIndex + ']';
    }


    handleChangeQuote(index) {
        this.dispatch(changeAssetIndex(index));
        this.dispatch(changeQuoteIndex(index));
    }

    render() {
        const {quote, readOnly, accessKeys, dpimttc, listdealquote, tpgcode, currencyCode, rateTaxValue, ...props} = this.props;

        var dpimtht = dpimttc ? (dpimttc / ( 1 + (rateTaxValue / 100))/*1.26582278*/) : undefined;//quote.pfiinvestissement ? (quote.pfiinvestissement / 1.2) : undefined;

        var scalekey = quote.pcrid + "_" + quote.pcrordre;
        let clReadOnly = readOnly ? 'read-only' : '';
        let quoteTab = DEFAULT_EMPTY;


        var scaleServices = DEFAULT_EMPTY;
        var commissionTab = DEFAULT_EMPTY;
        if (quote && quote.listdealquoteservice && quote.listdealquoteservice.length) {

            // ScaleServices properties explanation :
            // rows : to be printed from redux form state // initialSavedServices: to be compared to updated services to set right actionMode
            // possibleServices : services that will be proposed on the popup to check or uncheck // initialPossibleServices : to reset the popup service after change
            scaleServices = (
                <ScaleServices rows={quote.listdealquoteservice} initialSavedServices={this.props.initialSavedServices}
                               possibleServices={this.props.possibleServices}
                               initialPossibleServices={this.props.initialPossibleServices}
                               quoteIndex={this.props.quoteIndex}
                               currencyCode={this.props.currencyCode}
                               tpgcode={this.props.tpgcode}
                               id="pos.deal.financialquote.services.table"
                               dispatch={this.props.dispatch}/>);

        }
        if (quote && quote.listdealquotecommission && quote.listdealquotecommission.length) {
            commissionTab = <CommissionTable rows={quote.listdealquotecommission} {...this.props}
                                             id="pos.deal.financialquote.commission.table"
                                             accessKeys={accessKeys}/>;
        }

        if (listdealquote.length > 0) {
            let tabs = listdealquote.map((quote, index) => {
                let cl = this.props.quoteIndex === index && listdealquote.length > 0 ? "btn btn-primary" : "btn";
                if (sharedConst.ACTION_MODE_DELETION !== quote.actionMode) {
                    return <button className={cl} type="button"
                                   onClick={() => this.handleChangeQuote(index)}>{1 + index}</button>;
                }

            });

            quoteTab = (<div className="asset-tab">
                    {tabs}
                </div>
            )
        }

        const dealAttribute = this.props.values.listdealattribute ? this.props.values.listdealattribute.find(item => item.datcode === TPGTYPE) : {};
        const tpgtype = dealAttribute ? dealAttribute.datstringdata : '';
        const assetusage = this.props.values.dprassetusage;

        return (
            <div className={"financialQuote " + clReadOnly}>
                <label><FormattedMessage id="pos.quote.listquote"/></label>
                {quoteTab}
                <Box type="primary"
                     title={<FormattedMessage id="pos.deal.financialquote.title" defaultMessage="Financial data"/>}
                     withBoder="true">
                    <div className="row">

                        <div className="col-md-6">
                            <MultiCurrencyEntry
                                title={<FormattedMessage id="pos.deal.financialquote.amount.title"
                                                         defaultMessage="Amount"/>}
                                value={dpimtht} key="amount"
                                currencyCode={currencyCode}
                                onCurrencyChange={this.handleCurrencyChanged}
                                currenciesList={this.props.currenciesList}
                                tpgcode={tpgcode}
                                readOnly="false"/>
                        </div>
                        <div className="col-md-6">
                            <CurrencyEntry value={dpimttc} currencyCode={currencyCode}
                                           title={<FormattedMessage id="pos.deal.financialquote.amounttc.title"
                                                                    defaultMessage="Amount (tax incl.)"/>}
                                           key="amountTaxIncl"
                                           readOnly="true"/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <Field name="deal.tpgcode" component={SelectField} currencyCode={currencyCode}
                                   title={<FormattedMessage id="pos.deal.financialquote.product.title"
                                                            defaultMessage="Financial product"/>}
                                   options={tables.TPROFILGESTION}
                                   refParams={{tpgflagfacility: +this.props.isMF, tpgtype, assetusage}}
                                   key="quote-financialProduct-field"
                                   allowEmptyParams={true}
                                   onChange={this.handleProductChanged}
                                   placeholder={this.props.intl.formatMessage(messages.quoteproductPlaceholder)}/>
                        </div>
                    </div>

                    <DownPaymentBox quoteField={this.currentQuote} {...this.props}  />
                    <FirstPaymentDepositBox quoteField={this.currentQuote} {...this.props}  />


                    <Row>
                        <Col md={6}>
                            <Field name={`${this.currentQuote}.pfinbperiodes`} component={IntegerEntry}
                                   currencyCode={currencyCode}
                                   title={<FormattedMessage id="pos.deal.financialquote.duration.title"
                                                            defaultMessage="Duration"/>} key="periodsCount"
                            />


                        </Col>

                        <Col md={6}>
                            <FinancialScale value={scalekey}
                                            title={<FormattedMessage id="pos.deal.financialquote.scale.title"
                                                                     defaultMessage="Scale"/>} key="scale"
                                            placeholder={this.props.intl.formatMessage(messages.quotescalePlaceholder)}
                                            taccode={this.props.values.taccode}
                                            tpgcode={this.props.values.tpgcode}
                                            devcode={this.props.values.devcode}
                                            pfiinvestissement={this.props.quote.pfiinvestissement}
                                            onChange={this.handleScaleChanged}/>

                        </Col>
                    </Row>

                    <ResidualValueBox quoteField={this.currentQuote} {...this.props} />
                    <MileageBox quoteField={this.currentQuote} {...this.props} />
                    <PaymentsBox quoteField={this.currentQuote} {...this.props}/>
                    <ProfitabilityBox quoteField={this.currentQuote} {...this.props} />
                </Box>

                {scaleServices}
                {commissionTab}

            </div>
        )
    }
}

const selector = formValueSelector('dealForm');
const mapStateToProps = (state, props) => {
    const isMF = state.newdeal.isMF;
    const quoteIndex = state.newdeal.quoteIndex;
    const quote = selector(state, 'deal.listdealquote[' + quoteIndex + ']');
    const asset = selector(state, 'deal.listdealasset[' + quoteIndex + ']');
    var deal = getFormValues(props.form)(state).deal;
    var listActor = getFormValues(props.form)(state).listActor;
    var tpgcode = deal.tpgcode;
    return {
        dealLoading: state.newdeal.dealLoading,
        listdealattribute: selector(state, 'deal.listdealattribute'),
        quoteIndex, tpgcode,
        currencyCode: deal.devcode,
        quote: quote,
        readOnly: state.newdeal.readOnly,
        rateTaxValue: state.newdeal.rateTaxValue ? state.newdeal.rateTaxValue : 0.0,
        dpimttc: asset ? asset.dpmmtttc : {},//,dealUtils.getTotalAssetAmounttc(deal),
        values: deal, //get tpg and others avoid to bind the deal
        isMF,
        listdealquote: selector(state, 'deal.listdealquote'),
        customerRolcode: state.newdeal.customerRolcode,
        coCustomerRolcode: state.newdeal.coCustomerRolcode,
        listActor,
        currenciesList: getReferenceTable(state, tables.CURRENCY, {'tpgcode': tpgcode}).data,
        possibleServices: state.newdeal.possibleServices,
        initialPossibleServices: state.newdeal.initialPossibleServices,
        initialSavedServices: state.newdeal.formValues.deal.listdealquote[quoteIndex]?
            state.newdeal.formValues.deal.listdealquote[quoteIndex].listdealquoteservice : []
    }
};


export default connect(
    mapStateToProps
)(injectIntl(FinancialQuote));
