import React, {Component} from "react";
import {injectIntl, FormattedMessage} from "react-intl";
import Griddle from "griddle-react";
import Box from "../../core/components/lib/Box";
import isEqual from "lodash/isEqual";
const DEFAULT_EMPTY = [];


class ControlDisplay extends Component {
    render() {
        let icon = "fa-warning warning";
        if (this.props.rowData.flagerreur == 1) {
            icon = "fa-minus-circle error";
        }

        return (<i
            className={"fa fa-fw " + icon}>
        </i> );
    }
}

class ErrorDisplay extends Component {
    render() {
        return (<i
            className={"fa fa-fw fa-minus-circle error"}>
        </i> );
    }
}
const DISPLAYED_COLUMN_CODES = ['flagerreur', 'anomalie'];
const DISPLAYED_COLUMN_ERROS_CODES = ['id', 'defaultMessage'];

const COLUMN_META_DATA = [

    {
        columnName: 'flagerreur',
        displayName: <FormattedMessage id="pos.deal.listerrors.detail" defaultMessage="Detail"/>,
        customComponent: ControlDisplay
    },
    {
        displayName: "",
        columnName: 'anomalie',
        // customComponent: ControlDisplay
    }
];

const COLUMN_ERROR_META_DATA = [

    {
        columnName: 'id',
        displayName: <FormattedMessage id="pos.deal.listerrors.detail" defaultMessage="Detail"/>,
        customComponent: ErrorDisplay
    },

    {
        displayName: "",
        columnName: 'defaultMessage',

    }

];

class ListErrors extends Component {

    shouldComponentUpdate(nextProps) {
        return !isEqual(nextProps.errors, this.props.errors)
            || !isEqual(nextProps.control.controlemsgList, this.props.control.controlemsgList);
    }

    handleRowClick = (row, proxy) =>{
        this.props.onErrorClick && this.props.onErrorClick(row, proxy);
    };

    render() {

        var mandatoryBox = DEFAULT_EMPTY;
        var controlBox = DEFAULT_EMPTY;

        if (this.props.control && this.props.control.controlemsgList && this.props.control.controlemsgList.length > 0) {

            var rows = this.props.control.controlemsgList;

            controlBox = (
                <Box type="panel">
                <Griddle
                    tableClassName="table table-hover control-table"
                    useGriddleStyles={false}
                    results={rows}
                    resultsPerPage={50}
                    columns={DISPLAYED_COLUMN_CODES}
                    columnMetadata={COLUMN_META_DATA}
                    enableInfiniteScroll={true}
                    enableSort={false}
                    useFixedHeader={true}
                    />
                </Box> )


        }

        if (this.props.errors && this.props.errors.length > 0) {

            var listErrors = this.props.errors;

            mandatoryBox = (
                <Box type="panel">
                    <Griddle
                        tableClassName="table table-hover control-table errors-table"
                        useGriddleStyles={false}
                        results={listErrors}
                        resultsPerPage={50}
                        columns={DISPLAYED_COLUMN_ERROS_CODES}
                        columnMetadata={COLUMN_ERROR_META_DATA}
                        enableInfiniteScroll={true}
                        enableSort={false}
                        onRowClick={this.handleRowClick}
                        useFixedHeader={true}
                        />
                </Box>)


        }
        return (
            <div>
                {mandatoryBox}
                {controlBox}
            </div>
        );
    }
}


export default injectIntl(ListErrors)