'use strict'
import React from "react";
import {FormattedMessage} from "react-intl";
import DealBox from "./DealBox";
import PercentOrCurrencyEntry from "../../../../core/components/lib/PercentOrCurrencyEntry";
import {setDocumentationFeePct, setDocumentationFeeMnt, setOptionFeePct, setOptionFeeMnt} from "../reducers/dealQuote";
import QuoteUtils from "../../utils/QuoteUtils";
import {parseFloatOrEmpty} from "../../../../core/utils/Utils";
import {Fields} from "redux-form"

export default class FeesAndCharges extends React.Component {

    handleDocumentationFeeChanged = (event, value) => {
        this.props.dispatch(setDocumentationFeeMnt(this.props.quote, this.props.quoteField, parseFloatOrEmpty(value)));
    }

    handleOptionFeeChanged = (event, value) => {
        this.props.dispatch(setOptionFeeMnt(this.props.quote, this.props.quoteField, parseFloatOrEmpty(value)));
    }

    render() {

        let {quote, quoteField, readOnly, accessKeys, currencyCode, ...props} = this.props;

        let dpfpmtreverse = QuoteUtils.getDocumentationFeeMntField(quote, quoteField);
        let dpfppct = QuoteUtils.getDocumentationFeePctField(quote, quoteField);
        let opfpmtreverse = QuoteUtils.getOptionFeeMntField(quote, quoteField);
        let opfppct = QuoteUtils.getOptionFeePctField(quote, quoteField);
        let assetCost = QuoteUtils.getAssetCost(quote);

        return (
            <DealBox title={<FormattedMessage id="pos.quote.fees.title" defaultMessage="Fees & charges"/>}
                     readOnly={readOnly}>
                <Fields names={[dpfpmtreverse, dpfppct]} component={PercentOrCurrencyEntry} ref="documentationFee"
                        accessKeys={accessKeys}
                        currencyCode={currencyCode}
                        currencyValue={dpfpmtreverse}
                        percentValue={dpfppct}
                        baseValue={assetCost}
                        currency="£"
                        title={<FormattedMessage id="pos.quote.fees.docfee" defaultMessage="Documentation fee"/>}
                        onChange={this.handleDocumentationFeeChanged}/>

                <Fields names={[opfpmtreverse, opfppct]} component={PercentOrCurrencyEntry} ref="optionFee"
                        accessKeys={accessKeys}
                        currencyCode={currencyCode}
                        currencyValue={opfpmtreverse}
                        percentValue={opfppct}
                        baseValue={assetCost}
                        currency="£"
                        title={<FormattedMessage id="pos.quote.fees.otpion" defaultMessage="Option fee"/>}
                        hidden={quote.tpgcode !== 'HPFI'}
                        onChange={this.handleOptionFeeChanged}/>
            </DealBox>
        )
    }
}
