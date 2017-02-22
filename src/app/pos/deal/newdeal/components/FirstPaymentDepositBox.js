'use strict'
import React from "react";
import {FormattedMessage} from "react-intl";
import {Field, Fields} from "redux-form";
import PercentOrCurrencyEntry from "../../../../core/components/lib/PercentOrCurrencyEntry";
import {Row, Col} from "react-bootstrap";
import CurrencyEntry from "../../../../core/components/lib/CurrencyEntry";
import {depositMntChanged} from "./QuoteHelper";
import QuoteUtils from "../../utils/QuoteUtils";

export default class PaymentsBox extends React.Component {

    handleDepositChanged = (event, value) => {
        this.props.dispatch(depositMntChanged(this.props.quote, this.props.quoteField, value));
    };

    render() {

        let {currencyCode,quote, quoteField, accessKeys,rateTaxValue, ...props} = this.props;

        var premierloyerht = quote.pfimtpremierloyer ? (quote.pfimtpremierloyer / (1+ (rateTaxValue/100))) : undefined;


        return (
            <Row>
                <Col md={6}>
                    <Row>
                        <Col md={6}>
                            <CurrencyEntry value={premierloyerht} id="firstPayment" key="firstPayment"
                                           readOnly="true" currencyCode={currencyCode}
                                           {...accessKeys[`${quoteField}.pfimtpremierloyer`]}
                                           title={<FormattedMessage id="pos.deal.financialquote.firstpay.title"
                                                                    defaultMessage="First payment Excl(Tax)"/>}/>

                        </Col>
                        <Col md={6}>
                            <Field name={`${quoteField}.pfimtpremierloyer`} component={CurrencyEntry}
                                   prefix="%" key="firstPaymentTI"
                                   title={<FormattedMessage id="pos.deal.financialquote.firstpayincltax.title"
                                                            defaultMessage="Incl(Tax)"/>}
                                   {...accessKeys[`${quoteField}.pfimtpremierloyer`]}/>
                        </Col>
                    </Row>
                </Col>
                <Col md={6}>
                    <Fields names={[`${quoteField}.pfimtdeposit`, `${quoteField}.pfipctdeposit`]}
                            component={PercentOrCurrencyEntry} ref="deposit"
                            currencyCode={currencyCode}
                            unleash={true}
                            currencyValue={`${quoteField}.pfimtdeposit`}
                            percentValue={`${quoteField}.pfipctdeposit`}
                            onChange={this.handleDepositChanged}
                            baseValue={QuoteUtils.getAssetCost(quote)}
                            {...accessKeys[`${quoteField}.pfimtdeposit`, `${quoteField}.pfipctdeposit`]}
                            title={<FormattedMessage id="pos.deal.financialquote.deposit.title"
                                                     defaultMessage="Deposit"/>}/>
                </Col>

            </Row>
        );
    }
}
