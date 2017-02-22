'use strict'
import React, {Component, PropTypes} from 'react';

import CustomGriddle, {DateDisplay, PercentDisplay, NumberDisplay} from '../../../core/components/lib/CustomGriddle';
import  {FormattedMessage} from 'react-intl';
import Loader from '../../../core/components/lib/Loader';
const columns = ['period', 'duedate', 'percentage', 'amount', 'days'];

export default class InterestTable extends Component {

    render() {
        const columnMetadata = [
            {
                columnName: 'period',
                displayName: '#'

            },
            {
                columnName: 'duedate',
                displayName: <FormattedMessage id="wholesale.creditline.repayment.column.duedate"
                                               defaultMessage="due date"/>,
                customComponent: DateDisplay
            },
            {
                columnName: 'percentage',
                displayName: <FormattedMessage id="wholesale.creditline.repayment.column.percent"
                                               defaultMessage="Percentage"/>,
                customComponent: PercentDisplay
            },
            {
                columnName: 'amount',
                displayName: <FormattedMessage id="wholesale.creditline.repayment.column.amount"
                                               defaultMessage="Amount"/>,
                customComponent: NumberDisplay

            },
            {
                columnName: 'days',
                displayName: <FormattedMessage id="wholesale.creditline.repayment.column.days" defaultMessage="Days"/>,
            }
        ];

        if (this.props.showLinkDisplay) {
            columnMetadata[0].customComponent = LinkDisplay
        }

        let message = (<p className="center-text"><FormattedMessage id="wholesale.creditline.empty.repayement"
                                                                    defaultMessage="Select a financial scale, a start date and an amount"/>
        </p>);
        let noDataMessage = this.props.isLoading ? <Loader/> : message;
        return (
            <CustomGriddle
                tableClassName="table table-hover repayment-table"
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



