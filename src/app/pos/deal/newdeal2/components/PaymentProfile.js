'use strict'
import React from "react";
import {FormattedMessage} from "react-intl";
import DealBox from "./DealBox";
import DateEntry from "../../../../core/components/lib/DateEntry";
import FormGroup from "../../../../core/components/lib/FormGroup";
import IntegerEntry from "../../../../core/components/lib/IntegerEntry";
import * as dealConst from "../../utils/dealUtils";
import QuoteUtils from "../../utils/QuoteUtils";
import classNames from "classnames";
import {parseIntOrEmpty, parseIntOrZero} from "../../../../core/utils/Utils";
import SelectField from "../../../../core/components/lib/SelectField";
import {Field, change} from "redux-form";
import {tables} from "../../../../core/reducers/referenceTable";
import TextEntry from "../../../../core/components/lib/TextEntry";
import {Button} from "react-bootstrap";
import {getReferenceTable} from "../../../../core/reducers/referenceTable";

const profileOptions = [{code: "34", label: '1+33 Monthly'}, {code: "35", label: '2+33 Monthly'}, {
    code: "36",
    label: '3+33 Monthly'
}];

let profile = {};

export default class PaymentProfile extends React.Component {

    handleTermChanged = (event) => {
        this.props.dispatch(change('dealQuote', 'pfinbperiodes', parseIntOrEmpty(event.target.value))); //change deal term
    }

    handleProfileChanged = (event) => {
        let values = [];
        let separator = '+'
        values = event.code.split(separator);
        let advancePayment = parseIntOrEmpty(values[0]);
        var pfiperiodicit = values[1][values[1].length - 1];
        let nbTerm = parseIntOrZero(values[1].substring(0, values[1].length - 1));

        let perdiode = '';
        switch (pfiperiodicit) {
            case "M":
                perdiode = '030'
                break;
            case "Q":
                perdiode = '090'
                break;
            case "A":
                perdiode = '360'
                break;
        }
        this.props.dispatch(change('dealQuote', `${this.props.quoteField}.pfiperiodicite`, perdiode));
        this.props.dispatch(change('dealQuote', QuoteUtils.getTermField(this.props.quote, this.props.quoteField), nbTerm));
        this.props.dispatch(change('dealQuote', QuoteUtils.getFollowedByField(this.props.quote, this.props.quoteField), nbTerm));
        this.props.dispatch(change('dealQuote', `${this.props.quoteField}.pfinbperiodes`, parseIntOrZero(nbTerm) + parseIntOrZero(advancePayment)));
        this.props.dispatch(change('dealQuote', QuoteUtils.getAdvancePaymentField(this.props.quote, this.props.quoteField), advancePayment));
        this.props.dispatch(change('dealQuote', QuoteUtils.getDurationProfilField(this.props.quote, this.props.quoteField), event.code));
    }

    getProfile = () => {
        let advancePaymentFiled = QuoteUtils.getAdvancePayment(this.props.quote);
        let nbTerm = QuoteUtils.getTerm(this.props.quote);
        let periodicite = "";

        switch (this.props.quote.pfiperiodicite) {
            case "030":
                periodicite = "M"
                break;
            case "090":
                periodicite = "Q"
                break;
            case "360":
                periodicite = "A"
                break;
        }
        return advancePaymentFiled + "+" + nbTerm + periodicite;
    }


    handleButtonClick = (event) => {
        this.props.popup.scheduledPaymentProfilePopup.toggle();
    }

    changePaymentFrequency(newfreq) {
        this.props.dispatch(change('dealQuote', this.props.quoteField + '.pfiperiodicite', newfreq));
        let durprofileList  = this.props.durprofileList;
        if(durprofileList && durprofileList.length>0){
            let periodicite = "";
            switch (newfreq) {
                case "030":
                    periodicite = "M";
                    break;
                case "090":
                    periodicite = "Q";
                    break;
                case "360":
                    periodicite = "A";
                    break;
            }
            let filteredList = durprofileList.find(item => item.code.includes(periodicite));
            if(filteredList){
                this.handleProfileChanged(filteredList);
            }
        }

    }

    handleTermEditable = (event) => {
        var termEditable = QuoteUtils.getTermEditable(this.props.quote) === 1;
        event.preventDefault();
        event.stopPropagation();

        this.props.dispatch(change('dealQuote', QuoteUtils.getTermEditableField(this.props.quote, this.props.quoteField), termEditable ? 0 : 1));

        if (termEditable) {
            setTimeout(() => {
                this.refs.term.getRenderedComponent().focus();
            }, 200);
        } else {
            this.props.dispatch(change('dealQuote', 'pfinbperiodes', null));
            this.props.dispatch(change('dealQuote', QuoteUtils.getTermField(this.props.quote, this.props.quoteField), null));
        }
    }

    render() {

        let {quote, quoteField, startDateField,accessKeys, ...props} = this.props;

        var term = QuoteUtils.getTermField(quote, quoteField);
        let advance = QuoteUtils.getAdvancePaymentField(this.props.quote, quoteField);
        var termEditable = QuoteUtils.getTermEditable(quote) === 1;

        let bsStyle = termEditable?"primary":"default";

        var checkButton = (<Button bsStyle={bsStyle} onClick={this.handleTermEditable}>
            <span className="fa fa-pencil"/>
        </Button>);

        var paymentfrequency = QuoteUtils.getPaymentFrequency(quote);
        var quotetype = QuoteUtils.getQuoteType(quote);

        let btnIsPrimary = (v) => paymentfrequency === v ? "primary":"default";

        const accessKeyPopup = accessKeys['pos.quote.paymentprofile.popup'];
        let hasPopup = accessKeyPopup && !accessKeyPopup.hidden;

        return (
            <DealBox title={<FormattedMessage id="pos.quote.paymentprofile.title" defaultMessage="Payment profile"/>}
                     onButtonClick={this.handleButtonClick} hasPopup={hasPopup} readOnly={this.props.readOnly}>

                <Field component={DateEntry} name={startDateField}
                       title={<FormattedMessage id="pos.quote.paymentprofile.startdate" defaultMessage="Start date"/>}
                    />


                <SelectField value={this.getProfile()} options={tables.LANTUSPARAM} refParams={{'tusnom': 'DURPROFIL'}}
                             title={<FormattedMessage id="pos.quote.paymentprofile.term" defaultMessage="Duration Profile"/>}
                             onChange={this.handleProfileChanged}/>

                <FormGroup title={<FormattedMessage id="pos.quote.paymentprofile.paymentfrequency"
                                                    defaultMessage="Payment frequency"/>}>
                    <div className="btn-group btn-no-inline btn-group-nofloat">
                        <Button bsStyle={btnIsPrimary('030')}
                                onClick={event => this.changePaymentFrequency('030')}><FormattedMessage
                            id="pos.quote.paymentprofile.paymentfrequency.monthly" defaultMessage="Monthly"/></Button>
                        <Button bsStyle={btnIsPrimary('090')}
                                onClick={event => this.changePaymentFrequency('090')}><FormattedMessage
                            id="pos.quote.paymentprofile.paymentfrequency.quarterly" defaultMessage="Quarterly"/>
                        </Button>
                        {/*<Button bsStyle={btnIsPrimary('180')}*/}
                                {/*onClick={event => this.changePaymentFrequency('180')}><FormattedMessage*/}
                            {/*id="pos.quote.paymentprofile.paymentfrequency.semi" defaultMessage="Semi"/></Button>*/}
                        <Button bsStyle={btnIsPrimary('360')}
                                onClick={event => this.changePaymentFrequency('360')}><FormattedMessage
                            id="pos.quote.paymentprofile.paymentfrequency.annually" defaultMessage="Annually"/></Button>
                    </div>
                </FormGroup>




                <div className="row">
                    <div className="col-md-6">
                        <Field component={IntegerEntry} name={advance}
                               title={<FormattedMessage id="pos.quote.paymentprofile.advance" defaultMessage="In Advance"/>}
                               readOnly={!termEditable}
                               prefixButton={checkButton}
                               prefix="V"
                               ref="advance"
                               visible={quotetype === dealConst.VALUE_CODE_BUSINESS_TYPE_CBM}
                               onChange={this.handleTermChanged}/>
                    </div>
                    <div className="col-md-6">
                        <Field component={IntegerEntry} name={term} withRef
                               title={<FormattedMessage id="pos.quote.paymentprofile.terminfrequency" defaultMessage="Term in frequency"/>}
                               readOnly={!termEditable}
                               prefix="V"
                               prefixButton={checkButton}
                               ref="term"
                               visible={quotetype === dealConst.VALUE_CODE_BUSINESS_TYPE_CBM}
                               onChange={this.handleTermChanged}/>
                    </div>
                </div>

            </DealBox>
        )
    }
}




