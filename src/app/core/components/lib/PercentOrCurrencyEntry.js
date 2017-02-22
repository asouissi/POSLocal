'use strict'
import React, {Component, PropTypes} from "react";
import CurrencyEntry from "./CurrencyEntry";
import NumberEntry from "./NumberEntry";
import classNames from "classnames";
import {Field} from "redux-form";
import {FormattedMessage} from "react-intl";
import {FormGroup, ControlLabel, HelpBlock, Button, Row, Col} from "react-bootstrap";
import getIn from "redux-form/lib/structure/plain/getIn";


export default class PercentOrCurrencyEntry extends Component {
    constructor(props) {
        super(...arguments);

        this.state = {percentSelected: false};
    }

    isReadOnly() {
        return false;
    }

    isPercentSelected() {
        return this.state && !!this.state.percentSelected;
    }

    isCurrencySelected() {
        return !this.percentSelected;
    }

    get currencyField() {
        return this.refs.currency && this.refs.currency.getRenderedComponent();
    }

    get percentField() {
        return this.refs.percent && this.refs.percent.getRenderedComponent();
    }

    handleCurrencyClick(event) {
        this.setState({percentSelected: false});
        event.preventDefault();
        event.stopPropagation();

        setTimeout(() => {
            this.currencyField.focus();
        }, 100);
    }

    handlePercentClick(event) {
        this.setState({percentSelected: true});
        event.preventDefault();
        event.stopPropagation();

        setTimeout(() => {
            this.percentField.focus();
        }, 100);
    }

    render() {
        var readOnly = this.isReadOnly() || this.props.readOnly === "true" || this.props.readOnly === true;
        var props = this.props;
        var state = this.state;

        var {disabled, hidden, accessKeys, currencyValue, percentValue, currencyCode, ...props}  = this.props;
        accessKeys = accessKeys || {};

        const currencyAccessKey = accessKeys[currencyValue];
        const percentAccessKey = accessKeys[percentValue];
        if (hidden || (accessKeys
            && currencyAccessKey && currencyAccessKey.hidden
            && percentAccessKey && percentAccessKey.hidden)) {
            return false;
        }

        var groupClassNames = {
            'form-group': true,

        };
        if (props.groupClassName) {
            groupClassNames[props.groupClassName] = true;
        }

        var cl = {
            percentOrCurrency: true,
            "percentOrCurrency-readOnly": readOnly,
            "leash" : !props.unleash
        }
        if (state.percentSelected) {
            cl.percentSelected = true;
        } else {
            cl.currencySeected = true;
        }

        var ccls = {
            btn: true,
            "btn-primary": !state.percentSelected,
            "btn-unchecked": state.percentSelected
        }

        var pcls = {
            btn: true,
            "btn-primary": state.percentSelected,
            "btn-unchecked": !state.percentSelected
        }

        let currency = this.context.intl.formatNumber(0,
            {...this.context.intl.formats.number.currencyFormat,
                currency: currencyCode || this.context.intl.formats.number.currencyFormat.currency
            }).replace(/[0-9]|[,. ]/g, '').trim();

        var currencyButton = (<button disabled={readOnly} className={classNames(ccls)}
                                      onClick={event => this.handleCurrencyClick(event)}>{currency}</button>);
        var percentButton = (
            <button disabled={readOnly} className={classNames(pcls)} onClick={event => this.handlePercentClick(event)}>
                %</button>);

        var input = (
            <div className={classNames(cl)}>
                <Row>
                    <Field component={CurrencyEntry} groupClassName="currency col-lg-7 col-md-12" ref="currency" withRef
                           name={currencyValue}
                           {...currencyAccessKey}
                           currencyCode={currencyCode}
                           prefixButton={currencyButton}
                           readOnly={readOnly || state.percentSelected}
                           onChange={props.onChange}
                    />
                    <Field component={NumberEntry} groupClassName="percent col-lg-5 col-md-12" ref="percent" withRef
                           name={percentValue}
                           {...percentAccessKey}
                           prefix="%"
                           prefixButton={percentButton}
                           numberOfDigitAfterDecimal="2"
                           readOnly={readOnly || !state.percentSelected}
                           onChange={(e, v) => props.onChange(e, (v * props.baseValue) / 100)}
                    />
                </Row>
            </div>
        );

        if(props.unleash){
            input = (
                <div className={classNames(cl)}>
                    <Row>
                        <Col md={6}>
                        <Field component={CurrencyEntry} groupClassName="currency" ref="currency" withRef
                               name={currencyValue}
                               {...currencyAccessKey}

                               prefixButton={currencyButton}
                               readOnly={readOnly || state.percentSelected}
                               onChange={props.onChange}
                        />
                        </Col>
                        <Col md={6}>

                        <Field component={NumberEntry} groupClassName="percent" ref="percent" withRef
                               name={percentValue}
                               {...percentAccessKey}
                               prefix="%"
                               prefixButton={percentButton}
                               numberOfDigitAfterDecimal="2"
                               onChange={(e, v) => props.onChange(e, (v * props.baseValue) / 100)}
                               readOnly={readOnly || !state.percentSelected}/>
                        </Col>
                    </Row>
                </div>
            );
        }

        if (!props.title) {
            return input;
        }

        let fieldError = false;
        let helpBlock = null;
        if (this.props.names) {

            const currencyField = getIn(props, currencyValue) || {};
            let currencyMeta = currencyField.meta;
            const percentField = getIn(props, percentValue) || {};
            let percentMeta = percentField.meta;
            const currInError = currencyMeta && currencyMeta.touched && currencyMeta.error;
            const percentInError = percentMeta && percentMeta.touched && percentMeta.error;
            fieldError = (currInError) || (percentInError)

            if (fieldError) {
                helpBlock = (
                    <HelpBlock >
                        {currInError && <FormattedMessage {...currencyMeta.error}/>} <br/>
                        {percentInError && <FormattedMessage {...percentMeta.error}/>}
                    </HelpBlock>
                )
            }

        }
        var stateError = {
            'error': fieldError || state.error
        };

        return (
            <FormGroup bsClass={classNames(groupClassNames)} validationState={classNames(stateError)}>
                <ControlLabel>
                    {props.title}
                </ControlLabel>

                {input}
                {helpBlock}
                {props.children}
            </FormGroup>
        );
    }
}

PercentOrCurrencyEntry.contextTypes = {
    intl: PropTypes.object.isRequired,
}


