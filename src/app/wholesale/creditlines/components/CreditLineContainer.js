import React, {Component} from 'react'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router';
import config from './config'
import  {CREDITLINEDETAIL, CONTRACT} from '../../index';
import {fetchCreditLineDetail, fetchCreditLine, initContract} from '../../creditlines/reducers/actions'
import CreditLineDetailTable from './CreditlineDetailTable'
import  CreditLineTable  from './CreditlineTable.js'
import { FormattedMessage} from 'react-intl';
import Breadcrumbs from 'react-breadcrumbs'
import Box from '../../../core/components/lib/Box';
import {fetchReferenceTable, tables, getReferenceTable} from '../../../core/reducers/referenceTable'

const DEFAULT_EMPTY = [];

export class CreditLineContainer extends Component {
    componentWillMount() {
        if (this.props.params.dosid) {
            this.props.dispatch(fetchCreditLine(this.props.params.dosid));
        }
        this.props.dispatch(fetchReferenceTable(tables.LANMAKE));
        this.props.dispatch(fetchReferenceTable(tables.LANNAP));
        this.props.dispatch(fetchReferenceTable(tables.LANPHASE));
    }

    handleAssetCreationClick = (event) => {

        hashHistory.push(CREDITLINEDETAIL + '/' +this.props.params.dosid + CONTRACT + "/0");
    };



    render() {
        var rows = this.props.creditLine.listdrawsearch || [];
        var creditLineRow = this.props.creditLine ? [this.props.creditLine] : [];

        let disableNewAsset = (this.props.readonly === "1" || this.props.creditLine.isdosacteuroem) ? "disabled" : DEFAULT_EMPTY;

        return (

            <div className="my-creditlinedetail-content">
                <Breadcrumbs
                    routes={this.props.routes}
                    params={this.props.params} excludes={['app', '/']}/>
                <Box type="primary" title={<FormattedMessage id="wholesale.creditline.detail.page"
                                                             defaultMessage="Credit line detail"/>}>

                    <CreditLineTable rows={creditLineRow} isLoading={this.props.isLoading} reduced={false} reducedDetail={true}/>

                </Box>
                <div className="btn-export">
                    <span>Export Excel</span>
                    <a href={config.backServices+"/masterfacilities/"+this.props.params.dosid+"/excelexport"} className="fa fa-cloud-download"></a>
                </div>
                <Box className="box-action-container" type="primary " title={<FormattedMessage id="wholesale.creditline.detail.draw.table"
                                                              defaultMessage="Detail"/>}>


                    <CreditLineDetailTable referencetables={{makes : this.props.listMake, naps: this.props.listNap}} rows={rows} isLoading={this.props.isLoading} parentDosId={this.props.params.dosid}/>
                    <div className={"asset-creation-btn btn-icon "+disableNewAsset} onClick={this.handleAssetCreationClick}>
                        <span>New asset</span>
                        <i className="fa fa-car icon-circle"/>
                    </div>
                </Box>
            </div>
        );
    }
}
export default connect(
    state => ({
        creditLine: state.creditLines.creditLine,
        isLoading: state.creditLines.isLoading,
        menuItems: state.navigation.menuItems,
        listMake: getReferenceTable(state, tables.LANMAKE).data,
        listNap: getReferenceTable(state, tables.LANNAP).data,
        listPhase: getReferenceTable(state, tables.LANPHASE).data,
        readonly: state.authentication.user.readonly
    })
)(CreditLineContainer);