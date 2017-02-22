'use strict'
import React from 'react'
import classNames from 'classnames';
import {FormattedMessage} from 'react-intl';
import {FormGroup, ControlLabel, HelpBlock} from 'react-bootstrap';


//only used with redux form
export default class TextEntry extends React.Component {

    constructor(props) {
        super(props);
        this.state = ({focused: false, value: props.value || ""});
    }

    handleFocus = (event) => {
        this.setState({focused: true});

        if (this.props.input && this.props.input.onFocus) {
            //this.props.input.onFocus(event);
        }
    };

    handleBlur = (event) => {
        this.setState({focused: false});

        let UOC = this.props.updateOnChange;

        if (!UOC && this.props.onChange) {
            this.props.onChange(event, event.target.value);
        }

        if (this.props.input) {
            if (this.props.input.onBlur)
                this.props.input.onBlur(event);
            if (!UOC && this.props.input.onChange)
                this.props.input.onChange(event);
        }
    };

    handleChange = (event) => {
        const value = event.target.value;
        this.setState({value});
        if (this.props.updateOnChange && this.props.onChange)
            this.props.onChange(event, value);
        if (this.props.input)
            this.props.input.onChange(event);
    }
    handleKeyPress = (event) => {
        if(this.props.updateOnEnter===true){
            var charCode = (typeof event.which == "number") ? event.which : event.keyCode;
            if(charCode == 13  ){ // on Enter pressed
                this.props.onChange(event, event.target.value);
            }
        }
    }
    render() {
        let {input, title, placeholder, disabled, type, hidden, accessKey, ...props}  = this.props;
        if (hidden || (accessKey && accessKey.hidden)) {
            return false;
        }
        let vs = {
            'error': input && props.meta.touched && props.meta.error
        };
        let gc = {
            'form-group': title,
            'focused': this.state.focused || (this.props.input && this.props.input.value)
        }

        if (props.groupClassName) {
            gc[props.groupClassName] = true;
        }
        let controlLabel = title ? <ControlLabel>{title}</ControlLabel> : null;
        return (
            <FormGroup bsClass={classNames(gc)} validationState={classNames(vs) || undefined}>
                {controlLabel}
                <input value={this.state.value} className={"form-control "} {...input} type={type || "text"}
                       disabled={disabled || (accessKey && accessKey.disabled)}
                       placeholder={placeholder} onBlur={this.handleBlur} onChange={this.handleChange}
                       onFocus={this.handleFocus}
                       onKeyPress={this.handleKeyPress}/>
                {(props.meta && props.meta.touched && props.meta.error &&
                <HelpBlock >{<FormattedMessage {...props.meta.error}/>}</HelpBlock>)}

            </FormGroup>
        )
    }
}
