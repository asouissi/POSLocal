'use strict'
import React from "react";
import {connect} from "react-redux";
import {injectIntl, defineMessages, FormattedMessage} from "react-intl";
import {Field, formValueSelector, change, arrayPush} from "redux-form";
import Immutable from "seamless-immutable";
import {tables} from "../../../../core/reducers/referenceTable";
import Box from "../../../../core/components/lib/Box";
import CurrencyEntry from "../../../../core/components/lib/CurrencyEntry";
import IntegerEntry from "../../../../core/components/lib/IntegerEntry";
import TextEntry from "../../../../core/components/lib/TextEntry";
import SelectField from "../../../../core/components/lib/SelectField";
import sharedUtils from "../../../../core/utils/sharedUtils";
import * as sharedConst from "../../../../core/utils/sharedUtils";
import AssetComponents from "../../assets/components/AssetComponents";
import assets from "../../assets";
import {batchActions} from "redux-batched-actions";
import {appendDealNewQuote, changeQuoteIndex, fetchRateTax, removeQuote, setTpgcode, updateAssetAfterNapcodeChanged2} from "../reducers/actions";

const {

    setCarVariant,
    initVariant,
    appendDealNewAsset,
    changeAssetIndex,
    removeAsset,
    copyVariant

} = assets.actions;

const debug = (...messages) => console.log.apply(console, messages);
const DEFAULT_EMPTY = [];
const DEFAULT_NULL = null;


const AssetToolBox = props => (
    <div className="box-tools pull-right asset-tools">
        <button type="button" className="btn btn-box-tool"
                title={props.title}
                onClick={props.onDeleteClick}>
            <i className="fa fa-times"></i>
        </button>
    </div>
);
const messages = defineMessages({
    assetCategPlaceHolder: {id: "pos.deal.assetcateg.placeholder", defaultMessage: 'Select a category'},
    assetMakePlaceHolder: {id: "pos.deal.assetmake.placeholder", defaultMessage: 'Select a constructor'},
    assetModelPlaceHolder: {id: "pos.deal.assetmodel.placeholder", defaultMessage: 'Select a model'},
    assetfinishPlaceHolder: {id: "pos.deal.assetfinish.placeholder", defaultMessage: 'Select a finish'},
    assetVariantPlaceHolder: {id: "pos.deal.assetvariant.placeholder", defaultMessage: 'Select a variant'},
    assetEnergyPlaceHolder: {id: "pos.deal.assetenergy.placeholder", defaultMessage: 'Select an energy'},
    assetVATPlaceHolder: {id: "pos.deal.assetvat.placeholder", defaultMessage: 'VAT'},
    assetTaxCodePlaceHolder: {id: "pos.deal.assettaxcode.placeholder", defaultMessage: 'Select a tax code'},
    addAssetLabel: {id: "pos.deal.assets.btn.add", defaultMessage: 'Add asset'},
    copyAssetLabel: {id: "pos.deal.assets.btn.copy", defaultMessage: 'Copy asset'},
    removeAssetLabel: {id: "pos.deal.assets.btn.remove", defaultMessage: 'Remove asset'},
    productFamilyPlaceHolder: {
        id: "pos.deal.assets.generalinfo.productfamily.placeholder",
        defaultMessage: 'Select a product family'
    },
    modelYearPlaceHolder: {id: "pos.deal.assets.modelyear.placeholder", defaultMessage: 'Select model year'},
    enginePlaceHolder: {id: "pos.deal.assets.engine.placeholder", defaultMessage: 'Select an engine'},
    vehicleTypePlaceHolder: {id: "pos.deal.assets.vehicletype.placeholder", defaultMessage: 'Select vehicle type'},
    napplaceholder: {id: "pos.deal.assets.napcode.placeholder", defaultMessage: 'Select asset type'}
});
class Assets extends React.Component {
    constructor(props) {
        super(props);
        this.dispatch = props.dispatch;
    }

    componentWillMount() {
        this.fetchReferenceTable(this.props, {});
    }

    componentWillReceiveProps(nextProps) {
        this.fetchReferenceTable(nextProps, this.props)
    }

    fetchReferenceTable(nextProps, props) {
        if (nextProps.asset && nextProps.asset.varid && nextProps.varid != props.varid) {
            this.dispatch(setCarVariant(nextProps.asset.varid, this.currentAsset))
        }
    }

    handleRemoveAssetClicked = () => {
        this.dispatch(removeAsset('dealForm', this.props.assetIndex, 'deal.listdealasset'));
        this.dispatch(removeQuote('dealForm', this.props.assetIndex, 'deal.listdealquote'));
    }

    handleAssetModelChanged = () => {
        this.props.dispatch(change('dealForm', `${this.currentAsset}.mmtcode`, null));
        this.props.dispatch(change('dealForm', `${this.currentAsset}.varid`, null));
        this.props.dispatch(initVariant());

    }

    handleAssetFinishChanged = () => {
        this.props.dispatch(change('dealForm', `${this.currentAsset}.varid`, null));
        this.props.dispatch(initVariant());
    }

    handleAssetVariantChanged = (value) => {
        this.dispatch(setCarVariant('dealForm', value.code, this.currentAsset, this.props.assetIndex));
    }

    handleTaxCodeChanged = (value) => {
        this.dispatch(fetchRateTax( value.code));

    }

    handleNewAsset = () => {
        this.dispatch(appendDealNewAsset());
        this.dispatch(appendDealNewQuote());
    }

    handleCopyAsset = () => {
        const nextOrder = this.props.listdealasset.length + 1;

        var asset = Immutable(this.props.listdealasset[this.props.assetIndex]);
        asset = sharedUtils.updateActionMode(asset, sharedConst.ACTION_MODE_INSERTION);
        asset = asset.set('dpmordre', nextOrder);
        this.dispatch(arrayPush('dealForm', 'deal.listdealasset', asset));

        var quote = Immutable(this.props.listdealquote[this.props.assetIndex]);
        quote = sharedUtils.updateActionMode(quote, sharedConst.ACTION_MODE_INSERTION);
        quote = quote.set('dpfordre', nextOrder);
        quote = quote.set('pfinom', 'Quote #' + nextOrder);
        this.dispatch(arrayPush('dealForm', 'deal.listdealquote', quote));

        this.dispatch(copyVariant(this.props.variant, nextOrder - 1));

        this.dispatch(changeAssetIndex(nextOrder - 1));
        this.dispatch(changeQuoteIndex(nextOrder - 1));
    }

    handleChangeAsset(assetIndex) {
        this.dispatch(changeAssetIndex(assetIndex));
        this.dispatch(changeQuoteIndex(assetIndex));
    }

    handleModelYearChanged = () => {
        this.props.dispatch(batchActions([
            change('dealForm', `${this.currentAsset}.makid`, null)
            , change('dealForm', `${this.currentAsset}.mmocode`, null)
            , change('dealForm', `${this.currentAsset}.mmtcode`, null)
            , change('dealForm', `${this.currentAsset}.varid`, null)]));
        this.props.dispatch(initVariant());
    }

    handleMakChange = (value) => {
        this.props.dispatch(batchActions([
            change('dealForm', `${this.currentAsset}.mmocode`, null)
            , change('dealForm', `${this.currentAsset}.mmtcode`, null)
            , change('dealForm', `${this.currentAsset}.varid`, null)]));
        this.props.dispatch(initVariant());
    };

    //Updates asset category for all assets if changed after multiple assets are created
    handleAssetCategoryChanged = (value) => {
        for (var index = 0; index < this.props.listdealasset.length; index++) {
            this.dispatch(change('dealForm', 'deal.listdealasset[' + index + '].acacode', value.code));
        }
    }

    handleProductFamilyChanged = () => {
        this.dispatch(setTpgcode(null));
    }

    handleNAPChanged = (value) => {
        this.dispatch(updateAssetAfterNapcodeChanged2(this.props.listdealasset[this.props.assetIndex].dpmordre, value.code));
    }

    get currentAsset() {
        return 'deal.listdealasset[' + this.props.assetIndex + ']';
    }

    render() {
        // Get asset (only one asset as for now)
        let {asset = {}, options, variant = {}, assetIndex, readOnly, listdealasset, listdealattribute, intl, accessKeys, tpgcode, makId, ...props} = this.props;
        const {formatMessage} = intl;
        const acacode = listdealasset[assetIndex] ? listdealasset[assetIndex].acacode : null;
        var assetsComponents = DEFAULT_EMPTY;
        if (options && options.length) {
            assetsComponents = (
                <AssetComponents accessKeys={accessKeys} id="pos.deal.assets.box.components" rows={options}/>);
        }

        let assetTab = DEFAULT_EMPTY;
        let assetSectionHeader = DEFAULT_NULL;
        let assetDetailSection = DEFAULT_NULL;
        let clReadOnly = readOnly ? 'read-only' : '';

        let productDealAttrib = listdealattribute.find(item => item.datcode === 'TPGTYPE');
        let index = productDealAttrib ?
            listdealattribute.indexOf(productDealAttrib) :
            listdealattribute.length;
        let productFamily = 'deal.listdealattribute[' + index + '].datstringdata';

        if ((listdealasset.length > 0) && (productDealAttrib && productDealAttrib.datstringdata && listdealasset[0].acacode)) {
            let tabs = [];

            listdealasset.forEach((asset, index) => {
                let cl = assetIndex === index && listdealasset.length > 1 ? "btn btn-primary" : "btn btn-default";
                if (sharedConst.ACTION_MODE_DELETION !== asset.actionMode) {
                    tabs.push(
                        <button className={cl} type="button" key={"assetContainer_" + index}
                                onClick={(event) => this.handleChangeAsset(index, event)}>{1 + index}
                        </button>
                    );
                }

            });

            assetTab = (
                <div className="asset-tab">
                    {tabs}
                    <button className="btn btn-primary fa fa-clone" type="button" disabled={readOnly}
                            onClick={this.handleCopyAsset}
                            title={formatMessage(messages.copyAssetLabel)}>
                    </button>
                    <button className="btn btn-primary fa fa-plus" type="button" disabled={readOnly}
                            onClick={this.handleNewAsset}
                            title={formatMessage(messages.addAssetLabel)}>
                    </button>
                </div>
            )

            assetSectionHeader = (
                <label><FormattedMessage id="pos.deal.assets.box.title" defaultMessage="List of assets"/></label>);

            assetDetailSection = (
                <Box type="primary" title="" withBoder="true"
                     tools={<AssetToolBox onDeleteClick={this.handleRemoveAssetClicked}
                                          title={formatMessage(messages.removeAssetLabel)}/>}>
                    <div className={"row " + clReadOnly}>
                        <div className="col-md-6">

                            <Field name={`${this.currentAsset}.napcode`}
                                   component={SelectField}
                                   placeholder={this.props.intl.formatMessage(messages.napplaceholder)}
                                   options={tables.LANNAP} onChange={this.handleNAPChanged}
                                   refParams={{acacode: acacode, tpgcode: this.props.tpgcode}}
                                   title={<FormattedMessage id="pos.deal.assets.nap.title"
                                                            defaultMessage="NAP"/>}
                                   {...accessKeys[`${this.currentAsset}.napcode`]}/>

                            <Field name={`${this.currentAsset}.dpmnumserie`}
                                   component={TextEntry}
                                   title={<FormattedMessage id="pos.deal.assets.vinnumber.title"
                                                            defaultMessage="VIN Number "/>}
                                   {...accessKeys[`${this.currentAsset}.dpmnumserie`]}/>

                            <Field name={`${this.currentAsset}.dpmmillesime`}
                                   component={SelectField}
                                   onChange={this.handleModelYearChanged}
                                   placeholder={this.props.intl.formatMessage(messages.modelYearPlaceHolder)}
                                   options={tables.LANTUSPARAM} refParams={{tusnom: 'MMOYEAR'}}
                                   title={<FormattedMessage id="pos.deal.assets.modelyear.title"
                                                            defaultMessage="Model year"/>}
                                   {...accessKeys[`${this.currentAsset}.dpmmillesime`]}/>

                            <Field name={ this.currentAsset + '.makid'} component={SelectField}
                                   key={`${this.currentAsset}.makid`}
                                   title={<FormattedMessage id="pos.deal.assets.make.title"
                                                            defaultMessage="Make"/>}
                                   placeholder={formatMessage(messages.assetMakePlaceHolder)}
                                   options={tables.LANMAKE}
                                   onChange={this.handleMakChange}
                                   {...accessKeys[`${this.currentAsset}.makid`]}/>

                            <Field name={`${this.currentAsset}.mmocode`} component={SelectField}
                                   title={<FormattedMessage id="pos.deal.assets.model.title"
                                                            defaultMessage="Model"/>}
                                   options={tables.LANMAKEMODEL} refParams={{'makid': makId}}
                                   placeholder={formatMessage(messages.assetModelPlaceHolder)}
                                   onChange={this.handleAssetModelChanged}
                                   {...accessKeys[`${this.currentAsset}.mmocode`]}/>

                            <Field name={`${this.currentAsset}.mmtcode`} component={SelectField}
                                   title={<FormattedMessage id="pos.deal.assets.finish.title"
                                                            defaultMessage="Finish"/>}
                                   key="asset-finish-field" autoSelect={true}
                                   options={tables.LANMAKMODTRIMLEVEL}
                                   refParams={{
                                       'makid': makId,
                                       'mmocode': this.props.mmoCode
                                   }}
                                   placeholder={formatMessage(messages.assetfinishPlaceHolder)}
                                   onChange={this.handleAssetFinishChanged}
                                   {...accessKeys[`${this.currentAsset}.mmtcode`]}/>

                            <Field name={`${this.currentAsset}.varid`} component={SelectField}
                                   title={<FormattedMessage id="pos.deal.assets.variant.title"
                                                            defaultMessage="Variant"/>}
                                   autoSelect={true}
                                   refParams={{
                                       'makid': makId,
                                       'mmocode': this.props.mmoCode,
                                       'mmtcode': this.props.mmtCode,
                                       'devcode': this.props.devCode
                                   }}
                                   key="asset-variant-field" options={tables.LANVARIANT}
                                   placeholder={formatMessage(messages.assetVariantPlaceHolder)}
                                   onChange={ this.handleAssetVariantChanged}
                                   {...accessKeys[`${this.currentAsset}.varid`]}/>

                            {/*<AssetEnergy*/}
                            {/*title={<FormattedMessage id="pos.deal.assets.energy.title" defaultMessage="Energy"/>}*/}
                            {/*ref="energy" value={variant.varenergytype}*/}
                            {/*placeholder={formatMessage(messages.assetEnergyPlaceHolder)}*/}
                            {/*onChange={this.handleAssetEnergyChanged} disabled="true"*/}
                            {/*makid={asset.makid} mmocode={asset.mmocode} mmtcode={asset.mmtcode}*/}
                            {/*variant={asset.varid}/>*/}

                            <div className="row">
                                <div className="col-md-6">
                                    <Field name={`${this.currentAsset}.varbhp`} component={IntegerEntry}
                                           title={<FormattedMessage id="pos.deal.assets.power.title"
                                                                    defaultMessage="Power"/>}
                                           key="power-field" readOnly="true"
                                           suffix="hp"
                                           {...accessKeys[`${this.currentAsset}.varbhp`]}/>
                                </div>
                                <div className="col-md-6">
                                    <Field name={`${this.currentAsset}.varcarbon`} component={IntegerEntry}
                                           title={<FormattedMessage id="pos.deal.assets.co2.title"
                                                                    defaultMessage="CO2 emission"/>}
                                           key="co2-field" readOnly="true"
                                           suffix="g/km"
                                           {...accessKeys[`${this.currentAsset}.varcarbon`]}/>
                                </div>
                            </div>

                            <Field name={`${this.currentAsset}.dpmenergie`}
                                   component={SelectField}
                                   placeholder={this.props.intl.formatMessage(messages.enginePlaceHolder)}
                                   options={tables.LANTUSPARAM } refParams={{tusnom: 'CGENERGIE'}}
                                   title={<FormattedMessage id="pos.deal.assets.engine.title"
                                                            defaultMessage="Engine"/>}
                                   {...accessKeys[`${this.currentAsset}.dpmenergie`]}/>
                        </div>
                        <div className="col-md-6">
                            <Field name={`${this.currentAsset}.dpmmtvat`} component={CurrencyEntry}
                                   title={<FormattedMessage id="pos.deal.assets.vatamount.title"
                                                            defaultMessage="VAT amount"/>}
                                   placeholder={formatMessage(messages.assetVATPlaceHolder)} key="vat"
                                   readOnly="true"
                                   currencyCode={this.props.devCode}
                                   {...accessKeys[`${this.currentAsset}.dpmmtvat`]}/>

                            <Field name={`${this.currentAsset}.dpmmtinvest`} component={CurrencyEntry}
                                   title={<FormattedMessage id="pos.deal.assets.amountht.title"
                                                            defaultMessage="Amount excl. tax"/>}
                                   key="exclTax" readOnly="true"
                                   currencyCode={this.props.devCode}
                                   {...accessKeys[`${this.currentAsset}.dpmmtinvest`]}/>

                            <Field name={`${this.currentAsset}.dpmmtttc`} component={CurrencyEntry}
                                   title={<FormattedMessage id="pos.deal.assets.amounttc.title"
                                                            defaultMessage="Amount inc tax"/>}
                                   key="incTax" readOnly="true"
                                   currencyCode={this.props.devCode}
                                   {...accessKeys[`${this.currentAsset}.dpmmtttc`]}/>

                            <Field name={`${this.currentAsset}.taxcode`}
                                   component={SelectField}
                                   {...accessKeys[`${this.currentAsset}.taxcode`]}
                                   refTable={tables.LANTAXE} refParams={{tpgcode: tpgcode}}
                                   onChange={this.handleTaxCodeChanged}
                                   title={<FormattedMessage id="pos.deal.assets.taxcode.title"
                                                            defaultMessage="Tax code"/>}

                            />

                            <Field name={`${this.currentAsset}.listdealassetcomponent[0].dmdquantite`}
                                   component={IntegerEntry}
                                   title={<FormattedMessage id="pos.deal.assets.quantity.title"
                                                            defaultMessage="Quantity"/>}
                                   {...accessKeys[`${this.currentAsset}.listdealassetcomponent[0].dmdquantite`]}/>

                            <Field name={`${this.currentAsset}.dpmgenre`}
                                   component={SelectField}
                                   options={tables.LANTUSPARAM} refParams={{tusnom: 'CGGENRE'}}
                                   placeholder={formatMessage(messages.vehicleTypePlaceHolder)}
                                   title={<FormattedMessage id="pos.deal.assets.vehicletype.title"
                                                            defaultMessage="VP/VU"/>}
                                   {...accessKeys[`${this.currentAsset}.dpmgenre`]}/>
                        </div>
                    </div>
                </Box>
            );
        }

        return (
            <div className="asset-creation-form">

                <label><FormattedMessage id="pos.deal.assets.generalinfo.box.title"
                                         defaultMessage="General Info"/></label>

                <Box type="primary" title="" withBoder="true">
                    <div className="row">
                        <div className="col-md-6">
                            <Field name={productFamily}
                                   component={SelectField}
                                   onChange={this.handleProductFamilyChanged}
                                   key="asset-generalinfo-productfamily-field"
                                   placeholder={this.props.intl.formatMessage(messages.productFamilyPlaceHolder)}
                                   options={tables.LANTTRPARAM } refParams={{ttrnom: 'TPGTYPE'}}
                                   title={<FormattedMessage id="pos.deal.assets.generalinfo.productfamily.title"
                                                            defaultMessage="Product family"/>}
                                   {...accessKeys[productFamily]}/>
                        </div>

                        <div className="col-md-6">
                            <Field name={`${this.currentAsset}.acacode`} component={SelectField}
                                   key={`${this.currentAsset}.acacode`}
                                   placeholder={formatMessage(messages.assetCategPlaceHolder)}
                                   options={tables.LANASSETCATEGORY} refParams={{'tpgcode': tpgcode}}
                                   onChange={this.handleAssetCategoryChanged}
                                   title={<FormattedMessage id="pos.deal.assets.generalinfo.assetcategory.title"
                                                            defaultMessage="Asset category"/>}
                                   {...accessKeys[`${this.currentAsset}.acacode`]}/>
                        </div>
                    </div>

                </Box>
                {assetSectionHeader}
                {assetTab}
                {assetDetailSection}
                {assetsComponents}
            </div>
        )
    }
}

const selector = formValueSelector('dealForm');
const mapStateToProps = (state, props) => {
    const asset = 'deal.listdealasset[' + state.newdeal.assetIndex + ']';
    const makId = selector(state, `${asset}.makid`);
    const mmoCode = selector(state, `${asset}.mmocode`);
    const mmtCode = selector(state, `${asset}.mmtcode`);
    const tpgcode = selector(state, 'deal.tpgcode') || 'TOUT';
    const devCode = selector(state, `deal.devcode`);

    return {
        assetIndex: state.newdeal.assetIndex,
        listdealasset: selector(state, 'deal.listdealasset'),
        listdealquote: selector(state, 'deal.listdealquote'),
        listdealattribute: selector(state, 'deal.listdealattribute'),
        options: state.newdeal.options,
        variant: state.newdeal.variant[state.newdeal.assetIndex],
        readOnly: state.newdeal.readOnly,
        makId, mmoCode, mmtCode, tpgcode, devCode
    }
};


export default connect(
    mapStateToProps
)(injectIntl(Assets));
