import React, {Component, PropTypes} from "react";
import classNames from "classnames";
import {FormattedMessage} from "react-intl";
import {FormGroup, ControlLabel, HelpBlock, InputGroup} from "react-bootstrap";
import isNumber from "lodash/isNumber";


const EMPTY_STRING = "";

export default  class CurrencyEntry extends Component {
    constructor(props) {
        super(...arguments);

        this.state = {};
        var value = props.value || props.input && props.input.value;
        var input = "";
        // if (typeof(value) === "number") {
        input = String(value);
        // }

        this.state = {value: value, input: input, focus: false};

        // let symbol = this.context.intl.formatNumber(0, this.context.intl.formats.number.currencyFormat).replace(/[0-9]|[,. ]/g, '').trim();
        // if (props.currencyPosition !== "right") {
        //     this.state.prefix = symbol;
        //
        // } else {
        //     this.state.suffix = symbol;
        // }
    }

    getNumberOfDigitAfterDecimal() {
        return this.props.numberOfDigitAfterDecimal || 2;
    }

    getClassName() {
        return "currency-entry";
    }


    componentWillReceiveProps(nextProps, nextContext) {
        var value = nextProps.input ? nextProps.input.value : nextProps.value;

        let state = {value: value};

        // if (typeof(value) === "number") {
        state.input = String(value);
        // }

        this.setState(state)
    }

    handleFocus = (event) => {
        this.setState({focus: true});
        if (this.props.input && this.props.input.onFocus) {
            //this.props.input.onFocus(event);
        }
    };

    handleBlur = (event) => {
        this.setState({focus: false});
        // Component value has changed, fire onChange callback


        if (event.target.value && event.target.value === this.state.value) {
            return;
        }
        var value = event.target.value == "" ? 0 : parseFloat(event.target.value);

        if (this.props.onChange && value !== NaN && value >= 0) {
            this.props.onChange(event, value);
        }

        if (this.props.input && this.props.input.onBlur) {
            this.props.input.onBlur(event);
        }
    };

    handleChange = (event) => {
        var value = event.target.value;
        if (!value) {
            this.setState({value: null, input: value, error: this.props.required});
            return;
        }

        var v = parseFloat(value.replace(/\s/g, ''));
        if (isNaN(v) || v < 0) {
            this.setState({value: null, input: value, error: true});
            return;
        }

        this.setState({value: v, input: value, error: false});

    };


    isReadOnly() {
        return false;
    }

    getNumber() {
        return this.state.number;
    }

    focus = () => {
        this.refs.input.focus();
    }

    render() {
        var state = this.state;
        var {disabled, hidden, accessKey, ...props}  = this.props;

        if (hidden || (accessKey && accessKey.hidden)){
            return false;
        }

        if (props.visible === false) {
            return false;
        }

        var groupClassNames = {
            'form-group': true,

        };
        if (props.groupClassName) {
            groupClassNames[props.groupClassName] = true;
        }

        var inputClassNames = {
            'read-only': props.readOnly,
            'form-control': true
        };
        if (props.inputClassName) {
            inputClassNames[props.inputClassName] = true;
        }
        var mcl = this.getClassName();
        if (mcl) {
            inputClassNames[mcl] = true;
        }

        var readOnly = this.isReadOnly() || props.readOnly === "true" || props.readOnly === true;

        let {formatNumber} = this.context.intl;
        var v;
        if (!readOnly && (state.focus || state.error)) {
            v = state.input
        } else if (state.value != null && state.value != "" && isNumber(parseInt(state.value))) {
            v = formatNumber(state.value, {minimumFractionDigits: this.getNumberOfDigitAfterDecimal()});
        } else {
            v = state.value;
        }
        if (v === "NaN" || v === "undefined") v = EMPTY_STRING;
        var externalHandlers = {};

        var input = <input type="text"
                           id={props.id}
                           ref="input"
                           tabIndex={props.tabIndex}
                           disabled={disabled || (accessKey && accessKey.disabled)}
                           autoComplete="off"
                           inputMode="numeric"
                           className={classNames(inputClassNames)}
                           readOnly={readOnly}
                           value={v}
                           onChange={this.handleChange}
                           onBlur={this.handleBlur}
                           onFocus={this.handleFocus}
        />;

        input = this.decorateInput(input);

        let helpBlock = null;
        if(props.meta && props.meta.touched && props.meta.error){
            helpBlock = (<HelpBlock >{<FormattedMessage {...props.meta.error}/>}</HelpBlock>)
        }

        if (!props.title) {
            return input;
        }

        var stateError = {
            'error': (props.meta && props.meta.touched && props.meta.error) || state.error
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

    decorateInput(input) {
        let {prefix, prefixButton, suffixButton, suffix, currencyCode, ...props} = this.props;

        let currency = currencyCode || this.context.intl.formats.number.currencyFormat.currency;
        let symbol = this.context.intl.formatNumber(0, {...this.context.intl.formats.number.currencyFormat, currency : currency}).replace(/[0-9]|[,. ]/g, '').trim();

        var prefixSpan = undefined;
        if (prefix || !suffix) {
            if (prefixButton) {
                prefixSpan = (
                    <InputGroup.Button>{prefixButton}</InputGroup.Button>);

            } else {
                prefixSpan = (<InputGroup.Addon>{prefix || symbol}</InputGroup.Addon>);
            }
        }


        var suffixSpan = undefined;
        if (suffix) {
            if (suffixButton) {
                suffixSpan = (
                    <InputGroup.Button>{suffixButton}</InputGroup.Button>);
            } else {
                suffixSpan = (<InputGroup.Addon className="input-group-addon">{suffix || symbol}</InputGroup.Addon>);
            }
        }

        var cl = {
            "input-group": true
        };
        if (!props.title && props.groupClassName) {
            cl[props.groupClassName] = true;
        }

        return (
            <InputGroup bsClass={classNames(cl)}>
                {prefixSpan}
                {input}
                {suffixSpan}
            </InputGroup>
        );

        return input;
    }


}

CurrencyEntry.contextTypes = {
    intl: PropTypes.object.isRequired,
}
