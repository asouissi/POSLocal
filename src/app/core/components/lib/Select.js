'use strict'
import React from 'react'
import {FormattedMessage} from 'react-intl';

import AjaxComponent from './AjaxComponent'
import classNames from 'classnames';
import Select from 'react-select';
import {FormGroup, ControlLabel, HelpBlock} from 'react-bootstrap';

const errorOption = (<option key="#error" className="option-errored" value="ERROR" disabled="true">Error !</option>);
const loadOption = (<option key="#loading" className="option-loading" value="LOADING" disabled="true">Loading ...</option>);

const EMPTY_VALUE= "null";

export default class Select2 extends AjaxComponent {

    constructor(props) {
        super(props);
    }

    renderChildren (data, nextData) {
        if(nextData !== data){
            var placeholder = this.props.placeholder;
            let options = (<option key="#select" className="option-select" value={EMPTY_VALUE} disabled="true"
                                    >{placeholder}</option>);
            return this.listOptionsFromData(options, nextData);
        }
        return this.state.children;
    }

    handleBlur = () => {
        this.props.input && this.props.input.onBlur(this.props.input.value)
    };

    handleChange = (value) => {
        this.props.input && this.props.input.onChange(value ? value.code : null);
        const onValueChange = this.props.onChange;
        onValueChange && onValueChange(value);
    };


    render() {
        var state = this.state;
        let {input, hidden, disabled, accessKey,  ...props}  = this.props;
        if (hidden || (accessKey && accessKey.hidden)){
            return false;
        }
        var options = this.listOptions();

        if ('code' in this.props) {
            return this.renderLabel();
        }
        
        var empty = !(options instanceof Array) || !options.find((o) => !o.props.disabled);

        var cl = {
            'form-group': true
        };

        var stateError = {
            'error': (props.meta && props.meta.touched && props.meta.error) || state.error
        };

        return (
            <FormGroup bsClass={classNames(cl)} validationState={classNames(stateError)|| undefined}>
                <ControlLabel>
                    {props.title}
                </ControlLabel>
                <Select {...input}
                        disabled={disabled || (accessKey && accessKey.disabled)  || empty}
                        readOnly={props.readOnly}
                        options={this.state.data}
                        placeholder={props.placeholder}
                        isLoading={props.isLoading}
                        className='form-control'
                        onChange={this.handleChange}
                        onBlur={this.handleBlur}
                        value={props.value || input && input.value || EMPTY_VALUE}
                        clearable={false}
                        valueKey="code"
                        labelKey="label"/>

                {(props.meta && props.meta.touched && props.meta.error &&
                <HelpBlock >{<FormattedMessage {...props.meta.error}/>}</HelpBlock>)}
            </FormGroup>
        )
    }

    listOptions() {
        var state = this.state;

        var options;

        if (state.error) {
            options = errorOption;
        } else if (state.loading) {
            options = loadOption
        } else {
            var placeholder = this.props.placeholder ;
            options = this.state.children || (<option key="#select" className="option-select" value={EMPTY_VALUE} disabled="true"
                                                     >{placeholder}</option>);
        }

        return options;
    }

    listOptionsFromData(options, data) {

        if (data) {

            data = this.filterAndSortDatas(data);

            if (data && data.length) {
                var ops = data.map((row) => <option key={row.code}
                                                    value={row.code}>{this.getLabelFromData(row)}</option>);
                ops.unshift(options);
                options = ops;
            } else {
                options = (<option key="#loading" className="option-loading" value="NOTHING" disabled="true">Empty
                    list</option>);
            }
        }

        return options;
    }

    filterAndSortDatas(datas) {
        return datas;
    }

    getSelectedData() {
        var data = this.state.data;
        if (!data) {
            return undefined;
        }

        var selectedIndex = this.refs.select.selectedIndex;
        if (selectedIndex < 0) {
            return undefined;
        }

        var option = this.refs.select.options[selectedIndex];
        if (!option) {
            return undefined;
        }

        var d = data.find((d) => d.code === option.value);
        return d;
    }

    getLabelFromData(data) {
        if (!data) {
            return "";
        }

        return data.label;
    }

    renderLabel() {
        var state = this.state;
        var props = this.props;
        var data = state.data;

        var empty = !(data instanceof Array) || !data.length

        var found;
        if (!empty) {
            found = data.find((d) => d.code === props.code);
        }

        var cl = {
            'form-group': true,
            'has-error': state.error,
            'has-warning': state.warning,
            'has-success': state.success,
            'has-loading': state.loading,
            'is-empty': empty,
            'not-found': !found
        };

        var label = this.getLabelFromData(found);

        return (
            <span className={classNames(cl)}>{label}</span>
        );

    }
}