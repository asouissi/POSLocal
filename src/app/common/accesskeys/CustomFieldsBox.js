'use strict'

import React, {Component} from "react";
import {FormattedMessage, injectIntl} from "react-intl";
import Box from "../../core/components/lib/Box.js";
import TextEntry from "../../core/components/lib/TextEntry";
import {Field} from "redux-form";
import SelectField from "../../core/components/lib/SelectField";
import NumberEntry from "../../core/components/lib/NumberEntry";
import CurrencyEntry from "../../core/components/lib/CurrencyEntry";
import DateEntry from "../../core/components/lib/DateEntry";
import chunk from "lodash/chunk";

const DEFAULT_EMPTY = [];

class CustomFieldsBox extends Component {

    handleCustomChange = (name, cchvaluecode) => {
        let field = name.split('.cva')[0];//do better after
        this.props.change(field + '.cchvaluecode', cchvaluecode)
    }

    componentDidMount() {
        this.fields = DEFAULT_EMPTY;
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.customFields !== this.props.customFields || nextProps.accessKeys !== this.props.accessKeys) {

            let accessKeys = nextProps.accessKeys
            let keys = nextProps.customFields.map(customField => {

                    let {label, field, cchvaluecode, type, refTable, refTableParams, refTableApi, options, ...rest} = customField;

                    switch (type) {
                        case 'string':
                            return (
                                <Field groupClassName="col-md-4" component={TextEntry} name={field}
                                       title={label}  {...accessKeys[field]}
                                       onChange={() => this.handleCustomChange(field, cchvaluecode)}/>)
                        case 'number':
                            return (
                                <Field groupClassName="col-md-4" component={NumberEntry}
                                       {...accessKeys[field]}
                                       name={field}
                                       onChange={() => this.handleCustomChange(field, cchvaluecode)}
                                       title={label} numberOfDigitAfterDecimal="0"/>)
                        case 'float':
                            return (
                                <Field groupClassName="col-md-4" component={NumberEntry} name={field}
                                       {...accessKeys[field]}
                                       onChange={() => this.handleCustomChange(field, cchvaluecode)}
                                       title={label}/>)
                        case 'percent':
                            return (
                                <Field groupClassName="col-md-4" component={NumberEntry}
                                       name={field} {...accessKeys[field]}

                                       onChange={() => this.handleCustomChange(field, cchvaluecode)}
                                       title={label} prefix="%"/>)
                        case 'currency':
                            return (<Field groupClassName="col-md-4" component={CurrencyEntry}
                                           {...accessKeys[field]}
                                           onChange={() => this.handleCustomChange(field, cchvaluecode)}
                                           name={field} title={label}/>)
                        case 'date':
                            return (
                                <Field groupClassName="col-md-4" component={DateEntry} name={field}
                                       {...accessKeys[field]}
                                       onChange={() => this.handleCustomChange(field, cchvaluecode)}
                                       title={label}/>)
                        case 'list':
                            return (
                                <Field groupClassName="col-md-4" component={SelectField} name={field}
                                       options ={options}
                                       refTable={refTable} params={refTableParams} api={refTableApi}
                                       onChange={() => this.handleCustomChange(field, cchvaluecode)}
                                       {...accessKeys[field]}
                                       title={label}/>)

                    }
                }
            );

            keys = keys.filter(k => k != undefined); //remove hidden

            //chunck 3 because col-md-4 * 3 = 12
            let layoutKeys = chunk(keys, 3).map(row => (<div className="row">{row}</div>));
            this.fields = layoutKeys.length ? (
                <Box type="primary" title={<FormattedMessage id="common.customcharacteristic.form.title"
                                                             defaultMessage="customFields"/>}>
                    {layoutKeys}
                </Box>
            ) : DEFAULT_EMPTY
        }
    }

    render() {
        return (
            <div>
                {this.fields}
            </div>
        )
    }
}

export default (injectIntl(CustomFieldsBox));
