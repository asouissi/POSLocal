'use strict'
import React from 'react'
import DealBox from './DealBox'
import {Field, Fields} from 'redux-form'

import PercentOrCurrencyEntry from '../../../../core/components/lib/PercentOrCurrencyEntry'
import NumberEntry from '../../../../core/components/lib/NumberEntry'

import {setCommissionPct, setCommissionMnt, setSubsidyPct, setSubsidyMnt, setCostOfFunds} from '../reducers/dealQuote'
import QuoteUtils from '../../utils/QuoteUtils'
import {parseFloatOrEmpty} from '../../../../core/utils/Utils'
import {FormattedMessage} from 'react-intl'

export default class Profitability extends React.Component {
    constructor(props) {
        super(props);
    }

    handleCommissionChanged = (event, value) => {

        this.props.dispatch(setCommissionMnt(this.props.quote, this.props.quoteField, parseFloatOrEmpty(value)));

    }

    handleSubsidyChanged = (event, value) => {

        this.props.dispatch(setSubsidyMnt(this.props.quote, this.props.quoteField, parseFloatOrEmpty(value)));

    }

    handleCofChanged = (event, value) => {
        this.props.dispatch(setCostOfFunds(this.props.quote, this.props.quoteField, parseFloatOrEmpty(value)));
    }

    handleButtonClick = () => {
        this.props.popup.subsidyPopup.toggle();
    }

    render() {
        let {quote, quoteField, readOnly, accessKeys, currencyCode, ...props} = this.props;

        var commissionMnt = QuoteUtils.getCommissionMntField(quote, quoteField);
        var commissionPct = QuoteUtils.getCommissionPctField(quote, quoteField);
        var subsidyMnt = QuoteUtils.getSubsidyMntField(quote, quoteField);
        var subsidyPct = QuoteUtils.getSubsidyPctField(quote, quoteField);
        var costOfFunds = QuoteUtils.getCostOfFundsField(quote, quoteField);
        var popupComplete = QuoteUtils.getDealerSubsidyMnt(quote) && QuoteUtils.getManSubsidyMnt(quote);
        let netAdvanceValue = QuoteUtils.getNetAdvanceMnt(quote);

        let hasPopup = !(accessKeys[subsidyMnt] && accessKeys[subsidyMnt].hidden && accessKeys[subsidyPct] && accessKeys[subsidyPct].hidden);

        return (
            <DealBox title={<FormattedMessage id="pos.quote.profitability.title" defaultMessage="Profitability"/>}
                     onButtonClick={this.handleButtonClick}
                     complete={popupComplete}
                     hasPopup={hasPopup}
                     readOnly={readOnly}>

            <Fields names={[commissionMnt, commissionPct]} component={PercentOrCurrencyEntry} ref="commission"
                                    accessKeys={accessKeys}
                                    currencyValue={commissionMnt}
                                    currencyCode={currencyCode}percentValue={commissionPct}
                        baseValue={netAdvanceValue}            title={<FormattedMessage id="pos.quote.profitability.commission" defaultMessage="Commission" />}
                                    onChange={this.handleCommissionChanged}/>

                <Fields names={[subsidyMnt, subsidyPct]} component={PercentOrCurrencyEntry} ref="subsidy"
                        {...accessKeys[subsidyMnt]}
                        currencyValue={subsidyMnt}
                        currencyCode={currencyCode}percentValue={subsidyPct}
                        baseValue={netAdvanceValue}
                        title={<FormattedMessage id="pos.quote.profitability.subsidy" defaultMessage="Subsidy"/>}
                        onChange={this.handleSubsidyChanged}/>

                <Field component={NumberEntry}
                       {...accessKeys[costOfFunds]}
                       prefix="%"
                       title={<FormattedMessage id="pos.quote.profitability.costoffunds"
                                                defaultMessage="Cost of funds"/>}
                       name={costOfFunds}
                       onChange={this.handleCofChanged}/>
            </DealBox>)
    }
}
