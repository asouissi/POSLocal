import React, {Component} from 'react'
import {AmountDisplay} from "../../core/components/lib/CustomGriddle";
import {tables} from "../../core/reducers/referenceTable";
import {connect} from 'react-redux'
import ReferenceTableComponent from "../../core/components/lib/ReferenceTableComponent"


class AmountIncludeTaxDisplay extends Component {

    render() {

        var value = this.props.data;
        var taxcode = this.props.taxCode ? this.props.taxCode : this.props.rowData.taxcode;
        if (this.props.options) {
            var obj = this.props.options.find(obj => {
                return obj.code === taxcode;
            });
            if (obj && obj.otherinfo) {
                value = value * ( 1 + obj.otherinfo / 100 );
                this.props.data = value;
                value
            }
        }

        return (
            <AmountDisplay {...this.props} />);

    }
}
const mapStateToProps = (state, props) => {
    return {
        refTable: tables.LANTAXE,
        refParams: props.metadata.customComponentMetadata.refParams,
        allowEmptyParams: props.metadata.customComponentMetadata.allowEmptyParams,
        taxCode: props.metadata.customComponentMetadata.taxCode,

    }
}
export default connect(mapStateToProps)(ReferenceTableComponent(AmountIncludeTaxDisplay))
