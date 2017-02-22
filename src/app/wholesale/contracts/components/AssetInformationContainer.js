'use strict'
import React, {Component, PropTypes} from 'react';
import Box from '../../../core/components/lib/Box';
import {connect} from 'react-redux'
import {FormattedMessage, FormattedNumber} from 'react-intl';
import {
    fetchReferenceTable,
    fetchReferenceTableWithParams,
    tables,
    getReferenceTable
} from '../../../core/reducers/referenceTable'
import {fetchContract} from '../reducers/actions'


/**
 *
 *
 Fetch asset with :

 <AssetInformationContainer
    parentDosId = {this.props.params.dosid}
    contractId={this.props.params.contractId}  />

 or display asset with:

 <AssetInformationContainer
    asset={assetObject}  />

 */


class AssetInformation extends Component {

    componentWillMount() {
        if(this.props.contractId){
            this.props.dispatch(fetchContract(this.props.contractId, this.props.parentDosId));
        }

        this.props.dispatch(fetchReferenceTable(tables.LANMAKE));
        this.props.dispatch(fetchReferenceTableWithParams(tables.LANTUSPARAM, {'tusnom': 'COLOR'}));
    }


    componentWillReceiveProps(nextProps) {
        nextProps.asset.makId && nextProps.asset.makid != this.props.asset.makid && this.props.dispatch(fetchReferenceTableWithParams(tables.LANMAKEMODEL, {'makid': nextProps.asset.makid}));
        nextProps.asset.makId && nextProps.asset.mmocode && nextProps.asset.mmocode != this.props.asset.mmocode && this.props.dispatch(fetchReferenceTableWithParams(tables.LANMAKMODTRIMLEVEL, {
            'makid': nextProps.asset.makid,
            'mmocode': nextProps.asset.mmocode
        }));

    }

    render() {
        let {makid, mmocode, mmtcode, dosmtproduct, iruserialnumber, irccolor, phacode} = this.props.asset;
        let {listMake, listModel, listColor, listTrim, children} = this.props;
        let make = listMake.find(item => item.code === makid);
        let model = listModel && listModel.find(item => item.code === mmocode);
        let trim = listTrim && listTrim.find(item => item.code === mmtcode);
        let color = listColor && listColor.find(item => item.code === irccolor);

        var imageVariant = (<img className="variant-img" src="img/cars/santander.svg" height="155px" width="80%"/>);

        return (
            <Box title={<FormattedMessage id="wholesale.asset.informations.box.title"
                                          defaultMessage="Asset information"/>}
                 loading={this.props.isLoading}>
                {imageVariant}
                <dl className="dl-horizontal summary-offer-information">
                    <dt><FormattedMessage id="wholesale.assetinfo.make" defaultMessage="Make"/></dt>
                    <dd>{make && make.label}</dd>
                    <dt><FormattedMessage id="wholesale.assetinfo.model" defaultMessage="Model"/></dt>
                    <dd>{model && model.label}</dd>
                    <dt><FormattedMessage id="wholesale.assetinfo.trim" defaultMessage="Trim"/></dt>
                    <dd>{trim && trim.label}</dd>
                    <dt><FormattedMessage id="wholesale.assetinfo.color" defaultMessage="Color"/></dt>
                    <dd>{color && color.label}</dd>
                    <dt><FormattedMessage id="wholesale.assetinfo.vin" defaultMessage="Vin"/></dt>
                    <dd>{iruserialnumber && iruserialnumber}</dd>
                    <dt><FormattedMessage id="wholesale.assetinfo.amount" defaultMessage="Amount"/></dt>
                    <dd>{dosmtproduct ?
                        <FormattedNumber value={dosmtproduct} format="currencyFormat"/> : ''}</dd>

                </dl>
                {children}
            </Box>
        )
    }
}


AssetInformation.propTypes = {
    asset : React.PropTypes.object, // Asset with makid, mmocode, mmtcode
    contactId : React.PropTypes.number, //id to fetch the asset
    parentDosId : React.PropTypes.number, // parent dos i hope tmp
    children : React.PropTypes.node // parent dos i hope tmp
};


const mapStateToProps = (state, ownProps) => {

    let {asset} = ownProps;
    if(!asset && ownProps.contractId) {
        asset = state.contracts.contract;
    }

    return {
        isLoading: state.contracts.isLoading,
        listMake: getReferenceTable(state, tables.LANMAKE).data,
        listModel: getReferenceTable(state, tables.LANMAKEMODEL, {'makid': asset.makid}).data,
        listColor: getReferenceTable(state, tables.LANTUSPARAM, {'tusnom': 'COLOR'}).data,
        listTrim: getReferenceTable(state, tables.LANMAKMODTRIMLEVEL, {
            'makid': asset.makid,
            'mmocode': asset.mmocode
        }).data,
        asset
    }
};

const mapDispatchToProps = {};

export default connect(
    mapStateToProps
)(AssetInformation)


