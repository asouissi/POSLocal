import React from "react";
import {FormattedMessage} from "react-intl";
import isEqual from "lodash/isEqual";
import config from "./config";
import QuoteUtils from "../utils/QuoteUtils";
import Box from "../../../core/components/lib/Box";
import SummaryItem from "../../../core/components/lib/SummaryItem";
import {connect} from "react-redux";
import {formValueSelector} from "redux-form";
import RefTableDisplay from "../../../core/components/lib/RefTableDisplay";
import {tables} from "../../../core/reducers/referenceTable";

const EMPTY_OBJECT = {};
class GenericSummary extends React.Component {

    constructor(props) {
        super(props);
    }


    shouldComponentUpdate(nextProps) {
        return !isEqual(nextProps, this.props)
    }

    summaryItems = (assetMetadata) => {
        return assetMetadata.map((item) => {
            return (<SummaryItem metadata={item}  accessKeys={this.props.accessKeys[item.id]}/>);
        });
    }

    render() {

        let {mainfinanceamt, accessKeys, isMF} = this.props;

        var variant = this.props.variant || EMPTY_OBJECT;
        var asset = this.props.asset || {};
        var quote = {};
        var quoteelement = {};
        var displayOfferInfo = "box hide-box";
        let makid = asset.makid && asset.makid.toString();// after save it is an integer
        let varid = asset.varid && asset.varid.toString();
        if (this.props.quote !== undefined) {
            quote = this.props.quote;
            quoteelement = quote.listdealquoteelement[0] || {};
            displayOfferInfo = "box box-warning box-panel";
        }

        var optionsSum = (asset.options) ? 0 : undefined;
        var options = [];

        if (asset.listdealassetcomponent && asset.listdealassetcomponent.length) {
            options = asset.listdealassetcomponent.filter((option) => option.option).map((option) => {
                optionsSum += option.dmdprixunitaire * option.dmdquantite;

                return (<li key={option.key}>{option.dmddesignation}</li>);
            });
            options = (<ul>{options}</ul>);

        }
        var imagevariant = [];
        let imgHidden = accessKeys && accessKeys['pos.summary.assetinfo.variant.picture'] && accessKeys['pos.summary.assetinfo.variant.picture'].hidden
        if (!imgHidden) {
            if (variant.imagevariant) {
                const hostname = config.hostname || config.apis[config.masterApi].hostname;
                imagevariant = (
                    <img src={hostname + variant.imagevariant} width="100%"/>
                );
            }
            // else {
            //     imagevariant = (
            //         <img src="img/blank-car.png" height="155px" width="80%"/>
            //     );
            // }
        }


        const itemAssetMetadata = [
            {
                id: "pos.summary.assetinfo.type",
                label: <FormattedMessage id="pos.summary.assetinfo.type.title" defaultMessage="Models &amp; Type"/>,
                value: makid,
                customComponent: RefTableDisplay,
                customComponentMetadata: {
                    refTable: tables.LANMAKE
                }

            },
            {
                id: "pos.summary.assetinfo.model",
                label: <FormattedMessage id="pos.summary.assetinfo.model.title" defaultMessage="Model"/>,
                value: asset.mmocode,
                customComponent: RefTableDisplay,
                customComponentMetadata: {
                    refTable: tables.LANMAKEMODEL,
                    refParams: {
                        makid: asset.makid,
                    }
                }
            },
            {
                id: "pos.summary.assetinfo.finish",
                label: <FormattedMessage id="pos.summary.assetinfo.finish.title" defaultMessage="Finish"/>,
                value: asset.mmtcode,
                customComponent: RefTableDisplay,
                customComponentMetadata: {
                    refTable: tables.LANMAKMODTRIMLEVEL,
                    refParams: {
                        'makid': asset.makid,
                        'mmocode': asset.mmocode
                    }
                }
            },
            {
                id: "pos.summary.assetinfo.variant",
                label: <FormattedMessage id="pos.summary.assetinfo.variant.title" defaultMessage="Variant"/>,
                value: varid,
                customComponent: RefTableDisplay,
                customComponentMetadata: {
                    refTable: tables.LANVARIANT,
                    refParams: {
                        'makid': asset.makid,
                        'mmocode': asset.mmocode,
                        'mmtcode': asset.mmtcode,
                    }
                }
            },
            {
                id: "pos.summary.assetinfo.options",
                label: <FormattedMessage id="pos.summary.assetinfo.options.title" defaultMessage="Options"/>,
                value: options,
            },
            {
                id: "pos.summary.assetinfo.options.co2",
                label: <FormattedMessage id="pos.summary.options.co2.title" defaultMessage="Co2"/>,
                format: "number",
                value: asset.varcarbon
            },
            {
                id: "pos.summary.assetinfo.options.assetprice",
                label: <FormattedMessage id="pos.summary.options.assetprice.title" defaultMessage="Selling Price"/>,
                format: "currency",
                value: optionsSum ? optionsSum : asset.dpmmtinvest,
                currencyCode: this.props.currencyCode
            },
            {
                id: "pos.summary.assetinfo.options.sum",
                label: <FormattedMessage id="pos.summary.options.options.title" defaultMessage="Options Amount"/>,
                format: "currency",
                value: {optionsSum},
                currencyCode: this.props.currencyCode
            },
            {
                id: "pos.summary.assetinfo.options.kminit",
                label: <FormattedMessage id="pos.summary.options.kminit.title" defaultMessage="Km (initial value)"/>,
                format: "number",
                //todo value: {}
            }
        ]

        const itemOtherMetadata = [
            {
                id: "pos.summary.offerinfo.product",
                label: <FormattedMessage id="pos.summary.offerinfo.product.title" defaultMessage="Product"/>,
                value: this.props.tpgcode,
                customComponent: RefTableDisplay,
                customComponentMetadata: {
                    refTable: tables.TPROFILGESTION,
                    refParams: {
                        tpgflagfacility: isMF
                    },
                    allowEmptyParams: true,
                }
            },
            {
                id: "pos.summary.offerinfo.pfinom",
                label: <FormattedMessage id="pos.summary.offerinfo.pfinom.title" defaultMessage="Quote"/>,
                value: quote.pfinom
            },
            {
                id: "pos.summary.offerinfo.profitability",
                label: <FormattedMessage id="pos.summary.offerinfo.profitability.title" defaultMessage="Profitability"/>,
                format: "currency",
                value: quoteelement.pfrmargenominale,
                currencyCode: this.props.currencyCode
            },
            {
                id: "pos.summary.offerinfo.duration",
                label: <FormattedMessage id="pos.summary.offerinfo.duration.title" defaultMessage="Duration"/>,
                format: "number",
                value: quote.pfinbperiodes
            },
            {
                id: "pos.summary.offerinfo.frequency",
                label: <FormattedMessage id="pos.summary.offerinfo.frequency.title" defaultMessage="Frequency"/>,
                value: quote.pfiperiodicite,
                customComponent: RefTableDisplay,
                customComponentMetadata: {
                    refTable: tables.LANTTRPARAM,
                    refParams: {
                        ttrnom: 'PERIODE',
                    }
                }
            },
            {
                id: "pos.summary.offerinfo.mileage",
                label: <FormattedMessage id="pos.summary.offerinfo.mileage.title" defaultMessage="Mileage"/>,
                format: "number",
                value: quote.pfikilometrage
            },
            {
                id: "pos.summary.offerinfo.amount",
                label: <FormattedMessage id="pos.summary.offerinfo.amount.title" defaultMessage="Amount financed"/>,
                format: "currency",
                currencyCode: this.props.currencyCode,
                value: mainfinanceamt ? mainfinanceamt : quote.pfiinvestissement
            },
            {
                id: "pos.summary.offerinfo.stdrate",
                label: <FormattedMessage id="pos.summary.offerinfo.stdrate.title" defaultMessage="Standart rate"/>,
                format: "number",
                //todo value: {}
            },
            {
                id: "pos.summary.offerinfo.firstpay",
                label: <FormattedMessage id="pos.summary.offerinfo.firstpay.title" defaultMessage="First payment"/>,
                format: "currency",
                currencyCode: this.props.currencyCode,
                //todo value: {}
            },
            {
                id: "pos.summary.offerinfo.pay",
                label: <FormattedMessage id="pos.summary.offerinfo.pay.title" defaultMessage="Payment"/>,
                format: "currency",
                value: quoteelement.pfrmtloyer,
                currencyCode: this.props.currencyCode
            },
            {
                id: "pos.summary.offerinfo.commission",
                label: <FormattedMessage id="pos.summary.offerinfo.commission.title" defaultMessage="Commission"/>,
                format: "currency",
                //todo value: {},
                currencyCode: this.props.currencyCode
            },
            {
                id: "pos.summary.offerinfo.rv",
                label: <FormattedMessage id="pos.summary.offerinfo.rv.title" defaultMessage="RV"/>,
                format: "currency",
                value: quoteelement.pfrvr,
                currencyCode: this.props.currencyCode
            }
        ]


        let summaryBody = (
            <div>

                <Box type="panel"
                     title={<FormattedMessage id="pos.summary.assetinfo.title" defaultMessage="Asset information"/>}>

                    <div className="panel-collapse collapse in">
                        {imagevariant}
                        <dl className="dl-horizontal ">
                            {this.summaryItems(itemAssetMetadata)}
                        </dl>
                    </div>
                </Box>
                <div className={displayOfferInfo}>
                    <div className="box-header with-border">
                        <h4 className="box-title"><FormattedMessage id="pos.summary.offerinfo.title"
                                                                    defaultMessage="Offer information"/></h4>
                    </div>
                    <div className="panel-collapse collapse in">
                        <dl className="dl-horizontal">
                            {this.summaryItems(itemOtherMetadata)}
                        </dl>
                    </div>
                </div>
            </div>

        );
        return summaryBody;
    }
}

const mapStateToProps = (state, props) => {
    const dealPath = props.dealPath + '.' || '';
    const selector = formValueSelector(props.form);
    const quote = selector(state, dealPath + 'listdealquote[' + props.quoteIndex + ']');
    const asset = selector(state, dealPath + 'listdealasset[' + props.assetIndex + ']') || "";
    const tpgcode = selector(state, dealPath + 'tpgcode');
    const currencyCode = selector(state, dealPath + 'devcode');
    const attr = QuoteUtils.getQuoteAttribute(quote, QuoteUtils.pfacodes.MAINFINACEAMT.pfacode);

    let mainfinanceamt = 0.0;
    if (attr && attr.pfadouble) {
        mainfinanceamt = attr.pfadouble;
    }
    return {
        tpgcode,
        mainfinanceamt,
        currencyCode,
        quote,
        asset
    }
};

export default connect(
    mapStateToProps
)(GenericSummary);
