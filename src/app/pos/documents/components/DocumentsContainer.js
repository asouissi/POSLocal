import React, {Component} from "react";
import {connect} from "react-redux";
import DocumentsTable from "./DocumentsTable";
import Box from "../../../core/components/lib/Box.js";
import {FormattedMessage} from "react-intl";
import {fetchDocumentsAction} from "../reducers/actions";
import {getRouteAccessKeys, getComponentAccessKeys} from '../../../common/accesskeys/AccessKeysSelector';

export class DocumentsContainer extends Component {
    componentWillMount() {
        this.props.fetchDocumentsAction();
    }

    render() {
        const {rows, accessKeys} = this.props;
        const id = "common.actor.search.table";
        const key = getComponentAccessKeys(accessKeys, id);
        return (
            <div>
                <p>
                    <h3><FormattedMessage id="pos.documents.search.container.title"
                                          defaultMessage="Documents list"/></h3>
                </p>

                <Box className="box my-actors" type="primary" title="Documents list">
                    <div className="box-body">
                        <DocumentsTable id={id} rows={rows} accessKeys={key}/>
                    </div>
                </ Box>

            </div>
        )
    }
}


const mapStateToProps = (state, props) => {
    const route = props.route && props.route.path;
    return {
        rows: state.documents.documents,
        accessKeys: getRouteAccessKeys(state, route)
    }
}


const mapDispatchToProps = {
    fetchDocumentsAction

}

export default connect(
    mapStateToProps, mapDispatchToProps
)(DocumentsContainer)
