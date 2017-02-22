/**
 * Created by zos on 02/08/2016.
 */

import React, {Component} from 'react'
import {Link} from 'react-router';

import Griddle from 'griddle-react';
import {connect} from 'react-redux'
import {injectIntl, defineMessages, FormattedMessage} from 'react-intl';
import {reduxForm, Field, formValueSelector} from 'redux-form'
import {GlobalMessages} from '../../../core/intl/GlobalMessages';

import {Row, Col, ProgressBar} from 'react-bootstrap';
import {notify} from '../../../core/components/lib/notify';

import Box from '../../../core/components/lib/Box';
import FileChooser from '../../../core/components/lib/FileChooser';
import SelectField from '../../../core/components/lib/SelectField';
import config from './config'
import Breadcrumbs from 'react-breadcrumbs'
import {
    uploadDocument,
    getCreditlinedetailListDocument,
    getListTypesDocument,
    deleteDrawDocument
} from '../reducers/actions'
import  {CREDITLINEDETAIL, CONTRACT} from '../../index';

import AssetInformationContainer from './AssetInformationContainer';
import {isSettled} from "../reducers/actions";
import Loader from '../../../core/components/lib/Loader';

const messages = defineMessages({
    newFilePlaceholder: {id: "wholesale.contract.documents.form.newfile.placeholder", defaultMessage: 'Select a file'},
    typeFilePlaceholder: {
        id: "wholesale.contract.documents.form.typefile.placeholder",
        defaultMessage: 'Select a type'
    },
    documentsTitle: {id: "wholesale.contract.documents.title", defaultMessage: 'Documents'},
    btnBrowse: {id: "wholesale.contract.documents.btn.browse", defaultMessage: 'Browse...'},
    btnAdd: {id: "wholesale.contract.documents.btn.upload", defaultMessage: 'Upload'},
});

const validate = values => {
    const errors = {};
    if (!values.docid) {
        errors.docid = GlobalMessages.fieldRequire;
    }

    if (!values.file) {
        errors.file = GlobalMessages.fieldRequire;
    }
    return errors
};

const columns = ['dmaid', 'dmatypelibelle', 'dmafilename', 'dmapath'];

// Display Download button
class DownloadDisplay extends Component {

    handleDelete(dmaid){
        this.props.metadata.customComponentMetadata.deleteDrawDocument(this.props.metadata.customComponentMetadata.contractId, dmaid);

    }
    render() {
        return (
            <div>
                <a href={config.hostname+'/RestServices/draws/documents/content/'+this.props.rowData.dmaid}>
                    <i className="glyphicon glyphicon-cloud-download gi-2x gi-paddR"/>
                </a>
                <a onClick={() => this.handleDelete(this.props.rowData.dmaid)}><i className="glyphicon glyphicon-remove-circle gi-2x"/></a>

            </div>
        );


    }
}

export class ContractDocumentsFormContainer extends Component {
    constructor(props) {
        super(props)
        this.state = {progress: 0};
    }

    handleUploadOnClick = (data) => {
        let file = data.file;
        var formData = new FormData();
        formData.append('file', file);
        formData.append('docid', this.props.docTypeSelected);
        if (this.props.params.contractId && file) {
            this.props.uploadDocument(this.props.params.contractId, formData, this.onFileUploadProgress, this.notifySuccess);
        }
    };

    notifySuccess = () => {
        notify.show(<FormattedMessage id="wholesale.contract.documents.fileupload"
                                      defaultMessage="File uploaded"/>, 'success');
    };

    onFileUploadProgress = (progressEvent) => {
        const progress = progressEvent.loaded * 100 / progressEvent.total;
        this.setState({progress: progress})
    };

    componentWillMount() {
        const dosId = parseInt(this.props.params.contractId);
        if (dosId) {
            this.props.dispatch(isSettled(dosId));
        }
        this.props.getCreditlinedetailListDocument(this.props.params.contractId);
        this.props.getListTypesDocument();
    }

    render() {

        const columnMetadata = [
            {
                columnName: 'dmaid',
                displayName: <FormattedMessage id="wholesale.contract.documents.column.document"
                                               defaultMessage="Document #"/>,
                summaryLabel: 'ID'
            },
            {
                columnName: 'dmatypelibelle',
                displayName: <FormattedMessage id="wholesale.contract.documents.column.type" defaultMessage='Type'/>,
                summaryLabel: 'TYPE'
            },
            {
                columnName: 'dmafilename',
                displayName: <FormattedMessage id="wholesale.contract.documents.column.name" defaultMessage="Name"/>
            },
            {
                columnName: 'dmapath',
                displayName: '',
                customComponent: DownloadDisplay,
                customComponentMetadata: {
                    contractId: this.props.params.contractId,
                    deleteDrawDocument : this.props.deleteDrawDocument
                }
            }
        ];
        let noDocsMessage = (<p className="center-text"><FormattedMessage id="wholesale.contract.documents.nodocs"
                                                                          defaultMessage="You have no documents"/></p>);

        let noDataMessage = this.props.isLoading ? <Loader/> : noDocsMessage;
        const {
            handleSubmit, submitting, pristine
        } = this.props;
        let actionBtuttons = this.renderActionButtons();


        return (
            <div className="contract-content">
                <Breadcrumbs
                    routes={this.props.routes}
                    params={this.props.params} excludes={['app', '/']}/>

                <Row>
                    <Col md={8}>
                        <Box type="primary" title={<FormattedMessage id="wholesale.contract.documents.list.title"
                                                                     defaultMessage="List of documents"/>}>
                            <Griddle
                                tableClassName="table table-hover documents-table"
                                useGriddleStyles={false}
                                results={this.props.documents}
                                columns={columns}
                                columnMetadata={columnMetadata}
                                initialSort='dmafilename'
                                initialSortAscending={true}
                                noDataMessage={noDataMessage}
                                enableInfiniteScroll={true}
                                bodyHeight="250"
                                resultsPerPage={12}
                                useFixedHeader={true}
                            />
                        </Box>
                        <Box type="primary" title={<FormattedMessage id="wholesale.contract.documents.add.tooltip"
                                                                     defaultMessage="Add new documents"/>}>
                            <form >
                                <Row>
                                    <Col md={6}>
                                        <Field name="docid"
                                               component={SelectField}
                                               title={<FormattedMessage id="wholesale.contact.document.form.type"
                                                                        defaultMessage="Document type"/>}
                                               placeholder={this.props.intl.formatMessage(messages.typeFilePlaceholder)}
                                               options={this.props.docTypes}
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6}>
                                        <Field name="file" component={FileChooser} ref="upfile"/>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6}>
                                        <ProgressBar now={this.state.progress}
                                                     label={this.state.progress+ "%"}
                                                     active={this.state.progress === 100 && this.props.isUploading}
                                                     bsStyle={this.state.progress === 100 && !this.props.isUploading
                                                         ? 'success' : 'info'}/>
                                        <button type="submit" className="form-group btn btn-primary pull-right"
                                                onClick={handleSubmit(this.handleUploadOnClick)}
                                                disabled={pristine || submitting}>
                                            {this.props.intl.formatMessage(messages.btnAdd)}
                                        </button>
                                    </Col>
                                </Row>
                            </form>
                        </Box>
                    </Col>
                    <Col md={4}>
                        <Box type="primary"
                             title={<FormattedMessage id="wholesale.contract.documents.summary.box.title"
                                                      defaultMessage="Summary"/>}>
                            <AssetInformationContainer
                                parentDosId={this.props.params.dosid}
                                contractId={this.props.params.contractId}>
                                {actionBtuttons}
                                </AssetInformationContainer>
                        </Box>
                    </Col>
                </Row>
            </div>
        );
    }

    renderActionButtons() {
        let disabled = this.props.readonly === "1" ? "disabled" : "";
        return (
            <div className="text-center">


                <span className="btn-icon">
                    <Link to={{
                        pathname: CREDITLINEDETAIL + '/' + this.props.params.dosid +
                        CONTRACT + '/' + this.props.params.contractId
                    }} className="glyphicon glyphicon-zoom-in">

                    </Link>
                    <FormattedMessage id="wholesale.contract.documents.link.edit"
                                      defaultMessage="Show asset details"/>
                </span>
                <span className={this.props.isSettled || this.props.readonly === "1" ? 'btn-icon  link-disable' : 'btn-icon'}>
                    <Link to={{
                        pathname: CREDITLINEDETAIL + '/' + this.props.params.dosid +
                        CONTRACT + '/' + this.props.params.contractId
                        + '/settle'
                    }} className="fa fa-legal">

                    </Link>
                    <FormattedMessage id="wholesale.contract.documents.link.settle"
                                      defaultMessage="Settle"/>
                </span>
                <span className={!this.props.canBeConverted || (this.props.readonly === "1") ? 'btn-icon  link-disable' : 'btn-icon'}>
                    <Link to={{
                        pathname: CREDITLINEDETAIL + '/' + this.props.params.dosid +
                        CONTRACT + '/' + this.props.params.contractId
                        + '/convert'
                    }} className="fa fa-refresh">
                    </Link>
                    <FormattedMessage id="wholesale.contract.documents.link.convert"
                                      defaultMessage="Convert"/>
                </span>

            </div>
        );
    }
}

ContractDocumentsFormContainer = reduxForm({
        form: 'contractDocument',
        validate,
        enableReinitialize: true
    },
)(injectIntl(ContractDocumentsFormContainer));

const selector = formValueSelector('contractDocument');

const mapDispatchToProps = {getCreditlinedetailListDocument, getListTypesDocument, uploadDocument, deleteDrawDocument};

const mapStateToProps = (state) => {
    var docTypeSelected = selector(state, 'docid');
    let Bouchon = [
        {dmaid: 1, doclibelle: 'type1', dmafilename: 'name1', dmapath: 'Test.docx'},
        {dmaid: 2, doclibelle: 'type2', dmafilename: 'name2', dmapath: 'Test.docx'}
    ];
    var documentTypeOptionsBouchon = [
        {code: "IND", label: "Indirect"}, {code: "BK", label: "Bank"}, {code: "TS", label: "Test"}
    ];

    return {
        isUploading: state.contracts.isUploading,
        docTypes: state.contracts.docTypes,
        documents: state.contracts.documents,
        docTypeSelected: docTypeSelected,
        docServerPath: state.contracts.docServerPath,
        isSettled: state.contracts.isSettled,
        canBeConverted: state.contracts.canBeConverted,
        isLoading: state.contracts.isLoading,
        readonly: state.authentication.user.readonly
    }
}
export default connect(
    mapStateToProps, mapDispatchToProps
)(ContractDocumentsFormContainer);