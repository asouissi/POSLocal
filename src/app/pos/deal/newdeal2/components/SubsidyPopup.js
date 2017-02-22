'use strict'
import React from 'react'
import {connect} from 'react-redux'

import Modal from '../../../../core/components/lib/Modal.js'
import PercentOrCurrencyEntry from '../../../../core/components/lib/PercentOrCurrencyEntry.js'

import {setSubSubsidy} from '../reducers/dealQuote'
import QuoteUtils from '../../utils/QuoteUtils'
import {FormattedMessage} from 'react-intl';

export default class SubsidyPopup extends React.Component {

    toggle() {
        this.refs.modal.toggle();

        setTimeout(() => {
            this.refs.dealer.refs.currency.getRenderedComponent().focus();
        }, 200);
    }

    handleChange = () => {

        this.props.dispatch(
            setSubSubsidy(this.props.quote, this.props.quoteField,
                parseFloat(this.refs.dealer.refs.currency.getRenderedComponent().state.value),
                parseFloat(this.refs.manufacturer.refs.currency.getRenderedComponent().state.value)
            ));
    }

    handleResetEvent = () => {
        this.props.dispatch(setSubSubsidy(this.props.quote, this.props.quoteField, 0, 0));
    }

    handleClose = () => {
    }

    render() {
        var {quote, quoteField, currencyCode, ...props} = this.props;

        var dealerMnt = QuoteUtils.getDealerSubsidyMntField(quote, quoteField);
        var dealerPct = QuoteUtils.getDealerSubsidyPctField(quote, quoteField);
        var manMnt = QuoteUtils.getManSubsidyMntField(quote, quoteField);
        var manPct = QuoteUtils.getManSubsidyPctField(quote, quoteField);
        let assetCost = QuoteUtils.getAssetCost(quote);

        return (
            <Modal title={<FormattedMessage id="pos.quote.subsidy.title" defaultMessage="Subsidy"/>} ref="modal"
                   onReset={this.handleResetEvent} onClose={this.handleClose}>
                <PercentOrCurrencyEntry onChange={this.handleChange}
                                        currencyCode={currencyCode}
                                        title={<FormattedMessage id="pos.quote.subsidy.dealer.title"
                                                                 defaultMessage="Dealer subsidy"/>}
                                        ref="dealer"
                                        currencyValue={dealerMnt}
                                        percentValue={dealerPct}
                                        baseValue={assetCost}
                />

                <PercentOrCurrencyEntry onChange={this.handleChange}
                                        currencyCode={currencyCode}
                                        title={<FormattedMessage id="pos.quote.subsidy.manufact.title"
                                                                 defaultMessage="Manufacturer subsidy"/>}
                                        ref="manufacturer"
                                        currencyValue={manMnt}
                                        percentValue={manPct}
                                        baseValue={assetCost}
                />
            </Modal>
        );
    }
}
