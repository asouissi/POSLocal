'use strict'
import React, {Component, createElement} from "react";
import {connect} from "react-redux";

import isEqual from "lodash/isEqual"

import {
    fetchReferenceTable,
    fetchReferenceTableWithParams,
    getReferenceTable
} from "../../reducers/referenceTable";

const mapStateToProps = (state, props) => {
    let {options, isLoading, refTable, refParams, ...rest} = props;
    if (typeof options === 'string' || typeof refTable === 'string') {
        refTable = refTable || options;//options can be the name a this reference table
        const referenceTable = getReferenceTable(state, refTable, refParams);
        options = referenceTable.data;
        isLoading = referenceTable.isLoading;
    }
    return {
        options, isLoading, refTable
    }
};

const refTableComponent = (Wrapped) => connect(mapStateToProps)(class RefTable extends Component {

    componentWillMount() {
        let {refTable, refParams, refApi, allowEmptyParams, ...props} = this.props;
        if (this.props.refTable) {
            if (refParams) {
                this._fetchWithParams(this.props);

            } else {
                this.props.dispatch(fetchReferenceTable(refTable, refApi));
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.refTable && nextProps.refParams && !isEqual(nextProps.refParams, this.props.refParams)) {
            this._fetchWithParams(nextProps);
        }
    }

    _fetchWithParams(props) {
        let canFetch = true;
        let {allowEmptyParams, refTable, refParams, refApi, ...rest} = props;
        if (!allowEmptyParams) {
            canFetch = Object.values(refParams).reduce((fetch, val) => {
                const b = val !== null && val !== undefined && val !== '';
                return fetch && b
            }, true);
        }
        if (canFetch) {
            this.props.dispatch(fetchReferenceTableWithParams(refTable, refParams, refApi))
        }
    }

    render() {
        let {refTable, refApi, allowEmptyParams, refParams, ...props} = this.props;
        return <Wrapped {...props} />;
    }
});

export default refTableComponent