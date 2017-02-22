'use strict'
import React from "react";
import {FormattedMessage} from "react-intl";
import {Row, Col} from "react-bootstrap";
import QuoteUtils from "../../utils/QuoteUtils";
import {setResidualValue} from "./QuoteHelper";
import {Field, Fields} from "redux-form";
import PercentOrCurrencyEntry from "../../../../core/components/lib/PercentOrCurrencyEntry";
import NumberEntry from "../../../../core/components/lib/NumberEntry";


export default class ResidualValueBox extends React.Component {

    handleResidualValueChanged = (event, value) => {
        this.props.dispatch(setResidualValue(this.props.quote, this.props.quoteField, value));
    };

    render() {

        let {currencyCode,quote, quoteField, readOnly, accessKeys, ...props} = this.props;
        return (

            <Row>
                <Col md={6}>
                    <Fields
                        names={[`${quoteField}.listdealquoteelement[0].pfrvr`, `${quoteField}.listdealquoteelement[0].pfrpctvr`]}
                        component={PercentOrCurrencyEntry}
                        ref="residualvalue"
                        unleash={true}
                        onChange={this.handleResidualValueChanged}
                        currencyValue={`${quoteField}.listdealquoteelement[0].pfrvr`}
                        currencyCode={currencyCode}
                        percentValue={`${quoteField}.listdealquoteelement[0].pfrpctvr`}
                        baseValue={QuoteUtils.getAssetCost(quote)}
                        {...accessKeys[`${quoteField}.listdealquoteelement[0].pfrvr`, `${quoteField}.listdealquoteelement[0].pfrpctvr`]}
                        title={<FormattedMessage id="pos.quote.residualvaluebox.rv" defaultMessage="Residual value"/>}/>
                </Col>
                <Col md={6}>
                    <Row   >
                        <Col md={6}>
                            <Field
                                name={QuoteUtils.getQuoteAttributeFieldValue(quote, quoteField, QuoteUtils.pfacodes.PCTRVMIN)}
                                component={NumberEntry}
                                prefix="%"
                                {...accessKeys[QuoteUtils.getQuoteAttributeFieldValue(quote, quoteField, QuoteUtils.pfacodes.PCTRVMIN)]}
                                title={<FormattedMessage id="pos.deal.residualvaluebox.minresidualvalue.title"
                                                         defaultMessage="Min"/>}
                                key="minresidualvalue"
                                readOnly="true"/>
                        </Col>
                        <Col md={6}>
                            <Field
                                name={QuoteUtils.getQuoteAttributeFieldValue(quote, quoteField, QuoteUtils.pfacodes.PCTRVMAX)}
                                component={NumberEntry}
                                {...accessKeys[QuoteUtils.getQuoteAttributeFieldValue(quote, quoteField, QuoteUtils.pfacodes.PCTRVMAX)]}
                                prefix="%"
                                key="maxresidualvalue"
                                title={<FormattedMessage id="pos.deal.residualvaluebox.maxresidualvalue.title"
                                                         defaultMessage="Max"/>}
                                readOnly="true"/>
                        </Col>
                    </Row>
                </Col>
            </Row>
        );
    }
}
