'use strict'
import React from "react";
import classNames from "classnames";
import {FormattedMessage} from "react-intl";
import {FormGroup, ControlLabel, HelpBlock, InputGroup, Button} from "react-bootstrap";

const MIN_DELAY = 250; // Minimum delay between two searches

export default class SearchEntry extends React.Component {

    constructor(props) {
        super(props);

        this._lastSearch = 0;
    }

    _handleInputBlur = (event) => {
        this._performSearch(event);
        this.props.input && this.props.input.onBlur(this.props.input.value);
        this.props.onChange && this.props.onChange(this.props.input.value)
    }

    _handleInputChange = (event) => {
        this.props.input && this.props.input.onChange(event);
        this.props.onChange && this.props.onChange(this.refs.input.value)
    }

    _handleInputKeyPress = (event) => {
        if (event.keyCode == 13) {
            this._performSearch(event);
        }
    }

    _handleButtonClick = (event) => {
        if (this.props.onSearchClick) {
            this.props.onSearchClick(event);
        } else {
            this._performSearch(event);
        }
    }

    _performSearch() {
        if (typeof(this.props.onSearch) !== "function") {
            console.error("Invalid onSearch callback");
            return;
        }

        var now = Date.now();
        if (now - this._lastSearch < MIN_DELAY) {
            return;
        }

        var suggestEvent = {target: this.refs.input}

        this._lastSearch = now;
        this.props.onSearch && this.props.onSearch(suggestEvent);
    }

    render() {
        let {onChange, onBlur, onFocus, ...input} = this.props.input || {};
        var {title, placeholder, disabled, type, hidden, accessKey, ...props}  = this.props;
        var state = this.state;


        if (hidden || (accessKey && accessKey.hidden)) {
            return false;
        }
        var vs = {
            'error': props.meta && props.meta.touched && props.meta.error
        };
        let gc = {
            'form-group': title,
        }

        if (props.groupClassName) {
            gc[props.groupClassName] = true;
        }

        var controlLabel = title ? <ControlLabel>{title}</ControlLabel> : null;
        //maybe use a textentry plus some function
        return (
            <FormGroup bsClass={classNames(gc)} validationState={classNames(vs) || undefined}>
                {controlLabel}
                <InputGroup>

                    <input className="form-control" ref="input"
                           onKeyDown={this._handleInputKeyPress} onBlur={this._handleInputBlur}
                           onChange={this._handleInputChange} type={type || "text"}
                           disabled={disabled || (accessKey && accessKey.disabled)} value={props.value}
                           placeholder={props.placeholder} {...input}/>

                    <InputGroup.Button>
                        <Button disabled={props.disabled} bsStyle="info"
                                onKeyPress={(event) => {
                                    this._performSearch(event)
                                }} onClick={this._handleButtonClick}>
                            <span className="glyphicon glyphicon-search"/>
                        </Button>
                    </InputGroup.Button>
                </InputGroup>
                {(props.meta && props.meta.touched && props.meta.error &&
                <HelpBlock >{<FormattedMessage {...props.meta.error}/>}</HelpBlock>)}
            </FormGroup>
        );
    }
}