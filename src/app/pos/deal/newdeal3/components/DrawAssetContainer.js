import React, {Component} from "react";
import {connect} from "react-redux";
import {injectIntl, defineMessages, FormattedMessage} from "react-intl";
import Box from "../../../../core/components/lib/Box";
import SelectField from "../../../../core/components/lib/SelectField";
import {Field} from "redux-form";
import {tables} from "../../../../core/reducers/referenceTable";
import {selectAssetToDraw} from "../reducers/actions";

const messages = defineMessages({
    drawnmfselectPlaceHolder: {id: "pos.drawdeal.drawnmfselect.placeholder", defaultMessage: 'Select MF'},
    drawfinancialproductPlaceHolder: {
        id: "pos.drawdeal.drawfinancialproduct.placeholder",
        defaultMessage: 'Select a product'
    },
    drawassetselectPlaceHolder: {id: "pos.drawdeal.drawassetselect.placeholder", defaultMessage: 'Select an asset'},
    drawDealMsgTotalAssets: {id: "pos.drawdeal.mfselect.msg.totalassets", defaultMessage: 'Total assets'},
    drawDealMsgUndrawn: {id: "pos.drawdeal.mfselect.msg.undrawn", defaultMessage: 'undrawn'}

});

export class DrawAssetContainer extends Component {
    constructor(props) {
        super(props);
        this.dispatch = props.dispatch;
    }

    handleAssetNameChanged = (data)=> {
        this.dispatch(selectAssetToDraw(data.code));
    }

    /*
     Methods to format the labels of the asset select fields
     */
    getLabelFromData(data) {
        if (!data) {
            return "";
        }
        let label = "Asset #" + data.dpmordre;
        if (data.dpmlibelle && data.dpmlibelle != "" && data.dpmlibelle != "-" && data.dpmmtinvest && data.dpmmtinvest != "") {
            label = data.dpmlibelle + ' (' + this.props.intl.formatNumber(data.dpmmtinvest) + ')';
        } else if (data.varlibelle && data.varlibelle != "" && data.dpmmtinvest && data.dpmmtinvest != "") {
            label = data.varlibelle + ' (' + this.props.intl.formatNumber(data.dpmmtinvest) + ')';
        } else if (data.dpmmtinvest && data.dpmmtinvest != "") {
            label = "Asset #" + data.dpmordre + ' (' + this.props.intl.formatNumber(data.dpmmtinvest) + ')';
        } else {
            if (data.dpmtypecg && data.dpmtypecg != "") {
                label = data.dpmtypecg;
            } else if (data.dpmcategorie && data.dpmcategorie != "") {
                label = data.dpmcategorie;
            }
        }

        return label;
    }

    render() {
        // Get asset (only one asset as for now)
        var {tpgcodeParent, listdealasset, dpmordreSelected, tpglibelleparent, undrawns, readonlyAssets, ...rest} = this.props;
        var listdealassetstodraw = [];
        undrawns.forEach(p_undrawn => {
            const find = listdealasset.find((p_asset) => p_asset.dpmordre == p_undrawn.assetorder);
            if (find) {
                listdealassetstodraw.push(find);
            }
        });

        if (readonlyAssets) {
            const items = listdealasset.find((p_asset) => p_asset.dpmordre == dpmordreSelected);
            items && items.dpmordre && listdealassetstodraw.push(items);
        }

        var listdealassetstodrawForSelect = listdealassetstodraw
            .filter((row)=> (row !== undefined ? true : false))
            .map((row) => {
                return {
                    code: row.dpmordre + "",
                    label: this.getLabelFromData(row)
                }
            });

        var masterfacilityselect = [{
            code: tpgcodeParent || "",
            label: (tpglibelleparent || "") + " ("
            + listdealasset.length + " "
            + this.props.intl.formatMessage(messages.drawDealMsgTotalAssets) + ", "
            + undrawns.length + " " + this.props.intl.formatMessage(messages.drawDealMsgUndrawn) + ")"
        }];
        return (
            <div className="draw">
                <Box type="primary" title={<FormattedMessage id="pos.drawdeal.title" defaultMessage="Draw deal"/>}
                     withBorder="true">
                    <div className="row">
                        <div className="col-md-12">
                            <Field name="masterfacilitycode" component={SelectField}
                                   title={<FormattedMessage id="pos.drawdeal.drawnmfselect.title"
                                                            defaultMessage="Master facility"/>}
                                   options={masterfacilityselect} key="drawdeal-mftpgcode-field"
                                   placeholder={this.props.intl.formatMessage(messages.drawnmfselectPlaceHolder)}
                                   readOnly={readonlyAssets} disabled={readonlyAssets}/>

                            <Field name="tpgcode" component={SelectField}
                                   title={<FormattedMessage id="pos.drawdeal.drawfinancialproduct.title"
                                                            defaultMessage="Financial product"/>}
                                   refParams={{tpgcodeparent: tpgcodeParent}}
                                   options={tables.TPROFILGESTION} key="drawdeal-financialProduct-field"
                                   placeholder={this.props.intl.formatMessage(messages.drawfinancialproductPlaceHolder)}
                                   readOnly={readonlyAssets} disabled={readonlyAssets}/>

                            <Field name="listdealasset[0].dpmordre" component={SelectField}
                                   title={<FormattedMessage id="pos.drawdeal.drawassetselect.title"
                                                            defaultMessage="Asset name"/>}
                                   options={listdealassetstodrawForSelect} key="drawdeal-assetname-field"
                                   placeholder={this.props.intl.formatMessage(messages.drawassetselectPlaceHolder)}
                                   onChange={this.handleAssetNameChanged}
                                   readOnly={readonlyAssets} disabled={readonlyAssets}/>

                        </div>
                    </div>
                </Box>
            </div>
        );
    }
}

const mapStateToProps = (state, props) => ({
    dosid: state.newdeal3.deal.dosid,
    listdealasset: state.newdeal3.deal.listdealasset,
    dprnom: state.newdeal3.deal.dprnom,
    tpgcodeParent: state.newdeal3.deal.tpgcode,
    tpglibelleparent: state.newdeal3.deal.tpglibelle,
    undrawns: state.newdeal3.undrawns,
    dpmordreSelected: state.newdeal3.dpmordreSelected,
    readonlyAssets: state.newdeal3.readonlyAssets,
});

export default connect(
    mapStateToProps
)(injectIntl(DrawAssetContainer));