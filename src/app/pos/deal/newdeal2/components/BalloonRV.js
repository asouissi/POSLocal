'use strict'
import React from "react";
import {FormattedMessage} from "react-intl";
import DealBox from "./DealBox";
import DateEntry from "../../../../core/components/lib/DateEntry";
import PercentOrCurrencyEntry from "../../../../core/components/lib/PercentOrCurrencyEntry";
import {setBalloonMnt} from "../reducers/dealQuote";
import QuoteUtils from "../../utils/QuoteUtils";
import {parseFloatOrEmpty} from "../../../../core/utils/Utils";
import {Field, Fields} from "redux-form";

export default class BalloonRV extends React.Component {

    handleBalloonChanged = (event, value) => {
        this.props.dispatch(setBalloonMnt(this.props.quote, this.props.quoteField, parseFloatOrEmpty(value)));
    };

    render() {
        let {quote, quoteField, readOnly, accessKeys, ...props} = this.props;

        var balloon = QuoteUtils.getBalloonMntField(quoteField);
        var balloonPct = QuoteUtils.getBalloonPctField(quoteField);
        var balloonRVDate = QuoteUtils.getBalloonRVDateField(quote, quoteField);
        let assetCost = QuoteUtils.getAssetCost(quote);

        return (<DealBox title={<FormattedMessage id="pos.quote.ballon.title" defaultMessage="Balloon/RV"/>}
                         readOnly={readOnly}>
                <Fields names={[balloon, balloonPct]} component={PercentOrCurrencyEntry}
                        accessKeys={accessKeys} currencyCode={this.props.currencyCode}
                        ref="balloon"
                        onChange={this.handleBalloonChanged}
                        baseValue={assetCost}
                        currencyValue={balloon}
                        percentValue={balloonPct}
                        title={<FormattedMessage id="pos.quote.ballon.amount" defaultMessage="Amount"/>}/>

                <Field name={balloonRVDate} component={DateEntry}
                       {...accessKeys[balloonRVDate]}
                       title={<FormattedMessage id="pos.quote.ballon.date" defaultMessage="Date"/>}
                />
            </DealBox>
        )
    }
}
