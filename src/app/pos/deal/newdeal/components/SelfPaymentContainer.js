/**
 * Created by PrashantK on 16-12-2016.
 */

'use strict'
import React from "react";
import {Row, Col} from "react-bootstrap";
import {connect} from "react-redux";
import {injectIntl, FormattedMessage} from "react-intl";
import {formValueSelector, Field,arrayPush} from "redux-form";
import Box from "../../../../core/components/lib/Box";
import TextEntry from "../../../../core/components/lib/TextEntry";
import DateEntry from "../../../../core/components/lib/DateEntry";
import SelectField from "../../../../core/components/lib/SelectField";
import {tables, getReferenceTable, fetchReferenceTableWithParams} from "../../../../core/reducers/referenceTable";
import {changeVal} from "../reducers/actions";
import QuoteUtils, {TYPE_VERSEMENT_NORMAL} from "../../utils/QuoteUtils";

const SELF_PAYMENT_PFACODE = 'DTFIRSTPAYMENT';
class SelfPayment extends React.Component {

    componentWillMount() {
        if (this.props.listdealquote && this.props.listdealquote.length > 0) {
            let listAttribute = this.props.listdealquote[0].listdealquoteattribute;
            let value = listAttribute && (listAttribute).find(item => item.pfacode == SELF_PAYMENT_PFACODE);
            if (!value) {
                this.props.dispatch(arrayPush(this.props.form, 'deal.listdealquote[0].listdealquoteattribute', {pfacode: SELF_PAYMENT_PFACODE}))
            }
        }
    }

    componentDidMount() {
        this.props.dispatch(fetchReferenceTableWithParams(tables.LANTUSPARAM, {
            tusnom: 'PAYMENTDAYPOS',
            tpgcode: this.props.tpgcode
        }));
    }
    get currentAsset() {
        return 'deal.listdealasset[' + this.props.assetIndex + ']';
    }

    get currentQuote() {
        return 'deal.listdealquote[' + this.props.quoteIndex + ']';
    }



    render() {
        let {accessKeys, listPaymentDayPos, ...props} = this.props;


        let refTusnom = listPaymentDayPos && listPaymentDayPos.length > 0 ? 'PAYMENTDAYPOS' : 'PAYMENTDAY';
        let quote = this.props.listdealquote[this.props.quoteIndex];
        return (
            <div className="self-payment-form">
                <Box type="primary" title={<FormattedMessage id="pos.deal.selfpayment.title"
                                                             defaultMessage="Self payment"/>} withBoder="true">

                    <Row>
                        <Col md={6}>
                            <Field name={`${this.currentAsset}.dpmnumserie`} component={TextEntry}
                                   title={<FormattedMessage id="pos.deal.selfpayment.vinumber"
                                                            defaultMessage="VIN number"/>}
                                   {...accessKeys[`${this.currentAsset}.dpmnumserie`]}/>
                        </Col>
                        <Col md={6}>
                            <Field
                                name={QuoteUtils.getQuoteAttributeFieldValue(quote, `${this.currentQuote}`, QuoteUtils.pfacodes.DTFIRSTPAYMENT)}
                                component={SelectField}
                                title={<FormattedMessage id="pos.deal.selfpayment.paymentday"
                                                            defaultMessage="Payment day"/>}
                                placeholder=""
                                refTable={tables.LANTUSPARAM}
                                refParams={{tusnom: refTusnom, tpgcode: this.props.tpgcode}}
                                clearable={true}
                                {...accessKeys[QuoteUtils.getQuoteAttributeFieldValue(quote, `${this.currentQuote}`, QuoteUtils.pfacodes.DTFIRSTPAYMENT)]}/>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6}>
                            <Field name={`${this.currentAsset}.dpmimmatriculation`} component={TextEntry}
                                   title={<FormattedMessage id="pos.deal.selfpayment.registrationnumber"
                                                            defaultMessage="Registration number"/>}
                                   {...accessKeys[`${this.currentAsset}.dpmimmatriculation`]}/>
                        </Col>
                        <Col md={6}>
                            <Field name={`${this.currentAsset}.dpmdtrelease`} component={DateEntry}
                                   title={<FormattedMessage id="pos.deal.selfpayment.deliverydate"
                                                            defaultMessage="Delivery date"/>}
                                   {...accessKeys[`${this.currentAsset}.dpmdtrelease`]}/>
                        </Col>
                    </Row>
                </Box>
            </div>
        )
    }
}

const mapStateToProps = (state, props) => {
    const selector = formValueSelector(props.form);
    return {
        assetIndex: state.newdeal.assetIndex,
        quoteIndex: state.newdeal.quoteIndex,
        // tpgcode: selector(state, 'deal.tpgcode'),
        deal: selector(state, 'deal'),
        listdealquote: selector(state, 'deal.listdealquote'),
        listPaymentDayPos: getReferenceTable(state, tables.LANTUSPARAM, {
            tusnom: 'PAYMENTDAYPOS',
            tpgcode: props.tpgcode
        }).data
    }
}

export default connect(
    mapStateToProps
)(injectIntl(SelfPayment));