'use strict'
import React from "react";
import {FormattedMessage} from "react-intl";
import {Field, Fields} from "redux-form";
import PercentOrCurrencyEntry from "../../../../core/components/lib/PercentOrCurrencyEntry";
import {Row, Col} from "react-bootstrap";
import CurrencyEntry from "../../../../core/components/lib/CurrencyEntry";
import {setDiscountMnt} from "./QuoteHelper";
import QuoteUtils,{TYPE_VERSEMENT_NORMAL} from "../../utils/QuoteUtils";

export default class PaymentsBox extends React.Component {

    handleDiscountChanged = (event, value) => {
        this.props.dispatch(setDiscountMnt(this.props.quote, this.props.quoteField, value));
    };


    render() {

        let {currencyCode,quote, quoteField, accessKeys, rateTaxValue, ...props} = this.props;

        var pfvmtdiscount = quoteField + QuoteUtils.getQuotePaymentField(quote, TYPE_VERSEMENT_NORMAL) + '.pfvmtdiscount';
        var pfvpctdiscount = quoteField + QuoteUtils.getQuotePaymentField(quote, TYPE_VERSEMENT_NORMAL) + '.pfvpctdiscount';
        var pmttc =  QuoteUtils.getPaymentMnt(quote);
        var pfrmtloyerhtValue = pmttc ? (pmttc / ( 1 + (rateTaxValue/100))) : undefined;

        return (
            <Row>
                <Col md={6}>
                    <Fields
                        names={[pfvmtdiscount, pfvpctdiscount]}
                        component={PercentOrCurrencyEntry} ref="deposit"
                        currencyCode={currencyCode}
                        {...accessKeys[pfvmtdiscount, pfvpctdiscount]}
                        unleash={true}
                        currencyValue={pfvmtdiscount}
                        percentValue={pfvpctdiscount}
                        onChange={this.handleDiscountChanged}
                        baseValue={QuoteUtils.getAssetCost(quote)}
                        title={<FormattedMessage id="pos.deal.financialquote.discount.title"
                                                 defaultMessage="Discount"/>}/>
                </Col>
                <Col md={6}>
                    <Row>
                        <Col md={6}>
                            <CurrencyEntry value={pfrmtloyerhtValue} id="payment" key="payment"
                                           onChange={event => this.handleEntryChanged(event)}
                                           currencyCode={currencyCode}
                                           readOnly="true"
                                           {...accessKeys[`${quoteField}.listdealquoteelement[0].pfrmtloyer`]}
                                           title={<FormattedMessage id="pos.deal.financialquote.pay.title"
                                                                    defaultMessage="Payment Excl(Tax)"/>}>
                            </CurrencyEntry>
                        </Col>
                        <Col md={6}>
                            <Field name={`${quoteField}.listdealquoteelement[0].pfrmtloyer`} key="paymentTI"
                                           onChange={event => this.handleEntryChanged(event)}
                                           currencyCode={currencyCode}
                                           readOnly="true"
                                            component={CurrencyEntry}
                                           title={<FormattedMessage id="pos.deal.financialquote.payit.title"
                                                                    defaultMessage="Incl(Tax)"/>}
                                            {...accessKeys[`${quoteField}.listdealquoteelement[0].pfrmtloyer`]}/>

                        </Col>

                    </Row>
                </Col>
            </Row>
        );
    }
}
