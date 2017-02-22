'use strict'
import React from "react";
import FormGroup from "./FormGroup";
import Select from "react-select";
import axios from "axios";
import isEqual from "lodash/isEqual";


export default class SearchSelect extends React.Component {

    constructor(props) {
        super(props);
        this.state = {value: props.value};
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.url != this.props.url
            || nextProps.value != this.props.value
            || !isEqual(nextProps.params, this.props.params);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.url != this.props.url) {
            this.refs.select.setState({cache: {}});
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.url != this.props.url && this.props.value) {
            let value = this.props.value[this.props.valueKey] || this.props.value;
            this.refs.select.loadOptions(value);
        }
    }

    loadOptions(input, url, params, inputParamsKey) {
        if(inputParamsKey) {
            if (!params) params = {}
            params[inputParamsKey] = input;
        } else {
            url += input;
        }

        return axios.get(url, {params : params})
            .then((response) => {

                let options = this.data = response.data;

                if (this.props.valueKey) {
                    options = response.data.map(item => {
                        return {
                            [this.props.valueKey]: item[this.props.valueKey],
                            [this.props.labelKey]: item[this.props.labelKey]
                        }
                    });
                }

                return {options: options};
            })
            .catch(error => {
                console.log(error)
            })
    }

    //todo: can be override ...
    filterOptions(options, filter, values) {
        if (!options) options = [];
        return options
    }

    HandleChange = (value) => {
        let object = value;
        if (value && this.props.valueKey) {
            object = this.data.find(item => item[this.props.valueKey] === value[this.props.valueKey]);
        }

        if (this.props.onChange) {
            this.props.onChange(value, object, this.data);
        }

        if (this.props.field && this.props.field.onChange) {
            this.props.field.onChange(value.code);
        }
    }

    render() {
        let {url, title, params, onChange, inputParamsKey, field, filterOptions, loadOptions, onValueClick, ...props} = this.props;

        return (
            <FormGroup title={title}>
                <Select.Async ref="select"
                              onChange={this.HandleChange}
                              loadOptions={(input) => this.loadOptions(input, url, params, inputParamsKey)}
                              cache={{}}
                              clearable={this.props.clearable}
                              minimumInput={0}
                              inputProps={field && field.input}
                              {...props}
                />
            </FormGroup>
        );
    }
}
