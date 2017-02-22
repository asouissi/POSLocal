import React, {Component} from "react";
import { connect } from 'react-redux'
import ReferenceTableComponent from "./ReferenceTableComponent"

class RefTableDisplay extends Component {

    render(){
        var label = this.props.data;
        if(this.props.options) {
            var obj = this.props.options.find(obj => {
                return obj.code === this.props.data
            });
            if (obj) {
                label = obj.label;
            }else if(this.props.emptyValue){
                label = this.props.emptyValue;
            }
        }

        return (<span>{label}</span>);
    }
}
const mapStateToProps = (state,props) => {
    return {
        refTable         :props.metadata.customComponentMetadata.refTable,
        refParams        :props.metadata.customComponentMetadata.refParams,
        allowEmptyParams :props.metadata.customComponentMetadata.allowEmptyParams,
        emptyValue       :props.metadata.customComponentMetadata.emptyValue

    }
}
export default connect(mapStateToProps) (ReferenceTableComponent(RefTableDisplay ))