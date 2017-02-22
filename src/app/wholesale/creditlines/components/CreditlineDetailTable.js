'use strict'
import React, {Component, PropTypes} from "react";
import Griddle from "griddle-react";
import Pager from "../../../core/components/lib/Pager";
import {Link} from "react-router";
import {FormattedMessage, injectIntl, defineMessages} from "react-intl";
import {CREDITLINES, CONTRACT} from "../../index";
import {DateDisplay, CurrencyDisplay} from "../../../core/components/lib/CustomGriddle";
import {getStepStyle} from "../../../core/utils/Utils";
import Loader from '../../../core/components/lib/Loader';

//TOdO: get mak model by reference table , get label asset Type
const columns = ['dosnum', 'phalibelle', 'dosnom', 'napcode', 'makid', 'dosexternalref', 'iruserialnumber', 'dosdtdeb', 'dosdtfin', 'days', 'dosmtproduct'];

const messages = defineMessages({
    phaseTitle: {id: "wholesale.creditlinedetail.phalibelle.column", defaultMessage: 'Phase'}
});


class RefDisplay extends Component {
    render() {

        let label = this.props.data;
        var obj = this.props.metadata.customComponentMetadata.referenceTable.find(obj => {
            return obj.code === this.props.data
        });
        if (obj) {
            label = obj.label;
        }

        return (<span>{label}</span>);
    }
}

class PhaseDisplay extends Component {
    render() {
        let phaseLabel = this.props.metadata.customComponentMetadata.phalibelle;
        let phase = this.props.data;
        let cl = getStepStyle(this.props.data);
        return (<span className={cl} title={phaseLabel + " : " + phase}>{phase}</span>);
    }
}

const LinkDisplay = props => (
    <Link to={{
        pathname: CREDITLINES + '/' + props.metadata.customComponentMetadata.parentDosId +
        CONTRACT + '/' + props.rowData.dosid
    }}>
        {props.data}
    </Link>
);

class CreditLineDetailTable extends Component {
    render() {
        let {intl} = this.props;
        let {formatMessage} = intl;
        const columnMetadata = [
            {
                columnName: 'dosnum',
                sortDirectionCycle: ['desc', 'asc', null],
                displayName: <FormattedMessage id="wholesale.creditlinedetail.dosnum.column"
                                               defaultMessage="Contract"/>,
                customComponent: LinkDisplay,
                customComponentMetadata: {
                    parentDosId: this.props.parentDosId,
                }
            },
            {
                columnName: 'phalibelle',
                displayName: <FormattedMessage id="wholesale.creditlinedetail.phalibelle.column"
                                               defaultMessage="Phase"/>,
                customComponent: PhaseDisplay,
                customComponentMetadata: {
                    referenceTable: this.props.referencetables.phases,
                    phalibelle: formatMessage(messages.phaseTitle)
                }
            },
            {
                columnName: 'dosnom',
                displayName: <FormattedMessage id="wholesale.creditlinedetail.dosnom.column"
                                               defaultMessage="Financial plan"/>
            },
            {
                columnName: 'napcode',
                displayName: <FormattedMessage id="wholesale.creditlinedetail.labelassettype.column"
                                               defaultMessage="Asset type"/>,
                customComponent: RefDisplay,
                customComponentMetadata: {
                    referenceTable: this.props.referencetables.naps,
                }
            },
            {
                columnName: 'makid',
                displayName: <FormattedMessage id="wholesale.creditlinedetail.labelmakmodel.column"
                                               defaultMessage="Make"/>,
                customComponent: RefDisplay,
                customComponentMetadata: {
                    referenceTable: this.props.referencetables.makes,
                }
            },
            {
                columnName: 'dosexternalref',
                displayName: <FormattedMessage id="wholesale.creditlinedetail.invoice.column" defaultMessage="Invoice"/>
            },
            {
                columnName: 'iruserialnumber',
                displayName: <FormattedMessage id="wholesale.creditlinedetail.vin.column" defaultMessage="VIN"/>
            },
            {
                columnName: 'dosdtdeb',
                displayName: <FormattedMessage id="wholesale.creditlinedetail.dosdtdeb.column"
                                               defaultMessage="Start date"/>,
                customComponent: DateDisplay
            },
            {
                columnName: 'dosdtfin',
                displayName: <FormattedMessage id="wholesale.creditlinedetail.dosdtfin.column"
                                               defaultMessage="End date"/>,
                customComponent: DateDisplay
            },
            {
                columnName: 'dosmtproduct',
                displayName: <FormattedMessage id="wholesale.creditlinedetail.amount.column" defaultMessage="Amount"/>,
                customComponent: CurrencyDisplay
            },
            {
                columnName: 'days',
                displayName: <FormattedMessage id="wholesale.creditlinedetail.days.column" defaultMessage="Days"/>
            }
        ];

        let message = (<p className="center-text"><FormattedMessage id="wholesale.creditlinedetail.nodraw"
                                                                    defaultMessage="You have no draw, create a draw"/>
        </p>);
        let noDataMessage = this.props.isLoading ? <Loader/> : message;
        return (
            <Griddle
                tableClassName="table table-hover"
                useGriddleStyles={false}
                results={this.props.rows}
                columns={columns}
                columnMetadata={columnMetadata}
                initialSort='dosnum'
                initialSortAscending={false}

                showFilter={true}
                filterPlaceholderText={<FormattedMessage id="wholesale.filter.placeholder"
                                                         defaultMessage="Enter your filter"/>.props.defaultMessage}
                externalIsLoading={this.props.isLoading}
                noDataMessage={noDataMessage}

                resultsPerPage={12}
                useCustomPagerComponent={true}
                customPagerComponent={Pager}
                customPagerComponentOptions={{hidePrevNext: true}}
            />
        )
    }
}
export default injectIntl(CreditLineDetailTable);