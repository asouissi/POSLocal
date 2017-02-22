'use strict'
import React, {Component, PropTypes} from "react";
import classNames from "classnames";
import isNumber from "lodash/isNumber";
import {FormGroup, ControlLabel, HelpBlock} from 'react-bootstrap';
import {FormattedMessage} from "react-intl";

const EMPTY_STRING = "";

export default class NumberEntry extends Component {

    constructor(props) {
        super(...arguments);

        var value = props.value || props.input && props.input.value;
        var input = "";
        // if (typeof(value) === "number") {
        input = String(value);
        // }

        this.state = {value: value, input: input, focus: false};
    }

    componentWillReceiveProps(nextProps) {
        var value = nextProps.value || nextProps.input && nextProps.input.value;

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

        if (this.props.onChange) {
            this.props.onChange(event, value);
        }

        if (this.props.input && this.props.input.onBlur) {
            this.props.input.onBlur(event);
        }
    };

    handleChange = (event) => {
        var value = event.target.value;

        if (!value) {
            this.setState({value: null, input: value});
            return;
        }

        var v = parseFloat(value.replace(/\s/g, ''));
        if (isNaN(v)) {
            this.setState({value: null, input: value, error: true});
            return;
        }

        this.setState({value: v, input: value, error: false});

        if (this.props.input && this.props.input.onChange) {
            // this.props.input.onChange(value);
        }
    };

    getNumberOfDigitAfterDecimal() {
        var d = this.props.numberOfDigitAfterDecimal;
        if (typeof(d) === "string") {
            d = parseInt(d, 10);
        }
        if (typeof(d) === "number") {
            return d;
        }
        return 2;
    }

    getClassName() {
        return "number-entry";
    }

    isReadOnly() {
        return false;
    }

    getNumber() {
        return this.state.number;
    }

    focus() {
        this.refs.input.focus();
    }

    render() {
        var state = this.state;
        var {disabled, hidden, accessKey, ...props}  = this.props;

        if (hidden || (accessKey && accessKey.hidden)){
            return false;
        }

        var groupClassNames = {
            'form-group': true,
            'has-error': state.error,
            'has-warning': state.warning,
            'has-success': state.success,
            'has-loading': state.loading,
            'has-focus': state.focus
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

        if (v === "NaN") v = EMPTY_STRING;
        var input = <input type="text"
                           id={props.id}
                           ref="input"
                           tabIndex={props.tabIndex}
                           disabled={disabled || (accessKey && accessKey.disabled)}
            //pattern={pattern}
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

        if (!props.title) {
            return input;
        }
        var stateError = {
            'error': (props.meta && props.meta.touched && props.meta.error) || state.error
        };
        return (
            <FormGroup bsClass={classNames(groupClassNames)} validationState={classNames(stateError)|| undefined}>
                <ControlLabel>
                    {props.title}
                </ControlLabel>
                {input}
                {(props.meta && props.meta.touched && props.meta.error &&
                <HelpBlock >{<FormattedMessage {...props.meta.error}/>}</HelpBlock>)}
                {props.children}
            </FormGroup>
        );
    }

    decorateInput(input) {
        var props = this.props;
        var prefix = this.state.prefix || props.prefix;
        var suffix = this.state.suffix || props.suffix;

        if (!prefix && !suffix) {
            return input;
        }

        var prefixSpan = undefined;
        if (prefix) {
            if (this.props.prefixButton) {
                prefixSpan = (
                    <span className="input-group-addon input-group-addon-but">{this.props.prefixButton}</span>);

            } else {
                prefixSpan = (<span className="input-group-addon">{prefix}</span>);
            }
        }

        var suffixSpan = undefined;
        if (suffix) {
            if (this.props.suffixButton) {
                suffixSpan = (
                    <span className="input-group-addon input-group-addon-but">{this.props.suffixButton}</span>);
            } else {
                suffixSpan = (<span className="input-group-addon">{suffix}</span>);
            }
        }

        var cl = {
            "input-group": true
        };
        if (!props.title && props.groupClassName) {
            cl[props.groupClassName] = true;
        }

        return (<div className={classNames(cl)}>
                {prefixSpan}
                {input}
                {suffixSpan}
            </div>
        );

        return input;
    }
}
NumberEntry.contextTypes = {
    intl: PropTypes.object.isRequired,
}

//export default injectIntl(NumberEntry, {withRef: true});
