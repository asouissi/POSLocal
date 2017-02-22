'use strict'
import React, {Component, PropTypes} from 'react'
import {injectIntl, FormattedNumber, FormattedMessage, FormattedDate, defineMessages} from 'react-intl'
import Griddle from 'griddle-react';
import Pager from '../../../core/components/lib/Pager';

class MakeCells extends Component {
    render() {
        let values = this.props.metadata.customComponentMetadata.values
        let data = this.props.rowData
        return (
            <div className="cellContractDetailTable">
                {
                    values.map((value, index) => {
                        var text = data[value.key]
                        if (text != null && value.isDate)
                            text = <FormattedDate value={text}/>
                        else if (text != null && value.isCurrency)
                            text = <FormattedNumber value={text} format="currencyFormat"/>
                        else if (text != null && value.textNullValue)
                            text = value.textNullValue
                        if (text != null) {
                            text = (
                                <div>
                                    <span className="textBefore">{value.textBefore}</span>
                                    {text}
                                </div>
                            )
                        }

                        return (
                            <div key={index}>
                                {text}
                            </div>
                        )
                    })
                }
            </div>
        );
    }
}

class ContractsDetailTable extends Component {
    render() {
        const intl = this.props.intl
        const messages = {
            collumns: {
                dosid: intl.formatMessage({id: "pos.contracts.customer.column", defaultMessage: "Customer"}),
                dosdtdeb: intl.formatMessage({id: "pos.contracts.dates.column", defaultMessage: "Dates"}),
                advance: intl.formatMessage({id: "pos.contracts.finance.column", defaultMessage: "Finance"}),
                balanceoutstanding: intl.formatMessage({id: "pos.contracts.status.column", defaultMessage: "Status"}),
                naplibelle: intl.formatMessage({id: "pos.contracts.asset.column", defaultMessage: "Asset"}),

            },
            cells: {
                dosdtdeb: intl.formatMessage({id: "pos.contracts.dates.cell.from", defaultMessage: "From "}),
                dosdtfin: intl.formatMessage({id: "pos.contracts.dates.cell.to", defaultMessage: "To "}),
                advance: intl.formatMessage({id: "pos.contracts.finance.cell.advance", defaultMessage: "Advance: "}),
                drfmt: intl.formatMessage({
                    id: "pos.contracts.finance.cell.rentalValue",
                    defaultMessage: "Rental value: "
                }),
                tpglibelle: intl.formatMessage({id: "pos.contracts.finance.cell.product", defaultMessage: "Product: "}),
                drutaufixe: intl.formatMessage({id: "pos.contracts.finance.cell.yield", defaultMessage: "Yield: "}),
                commision: intl.formatMessage({
                    id: "pos.contracts.finance.cell.commission",
                    defaultMessage: "Commission: "
                }),
                balanceoutstanding: intl.formatMessage({
                    id: "pos.contracts.status.cell.outstanding",
                    defaultMessage: "Outstanding: "
                }),
                arrears: intl.formatMessage({id: "pos.contracts.status.cell.arrears", defaultMessage: "Arrears: "}),
                naplibelle: intl.formatMessage({id: "pos.contracts.asset.cell.type", defaultMessage: "Type: "}),
                acadescription: intl.formatMessage({
                    id: "pos.contracts.asset.cell.category",
                    defaultMessage: "Category: "
                }),
                irudescrip: intl.formatMessage({
                    id: "pos.contracts.asset.cell.description",
                    defaultMessage: "Description: "
                })
            }
        }
        const columns = ['dosid', 'dosdtdeb', "drfmt", "balanceoutstanding", "naplibelle"];
        const columnMetadata = [
            {
                columnName: 'dosid',
                displayName: messages.collumns.dosid,
                customComponent: MakeCells,
                customComponentMetadata: {
                    values: [
                        {key: "actlibcourt"},
                        {key: "dosid"}]
                }
            },
            {
                columnName: 'dosdtdeb',
                displayName: messages.collumns.dosdtdeb,
                customComponent: MakeCells,
                customComponentMetadata: {
                    values: [
                        {key: "dosdtdeb", textBefore: messages.cells.dosdtdeb, isDate: true},
                        {key: "dosdtfin", textBefore: messages.cells.dosdtfin, isDate: true}
                    ]
                }
            },
            {
                columnName: 'drfmt',
                displayName: messages.collumns.advance,
                customComponent: MakeCells,
                customComponentMetadata: {
                    values: [
                        {key: "advance", textBefore: messages.cells.advance, isCurrency: true},
                        {key: "drfmt", textBefore: messages.cells.drfmt, isCurrency: true},
                        {key: "tpglibelle", textBefore: messages.cells.tpglibelle},
                        {key: "drutaufixe", textBefore: messages.cells.drutaufixe, isCurrency: true},
                        {key: "commision", textBefore: messages.cells.commision, isCurrency: true}]
                }
            },
            {
                columnName: 'balanceoutstanding',
                displayName: messages.collumns.balanceoutstanding,
                customComponent: MakeCells,
                customComponentMetadata: {
                    values: [
                        {
                            key: "balanceoutstanding",
                            textBefore: messages.cells.balanceoutstanding,
                            isCurrency: true
                        },
                        {key: "arrears", textBefore: messages.cells.arrears, isCurrency: true}
                    ]
                }
            },
            {
                columnName: 'naplibelle',
                displayName: messages.collumns.naplibelle,
                customComponent: MakeCells,
                customComponentMetadata: {
                    values: [
                        {key: "naplibelle", textBefore: messages.cells.naplibelle},
                        {key: "acadescription", textBefore: messages.cells.acadescription},
                        {key: "irudescrip", textBefore: messages.cells.irudescrip}
                    ]
                }
            },
        ]

        const noDataMessage = <span>There is no data to display</span>

        return (
            <Griddle
                tableClassName="table table-hover"
                useGriddleStyles={false}
                results={this.props.rows}
                initialSort='dosid'
                sortAscending={false}
                columns={columns}
                columnMetadata={columnMetadata}
                resultsPerPage={12}
                useCustomPagerComponent={true}
                customPagerComponent={Pager}
                noDataMessage={noDataMessage}
            />
        )
    }
}
export default injectIntl(ContractsDetailTable)