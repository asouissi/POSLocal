'use strict'
import React from "react";
import {tables} from "../../../../core/reducers/referenceTable";
import SelectField from "../../../../core/components/lib/SelectField";
import CurrencyEntry from "../../../../core/components/lib/CurrencyEntry";
import {Field, change} from "redux-form";
import FinancialUnit from "./FinancialUnit";
import {FormattedMessage} from "react-intl";
import {Row, Col} from "react-bootstrap";

export default class MileageBox extends React.Component {

    handleUniteMesureChanged = (event) => {
        this.props.dispatch(change('dealForm', `${this.props.quoteField}.pfiunitemesure`, event.code || event.target.value));
    }


    render() {

        let {currencyCode,quote, quoteField, readOnly, accessKeys, ...props} = this.props;

        return (

            <Row>
                <Col md={6}>
                    <Row>
                        <Col md={6}>
                            <Field name={`${quoteField}.pfikilometrage`} component={SelectField}
                                   title={<FormattedMessage id="pos.deal.financialquote.mileage.title"
                                                            defaultMessage="Mileage"/>} key="mileage" suffix="km"
                                   options={tables.LANTUSPARAM} refParams={{'tusnom': 'MILEAGE'}}
                                   readOnly={false}
                                   {...accessKeys[`${quoteField}.pfikilometrage`]}/>
                        </Col>
                        <Col md={6}>
                            <FinancialUnit value={quote.pfiunitemesure}
                                           title={<FormattedMessage id="pos.deal.financialquote.unit.title"
                                                                    defaultMessage="Unit"/>} key="unit"

                                           onChange={this.handleUniteMesureChanged}
                                           accessKeys={accessKeys}/>
                        </Col>
                    </Row>
                </Col>
                <Col md={6}>
                    <Row>
                        <Col md={6}>
                            <Field name={`${quoteField}.pfikilometrage`}
                                   component={SelectField}
                                   suffix="km"
                                   title={<FormattedMessage id="pos.deal.financialquote.mileagetotal.title"
                                                            defaultMessage="Mileage total"/>} key="mileagetotal"
                                   options={tables.LANTUSPARAM} refParams={{'tusnom': 'MILEAGE'}}
                                   readOnly={true}
                                   {...accessKeys[`${quoteField}.pfikilometrage`]}
                            />
                        </Col>
                        <Col md={6}>
                            <Field name={`${quoteField}.pfimtexcessuse`} component={CurrencyEntry}
                                   title={<FormattedMessage id="pos.deal.financialquote.extramileagecost.title"
                                                            defaultMessage="Extra mileage cost"/>}
                                   {...accessKeys[`${quoteField}.pfimtexcessuse`]}   currencyCode={currencyCode}
                                   key="extraMileageCost" readOnly="true"/>
                        </Col>

                    </Row>
                </Col>
            </Row>
        );
    }
}
