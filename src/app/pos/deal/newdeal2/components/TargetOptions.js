'use strict'
import React from 'react'
import DealBox from './DealBox'

import CurrencyEntry from '../../../../core/components/lib/CurrencyEntry'
import NumberEntry from '../../../../core/components/lib/NumberEntry'

import {parseFloatOrEmpty, parseIntOrEmpty} from '../../../../core/utils/Utils'


import {setMargin} from '../reducers/dealQuote'
import QuoteUtils from '../../utils/QuoteUtils'
import {FormattedMessage} from 'react-intl';
import {Field, change} from "redux-form"
import SelectField from "../../../../core/components/lib/SelectField";
import {tables} from "../../../../core/reducers/referenceTable";
import FinancialScale from "../../newdeal/components/FinancialScale";

var dataFW = [
    {code: 'PA', label: 'Payment Amount'},
    {code: 'INT', label: 'Interest Rate'},
    {code: 'BA', label: 'Balloon'},
    {code: 'COS', label: 'Cost'},
    {code: 'TER', label: 'Term'},
    {code: 'SUB', label: 'Subsidy'},
];

var dataFF = [{code: 'MARG', label: 'Margin'},
    {code: 'YIELD', label: 'Yield'},
    {code: 'APR', label: 'APR'},
    {code: 'FLAT', label: 'Flat Rate'},
    {code: 'NPV', label: 'NPV'}
];

export default class TargetOptions extends React.Component {

    handleMarginChanged = (event) => {
        this.props.dispatch(setMargin(this.props.quote, this.props.quoteField, parseFloatOrEmpty(event.target.value)));
    };

    componentWillReceiveProps(nextProps) {

        let indexWhat = nextProps.quote.listdealquoteattribute.findIndex((p) => p.pfacode === 'TMP_FINDWHAT');
        let indexFrom = nextProps.quote.listdealquoteattribute.findIndex((p) => p.pfacode === 'TMP_FINDFROM');
        let findWhatField = QuoteUtils.getFindWhatField(nextProps.quote, nextProps.quoteField);
        var findFromField = QuoteUtils.getFindFromField(nextProps.quote, nextProps.quoteField);

        if (indexWhat == -1 || (this.props.accessKeys!==nextProps.accessKeys && nextProps.accessKeys[findWhatField] && nextProps.accessKeys[findWhatField].hidden )) {
            this.props.dispatch(QuoteUtils.createQuoteAttributeAction(nextProps.quote, 'dealQuote', nextProps.quoteField,
                'TMP_FINDWHAT', {pfachaine: 'PA'}));
        }

        if (indexFrom == -1 || (this.props.accessKeys!==nextProps.accessKeys && nextProps.accessKeys[findFromField] && nextProps.accessKeys[findFromField].hidden )) {
            this.props.dispatch(QuoteUtils.createQuoteAttributeAction(nextProps.quote, 'dealQuote', nextProps.quoteField,
                'TMP_FINDFROM', {pfachaine: 'MARG'}));
        }
    }
    handleScaleChanged = (event) => {
        var value ='';
        if(event){
            value = event.code || event.target.value;
        }

        var values = value.split("_");
        if (values.length == 2) {
            // Change the scale
            var pcrid = parseInt(values[0]);
            var pcrordre = parseInt(values[1]);
            this.props.dispatch(change('dealQuote', `${this.props.quoteField}.pcrid`, pcrid));
            this.props.dispatch(change('dealQuote', `${this.props.quoteField}.pcrordre`, pcrordre));
        }
    }

    render() {
        let {quote, quoteField, readOnly, accessKeys} = this.props;
        let component = [];
        var findFrom = QuoteUtils.getFindFrom(quote);
        var scalekey = quote.pcrid + "_" + quote.pcrordre;
        let findWhatField = QuoteUtils.getFindWhatField(quote, quoteField);
        var findFromField = QuoteUtils.getFindFromField(quote, quoteField);

        if(!(accessKeys[findFromField] && accessKeys[findFromField].hidden===true)){
            switch (findFrom) {

                case 'YIELD':
                    component = <Field name={`${quoteField}.listdealquoteelement[0].pfrtotalnominal`}
                                       component={NumberEntry} prefix="%"
                                       title={<FormattedMessage id="pos.quote.targetoptions.yield" defaultMessage="Yield"/>}
                    />;
                    break;
                case 'APR':
                    component = <Field name={QuoteUtils.getAPRField(quote, quoteField)}
                                       component={NumberEntry} prefix="%"
                                       title={<FormattedMessage id="pos.quote.targetoptions.apr"
                                                                defaultMessage="APR"/>}/>;
                    break;
                case 'FLAT':
                    component = <Field name={QuoteUtils.getFlatRateField(quote, quoteField)}
                                       component={NumberEntry} prefix="%"
                                       title={<FormattedMessage id="pos.quote.targetoptions.falterate"
                                                                defaultMessage="Flat rate"/>}
                                       numberOfDigitAfterDecimal="2"/>;
                    break;
                case 'NPC':
                    component = <CurrencyEntry
                        title={<FormattedMessage id="pos.quote.targetoptions.npc" defaultMessage="NPC"/>}
                    />;
                    break;
                case 'VAN3':
                    component = <CurrencyEntry
                        title={<FormattedMessage id="pos.quote.targetoptions.dgm" defaultMessage="DGM"/>}
                    />;
                    break;
                case 'VAN4':
                    component = <CurrencyEntry
                        title={<FormattedMessage id="pos.quote.targetoptions.commission" defaultMessage="Commission"/>}
                    />;
                    break;

                case 'MARG':
                    component = <Field name={`${quoteField}.listdealquoteelement[0].pfrmargenominale`}
                                       component={NumberEntry}
                                       prefix="%"
                                       title={<FormattedMessage id="pos.quote.targetoptions.margin"
                                                                defaultMessage="Margin"/>}
                                       numberOfDigitAfterDecimal="2"
                                       onChange={this.handleMarginChanged}/>;
            }
        }



        return (
            <DealBox title={<FormattedMessage id="pos.quote.targetoptions.title" defaultMessage="Target options"/>}
                     readOnly={readOnly}>
                <Field name={`${quoteField}.tpgcode`} component={SelectField}
                       options={tables.TPROFILGESTION}
                       title={<FormattedMessage id="pos.quote.targetoptions.financetype"
                                                defaultMessage="Product"/>}
                />

                <Field name={`${quoteField}.pcrlibelle`} value={scalekey} component={SelectField} hidden="true"
                       title={<FormattedMessage id="pos.quote.targetoptions.scale.title" defaultMessage="Scale"/>} key="scale"
                       options={tables.LANPRICINGCRITERIA}
                       refParams={{'tpgcode':quote.tpgcode,'devcode':this.props.devcode,'pfiinvestissement':quote.pfiinvestissement}}
                       onChange={this.handleScaleChanged}
                       autoSelect={true}/>


                <Field name={findWhatField} component={SelectField} options={dataFW}
                       {...accessKeys[findWhatField]}
                       title={<FormattedMessage id="pos.quote.targetoptions.findwhat" defaultMessage="Find what"/>}
                />

                <Field name={findFromField} component={SelectField} options={dataFF}
                       {...accessKeys[findFromField]}
                       title={<FormattedMessage id="pos.quote.targetoptions.findfrom" defaultMessage="Find from"/>}
                />

                {component}
            </DealBox>
        )
    }
}
