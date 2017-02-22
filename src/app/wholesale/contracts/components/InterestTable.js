'use strict'
import React, {Component, PropTypes} from 'react';

import CustomGriddle, {DateDisplay, PercentDisplay} from '../../../core/components/lib/CustomGriddle';
import  {FormattedMessage} from 'react-intl';
import Loader from '../../../core/components/lib/Loader';

const columns = ['period', 'startdate', 'enddate', 'rate', 'days'];

export default class InterestTable extends Component {

    render() {
        const columnMetadata = [
            {
                columnName: 'period',
                displayName: '#'

            },
            {
                columnName: 'startdate',
                displayName: <FormattedMessage id="wholesale.creditline.interest.column.startdate" defaultMessage="Start date"/>,
                customComponent: DateDisplay
            },
            {
                columnName: 'enddate',
                displayName: <FormattedMessage id="wholesale.creditline.interest.column.enddate" defaultMessage="End date"/>,
                customComponent: DateDisplay
            },
            {
                columnName: 'rate',
                displayName: <FormattedMessage id="wholesale.creditline.interest.column.rate" defaultMessage="Rate"/>,
                customComponent: PercentDisplay
            },
            {
                columnName: 'days',
                displayName: <FormattedMessage id="wholesale.creditline.interest.column.days" defaultMessage="Days"/>,
            }
        ];

        if (this.props.showLinkDisplay) {
            columnMetadata[0].customComponent = LinkDisplay
        }

        let message = (<p className="center-text"><FormattedMessage id="wholesale.creditline.empty.interest"
                                                                    defaultMessage="Select a financial scale and a start date"/>
        </p>);
        let noDataMessage = this.props.isLoading ? <Loader/> : message;
        return (
            <CustomGriddle
                tableClassName="table table-hover interest-table"
                useGriddleStyles={false}
                results={this.props.rows}
                columns={columns}
                columnMetadata={columnMetadata}
                initialSort='period'
                initialSortAscending={false}
                resultsPerPage={12}
                showPager={false}
                noDataMessage={noDataMessage}

            />
        )
    }
}



