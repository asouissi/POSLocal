'use strict'
import React from 'react'
import {connect} from 'react-redux';

import NavTabs from '../../../../core/components/lib/NavTabs';
import Timeline from '../../../../common/timeline/components/Timeline';
import dealUtils from '../../utils/dealUtils'
import QuoteUtils from '../../utils/QuoteUtils'
import union from 'lodash/union'
import {saveItem, readItem} from '../../../../common/timeline/reducers/actions'
import {setMainQuote} from '../reducers/dealQuote'
import Box from '../../../../core/components/lib/Box.js';

import {getTimeLine} from '../../../../common/timeline/reducers/actions'
import { timelineSelector } from '../../../../common/timeline/TimelineSelector'
import {FormattedMessage, FormattedNumber} from 'react-intl'
import {formValueSelector, getFormValues} from 'redux-form'
import ListErrors from "../../../../common/components/ListErrors";
import {handleFaultyStep} from "../reducers/newdeal2";

const formatPercent = (value) => {
    if (typeof(value) !== "number" || isNaN(value)) {
        return "";
    }
    return value.toFixed(2);
}

const SummaryQuote = (props) => (
    <Box className="box box-primary panel" title={props.name}
         tools={props.tools}>


        <dl className="dl-horizontal paymentDetails">
            <dt>{<FormattedMessage id="pos.quote.summary.margin" defaultMessage="Margin " />} %</dt>
            <dd>{formatPercent(props.margin)}</dd>
            <dt>{<FormattedMessage id="pos.quote.summary.yield" defaultMessage="Yield " />} %</dt>
            <dd>{formatPercent(props.myyield)}</dd>
            <dt>{<FormattedMessage id="pos.quote.summary.apr" defaultMessage="APR " />} %</dt>
            <dd></dd>
            <dt>{<FormattedMessage id="pos.quote.summary.flatrate" defaultMessage="Flat rate " />} %</dt>
            <dd>{formatPercent(props.flatrate)}</dd>
            <dt>{<FormattedMessage id="pos.quote.summary.npv" defaultMessage="NPV" />}</dt>
            <dd>{props.npv?<FormattedNumber value={props.npv}  format="currencyFormat" currency={props.currencyCode} />:''}</dd>
        </dl>


        <dl className="dl-horizontal paymentDetails">
            <dt>{<FormattedMessage id="pos.quote.summary.netadvance" defaultMessage="Net advance" />}</dt>
            <dd>{props.na?<FormattedNumber value={props.na}  format="currencyFormat" currency={props.currencyCode} />:''}</dd>
            <dt>{<FormattedMessage id="pos.quote.summary.payment" defaultMessage="Payment" />}</dt>
            <dd>{props.pm?<FormattedNumber value={props.pm} format="currencyFormat" currency={props.currencyCode} />:''}</dd>
            <dt>{<FormattedMessage id="pos.quote.summary.documentationfees" defaultMessage="Documentation fees" />}</dt>
            <dd>{props.docFee?<FormattedNumber value={props.docFee} format="currencyFormat" currency={props.currencyCode} />:''}</dd>
            {props.optionfee1}{props.optionfee2}
            {/*<dt>{<FormattedMessage id="pos.quote.summary.rate" defaultMessage="Rate per 1000" />}</dt>
            <dd>{formatPercent(props.rate1000)}</dd>*/}
            <dt>{<FormattedMessage id="pos.quote.costanalysis.vat"/>}</dt>
            <dd>{props.vat}</dd>

        </dl>

    </Box>
);

const SummaryToolBox = props => (
    <div className="box-tools pull-right summary-tools">
        <button type="button" className="btn btn-box-tool"
                onClick={props.onClick}>
            {props.icon} Main
        </button>
    </div>
);


const DEFAULT_EMPTY = [];

class Summary2 extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            items: [{
                creationdate: new Date(2016, 1, 11, 17, 27),
                subtype: 'sort-numeric-asc',
                userfirstname: 'DEALER1',
                description: 'Generate contract number'
            }, {
                creationdate: new Date(2016, 1, 3, 8, 0),
                subtype: 'bank',
                userfirstname: 'DEALER1',
                description: 'Transfer into Back Office'
            }, {
                creationdate: new Date(2016, 0, 3, 18, 0),
                subtype: 'user',
                userfirstname: 'DEALER1',
                description: 'Submit for approval',
                comment: 'Net Advance: £ 20,000\nStandard rate: 3.2%\nPayment: 36 months, £ 2,000'
            }, {
                creationdate: new Date(2016, 0, 3, 16, 0),
                subtype: 'file',
                userfirstname: 'Mina Lee',
                description: 'uploaded new document',
                documentURL: 'http://www.google.fr',
                previewURL: 'img/types/pdf.png'
            }, {
                creationdate: new Date(2015, 11, 22, 14, 0),
                subtype: 'money',
                userfirstname: 'DEALER1',
                description: 'Promote to deal'
            }, {
                creationdate: new Date(2015, 11, 2, 10, 0),
                subtype: 'money',
                userfirstname: 'DEALER1',
                description: 'New opportunity'
            }
            ]
        };
    }

    componentWillReceiveProps(nextProps) {

        if (this.props.dosid !== nextProps.dosid
            || this.props.dosid && !this.timeLineInterval) {
            this.startTimeLinePoll(nextProps.dosid);

            if (!nextProps.dosid) {
                this.props.dispatch(getTimeLine());
            }
        }
    }


    componentWillMount() {
        let dealId =  this.props.dosid;
        this.props.dispatch(getTimeLine(dealId));
    }

    startTimeLinePoll(dealId) {
        this.stopTimeLinePoll();
        if (dealId) {
            this.props.dispatch(getTimeLine(dealId));
            this.timeLineInterval = setInterval(() => this.props.dispatch(getTimeLine(dealId)), 1000 * 30);
        }
    }

    stopTimeLinePoll() {
        if (this.timeLineInterval) {
            clearInterval(this.timeLineInterval);
            this.timeLineInterval = undefined
        }
    }

    componentWillUnmount() {
        this.stopTimeLinePoll();
    }

    handleNewItem(event) {
        this.setState((state) => {
            var items = state.items;

            items.forEach(item => item.editable = false);

            items.unshift({
                dealid: this.props.dosid,
                creationdate: new Date().getTime(),
                type: 'TASK',
                subtype: 'CHAT',
                userfirstname: 'Me',
                description: 'Note',
                editable: true
            });

            setTimeout(() => {
                this.refs.timeline.setFocus();
            }, 200);

            return {items: items};
        });
    }

    handleSaveItem(item) {
        this.state.items.shift();
        delete item.editable;
        item.userfirstname = this.props.user.firstname;
        item.userlastname = this.props.user.lastname;
        item.usercode = this.props.user.uticode;

        this.props.dispatch(saveItem(item))
    }

    handleReadItem(item) {
        this.props.dispatch(readItem(item, item.dealid));
    }

    handleSetMainQuote(quote) {
        this.props.dispatch(setMainQuote(quote));
    }

    handleErrorClick = () => {
        this.props.dispatch(handleFaultyStep(this.props.syncErrors ,'dealQuote'));
    }


    render() {
        var selectedQuote = this.props.selectedQuote;
        let currencyCode = this.props.currencyCode;
        var summaryBody = this.props.listdealquote.map((quote, index) => {

            var props = {
                name: QuoteUtils.getQuoteName(quote),
                margin: QuoteUtils.getMargin(quote),
                myyield: QuoteUtils.getYield(quote),
                flatrate: QuoteUtils.getFlatRate(quote),
                npv: QuoteUtils.getNPV(quote),
                na: QuoteUtils.getNetAdvanceMnt(quote),
                pm: QuoteUtils.getPaymentMnt(quote),
                docFeeOption: QuoteUtils.getOptionFeeMnt(quote),
                docFee: QuoteUtils.getDocumentationFeeMnt(quote),
                vat: QuoteUtils.getAssetVATMnt(quote),
                currencyCode
            }

            let optionfee1 = [];
            let optionfee2 = [];
            if (QuoteUtils.getQuoteType(quote) === "HP") {
                optionfee1 = <dt><FormattedMessage id="pos.quote.summary.optionfees" defaultMessage="Option fees" /></dt>
                optionfee2 = <dd>{props.docFeeOption?<FormattedNumber value={props.docFeeOption} format="currencyFormat" currency={this.props.currencyCode} />:''}</dd>
            }

            props.optionfee1 = optionfee1;
            props.optionfee2 = optionfee2;

            props.rate1000 = (props.na > 0) ? props.pm / props.na * 1000 : undefined;

            //add box tools
            let selectIcon = <i className="fa fa-square-o" 
                                title={<FormattedMessage id="pos.quote.summary.selectquote" defaultMessage="Select quote" />}/>;
            if (quote === selectedQuote) {
                selectIcon = <i className="fa fa-check-square-o" title={<FormattedMessage id="pos.quote.summary.selectedquote" defaultMessage="Selected quote" />}/>;
            }

            props.tools = <SummaryToolBox icon={selectIcon} onClick={() => this.handleSetMainQuote(quote)}/>;

            return <SummaryQuote {...props} />;
        });


        let items = union(this.props.timeLine, this.state.items);
        let timelineProps = {};

        if (this.props.dosid) {
            timelineProps.onNewItem = event => this.handleNewItem(event);
            timelineProps.onSaveNewItem = item => this.handleSaveItem(item);
            timelineProps.onReadItem = item => this.handleReadItem(item);
        }

        var timelineBody = (<Timeline items={items} {...timelineProps} ref="timeline"/>);

        var tabs = [{
            key: 'summary',
            title: <FormattedMessage id="pos.quote.summary.title" defaultMessage="Summary" />,
            body: summaryBody
        }, {
            key: 'timeline',
            title:  <FormattedMessage id="pos.quote.timeline.title" defaultMessage="Timeline" />,
            body: timelineBody
        }];

        var controlTabs = {
            key: "errors",
            title: <FormattedMessage id="pos.quote.controls" defaultMessage="Controls"/>,
            body: <ListErrors errors={this.props.error} control={this.props.control}  onErrorClick={this.handleErrorClick}/>,
            active: true
        }

        if (this.props.submitFailed && (this.props.error || (this.props.control && this.props.control.controlemsgList && this.props.control.controlemsgList.length > 0))) {
            tabs.push(controlTabs)
        }

        return (
            <NavTabs className="summary" tabs={tabs}/>
        )
    }
}
const selector = formValueSelector('dealQuote');
const timelineselector = timelineSelector();
const makeMapStateToProps = () => {

    const mapStateToProps = (state, props) => ({
        quote: selector(state, "listdealquote[" + state.newdeal2.quoteIndex + "]"),
        listdealquote: selector(state, 'listdealquote'),
        dosid: selector(state, 'dosid'),
        tpgcode: selector(state, 'tpgcode'),
        user: state.authentication.user,
        timeLine: timelineselector(state.timeline.deal, props),
        readOnly: state.newdeal2.readOnly,
        selectedQuote: dealUtils.getSelectedQuote(getFormValues('dealQuote')(state)),
        control : state.newdeal2.control,
        currencyCode: selector(state, "devcode")
    });

    return mapStateToProps;

}

export default connect(
    makeMapStateToProps
)(Summary2);
