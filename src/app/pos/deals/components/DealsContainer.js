import React, {Component} from "react";
import {connect} from "react-redux";
import config from "./config";
import Box from "../../../core/components/lib/Box";
import {fetchDeals} from "../reducers/deals";
import {
    fetchReferenceTable,
    fetchReferenceTableWithParams,
    tables,
    getReferenceTable
} from "../../../core/reducers/referenceTable";
import Dashboard from "../../../core/dashboards/components/DashboardContainer";
import DealTable2 from "./DealTable2";
import {getRouteAccessKeys, getComponentAccessKeys} from '../../../common/accesskeys/AccessKeysSelector';

export class MyDeals extends React.Component {

    componentWillMount() {
        this.props.dispatch(fetchReferenceTableWithParams(tables.TPROFILGESTION, {'tpgflagfacility': '1'}));
        this.props.dispatch(fetchReferenceTable(tables.LANJALON));
        this.props.dispatch(fetchDeals());
    }

    componentWillReceiveProps(nextProps) {
        // reload deals
        if ((!nextProps.isLoading && nextProps.location.action === "REPLACE" && this.props.location.action !== "REPLACE")
            || nextProps.currentBrand !== this.props.currentBrand) {
            this.props.dispatch(fetchDeals());
        }
    }

    render() {
        const {accessKeys, menuItems, listProfile, listJalon, deals, isLoading} = this.props;

        let tools = [];

        const frontServices = config.frontServices || config.apis[config.masterApi].api;
        tools.push(
            <i key="btn-export" className="btn-export">
                <span>Export Excel</span>
                <a href={frontServices + "/deals/excelexport"} className="fa fa-cloud-download"></a>
            </i>
        );

        let toolBox = (<div className="box-tools pull-right">{tools}</div>);

        const dealTable2ID = "pos.mydeals.table.deals";
        const key = getComponentAccessKeys(accessKeys, dealTable2ID);
        return (
            <div className="my-deals-content">

                <Box type="primary" className="deals" tools={toolBox}>
                    <DealTable2 rows={deals} isLoading={isLoading}
                                id={dealTable2ID}
                                accessKeys={key}
                                listJalon={listJalon}
                                listProfile={listProfile}
                                menuItems={menuItems}
                    />
                </Box>

                <Dashboard resources="/mydeals" showDashboardEditor={false}/>
            </div>
        );
    }
}
const mapStateToProps = (state, props) => {
    const route = props.route && props.route.path;

    return {
        deals: state.deals.deals,
        isLoading: state.deals.isLoading,
        listJalon: getReferenceTable(state, tables.LANJALON).data,
        listProfile: getReferenceTable(state, tables.TPROFILGESTION, {'tpgflagfacility': '1'}).data,
        menuItems: state.navigation.menuItems,
        currentBrand: state.authentication.user.brandcurrent,
        accessKeys: getRouteAccessKeys(state, route)
    }
}

export default connect(mapStateToProps)(MyDeals);
