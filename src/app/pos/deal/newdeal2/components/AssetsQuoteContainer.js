'use strict'
import React from "react";
import {connect} from "react-redux";
import {injectIntl, defineMessages, FormattedMessage} from "react-intl";
import Box from "../../../../core/components/lib/Box";
import TextEntry from "../../../../core/components/lib/TextEntry";
import CurrencyEntry from "../../../../core/components/lib/CurrencyEntry";
import assets from "../../assets";
import dealUtils from "../../utils/dealUtils";
import sharedUtils from "../../../../core/utils/sharedUtils";
import * as sharedConst from "../../../../core/utils/sharedUtils";
import {tables} from "../../../../core/reducers/referenceTable";
import {
    appendNewAsset2,
    updateAssetAfterAcacodeChanged2,
    updateAssetAfterNapcodeChanged2,
    updateAssetAfterDpmmtinvestChanged2
} from "../reducers/actions";
import {Field, formValueSelector, change, getFormValues} from "redux-form";
import SelectField from "../../../../core/components/lib/SelectField";
import customer from "../../customer";
import {ACTOR} from '../../../../common/index';

const {removeAsset} = assets.actions;

const messages = defineMessages({
    removeAssetTitle: {id: "pos.quote.assets.btn.removeasset.title", defaultMessage: 'Remove asset'},
    categoryPlaceholder: {id: "pos.quote.assets.category.placeholder", defaultMessage: 'Select a category'},
    assetTypePlaceHolder: {id: "pos.quote.assets.type.placeholder", defaultMessage: 'Select a type'}
});

const CustomerContainer = customer.components.CustomerContainer;
const ACTOR_ROUTE = {path: ACTOR};
const SUPPLIER_ROLCODE = 'FOURN';
const DEAL_QUOTE = 'dealQuote';
/**
 * Component for one asset
 */
class OneAsset extends React.Component {

    constructor(props) {
        super(props);

        this.state = {};
        this.dispatch = props.dispatch;
    }


    handleAssetCategoryChanged = (value) => {
        this.dispatch(updateAssetAfterAcacodeChanged2(this.props.assetField, this.props.asset.dpmordre, value.code));
    };

    handleAssetTypeChanged = (value) => {
        this.dispatch(updateAssetAfterNapcodeChanged2(this.props.assetField, this.props.asset.dpmordre, value.code));
    };

    handleAssetAmountChanged = (event) => {
        this.dispatch(updateAssetAfterDpmmtinvestChanged2(this.props.assetField, this.props.asset.dpmordre, event.target.value));
    };

    handleAssetChanged = (event) => {
        this.dispatch(change('dealQuote', `${this.props.assetField}.actionMode`, this.props.asset.actionMode));
    };

    handleRemoveAssetClicked = () => {
        this.dispatch(removeAsset('dealQuote', this.props.assetIndex));
    };

    render() {
        let {asset, mdClassName, tpgcode, intl, currencyCode, ...props} = this.props;
        let {formatMessage} = intl;
        let dpmordre = asset.dpmordre;

        let title = "Asset #" + dpmordre;
        if (asset._actionMode === sharedConst.ACTION_MODE_INSERTION) {
            title = "New Asset";
        }

        let idAssetCategory = "acacode" + dpmordre;
        let idAssetType = "napcode" + dpmordre;
        let idAssetDescription = "dpmlibelle" + dpmordre;
        let idAssetAmount = "dpmmtinvest" + dpmordre;

        // The toolbox is used for the Cross to remove an asset
        var toolBox = (    <div className="box-tools pull-right">
            <button type="button" className="btn btn-box-tool"
                    title={formatMessage(messages.removeAssetTitle)}
                    onClick={this.handleRemoveAssetClicked}>
                <i className="fa fa-times"></i>
            </button>
        </div> );

        return (
            <div className={mdClassName}>
                <Box type="primary" title={title} withBorder="true" tools={toolBox}>
                    <Field name={`${this.props.assetField}.acacode`} component={SelectField}
                           options={tables.LANASSETCATEGORY}
                           refParams={{'tpgcode': tpgcode}}
                           title={<FormattedMessage id="pos.quote.assets.category" defaultMessage="Category"/>}
                           placeholder={formatMessage(messages.categoryPlaceholder)}
                           onChange={this.handleAssetCategoryChanged}/>

                    <Field name={`${this.props.assetField}.napcode`} component={SelectField}
                           options={tables.LANNAP}
                           refParams={{'tpgcode': tpgcode, 'acacode': asset.acacode}}
                           title={<FormattedMessage id="pos.quote.assets.type.title" defaultMessage="Type"/>}
                           placeholder={formatMessage(messages.assetTypePlaceHolder)}
                           onChange={this.handleAssetTypeChanged}/>

                    <Field name={`${this.props.assetField}.dpmlibelle`} component={TextEntry}
                           title={<FormattedMessage id="pos.quote.assets.description"
                                                    defaultMessage="Description"/>}
                           onChange={this.handleAssetChanged}/>

                    <Field name={`${this.props.assetField}.dpmmtinvest`} component={CurrencyEntry}
                           currencyCode={currencyCode}
                           title={<FormattedMessage id="pos.quote.assets.amount" defaultMessage="Amount"/>}
                           onChange={this.handleAssetAmountChanged}/>

                    <CustomerContainer
                        route={ACTOR_ROUTE}
                        form={DEAL_QUOTE} rolcode={SUPPLIER_ROLCODE} key="dealQuote-AssetContainer"
                        searchTitle={<FormattedMessage id="pos.quote.suppliersearch.title"
                                                       defaultMessage="Search Supplier"/>}
                        newTitle={<FormattedMessage id="pos.quote.newsupplier.title"
                                                    defaultMessage="New Supplier"/>}
                        customernumberTitle="Supplier Number"
                        customernameTitle="Supplier Name"
                        rolcodes={[SUPPLIER_ROLCODE]}
                        isActorTypeHidden={true}
                        actorList={`${this.props.assetField}.listdealassetactor`}
                        isSearchEntryClearable={true}
                    />,
                </Box>
            </div>
        );
    }
}

const OneAssetBox = (injectIntl(OneAsset));

class AssetsQuoteContainer extends React.Component {
    constructor(props) {
        super(props);
        this.dispatch = props.dispatch;
    }

    handleNewAssetClicked = () => {
        this.dispatch(appendNewAsset2());
    }

    computeDefaultClassLayoutForBoxes(p_nbOfAssets) {
        if (p_nbOfAssets == 1) {
            return 'col-md-12';
        }
        else {
            return 'col-md-6';
        }
    }

    get quoteField() {
        return 'listdealquote[' + this.props.quoteIndex + ']';
    }

    computeDefaultClassLayoutForTitleBar(p_nbOfAssets) {
        if (p_nbOfAssets == 1) {
            return 'col-md-6';
        }
        else {
            return 'col-md-6';
        }
    }

    render() {

        let {dpimt, listdealasset, readOnly, tpgcode, listCategory, quoteIndex, currencyCode, ...props} = this.props;
        const clsAssetAmount = this.props.listdealquote
                                && this.props.listdealquote[quoteIndex]
                                && parseInt(this.props.listdealquote[quoteIndex].pfiinvestissement) === parseInt(dpimt) ? "verified" : "mismatch";

        let visibleAssets = listdealasset.filter((p_asset) => {
            return sharedUtils.isValid(p_asset)
        });

        let mdClassNameBoxes = this.computeDefaultClassLayoutForBoxes(visibleAssets.length);
        let mdClassNameTitleBar = this.computeDefaultClassLayoutForTitleBar(visibleAssets.length);

        let allBoxes = listdealasset.map((asset, index) => {
            if (sharedConst.ACTION_MODE_DELETION !== asset.actionMode) {
                return (
                    <OneAssetBox tpgcode={tpgcode} listCategory={listCategory} asset={asset} assetIndex={index}
                                 assetField={"listdealasset[" + index + "]"} mdClassName={mdClassNameBoxes}
                                 dispatch={this.dispatch}/> );
            }

        });

        let clReadOnly = readOnly ? 'read-only' : '';

        return (
            <div className={"asset-creation-form " + clReadOnly}>
                <div className="row">
                    <div className="col-md-10 no-padding">
                        <div className="col-sm-6">
                            <CurrencyEntry
                                id="dpimt" value={dpimt} readOnly="true" inputClassName={clsAssetAmount}
                                currencyCode={currencyCode}
                                title={<FormattedMessage id="pos.quote.assets.totalamount"
                                                         defaultMessage="Total amount"/>}
                            />
                        </div>
                        <div className="col-sm-6">
                            <Field name={`${this.quoteField}.pfiinvestissement`} component={CurrencyEntry}
                                   readOnly={true} currencyCode={currencyCode}
                                   title={<FormattedMessage id="pos.quote.assets.assetcost"
                                                            defaultMessage="Asset cost"/>}
                            />

                        </div>
                    </div>
                    <div className="col-md-2">
                        <label className="control-label" style={{visibility: 'hidden'}}>X</label>

                        <div className="btn-new-asset">
                            <button ref="newAsset" type="button" className="btn btn-primary fa fa-plus"
                                    onClick={this.handleNewAssetClicked}
                                    title={<FormattedMessage id="pos.quote.assets.btn.newasset"
                                                             defaultMessage="New asset"/>}>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="row">
                    {allBoxes}
                </div>
            </div> );
    }
}

const selector = formValueSelector('dealQuote');
const mapStateToProps = (state, props) => {
    const tpgcode = selector(state, 'tpgcode');
    const currencyCode = selector(state, 'devcode');
    const deal = getFormValues('dealQuote')(state);

    return {
        quoteIndex: state.newdeal2.quoteIndex,
        listdealquote: selector(state, 'listdealquote'),
        listdealasset: selector(state, 'listdealasset'),
        options: state.newdeal2.options,
        readOnly: state.newdeal2.readOnly,
        dpimt: dealUtils.getTotalAssetAmount(deal),
        tpgcode, currencyCode
    }
};


export default connect(
    mapStateToProps
)(injectIntl(AssetsQuoteContainer));