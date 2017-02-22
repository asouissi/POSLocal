import React, {Component} from "react";
import {connect} from "react-redux";
import {notify} from "../../../../core/components/lib/notify";
import {injectIntl, defineMessages, FormattedMessage} from "react-intl";
import {Field, getFormValues, formValueSelector, change} from "redux-form";
import BalloonRV from "./BalloonRV";
import CostAnalysis from "./CostAnalysis";
import Profitability from "./Profitability";
import FeesAndCharges from "./FeesAndCharges";
import PaymentProfile from "./PaymentProfile";
import TargetOptions from "./TargetOptions";
import ScheduledPaymentProfilePopup from "./ScheduledPaymentProfilePopup";
import SubsidyPopup from "./SubsidyPopup";
import MultiCurrencyEntry from "../../../../core/components/lib/MultiCurrencyEntry";
import {promoteToDeal, actionDone} from "../reducers/newdeal2";
import {addQuote, changeQuote, setAssetCost, computePayment, setQuoteType} from "../reducers/dealQuote";
import dealUtils from "../../utils/dealUtils";
import QuoteUtils from "../../utils/QuoteUtils";
import {parseFloatOrEmpty} from "../../../../core/utils/Utils";
import {tables, getReferenceTable, fetchReferenceTableWithParams} from "../../../../core/reducers/referenceTable";


const DEFAULT_EMPTY = [];

const messages = defineMessages({
    paymentSuccess: {id: "pos.quote.notify.payment.success", defaultMessage: 'Payment is now'},
    submit: {id: "pos.quote.notify.promote.success", defaultMessage: 'Quote submitted'},
    addQuoteTitle: {id: "pos.quote.financialquote.btn.addquote.title", defaultMessage: 'Add quote'},
    amortizationFail: {
        id: "pos.quote.notify.amortization.fail",
        defaultMessage: 'The sum of the amortizations is different than start basis minus end basis'
    }
});


class FinancialQuote2 extends Component {

    componentWillMount() {
        this.props.dispatch(fetchReferenceTableWithParams(tables.CURRENCY,{'tpgcode': this.props.tpgcode}));
    }


    componentWillReceiveProps(nextProps) {
        if (this.props.dealLoading) {
            return;
        }
        if (nextProps.quoteIndex === this.props.quoteIndex) {
            this.checkPayment(nextProps.quote, this.props.quote);
        }
        if (nextProps.tpgcode!== this.props.tpgcode) {
            this.props.dispatch(fetchReferenceTableWithParams(tables.CURRENCY,{'tpgcode': nextProps.tpgcode}));
        }
    }

    fieldAsChange(newQuote, quote, accessor) {
        var newField = accessor(newQuote);
        var field = accessor(quote);
        return newField != field;
    }

    checkPayment(newquote, quote) {
        let acChanged = this.fieldAsChange(newquote, quote, QuoteUtils.getAssetCost);
        let depositChanged = this.fieldAsChange(newquote, quote, QuoteUtils.getDepositMnt);
        let termChanged = this.fieldAsChange(newquote, quote, QuoteUtils.getTerm);
        let profileChanged = this.fieldAsChange(newquote, quote, QuoteUtils.getProfile);
        let cofChanged = this.fieldAsChange(newquote, quote, QuoteUtils.getCostOfFunds);
        let marginChanged = this.fieldAsChange(newquote, quote, QuoteUtils.getMargin);
        let productChanged = this.fieldAsChange(newquote, quote, QuoteUtils.getFinanceType);


        if (acChanged || depositChanged || termChanged || profileChanged || cofChanged || marginChanged || productChanged) {
            if (newquote.dpfordre) {
                this.props.dispatch(computePayment(newquote.dpfordre, this.notifySuccess, this.notifyError));
            }
        }
    }

    notifySuccess = (payment) => {
        notify.show(this.props.intl.formatMessage(messages.paymentSuccess)
            + " "
            + this.props.intl.formatNumber(payment, { ...this.props.intl.formats.number.currencyFormat,
                         currency: this.props.currencyCode})
            , 'success');
    };

    notifyError = () => {
        notify.show(this.props.intl.formatMessage(messages.amortizationFail));
    };

    handlePromoteDeal = (event) => {
        this.props.dispatch(promoteToDeal());
    }

    handleNewQuote = () => {
        this.props.dispatch(addQuote());
    }

    handleChangeQuote(index) {
        const {dispatch} = this.props;
        dispatch(changeQuote(index));
    }

    handleCurrencyChanged = (currenCyCode) => {
        this.props.dispatch(change('dealQuote', 'devcode', currenCyCode));

    }

    handleCostChanged = (event) => {
        this.props.dispatch(setAssetCost(this.props.quote, 'dealQuote', this.quoteField, event.target.value == "" ? 0 : parseFloatOrEmpty(event.target.value)));
    }

    changeQuoteType(newQuoteType) {
        this.props.dispatch(setQuoteType(this.props.quote, 'dealQuote', this.quoteField, newQuoteType));
    }

    handleDoneAction = () => {
        this.props.dispatch(actionDone());
    }


    get quoteField() {
        return 'listdealquote[' + this.props.quoteIndex + ']';
    }

    render() {
        const {currencyCode, quote, startDate, startDateField, currentPhase, readOnly, promoted, listdealquote, intl, isDisabled, tpgcode, ...props} = this.props;
        const {formatMessage} = intl;

        let quoteType = QuoteUtils.getQuoteType(quote);

        // var depositPopup = (<DepositPopup ref="depositPopup" quote={quote} quoteField={this.quoteField}
        //                                   dispatch={this.props.dispatch}/>);

        var scheduledPaymentProfilePopup = (
            <ScheduledPaymentProfilePopup ref="scheduledPaymentProfilePopup" quote={quote} quoteField={this.quoteField}
                                          startDate={startDate} currencyCode={currencyCode}
                                          dispatch={this.props.dispatch}/>);
        var subsidyPopup = (<SubsidyPopup ref="subsidyPopup" quote={quote} quoteField={this.quoteField}
                                          dispatch={this.props.dispatch} currencyCode={currencyCode}/>);


        var promoteButton = DEFAULT_EMPTY;
        if (currentPhase === 'NEGO' && !promoted) {
            promoteButton = <button className="btn btn-primary" type="button" disabled={isDisabled || readOnly}
                                    onClick={this.handlePromoteDeal}>
                <FormattedMessage id="pos.quote.btn.promote" defaultMessage="Promote to deal"/>
            </button>;
        }


        let clReadOnly = readOnly ? 'read-only' : '';

        let quoteTab = DEFAULT_EMPTY;

        if (listdealquote.length > 0) {
            let tabs = listdealquote.map((quote, index) => {
                let cl = this.props.quoteIndex === index && listdealquote.length > 1 ? "btn btn-primary btn-quote-index" : "btn btn-default";
                return <button className={cl} type="button"
                               onClick={() => this.handleChangeQuote(index)}>{1 + index}</button>;
            });

            quoteTab = (<div className="quote-tab">
                    {tabs}
                    <button className="btn btn-primary fa fa-plus" type="button" disabled={readOnly}
                            onClick={this.handleNewQuote} title={formatMessage(messages.addQuoteTitle)}>
                    </button>
                </div>
            )
        }

        return (
            <div className="financialQuote2">
                {scheduledPaymentProfilePopup}
                {subsidyPopup}

                <div className="row">
                    <div className="col-md-4">
                        <Field name={`${this.quoteField}.pfiinvestissement`} component={MultiCurrencyEntry}
                               readOnly={readOnly}
                               title={<FormattedMessage id="pos.quote.assetcost" defaultMessage="Asset cost"/>}
                               currencyCode={currencyCode}
                               onCurrencyChange={this.handleCurrencyChanged}
                               currenciesList={this.props.currenciesList}
                               tpgcode={tpgcode}
                               onChange={this.handleCostChanged}/>
                    </div>


                    <div className="col-md-4">
                        <div className={"from-group " + clReadOnly}>
                            <label className="control-label" style={{visibility: 'hidden'}}>X</label>

                        </div>
                    </div>
                    <div className="col-md-4">
                        <FormattedMessage id="pos.quote.listquote" defaultMessage="Quote" tagName="label"/>
                        {quoteTab}
                        <div className="btn-promote-to-deal">
                            {promoteButton}
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-4">
                        <TargetOptions quoteField={this.quoteField} {...this.props}/>
                    </div>
                    <div className="col-md-4">
                        <CostAnalysis quoteField={this.quoteField} {...this.props} />
                    </div>
                    <div className="col-md-4">
                        <Profitability quoteField={this.quoteField} {...this.props} popup={this.refs}/>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-4">
                        <PaymentProfile startDateField={startDateField} {...this.props}
                                        quoteField={this.quoteField} popup={this.refs}/>
                    </div>
                    <div className="col-md-4">
                        <BalloonRV quoteField={this.quoteField} {...this.props}/>
                    </div>
                    <div className="col-md-4">
                        <FeesAndCharges quoteField={this.quoteField} {...this.props}/>
                    </div>
                </div>
            </div>);
    }
}

const selector = formValueSelector('dealQuote');
const mapStateToProps = (state, props) => {
    const quote = 'listdealquote[' + state.newdeal2.quoteIndex + ']';
    const deal = getFormValues('dealQuote')(state);
    var tpgcode = selector(state, "tpgcode");
    return {
        currencyCode: selector(state, "devcode"),
        tpgcode,
        dealLoading: state.newdeal2.dealLoading,
        quote: selector(state, quote),
        devcode: selector(state, 'devcode'),
        quoteIndex: state.newdeal2.quoteIndex,
        listdealquote: selector(state, 'listdealquote'),
        readOnly: state.newdeal2.readOnly,
        startDate: dealUtils.getStartDate(deal),
        startDateField: dealUtils.getStartDateField(deal),
        currentPhase: dealUtils.getCurrentPhaseCode(deal),
        promoted: dealUtils.isPromoted(deal),
        action: state.newdeal2.action,
        currentJalcode: selector(state, 'jalcode'),
        isDisabled: Boolean(state.authentication.user.restrictedaccess),
        currenciesList: getReferenceTable(state, tables.CURRENCY, {'tpgcode': tpgcode}).data,
        durprofileList  : getReferenceTable(state, tables.LANTUSPARAM, {'tusnom': 'DURPROFIL'}).data

    }
};


export default connect(
    mapStateToProps
)(injectIntl(FinancialQuote2));
