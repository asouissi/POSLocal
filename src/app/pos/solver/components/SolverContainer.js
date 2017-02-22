import React from "react";
import {connect} from "react-redux";
import classNames from 'classnames';
import {Grid, Row, Col} from "react-bootstrap";
import {injectIntl, FormattedMessage} from "react-intl";
import {reduxForm, Field, formValueSelector} from 'redux-form'
import {
    tables,
    getReferenceTable, promiseReferenceTable
} from '../../../core/reducers/referenceTable'
import Loader from '../../../core/components/lib/Loader';
import Car from "./Car";
import SolverInfos from "./SolverInfos";
import Box from "../../../core/components/lib/Box";
import SliderField from "../../../core/components/lib/SliderField";

import {
    getQuotes, clearQuotes
} from '../reducers/actions'

const MONTHLY_BUDGET_STEPS = [];
for (let i = 50; i <= 1500; i += 50) {
    MONTHLY_BUDGET_STEPS.push({code: i, label: "£ " + i});
}

class SolverContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    componentDidMount() {
        function m(min, val) {
            let v = parseFloat(val.code);
            if (v < 1) {
                return min;
            }
            if (min === undefined) {
                return v;
            }

            return Math.min(min, v);
        }

        let min = MONTHLY_BUDGET_STEPS[0].code;
        let min2 = MONTHLY_BUDGET_STEPS[Math.floor(MONTHLY_BUDGET_STEPS.length / 2)].code;
        this.props.change('monthlyBudget', [min, min2]);

        promiseReferenceTable(tables.LANTUSPARAM, {'tusnom': 'SQDEPOSIT'}, this.props.dispatch).then((result) => {
            let min = result.reduce(m, undefined);
            this.props.change('deposit', min);
        });

        promiseReferenceTable(tables.LANTUSPARAM, {'tusnom': 'SQTERM'}, this.props.dispatch).then((result) => {
            let min = result.reduce(m, undefined);
            this.props.change('paymentPeriod', min);
        });

        promiseReferenceTable(tables.LANTUSPARAM, {'tusnom': 'SQMILEAGE'}, this.props.dispatch).then((result) => {
            let min = result.reduce(m, undefined);
            this.props.change('annualMileage', min);
        });
    }

    componentWillUnmount() {
        if (this._changeTimerId) {
            clearTimeout(this._changeTimerId);
        }

        this.props.clearQuotes();
    }

    handleOnChangeDeposit = (value) => {
        this._handleSliderChange({deposit: value});
    }

    handleOnChangePaymentPeriod = (value) => {
        this._handleSliderChange({paymentPeriod: value});
    }

    handleOnChangeMonthlyBudget = (value) => {
        this._handleSliderChange({monthlyBudgetMin: value[0], monthlyBudgetMax: value[1]});
    }

    handleOnChangeAnnualMileage = (value) => {
        this._handleSliderChange({annualMileage: value});
    }

    _handleSliderChange = (changes) => {
        if (this._changeTimerId) {
            clearTimeout(this._changeTimerId);
            this._changeTimerId = undefined;
        }

        this.props.clearQuotes();

        let params = {
            deposit: this.props.deposit,
            paymentPeriod: this.props.paymentPeriod,
            monthlyBudgetMin: this.props.monthlyBudget && this.props.monthlyBudget[0],
            monthlyBudgetMax: this.props.monthlyBudget && this.props.monthlyBudget[1],
            annualMileage: this.props.annualMileage,
            ...changes
        };

        if (isNaN(params.deposit) || isNaN(params.paymentPeriod) ||
            isNaN(params.monthlyBudgetMin) || isNaN(params.monthlyBudgetMax) || isNaN(params.annualMileage)) {
            return;
        }

        this.setState({waiting: true});

        this._changeTimerId = setTimeout(() => {
            this.setState({waiting: false});

            this.props.getQuotes(params);
        }, 2000);
    }

    render() {

        function computeMarks(steps) {
            let marks = {};
            let min;
            let max;
            if (steps && steps.length) {
                steps.forEach((step) => {
                    marks[step.code] = "£ " + step.label;

                    let v = parseFloat(step.code);
                    min = (min === undefined) ? v : Math.min(min, v);
                    max = (max === undefined) ? v : Math.max(max, v);
                });
            }
            return {marks, min, max, disabled: min === undefined};
        }

        let monthlyBudget = computeMarks(this.props.monthlyBudgetSteps);
        let deposit = computeMarks(this.props.depositSteps);
        let paymentPeriod = computeMarks(this.props.paymentPeriodSteps);
        let annualMileage = computeMarks(this.props.annualMileageSteps);

        let monthlyBudgetRight = null;
        if (this.props.monthlyBudget) {
            if (this.props.monthlyBudget[0] !== this.props.monthlyBudget[1]) {
                monthlyBudgetRight = `£ ${this.props.monthlyBudget[0]} - £ ${this.props.monthlyBudget[1]}`;
            } else {
                monthlyBudgetRight = `£ ${this.props.monthlyBudget[0]}`;
            }
        }

        let paymentPeriodRight = null;
        if (!isNaN(this.props.paymentPeriod)) {
            if (this.props.paymentPeriod > 1) {
                paymentPeriodRight = `${this.props.paymentPeriod} months`;

            } else if (this.props.paymentPeriod == 1) {
                paymentPeriodRight = `${this.props.paymentPeriod} month`;

            } else {
                paymentPeriodRight = "any";
            }
        }

        let annualMileageRight = null;
        if (!isNaN(this.props.annualMileage)) {
            if (this.props.annualMileage > 0) {
                annualMileageRight = `${this.props.annualMileage} km`;
            } else {
                annualMileageRight = "any";
            }
        }

        let cars = null;

        if (this.props.quotes && this.props.quotes.staticquotes) {
            cars = this.props.quotes.staticquotes.map((quote, index) => {
                return (<Col md={12} lg={6} key={index}>
                    <Box type="primary" className="solver-car"
                         title={quote.variant.varlibelle}
                         withBoder="true">
                        <Car quote={quote}/>
                    </Box>
                </Col>);
            });

            let cl = {
                'quotes-car-list': !this.props.quotesCleared,
                'quotes-car-list-exit': this.props.quotesCleared,
            };

            cars = (<Row key="cars" className={classNames(cl)}>{cars}</Row>);
        }

        let quotesInfos = null;

        if (!this.props.quotes || !this.props.quotes.staticquotes || this.props.quotesCleared) {
            if (this.props.loading) {
                quotesInfos = (<div key="infos" className="quotesInfos quotesInfos-loading">
                    <Loader/>
                </div>);

            } else if (this.props.error) {
                quotesInfos = (<div key="infos" className="quotesInfos quotesInfos-error">Error !</div>)

            } else if (this.state.waiting) {
                quotesInfos = (<div key="infos" className="quotesInfos quotesInfos-criteria">
                    <label><span className="fa fa-clock-o"/>Waiting for more datas ...</label>
                </div>)

            } else if (this.props.quotes && this.props.quotes.staticquotes === null) {
                quotesInfos = (<div key="infos" className="quotesInfos quotesInfos-criteria">
                    <label><span className="fa fa-ban"/>No proposals</label>
                </div>)

            } else {
                quotesInfos = (<div key="infos" className="quotesInfos quotesInfos-criteria">
                    <label><span className="fa fa-shopping-cart"/>Please select financial datas</label>
                </div>)
            }
        }
        const skin = this.props.params && this.props.params.skin || "";
        return (
            <div className={skin}>
                <Grid className="solver-container" fluid={true}>
                    <Row>
                        <Col xs={12} sm={6} md={4} lg={4} className="column-left">
                            <Row>
                                <Col xs={12}>
                                    <Box type="primary" className="solver-selectors"
                                         title={<FormattedMessage id="pos.solver.selector.title"
                                                                  defaultMessage="Financial data"/>}
                                         withBoder="true">

                                        <Field groupClassName="solver-slider"
                                               name="monthlyBudget" component={SliderField}
                                               title={<FormattedMessage id="pos.solver.selector.monthlyBudget"
                                                                        defaultMessage="Monthly budget"/>}
                                               rightTitle={monthlyBudgetRight}
                                               range
                                               step={null}
                                               {...monthlyBudget}
                                               onChange={this.handleOnChangeMonthlyBudget}
                                        />
                                        <Field groupClassName="solver-slider"
                                               name="deposit" component={SliderField}
                                               title={<FormattedMessage id="pos.solver.selector.deposit"
                                                                        defaultMessage="Deposit"/>}
                                               rightTitle={!isNaN(this.props.deposit) && `£ ${this.props.deposit}`}
                                               step={null}
                                               onChange={this.handleOnChangeDeposit}
                                               {...deposit}
                                        />
                                        <Field groupClassName="solver-slider"
                                               name="paymentPeriod" component={SliderField}
                                               title={<FormattedMessage id="pos.solver.selector.paymentPeriod"
                                                                        defaultMessage="Payment period"/>}
                                               rightTitle={paymentPeriodRight}
                                               step={null}
                                               onChange={this.handleOnChangePaymentPeriod}
                                               {...paymentPeriod}
                                        />
                                        <Field groupClassName="solver-slider"
                                               name="annualMileage" component={SliderField}
                                               title={<FormattedMessage id="pos.solver.selector.annualMileage"
                                                                        defaultMessage="Annual Mileage"/>}
                                               rightTitle={annualMileageRight}
                                               step={null}
                                               onChange={this.handleOnChangeAnnualMileage}
                                               {...annualMileage}
                                        />
                                    </Box>
                                </Col>
                                {this.props.quotes && this.props.quotes.deal && <Col xs={12} xsHidden>
                                    <SolverInfos deal={this.props.quotes.deal}/>
                                </Col>}
                            </Row>
                        </Col>
                        <Col xs={12} sm={6} md={8} lg={8}>
                            {quotesInfos} {cars}
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

SolverContainer = reduxForm({
        form: 'solver',
        enableReinitialize: true
    }
)(SolverContainer);

const selector = formValueSelector('solver');

const mapStateToProps = (state, props) => {
    return {
        initialValues: state.solver.initial,

        monthlyBudgetSteps: MONTHLY_BUDGET_STEPS,
        depositSteps: getReferenceTable(state, tables.LANTUSPARAM, {tusnom: 'SQDEPOSIT'}).data,
        paymentPeriodSteps: getReferenceTable(state, tables.LANTUSPARAM, {tusnom: 'SQTERM'}).data.filter((v) => parseFloat(v.code) > 0),
        annualMileageSteps: getReferenceTable(state, tables.LANTUSPARAM, {tusnom: 'SQMILEAGE'}).data.filter((v) => parseFloat(v.code) > 0),

        loading: state.solver.loading,
        error: state.solver.error,
        quotes: state.solver.quotes,
        quotesCleared: state.solver.quotesCleared,

        monthlyBudget: selector(state, 'monthlyBudget'),
        deposit: selector(state, 'deposit'),
        paymentPeriod: selector(state, 'paymentPeriod'),
        annualMileage: selector(state, 'annualMileage'),
    };
};

const mapDispatchToProps = {getQuotes, clearQuotes};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(SolverContainer));
