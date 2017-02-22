import React, {Component} from "react";
import Select from "react-select";
import {FormGroup, ControlLabel, HelpBlock} from "react-bootstrap";
import classNames from "classnames";
import {FormattedMessage} from "react-intl";

import ReferenceTableComponent from "./ReferenceTableComponent"
//only used with redux form
class SelectField extends Component {

    handleBlur = () => {
        this.props.input && this.props.input.onBlur(this.props.input.value)
    };

    handleChange = (value) => {
        this.props.input && this.props.input.onChange(value ? value.code : null);
        const onValueChange = this.props.onChange;
        onValueChange && onValueChange(value);
    };


    componentDidUpdate(prevProps) {
        let {options, input, autoSelect, ...props} = this.props;
        const value = input ? input.value : props.value;
        if (!value && options && options.length && options !== prevProps.options && (options.length === 1 || autoSelect)) {
            this.handleChange(options[0]); //auto select if there is only one value
        }
    }

    render() {

        const input2 = this.props.input || {};
        let {onChange, onBlur, onFocus, ...input} = input2;
        let {title, options, placeholder, isLoading, disabled, hidden, accessKey,...props} = this.props;
        if (hidden || (accessKey && accessKey.hidden)) {
            return false;
        }
        var cl = {
            'error': input &&  props.meta && props.meta.touched && props.meta.error
            //'warning': input && props.meta.touched && props.meta.error
        };

        let gc = {
            'form-group': true,
        }

        if (props.groupClassName) {
            gc[props.groupClassName] = true;
        }

        if(input.value)
         input.value = input.value.toString();
        var vs = classNames(cl) || undefined;
        return (
            <FormGroup validationState={vs} bsClass={classNames(gc)}>
                <ControlLabel>
                    {title}
                </ControlLabel>
                <Select value={props.value} {...input}
                        options={options}
                        disabled={disabled || (accessKey && accessKey.disabled) || (!isLoading && (!options || !options.length))}
                        placeholder={placeholder}
                        isLoading={isLoading}
                        className='form-control'
                        onBlur={this.handleBlur}
                        onChange={this.handleChange}
                        clearable={!!this.props.clearable}
                        valueKey="code"
                        labelKey={this.props.labelKey||"label"}/>
                {(props.meta && props.meta.touched && props.meta.error &&
                <HelpBlock >{<FormattedMessage {...props.meta.error}/>}</HelpBlock>)}

            </FormGroup>
        )
    }
};

export default ReferenceTableComponent(SelectField)