import React, {Component} from 'react'
import {connect} from 'react-redux'
import {fetchCreditLines} from '../reducers/actions'
import Dashboard from '../../../core/dashboards/components/DashboardContainer';
import Box from '../../../core/components/lib/Box';

import Breadcrumbs from 'react-breadcrumbs';

import CreditlineTable  from './CreditlineTable'
import {FormattedNumber, FormattedMessage} from 'react-intl';
import {hashHistory} from 'react-router';


export class CreditLines extends Component {

    componentWillMount() {
        this.props.dispatch(fetchCreditLines());
    }

    handleAssetsImportClick = (event) => {

        hashHistory.push('/import');
    };

    render() {

        let disabled = this.props.readonly==="1"?"disabled":"";

        return (
            <div className="credit-content">
                <Breadcrumbs name="Dashboard"
                             routes={this.props.routes}
                             params={this.props.params} excludes={['app', '/']}/>
                <Box type="primary" title={<FormattedMessage id="wholesale.creditline.situation.tooltip"
                                                             defaultMessage="Credit line situation"/>}>

                    <CreditlineTable rows={this.props.creditLines || []} isLoading={this.props.isLoading}
                                     showLinkDisplay={true}
                                     showSummary={true}
                                     filter={false}
                                     menuItems={this.props.menuItems}
                                     reduced={false}/>

                    <div className={"import-asset-btn "+disabled} onClick={this.handleAssetsImportClick}
                         title={<FormattedMessage id="wholesale.creditline.import.tooltip"
                                                  defaultMessage="Import assets"/>}>
                        <i className="fa fa-arrow-circle-down icon-circle"/>
                        <span><FormattedMessage id="wholesale.creditline.import.btn"
                                                defaultMessage="Import asset contract"/></span>
                    </div>

                </Box>

                <Dashboard resources="/wsmycreditlines"  showDashboardEditor={false}/>
            </div>
        );
    }
}
export default connect(
    state => ({
        creditLines: state.creditLines.creditLines,
        isLoading: state.creditLines.isLoading,
        menuItems: state.navigation.menuItems,
        readonly: state.authentication.user.readonly
    })
)(CreditLines);
