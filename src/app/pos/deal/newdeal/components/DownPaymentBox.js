'use strict'
import React from "react";
import {FormattedMessage} from "react-intl";
import QuoteUtils from "../../utils/QuoteUtils";
import {setDownPaymentMnt} from "./QuoteHelper";
import {Field, Fields} from "redux-form";
import PercentOrCurrencyEntry from "../../../../core/components/lib/PercentOrCurrencyEntry";
import NumberEntry from "../../../../core/components/lib/NumberEntry";
import {Row, Col} from "react-bootstrap";


export default class DownPaymentBox extends React.Component {

    handleDownPaymentChanged = (event, value) => {
        this.props.dispatch(setDownPaymentMnt(this.props.quote, this.props.quoteField, value));
    };

    render() {

        let {currencyCode,quote, quoteField, accessKeys, ...props} = this.props;
        let pfimtdownpayment = QuoteUtils.getDownPaymentMntField(quote, quoteField);
        let pfipctdownpayment = QuoteUtils.getDownPaymentPctField(quote, quoteField);
        return (
            <Row>
                <Col md={6}>
                    <Fields names={[pfimtdownpayment, pfipctdownpayment]}
                            component={PercentOrCurrencyEntry}
                            accessKeys={accessKeys}
                            unleash={true}
                            ref="downpayment"
                            onChange={this.handleDownPaymentChanged}
                            currencyValue={pfimtdownpayment}
                            percentValue={pfipctdownpayment}
                            {...accessKeys[pfimtdownpayment, pfipctdownpayment]}
                            baseValue={QuoteUtils.getAssetCost(quote)}
                            currencyCode={currencyCode}
                            title={<FormattedMessage id="pos.quote.downpaymentbox.amount"
                                                     defaultMessage="Down payment"/>}/>
                </Col>
                <Col md={6}>
                    <Row>
                    <Col md={6}>
                        <Field
                            name={QuoteUtils.getQuoteAttributeFieldValue(quote, quoteField, QuoteUtils.pfacodes.DWPPCTMIN)}
                            prefix="%"
                            component={NumberEntry}
                            {...accessKeys[`${quoteField}.pfimtdeposit`, `${quoteField}.pfipctdeposit`]}

                            title={<FormattedMessage id="pos.deal.downpaymentbox.mindowpayment.title"
                                                     defaultMessage="Min"/>}
                            key="mindowpayment"
                            readOnly="true"/>
                    </Col>
                    <Col md={6}>
                        <Field
                            name={QuoteUtils.getQuoteAttributeFieldValue(quote, quoteField, QuoteUtils.pfacodes.DWPPCTMAX)}
                            prefix="%"
                            key="maxdownpayment"
                            component={NumberEntry}
                            {...accessKeys[QuoteUtils.getQuoteAttributeFieldValue(quote, quoteField, QuoteUtils.pfacodes.DWPPCTMAX)]}
                            title={<FormattedMessage id="pos.deal.downpaymentbox.maxdownpayment.title"
                                                     defaultMessage="Max"/>}
                            readOnly="true"/>
                    </Col>
                    </Row>
                </Col>
            </Row>
        );
    }
}
