'use strict'
import React, {Component, PropTypes} from 'react';

import Pager from '../../../core/components/lib/Pager';
import CustomGriddle, {CurrencyDisplay} from '../../../core/components/lib/CustomGriddle';
import {Link} from 'react-router';
import {FormattedNumber, FormattedMessage} from 'react-intl';
import  {CREDITLINES} from '../../index';
import Loader from '../../../core/components/lib/Loader';

const allColumns = ['dosnum','tpglibelle', 'dosmtcomite', 'outstanding', 'pendingamount', 'availableamount', 'livestock'];
const reducedDetailColumns = ['tpglibelle', 'dosmtcomite', 'outstanding', 'pendingamount', 'availableamount', 'livestock'];
const reducedColumns = ['dosnum', 'tpglibelle', 'availableamount', 'livestock'];

class LinkDisplay extends Component {
    render() {
        let nav = CREDITLINES + '/';
        return (<Link to={nav + this.props.rowData.dosid}>{this.props.data}</Link>);
    }
}


export default class CreditlineTable extends Component {

    render() {
            var columnMetadataDosnum =
            {
                columnName: 'dosnum',
                displayName: <FormattedMessage id="wholesale.creditline.column.name"
                                               defaultMessage="Credit line name"/>
            };
            var columnMetadataDetail = [
            {
                columnName: 'tpglibelle',
                displayName: <FormattedMessage id="wholesale.creditline.column.product"
                                               defaultMessage="Product"/>,
                summaryLabel: 'Product'
            },
            {
                columnName: 'dosmtcomite',
                displayName: <FormattedMessage id="wholesale.creditline.column.creditlimit"
                                               defaultMessage="Credit limit"/>,
                summaryType: 'SUM',
                customComponent: CurrencyDisplay
            },
            {
                columnName: 'outstanding',
                displayName: <FormattedMessage id="wholesale.creditline.column.outstanding"
                                               defaultMessage="Outstanding"/>,
                summaryType: 'SUM',
                customComponent: CurrencyDisplay
            },
            {
                columnName: 'pendingamount',
                displayName: <FormattedMessage id="wholesale.creditline.column.pending" defaultMessage="Pending"/>,
                summaryType: 'SUM',
                customComponent: CurrencyDisplay
            },
            {
                columnName: 'availableamount',
                displayName: <FormattedMessage id="wholesale.creditline.column.available" defaultMessage="Available"/>,
                summaryType: 'SUM',
                customComponent: CurrencyDisplay
            },
            {
                columnName: 'livestock',
                displayName: <FormattedMessage id="wholesale.creditline.column.livestock" defaultMessage="Live stock"/>,
                summaryType: 'SUM',
            }
        ];
        var columnMetadata = [ columnMetadataDosnum, ...columnMetadataDetail ];
        var columnMetadataReduced = [
            {
                columnName: 'dosnum',
                displayName: <FormattedMessage id="wholesale.creditline.column.name"
                                               defaultMessage="Credit line name"/>,
                summaryLabel: 'Total'
            },
            {
                columnName: 'tpglibelle',
                displayName: <FormattedMessage id="wholesale.creditline.column.product"
                                               defaultMessage="Product"/>
            },
            {
                columnName: 'availableamount',
                displayName: <FormattedMessage id="wholesale.creditline.column.available" defaultMessage="Available"/>,
                summaryType: 'SUM',
                customComponent: CurrencyDisplay
            },
            {
                columnName: 'livestock',
                displayName: <FormattedMessage id="wholesale.creditline.column.livestock" defaultMessage="Live stock"/>,
                summaryType: 'SUM',
            }
        ];
        var columns = allColumns;
        if (this.props.showLinkDisplay) {
            columnMetadata[0].customComponent = LinkDisplay
        }
        if (this.props.reduced) {
            columns = reducedColumns;
            columnMetadata = columnMetadataReduced;
        }
        else if(this.props.reducedDetail){
            columns = reducedDetailColumns;
            columnMetadata = columnMetadataDetail;
        }


        let message = (<p className="center-text"><FormattedMessage id="wholesale.creditline.nocreditline"
                                                                    defaultMessage="You have no credit line, create a credit line"/>
        </p>);
        let noDataMessage = this.props.isLoading ? <Loader/> : message;
        return (
            <CustomGriddle
                tableClassName="table table-hover credit-table"
                useGriddleStyles={false}
                results={this.props.rows}
                columns={columns}
                columnMetadata={columnMetadata}
                initialSort='dosnum'
                initialSortAscending={false}
                resultsPerPage={12}
                showPager={false}
                showSummary={this.props.showSummary}
                noDataMessage={noDataMessage}

            />
        )
    }
}



