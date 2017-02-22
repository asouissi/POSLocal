import React, {Component, PropTypes} from 'react'
import Griddle from 'griddle-react'
import {FormattedMessage, defineMessages} from 'react-intl'
import Pager from '../../../core/components/lib/Pager'
import Loader from '../../../core/components/lib/Loader';

const columns = ['uticode', 'utiprenom', 'utinom', 'utistatus', 'utiflaginactif'];

class InactiveUserDisplay extends Component {
    handleOnClick = (event) => {
        if (confirm('User will no longer be able to login.\nDo you want to proceed?')) {
            this.props.metadata.customComponentMetadata.onUserDeactivate(this.props.rowData);
        }
    }

    render() {
        let flagUser = this.props.rowData.utiflaginactif;
        if (!flagUser) {
            return (
                <span className="btn btn-xs btn-primary" type="button"
                      onClick={this.handleOnClick}><FormattedMessage id="common.users.components.usertable.deactivate"
                                                                     defaultMessage="Deactivate"/></span> );
        }
        else {
            return false;
        }
    }
}

class UserStatusDisplay extends Component {
    render() {
        let flagUser = this.props.rowData.utiflaginactif;
        if (!flagUser) {
            return (
                <span><FormattedMessage id="common.users.components.usertable.active"
                                        defaultMessage="Active"/></span> );
        }
        else {
            return (<span><FormattedMessage id="common.users.components.usertable.inactive"
                                            defaultMessage="Inactive"/></span> );
        }
    }
}

class UserTable extends Component {
    render() {
        const columnMetadata = [
            {
                columnName: 'uticode',
                displayName: <FormattedMessage id="common.users.components.usertable.usercode"
                                               defaultMessage="User code"/>
            },
            {
                columnName: 'utiprenom',
                displayName: <FormattedMessage id="common.users.components.usertable.firstname"
                                               defaultMessage="First name"/>
            },
            {
                columnName: 'utinom',
                displayName: <FormattedMessage id="common.users.components.usertable.lastname"
                                               defaultMessage="Last name"/>
            },
            {
                columnName: 'utistatus',
                displayName: <FormattedMessage id="common.users.components.usertable.userstatus"
                                               defaultMessage='Status'/>,
                customComponent: UserStatusDisplay
            },
            {
                columnName: 'utiflaginactif',
                displayName: <FormattedMessage id="common.users.components.usertable.action" defaultMessage='Action'/>,
                customComponent: InactiveUserDisplay,
                customComponentMetadata: {
                    onUserDeactivate: this.props.onUserDeactivate
                }
            }
        ];
        let message = (<p className="center-text"><FormattedMessage id="common.users.components.usertable.nousers"
                                                                    defaultMessage="No users to display"/></p>);
        let noDataMessage = this.props.isLoading ? <Loader/> : message;
        return (
            <Griddle
                tableClassName="table table-hover"
                useGriddleStyles={false}
                results={this.props.rows}
                initialSort='uticode'
                sortAscending={true}
                columns={columns}
                columnMetadata={columnMetadata}
                resultsPerPage={12}
                useCustomPagerComponent={true}
                customPagerComponent={Pager}
                showFilter={true}
                noDataMessage={noDataMessage}
            />
        )
    }
}
export {UserTable}