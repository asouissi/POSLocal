import React from "react";
import {connect} from "react-redux";
import Box from '../../../core/components/lib/Box';
import {defineMessages, injectIntl, FormattedMessage, FormattedNumber} from "react-intl";
import {
    fetchReferenceTableWithParams,
    tables,
    getReferenceTable
} from '../../../core/reducers/referenceTable'

import QuoteUtils from '../../deal/utils/QuoteUtils'

const MasterFacility = true;

const formatPercent = (value) => {
    if (typeof(value) !== "number" || isNaN(value)) {
        return "";
    }
    return value.toFixed(2);
}

class SolverInfos extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.dispatch(fetchReferenceTableWithParams(tables.TPROFILGESTION, {tpgflagfacility: +MasterFacility}));
    }


    render() {

        let deal = this.props.deal;
        let quote = deal.listdealquote[0] || {listdealquoteelement: []};
        let quoteelement = QuoteUtils.getQuoteElement(quote);

        let quoteProps;
        if (quote.listdealquoteelement.length) {
            quoteProps = {
                name: QuoteUtils.getQuoteName(quote),
                margin: QuoteUtils.getMargin(quote),
                myyield: QuoteUtils.getYield(quote),
                flatrate: QuoteUtils.getFlatRate(quote),
                npv: QuoteUtils.getNPV(quote),
                na: QuoteUtils.getNetAdvanceMnt(quote),
                pm: QuoteUtils.getPaymentMnt(quote),
                docFeeOption: QuoteUtils.getOptionFeeMnt(quote),
                docFee: QuoteUtils.getDocumentationFeeMnt(quote)
            }
        }
        let product = this.props.listFinancialProduct && this.props.listFinancialProduct.find(item => item.code === deal.tpgcode);

        return (<Box type="primary" className="solver-solution summary-offer-information"
                     truncateTitle={false}
                     title={<FormattedMessage id="solver.solver.solution.title"
                                              defaultMessage="Solution Personal Contract Plan, Representative Example"/>}
                     withBoder="true">


                <dl className="dl-horizontal paymentDetails">
                    <dt>{<FormattedMessage id="solver.quote.summary.margin" defaultMessage="Margin "/>}
                        %
                    </dt>
                    <dd>{formatPercent(quoteProps.margin)}</dd>
                    <dt>{<FormattedMessage id="solver.quote.summary.yield" defaultMessage="Yield "/>}
                        %
                    </dt>
                    <dd>{formatPercent(quoteProps.myyield)}</dd>
                    <dt>{<FormattedMessage id="solver.quote.summary.apr" defaultMessage="APR "/>} %
                    </dt>
                    <dd></dd>
                    <dt>{<FormattedMessage id="solver.quote.summary.flatrate"
                                           defaultMessage="Flat rate "/>} %
                    </dt>
                    <dd>{formatPercent(quoteProps.flatrate)}</dd>
                    <dt>{<FormattedMessage id="solver.quote.summary.npv" defaultMessage="NPV"/>}</dt>
                    <dd>{quoteProps.npv ?
                        <FormattedNumber value={quoteProps.npv}
                                         format="currencyFormat"/> : ''}</dd>
                </dl>


                <dl className="dl-horizontal summary-offer-information">
                    <dt><FormattedMessage id="solver.summary.offerinfo.product.title"
                                          defaultMessage="Product"/>
                    </dt>
                    <dd>{product && product.label}</dd>
                    <dt><FormattedMessage id="solver.summary.offerinfo.duration.title"
                                          defaultMessage="Duration"/>
                    </dt>
                    <dd className="number">{quote.pfinbperiodes ?
                        <FormattedNumber value={quote.pfinbperiodes}/> : ''}</dd>
                    <dt><FormattedMessage id="solver.summary.offerinfo.mileage.title"
                                          defaultMessage="Mileage"/>
                    </dt>
                    <dd className="number">{quote.pfikilometrage ?
                        <FormattedNumber value={quote.pfikilometrage}/> : ''}</dd>
                    <dt><FormattedMessage id="solver.summary.offerinfo.amount.title"
                                          defaultMessage="Amount"/></dt>
                    <dd className="number">{quote.pfiinvestissement ?
                        <FormattedNumber value={quote.pfiinvestissement}
                                         format="currencyFormat"/> : ''}</dd>
                    <dt><FormattedMessage id="solver.summary.offerinfo.stdrate.title"
                                          defaultMessage="Standart rate"/></dt>
                    <dd className="number"></dd>
                    <dt><FormattedMessage id="solver.summary.offerinfo.firstpay.title"
                                          defaultMessage="First payment"/></dt>
                    <dd className="number"></dd>
                    <dt><FormattedMessage id="solver.summary.offerinfo.pay.title"
                                          defaultMessage="Payment"/></dt>
                    <dd className="number">{quoteelement.pfrmtloyer ?
                        <FormattedNumber value={quoteelement.pfrmtloyer}
                                         format="currencyFormat"/> : ''}</dd>
                    <dt><FormattedMessage id="solver.summary.offerinfo.commission.title"
                                          defaultMessage="Commission"/></dt>
                    <dd className="number important"></dd>
                </dl>

            </Box>
        );
    }
}

const mapStateToProps = (state, props) => {
    return {
        listFinancialProduct: getReferenceTable(state, tables.TPROFILGESTION, {tpgflagfacility: +MasterFacility}).data,
    };
};

export default connect(mapStateToProps)(injectIntl(SolverInfos));
