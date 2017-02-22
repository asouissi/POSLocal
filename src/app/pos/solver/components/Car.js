import React from 'react'
import {FormattedMessage, FormattedNumber} from 'react-intl';
import isEqual from 'lodash/isEqual';
import config from './config';

import {connect} from 'react-redux';
import {
    fetchReferenceTable,
    fetchReferenceTableWithParams,
    tables,
    getReferenceTable
} from '../../../core/reducers/referenceTable'

const EMPTY_OBJECT = {};
class Car extends React.Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.props.dispatch(fetchReferenceTable(tables.LANMAKE));
        this.fetchReferenceTable(this.props, {asset: {}});
    }

    shouldComponentUpdate(nextProps) {
        return !isEqual(nextProps, this.props)
    }

    componentWillReceiveProps(nextProps) {
        this.fetchReferenceTable(nextProps, this.props)
    }

    fetchReferenceTable(nextProps, props) {
        let asset = (props.quote && props.quote.variant) || {};
        let nasset = nextProps.quote && nextProps.quote.variant;

        if (nasset.makid) {
            (nasset.makid != asset.makid ) && this.props.dispatch(fetchReferenceTableWithParams(tables.LANMAKEMODEL, {'makid': nasset.makid}));
            if (nasset.mmocode) {
                (nasset.mmocode != asset.mmocode  ) && this.props.dispatch(fetchReferenceTableWithParams(tables.LANMAKMODTRIMLEVEL, {
                    'makid': nasset.makid,
                    'mmocode': nasset.mmocode
                }));

                if (nasset.mmtcode) {
                    (nasset.mmtcode != asset.mmtcode  ) && this.props.dispatch(fetchReferenceTableWithParams(tables.LANVARIANT, {
                        'makid': nasset.makid,
                        'mmocode': nasset.mmocode,
                        'mmtcode': nasset.mmtcode
                    }));
                }
            }
        }
    }


    render() {
        var quote = this.props.quote || {};
        var asset = quote.variant || {};

        var optionsSum = (asset.options) ? 0 : undefined;
        var options = [];
        if (asset.options && asset.options.length) {
            options = asset.options.filter((option) => option.option).map((option) => {
                optionsSum += option.unitPrice * option.quantity;
                return (<li key={option.key}>{option.description}</li>);
            });
            options = (<ul>{options}</ul>);
        }

        var imagevariant = [];
        if (asset.imagevariant) {
            const hostname = config.hostname || config.apis[config.masterApi].hostname;
            imagevariant = (<img src={hostname + asset.imagevariant} width="100%"/>);
        } else {
            imagevariant = (<img src="img/blank-car.png" height="155px" width="80%"/>);
        }

        let {listMake, listModel, listVariant, listTrim, listFinancialProduct} = this.props;
        let makid = asset.makid && asset.makid.toString();//// after save it is an integer
        let varid = asset.varid && asset.varid.toString();
        let make = listMake.find(item => item.code === makid);
        let model = listModel && listModel.find(item => item.code === asset.mmocode);
        let finish = listTrim && listTrim.find(item => item.code === asset.mmtcode);
        let variantItem = listVariant && listVariant.find(item => item.code === varid);
        let product = listFinancialProduct && listFinancialProduct.find(item => item.code === this.props.tpgcode);

        let summaryBody = (
            <div className="panel-collapse collapse in">
                {imagevariant}
                <dl className="dl-horizontal summary-offer-information">
                    <dt><FormattedMessage id="solver.summary.assetinfo.type.title"
                                          defaultMessage="Models &amp; Type"/></dt>
                    <dd>{make && make.label}</dd>
                    <dt><FormattedMessage id="solver.summary.assetinfo.model.title" defaultMessage="Model"/></dt>
                    <dd>{model && model.label}</dd>
                    <dt><FormattedMessage id="solver.summary.assetinfo.finish.title" defaultMessage="Finish"/></dt>
                    <dd>{finish && finish.label}</dd>
                    <dt><FormattedMessage id="solver.summary.assetinfo.variant.title" defaultMessage="Variant"/>
                    </dt>
                    <dd>{variantItem && variantItem.label}</dd>
                    <dt><FormattedMessage id="pos.solver.duration.title" defaultMessage="Duration"/></dt>
                    <dd className="number"><FormattedNumber value={quote.sqterm}/></dd>
                    <dt><FormattedMessage id="pos.solver.deposit.title" defaultMessage="Deposit"/></dt>
                    <dd className="number">{!isNaN(quote.sqdeposit) &&
                    <FormattedNumber value={quote.sqdeposit} format="currencyFormat"/>}</dd>
                    <dt><FormattedMessage id="pos.solver.mileage.title" defaultMessage="Mileage"/></dt>
                    <dd className="number">{quote.sqmileage ?
                        <FormattedNumber value={quote.sqmileage}/> : ''}</dd>
                    <dt><FormattedMessage id="pos.solver.sqmonthly.title"
                                          defaultMessage="Rental"/></dt>
                    <dd className="number">{quote.sqmonthly ?
                        <FormattedNumber value={quote.sqmonthly} format="currencyFormat"/> : ''}</dd>
                    <dt><FormattedMessage id="pos.solver.budget.title"
                                          defaultMessage="On the road price"/></dt>
                    <dd className="number">{asset.vprmt ?
                        <FormattedNumber value={asset.vprmt} format="currencyFormat"/> : ''}</dd>
                </dl>
            </div>
        );
        return summaryBody;
    }
}

const mapStateToProps = (state, props) => {

    const asset = props.quote.variant;

    return {
        listMake: getReferenceTable(state, tables.LANMAKE).data,
        listModel: getReferenceTable(state, tables.LANMAKEMODEL, {'makid': asset.makid}).data,
        listTrim: getReferenceTable(state, tables.LANMAKMODTRIMLEVEL, {
            'makid': asset.makid,
            'mmocode': asset.mmocode
        }).data,
        listVariant: getReferenceTable(state, tables.LANVARIANT, {
            'makid': asset.makid,
            'mmocode': asset.mmocode,
            'mmtcode': asset.mmtcode
        }).data
    }
};

export default connect(
    mapStateToProps
)(Car);
