'use strict'
import React, {Component} from 'react'
import {Button, ButtonGroup} from 'react-bootstrap';
import isEqual from 'lodash/isEqual';
import uniq from 'lodash/uniq';
import filter from 'lodash/filter';

export default class RadioButtonGroupEntry extends Component {

    getNamesFromFields(f) {
        return Object.keys(f);
    }

    componentWillMount() {
        var names = this.getNamesFromFields(this.props.fields);
        var testNamesArray = uniq(names);
        if (!isEqual(testNamesArray, names))
            throw new Error("Duplicated entry, please check the keys of the attribute 'fields' in 'props'.");

        var state = this.getResetedState(); // reset if multi else just selected code
        var activetSet = false;
        this.state = state;
        names.forEach(n => {
            if (this.props.fields[n].activeByDefault) {
                if (this.props.uniqueSelected && activetSet)
                    throw new Error("Active field already set, please check the attribute 'fields' in 'props'.")
                activetSet = true;
                this.handleClick(n);
            }
        });
    }

    getResetedState() {
        var state = {};
        this.getNamesFromFields(this.props.fields).forEach(n => state[n] = false);
        return state;
    }

    handleClick(n) {
        var value = !this.state[n];
        var uniqueSelected = this.props.uniqueSelected;
        var state = uniqueSelected ? this.getResetedState() : this.state;
        state[n] = value;
        var filtered = "";
        if (uniqueSelected)
            filtered = value ? n : "";
        else {
            filtered = filter(this.getNamesFromFields(this.props.fields), n => state[n]);
            filtered = filtered.length != 0 ? filtered : "";
        }
        this.state = state;
        this.props[n] && this.props[n].input && this.props[n].input.onChange(filtered);
        const onValueChange = this.props.onChange;
        onValueChange && onValueChange(filtered);
    }

    render() {
        var {fields, uniqueSelected, advancedBtn, openFilterModal, ...props} = this.props
        var array = this.getNamesFromFields(this.props.fields).map((n, index) => {
            let style = this.state[n] ? "primary" : "default";
            var fieldData = fields[n];
            return <Button key={"btnGrp-" + index} bsStyle={style}
                           onClick={e => {
                               e.preventDefault();
                               this.handleClick(n);
                           }}>
                {fieldData.label || n}
            </Button>;
        });
        let advancedSearchBtn;
        if (advancedBtn) {
            advancedSearchBtn = (<Button onClick={openFilterModal}>
                <i className="fa fa-search-plus fa-lg"/>
            </Button>);
        }

        return (
            <ButtonGroup {...props}>
                {array}
                {advancedSearchBtn}
            </ButtonGroup>
        );
    }
}
