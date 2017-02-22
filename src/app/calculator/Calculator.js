import React, {Component, PropTypes} from "react";
import Slider from "../core/components/lib/Slider";
import {calcValues} from "./CalcUtils";
import CurrencyEntry from "../core/components/lib/CurrencyEntry";
import IntegerEntry from "../core/components/lib/IntegerEntry";

export default  class Calculator extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            costValue: 10000,
            termValue: 20
        };
    }

    handleCostChange = (value) => {
        let {aprRate, monthly, total} = this.calculatePayment();
        this.setState({
            costValue: value
        });

        if (this.props.onChange) {
            this.props.onChange({
                cost: value,
                term: this.state.termValue,
                aprRate: aprRate,
                monthly: monthly,
                total: total
            })
        }
    }

    handleTermChange = (value) => {
        let {aprRate, monthly, total} = this.calculatePayment();

        this.setState({
            termValue: value
        });
        if (this.props.onChange) {
            this.props.onChange({
                cost: this.state.costValue,
                term: value,
                aprRate: aprRate,
                monthly: monthly,
                total: total
            })
        }
    }

    calculatePayment() {

        let aprRate, monthly, total =0;

        let roundedValue = Math.floor(this.state.costValue / 1000) * 1000;

        let amount = calcValues.find(value => {
            return value.amount === roundedValue
        });
        if (amount) {
            let term = amount.terms.find(term => term.number === this.state.termValue);
            if (term) {
                let {formatNumber, formats} = this.context.intl;

                aprRate = term.results.rate;
                monthly = term.results.monthly * (this.state.costValue / roundedValue);
                total = monthly * this.state.termValue;
            }
        }
        return {
            aprRate, monthly, total  // no format no currency
        }
    }

    render() {
        let {aprRate, monthly, total} = this.calculatePayment();
        //here format
        let {formatNumber, formats} = this.context.intl;
        aprRate = formatNumber(aprRate, {style: 'percent', maximumFractionDigits: 2});
        total = formatNumber(total, formats.number.currencyFormat);
        monthly = formatNumber(monthly, formats.number.currencyFormat);

        return (
            <div className="calculator">

                <div className="row">

                    <div className="calculator-form col-md-7 col-xs-12">
                        <h3>Loan Calculator</h3>
                        <div className="row text-center">
                            <label> I'd like to borrow: </label>
                            <div className="row">
                                <div className="calculator-slider col-xs-12">
                                    <Slider
                                        min={1000}
                                        max={25000}
                                        step={100}
                                        value={this.state.costValue}
                                        onChange={(value) => this.handleCostChange(value)}/>
                                </div>

                                <CurrencyEntry groupClassName="calculator-field col-sm-2 col-sm-offset-5 col-xs-6 col-xs-offset-3" currency='£'
                                               onChange={(event, value) => this.handleCostChange(value)}
                                               value={this.state.costValue} numberOfDigitAfterDecimal={0}/>
                            </div>
                        </div>
                        <div className="row text-center">
                            <label> Over a period of: </label>
                            <div className="row">
                                <div className="calculator-slider col-xs-12">
                                    <Slider
                                        min={12}
                                        max={60}
                                        step={1}
                                        value={this.state.termValue}
                                        onChange={(value) => this.handleTermChange(value)}/>
                                </div>

                                <div className="calculator-field col-sm-2 col-sm-offset-5 col-xs-6 col-xs-offset-3 term">
                                    <IntegerEntry onChange={(event, value) => this.handleTermChange(value)}
                                                  suffix=" Months" value={this.state.termValue}/>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="calculator-summary col-md-5 col-xs-12">
                        <h3>Summary</h3>
                        <div className="summary-row">
                            <span>Representative APR:</span> <span>{aprRate}</span>
                        </div>
                        <div className="summary-row">
                            <span>Monthly repayment:</span> <span>{monthly}</span>
                        </div>
                        <div className="summary-row">
                            <span>Total repayment:</span> <span>{total}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

Calculator.contextTypes = {
    intl: PropTypes.object.isRequired,
}