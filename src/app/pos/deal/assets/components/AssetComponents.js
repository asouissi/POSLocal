'use strict'
import React from 'react'
import { connect } from 'react-redux'
import {formValueSelector} from 'redux-form'
import Box from '../../../../core/components/lib/Box'
import FormattedCurrency from '../../../../core/components/lib/FormattedCurrency'
import FormattedInteger from '../../../../core/components/lib/FormattedInteger'
import Table from '../../../../core/components/lib/Table'

import classNames from 'classnames';
import {injectIntl, defineMessages, FormattedMessage} from 'react-intl';

class AssetComponents extends Table {
    constructor(props) {
        super(props);

        this.dispatch = props.dispatch;
    }

    _formatNumber(value, nod, devise) {
        if (nod) {
            return value.toFixed(nod).replace(/(\d)(?=(\d{3})+\.)/g, '$1\u202F');
        }

        return value.toFixed(nod).replace(/(\d)(?=(\d{3})+$)/g, '$1\u202F');
    }

    render() {

        var selectedRow=this.getSelectedRow();
        let assetQuantity = 0;
        if(this.props.listdealasset[this.props.assetIndex]
            && this.props.listdealasset[this.props.assetIndex].listdealassetcomponent[0]
            && this.props.listdealasset[this.props.assetIndex].listdealassetcomponent[0].dmdquantite) {
            assetQuantity = parseInt(this.props.listdealasset[this.props.assetIndex].listdealassetcomponent[0].dmdquantite);
        }

            var components = this.getRows().map((row) => (
                <tr key={row.key} data-key={row.key} className={classNames({selected: selectedRow === row})}>
                    <td>{row.description}</td>
                    <td className="number">{this._formatNumber(assetQuantity)}</td>
                    <td className="number">{this._formatNumber(row.unitPriceBeforeTax, 2)}</td>
                    <td className="number">{this._formatNumber(row.unitPriceBeforeTax * assetQuantity, 2)}</td>
                    <td>{row.tax}</td>
                    <td className="number">{this._formatNumber(row.unitPriceAfterTax * assetQuantity + row.vatAmount, 2)}</td>
                    <td><input type="checkbox"/></td>
                </tr>));


        return (<Box type="primary" {...this.props.accessKeys[this.props.id]}  id={this.props.id} title={<FormattedMessage id="pos.assets.box.title" defaultMessage="Components" />} withBoder="true">
            <table className="table table-bordered table-hover" onClick={this.$handleTableOnClick}>
                <tbody>
                <tr>
                    <th><FormattedMessage id="pos.assets.describe.title" defaultMessage="Description" /></th>
                    <th className="number"><FormattedMessage id="pos.assets.quantity.title" defaultMessage="Quantity" /></th>
                    <th className="number"><FormattedMessage id="pos.assets.unitprice.title" defaultMessage="Unit price" /></th>
                    <th className="number"><FormattedMessage id="pos.assets.totalht.title" defaultMessage="Total before tax" /></th>
                    <th><FormattedMessage id="pos.assets.tax.title" defaultMessage="Tax" /></th>
                    <th className="number"><FormattedMessage id="pos.assets.totaltc.title" defaultMessage="Total after tax " /></th>
                    <th>Option</th>
                </tr>
                {components}
                </tbody>
            </table>
            <div className="box-footer">
                <div className="col-md-6">
                    <dl className="dl-horizontal">
                        <dt><FormattedMessage id="pos.assets.describe.title" defaultMessage="Description" /></dt>
                        <dd><input type="text" readOnly="true" value={selectedRow.description} className="form-control" /></dd>
                        <dt><FormattedMessage id="pos.assets.quantity.title" defaultMessage="Quantity" /></dt>
                        <dd><FormattedInteger value={assetQuantity} style="count" className="assets-rowCount" /></dd>
                        <dt><FormattedMessage id="pos.assets.tax.title" defaultMessage="Tax" /></dt>
                        <dd>
                            <select className="form-control">
                                <option value="EXO">{this.props.intl.formatMessage({id:"pos.assets.taxfree.title", defaultMessage:"Tax free"})}</option>
                            </select>
                        </dd>
                        <dt><FormattedMessage id="pos.assets.unitpriceht.title" defaultMessage="Unit price before tax" /></dt>
                        <dd><FormattedCurrency value={selectedRow.unitPriceBeforeTax} style="currency" className="assets-rowCurrency" /></dd>
                        <dt><FormattedMessage id="pos.assets.unitpricetc.title" defaultMessage="Unit price after tax" /></dt>
                        <dd><FormattedCurrency value={selectedRow.unitPriceAfterTax} style="currency" className="assets-rowCurrency" /></dd>
                    </dl>
                </div>
                <div className="col-md-6">
                    <dl className="dl-horizontal">
                        <dt><FormattedMessage id="pos.assets.totalht.title" defaultMessage="Total before tax" /></dt>
                        <dd><FormattedCurrency value={selectedRow.totalBeforeTax*assetQuantity} style="currency" className="assets-rowCurrency" /></dd>
                        <dt><FormattedMessage id="pos.assets.totalvat.title" defaultMessage="Total VAT amount" /></dt>
                        <dd><FormattedCurrency value={selectedRow.vatAmount} style="currency" className="assets-rowCurrency" /></dd>
                        <dt><FormattedMessage id="pos.assets.totaltc.title" defaultMessage="Total after tax" /></dt>
                        <dd><FormattedCurrency value={selectedRow.totalAfterTax*assetQuantity} style="currency" className="assets-rowCurrency" /></dd>
                    </dl>
                </div>
            </div>
        </Box>)}
}

const selector = formValueSelector('dealForm');
const mapStateToProps = (state, props) => {
    return {
        listdealasset: selector(state, 'deal.listdealasset'),
        assetIndex: state.newdeal.assetIndex,
    }
};

export default connect(
    mapStateToProps
)(injectIntl(AssetComponents));