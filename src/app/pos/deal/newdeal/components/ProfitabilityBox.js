'use strict'
import React from "react";
import {FormattedMessage} from "react-intl";
import QuoteUtils from "../../utils/QuoteUtils";
import {Field} from "redux-form";
import NumberEntry from "../../../../core/components/lib/NumberEntry";
import {Row, Col} from "react-bootstrap";


export default class PtofitabilityBox extends React.Component {
    render() {

        let {quote, quoteField, readOnly, accessKeys, ...props} = this.props;

        return (
            <Row>
                <Col md={6}>
                    <Row>
                        <Col md={6}>
                            <Field name={`${quoteField}.listdealquoteelement[0].pfrtotalnominal`}
                                   component={NumberEntry}
                                   prefix="%"
                                   {...accessKeys[`${quoteField}.listdealquoteelement[0].pfrtotalnominal`]}
                                   title={<FormattedMessage id="pos.deal.financialquote.stdrate.title"
                                                            defaultMessage="Standard rate"/>} key="standardRate"
                                   readOnly="true"/>
                        </Col>
                        <Col md={6}>
                            <Field
                                name={QuoteUtils.getQuoteAttributeFieldValue(quote, quoteField, QuoteUtils.pfacodes.TAEG)}
                                prefix="%"
                                title={<FormattedMessage id="pos.deal.financialquote.taeg.title"
                                                         defaultMessage="TAEG"/>}
                                key="taeg" component={NumberEntry}
                                {...accessKeys[QuoteUtils.getQuoteAttributeFieldValue(quote, quoteField, QuoteUtils.pfacodes.TAEG)]}
                                readOnly="true"/>
                        </Col>
                    </Row>
                </Col>

                <Col md={6}>
                    <Row>
                        <Col md={6}>
                            <Field name={QuoteUtils.getMargin(quote)}
                                   component={NumberEntry}
                                   prefix="%"
                                   title={<FormattedMessage id="pos.deal.financialquote.margin.title"
                                                            defaultMessage="Margin"/>}
                                   {...accessKeys[QuoteUtils.getMargin(quote)]}
                                   key="margin"
                                   readOnly="true"/>
                        </Col>
                        <Col md={6}>
                            <Field name={`${quoteField}.listdealquotepayment[0].pfvpctdiscount`}
                                   component={NumberEntry}
                                   prefix="%"
                                   key="other"
                                   title={<FormattedMessage id="pos.deal.financialquote.other.title"
                                                            defaultMessage="Other"/>}
                                   {...accessKeys[`${quoteField}.listdealquotepayment[0].pfvpctdiscount`]}
                                   readOnly="true"/>
                        </Col>
                    </Row>
                </Col>
            </Row>
        );
    }
}
