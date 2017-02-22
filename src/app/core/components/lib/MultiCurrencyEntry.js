import React, {Component, PropTypes} from "react";
import CurrencyEntry from "./CurrencyEntry";
import {MenuItem, DropdownButton} from "react-bootstrap";
import classNames from "classnames";
const DEFAULT_EMPTY = [];

export default  class MultiCurrencyEntry extends Component {


    symbList = () => {

        //here i use asMutable from seammless because currenciesLitst should not be mutated by sort
        return this.props.currenciesList.asMutable().sort((a, b) => {
            if(a.code < b.code) return -1
            if(a.code > b.code) return 1
            return 0

        }).map((currency) => {

            var sybItem = this.context.intl.formatNumber(0, {
                ...this.context.intl.formats.number.currencyFormat,
                currency: currency.code
            }).replace(/[0-9]|[,. ]/g, '').trim();

            let label =  currency.code
            if(sybItem && sybItem !== currency.code) {
                label +=  " - " + sybItem
            }
            return (
                <MenuItem eventKey={currency.code} onSelect={this.handleSelect}>
                    {label}
                </MenuItem>
            )

        });
    }

    handleSelect = (selectedKey) => {
        this.props.onCurrencyChange(selectedKey);
    }


    render() {
        let {currenciesList, onCurrencyChange, tpgcode, ...props} = this.props;

        var spanCurrency = DEFAULT_EMPTY;


        var symbol = this.context.intl.formatNumber(0, {
            ...this.context.intl.formats.number.currencyFormat,
            currency: this.props.currencyCode
        }).replace(/[0-9]|[,. ]/g, '').trim();

        var ccls = {
            btn: true,
            "btn-primary": false,
            "btn-unchecked": true
        }


        if (currenciesList && currenciesList.length > 1) {

            spanCurrency = (
                <DropdownButton title={symbol || this.props.currencyCode} disabled={false} className={classNames(ccls)}
                                id={`split-button-basic-primary-currency`}>
                    {this.symbList()}
                </DropdownButton >
            );

            props = {...props, prefixButton: spanCurrency}

        }

        return (
            <CurrencyEntry title={this.props.title} {...props}/>
        )
    }
};

MultiCurrencyEntry.contextTypes = {
    intl: PropTypes.object.isRequired,
}

