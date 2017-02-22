'use strict'
import React from "react";
import DealBox from "./DealBox";
import PercentOrCurrencyEntry from "../../../../core/components/lib/PercentOrCurrencyEntry";
import {setDepositPct, setDepositMnt, setVATPct, setVATMnt} from "../reducers/dealQuote";
import QuoteUtils from "../../utils/QuoteUtils";
import {parseFloatOrEmpty} from "../../../../core/utils/Utils";
import {FormattedMessage} from "react-intl";
import {Fields, Field} from "redux-form";
import SelectField from '../../../../core/components/lib/SelectField';
import {tables} from "../../../../core/reducers/referenceTable";
import DepositPopup from './DepositPopup';


export default class CostAnalysis extends React.Component {

    handleButtonClick = () => {
        this.refs.depositPopup.toggle();
    };

    handleDepositChanged = (event, value) => {
        this.props.dispatch(setDepositMnt(this.props.quote, this.props.quoteField, value));
    };

    handleVATChanged = (event, value) => {
        this.props.dispatch(setVATMnt(this.props.quote, this.props.quoteField, parseFloatOrEmpty(value)));
    };

    render() {

        let {currencyCode, quote, quoteField, readOnly, accessKeys, ...props} = this.props;

        var netAdvanceMnt = QuoteUtils.getNetAdvanceMntField(quote, quoteField);
        var netAdvancePct = QuoteUtils.getNetAdvancePctField(quote, quoteField);
        var dealPaymentMnt = QuoteUtils.getDepositMntField(quote, quoteField);
        var dealPaymentPct = QuoteUtils.getDepositPctField(quote, quoteField);
        var vat = QuoteUtils.getVATMntField(quote, quoteField);
        var vatPct = QuoteUtils.getVATPctField(quote, quoteField);
        let assetCost = QuoteUtils.getAssetCost(quote);

        var depositPopup = (<DepositPopup id="pos.quote.costanalysis.popup" ref="depositPopup" quote={quote} quoteField={this.quoteField}
                                          dispatch={this.props.dispatch} currencyCode={currencyCode}/>);

        const accessKeyPopup = accessKeys['pos.quote.costanalysis.popup'];
        let hasPopup = accessKeyPopup && accessKeyPopup.hidden ? !accessKeyPopup.hidden : true;
        return (
            <DealBox title={<FormattedMessage id="pos.quote.costanalysis.title" defaultMessage="Cost analysis"/>}
                     onButtonClick={this.handleButtonClick}
                     hasPopup={hasPopup} popupId="pos.quote.costanalysis.popup" readOnly={readOnly}>
                {depositPopup}
                <Fields names={[dealPaymentMnt, dealPaymentPct]} component={PercentOrCurrencyEntry} ref="deposit"
                        accessKeys={accessKeys}
                        currencyCode={currencyCode}
                        currencyValue={dealPaymentMnt}
                        baseValue={assetCost}
                        percentValue={dealPaymentPct}
                        onChange={this.handleDepositChanged}
                        title={<FormattedMessage id="pos.quote.costanalysis.deposit" defaultMessage="Deposit"/>}/>

                <Fields names={[netAdvanceMnt, netAdvancePct]} component={PercentOrCurrencyEntry} ref="netAdvance"
                        accessKeys={accessKeys}
                        currencyCode={currencyCode}
                        currencyValue={netAdvanceMnt}
                        baseValue={assetCost}
                        percentValue={netAdvancePct}
                        title={<FormattedMessage id="pos.quote.costanalysis.netadvance" defaultMessage="Net advance"/>}
                        readOnly="true"/>

                <Field name="taxcode"
                       title={<FormattedMessage id="pos.quote.costanalysis.vat" defaultMessage="VAT"/>}
                       component={SelectField}
                       options={tables.LANTAXE}
                />
            </DealBox>
        );
    }
}