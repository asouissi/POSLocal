'use strict'
import React from 'react'
import Autocomplete from 'react-autocomplete'
import AjaxComponent from './AjaxComponent'
import classNames from 'classnames';


import FormGroup from './FormGroup'


export default class SearchEntry extends AjaxComponent {

    constructor(props) {
        super(props);
        this.state = {
            value: '',
            data: [],
            loading: false
        }

        //this.propsToState(props)
    }

    componentDidMount(){
        this.propsToState(this.props);
    }

    componentWillReceiveProps(newProps) {
        this.propsToState(newProps)
    }

    propsToState(props) {
        let {value} = props;
        console.log('sate before', this.state.value);
        console.log('value', value);
        this.setState({value});
        console.log('sate after', this.state.value);
    }

    handleChange(event, value, url) {
        this.setState({value});
        this.loadDatas(url + value);
    }

    renderItem(item, isHighlighted) {
        var {labelKey, valueKey} = this.props;
        let cl = {
            'highlight': isHighlighted,
            'auto-complete-item': true
        }
        return (
            <div
                className={classNames(cl)}
                key={item[valueKey]}
                id={item[valueKey]}>

                {item[labelKey]}

            </div>
        )
    }

    listItems() {
        return this.state.data.map(item => {
            {
                return {
                    [this.props.valueKey]: item[this.props.valueKey],
                    [this.props.labelKey]: item[this.props.labelKey]
                }
            }
        })
    }


    handleOnSelect(value, itemSelected){
        let object = this.state.data.find(item => item[this.props.valueKey] === itemSelected[this.props.valueKey]);
        this.props.onSelect(value, object);
    }

    render() {
        var {url, labelKey, valueKey, value, title, placeholder, onSelect, ...props} = this.props;
        var state = this.state;
        var items = this.listItems();

        var cl = {
            'auto-complete': true,
            'form-group': true,
            'has-error': state.error,
            'has-warning': state.warning,
            'has-success': state.success,
            'has-loading': state.loading
        };

        return (
            <FormGroup classNames={cl} title={title}>

                <Autocomplete
                    value={state.value}
                    items={items}
                    onChange={(event, value) => {
                        this.handleChange(event, value, url);
                    }}
                    onSelect={(value, item) => this.handleOnSelect(value, item)}
                    getItemValue={(item) => item[labelKey]}

                    renderItem={(item, isHighlighted) => this.renderItem(item, isHighlighted)}

                    wrapperStyle={{}}
                    wrapperProps={{className: 'input-group'}}
                    inputProps={{className: 'form-control', placeholder: placeholder}}
                    {...props}
                />
            </FormGroup>);
    }
}