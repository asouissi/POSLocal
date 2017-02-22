'use strict'
import React from 'react'
import {injectIntl} from 'react-intl';
import classNames from 'classnames';
import {FormattedMessage} from 'react-intl';


import Calendar from 'react-input-calendar';
import moment from 'moment';

import {FormGroup, ControlLabel, HelpBlock, InputGroup, Button} from 'react-bootstrap';

const DEFAULT_DATE_FORMAT = 'DD-MM-YYYY';

class DateEntry extends React.Component {

    constructor(props) {
        super(props);
    }

    _handleButtonClick = (event) => {
        event.preventDefault();
        event.stopPropagation();

        this.refs.input.toggleClick();
    };

    _handleDateChanged = (formattedDate) => {
        var date = null;

        if (formattedDate) {
            var m = moment(formattedDate);

            if (m && m.isValid()) {
                date = m.valueOf();
            }
        }


        if (typeof (this.props.onChange) === "function") {
            this.props.onChange({
                target: {
                    value: date
                }
            });
        }

        if (this.props.input && this.props.input.onChange) {
            this.props.input.onChange(date);
        }
    };

    _handleBlur = (event, formattedDate) => {
        var date;

        if (formattedDate) {
            var m = moment(formattedDate);

            if (m && m.isValid()) {
                date = m.valueOf();
            }
        }

        if (this.props.input && this.props.input.onChange) {
            this.props.input.onBlur(date);
        }
    };

    render() {
        var {input, title, disabled, hidden, accessKey, ...props}  = this.props;

        if (hidden || (accessKey && accessKey.hidden)){
            return false;
        }

        var cl = {
            'error': input && props.meta.touched && props.meta.error
        };

        var date = this.props.date || this.props.input && this.props.input.value;
        const {locale} = this.props.intl;
        var format = locale.indexOf('US') !== -1 ? 'MM-DD-YYYY' : DEFAULT_DATE_FORMAT;


        let gc = {
            'form-group': true,
        }

        if (props.groupClassName) {
            gc[props.groupClassName] = true;
        }

        return (
            <FormGroup validationState={classNames(cl) || undefined} bsClass={classNames(gc)}>
                <ControlLabel>
                    {title}
                </ControlLabel>
                <InputGroup className="input-group">
                    <InputGroup.Button >
                        <button className="btn btn-unchecked" onClick={this._handleButtonClick}>
                            <i className="fa fa-calendar"/>
                        </button>
                    </InputGroup.Button>
                    <Calendar format={format}
                              date={date}
                              className="form-control pull-right"
                              inputFieldClass="form-control"
                              ref="input"
                              closeOnSelect={true}
                              disabled={disabled || (accessKey && accessKey.disabled)}
                              onChange={this._handleDateChanged}
                              onBlur={this._handleBlur}
                              hideIcon={true}/>
                </InputGroup>
                {(props.meta && props.meta.touched && props.meta.error &&
                <HelpBlock >{<FormattedMessage {...props.meta.error}/>}</HelpBlock>)}

            </FormGroup>);
    }
}
export default injectIntl(DateEntry)