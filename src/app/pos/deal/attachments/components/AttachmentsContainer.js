'use strict'
import React, {Component} from 'react'
import {connect} from 'react-redux';
import flow from 'lodash/flow'
import HTML5Backend from 'react-dnd-html5-backend';
import {injectIntl, defineMessages, FormattedMessage, FormattedDate} from 'react-intl';
import {Table, Button, Grid, Row, Col} from "react-bootstrap";
import KsiopTable from '../../../../core/components/lib/Table'
import Box from '../../../../core/components/lib/Box'
import {DateDisplay} from '../../../../core/components/lib/CustomGriddle'
import FileDropZone from '../../../../core/components/lib/FileDropZone';
import {getAwesomeIconFromMimeType, getMimeTypeFromFilename} from '../../../../core/utils/MimeTypes'
import {notify} from '../../../../core/components/lib/notify';
import config from './config'
import {getBootstrapResolution} from '../../../../core/utils/Utils';
import PatternGenerator from '../../../../core/components/lib/responsiveGriddle';
import Pager from '../../../../core/components/lib/Pager';
import MediaQuery from 'react-responsive';
import {formValueSelector} from "redux-form";
import TextEntry from '../../../../core/components/lib/TextEntry';

import {
    fetchReferenceTableWithParams,
    tables,
    getReferenceTable
} from "../../../../core/reducers/referenceTable";
import {saveDealGeneric} from '../reducers/actions'
import {
    uploadDocument,
    updateThenUploadDocument,
    getListDocument,
    setDmaType,
    setDmaCat,
    setPredefinedType,
    setPredefinedDmaid,
    setDmaStatus,
    setDmaComment,
    deleteDocument,
    cleanDocumentList,
    dispatchPDFInit
} from '../../attachments/reducers/actions'

import PDFPagesDialog from './PDFPagesDialog';
import PhotoDialog from './PhotoDialog';
import Griddle from 'griddle-react';
import Loader from '../../../../core/components/lib/Loader';

const DragDropContext = require('react-dnd').DragDropContext;

const messages = defineMessages({
    optionBalance: {id: "pos.attach.option.balance", defaultMessage: 'Balance sheet'},
    optionBankGaurantee: {id: "pos.attach.option.bank", defaultMessage: 'Bank guarantee'},
    optionGuaranteeDoc: {id: "pos.attach.option.gaurantee", defaultMessage: 'Guarantee document'},
    optionKbis: {id: "pos.attach.option.kbis", defaultMessage: 'Kbis extract'},
    optionManagerID: {id: "pos.attach.option.managerid", defaultMessage: 'Manager personal ID'},
    optionOtherDoc: {id: "pos.attach.option.otherdoc", defaultMessage: 'Other documents'},
    optionplaccounts: {id: "pos.attach.option.placcounts", defaultMessage: 'PL accounts'},

    optionActive: {id: "pos.attach.option.active", defaultMessage: 'Active'},
    optionInactive: {id: "pos.attach.option.inactive", defaultMessage: 'Inactive'},

    btnopen: {id: "pos.attach.btn.open", defaultMessage: 'Open'},
    btnDownload: {id: "pos.attach.bttn.download", defaultMessage: 'Download'},
    btnDelete: {id: "pos.attach.btn.delete", defaultMessage: 'Delete'},
    // btnUpload: {id: "pos.attach.btn.upload", defaultMessage: 'Upload new attachment'},

    saveSuccess: {id: "pos.attach.save.success", defaultMessage: 'Save success'},
    saveError: {id: "pos.attach.save.error", defaultMessage: 'Save fails'},
    updateSuccess: {id: "pos.attach.update.success", defaultMessage: 'Update success'},

    typeFilePlaceholder: {
        id: "pos.attach.typefile.placeholder",
        defaultMessage: 'Select a type'
    },
    statusPlaceholder: {
        id: "pos.attach.status.placeholder",
        defaultMessage: 'Select a status'
    },

});

class MimeIconDisplay extends Component {
    render() {
        let mimeTypeDoc = getMimeTypeFromFilename(this.props.rowData.dmafilename);
        let mimeIcon = getAwesomeIconFromMimeType(mimeTypeDoc || 'application/download');
        return (<span className={'fa fa-' + mimeIcon}/>);
    }
}
// Format input
class InputDisplay extends Component {
    constructor(props) {
        super(props);
        this.state = {value: props.data};
    }

    handleChange(value) {
        this.setState({value});
    }

    render() {
        return (
            <TextEntry value={this.state.value} className="form-control"
                       onChange={(event, value) => this.props.metadata.customComponentMetadata.handleDMACommentChanged(value, this.props.rowData.dmaid)}
                       updateOnEnter={true}
            />);

    }
}
class DocTypeDisplay extends Component {

    render() {

        var docType = this.props.metadata.customComponentMetadata.listDocTypes.find(type => {
            return type.code === this.props.data
        });
        var label = 'No Type';
        if (docType) {
            label = docType.label;
        }
        if (this.props.rowData.dmafilename && (!docType || !this.props.rowData.dmacat || this.props.rowData.dmacat == "null" || this.props.rowData.dmacat == "IND")) {// if no category or no type, the user can change
            let docTypeOptions = [(<option key="IND" value="IND"></option>),
                ...this.props.metadata.customComponentMetadata.listDocTypes.map((row) => (
                    (<option key={row.code} value={row.code}>{row.label}</option>)
                ))
            ];
            return ( <select className="dropdownInside"
                             defaultValue={this.props.data}
                             onChange={(event) => this.props.metadata.customComponentMetadata.handleDMATypeChanged(event, this.props.rowData.dmaid)}>{docTypeOptions}</select>);
        } else {
            return (<span>{label}</span>);
        }

    }
}
class DocCategoryDisplay extends Component {

    render() {

        var docCat = this.props.metadata.customComponentMetadata.listDocCategories.find(type => {
            return type.code === this.props.data
        });
        var label = 'No Categ';
        if (docCat) {
            label = docCat.label;
        }

        if (this.props.rowData.dmafilename && (!docCat || !this.props.rowData.dmatype || this.props.rowData.dmatype == "null" || this.props.rowData.dmatype == "IND")) { // if no category or no type, the user can change
            let docCatOptions = [(<option key="IND" value="IND"></option>),
                ...this.props.metadata.customComponentMetadata.listDocCategories.map((row) => (
                    (<option key={row.code} value={row.code}>{row.label}</option>)
                ))
            ];
            return ( <select className="dropdownInside"
                             defaultValue={this.props.data}
                             onChange={(event) => this.props.metadata.customComponentMetadata.handleDMACatChanged(event, this.props.rowData.dmaid)}>{docCatOptions}</select>);
        } else {
            return (<span>{label}</span>);
        }

    }
}

class CommandsDisplay extends Component {
    render() {
        return ( <div className="btn-group">
            <button className="removeIcon"  type="button"
                    onClick={(event) => this.props.metadata.customComponentMetadata.handleDelete(event, this.props.data)}>
                <i className="glyphicon glyphicon-remove-circle"/>
            </button>
        </div>);
    }
}
class FilenameDisplay extends Component {
    render() {
        if (this.props.data) {
            return (<a className="linkIcon"
                       href={config.hostname + '/RestServices/deals/' + this.props.rowData.dosidprospect + '/documents/content/' + this.props.rowData.dmaid}>
                {this.props.data || ''}
            </a>);
        } else {
            return (<button className="attachIcon" type="button"
                            onClick={(event) => this.props.metadata.customComponentMetadata.handleAttachPredefined(event, this.props.rowData.dmatype, this.props.rowData.dmaid)}>
                <i className="glyphicon glyphicon-paperclip"/>
            </button>);
        }

    }
}
class Attachments extends KsiopTable {

    constructor(props) {
        super(props);
    }

    _getDefaultDocumentTypes() {
        return [
            {code: "BALA", label: this.props.intl.formatMessage(messages.optionBalance)},
            {code: "BANK", label: this.props.intl.formatMessage(messages.optionBankGaurantee)},
            {code: "GUAR", label: this.props.intl.formatMessage(messages.optionGuaranteeDoc)},
            {code: "KBIS", label: this.props.intl.formatMessage(messages.optionKbis)},
            {code: "MPID", label: this.props.intl.formatMessage(messages.optionManagerID)},
            {code: "OTHE", label: this.props.intl.formatMessage(messages.optionOtherDoc)},
            {code: "PLAC", label: this.props.intl.formatMessage(messages.optionplaccounts)}
        ];
    }

    static _formatSize(bytes, thresh = 2048) {
        if (Math.abs(bytes) < thresh) {
            return bytes + ' octets';
        }
        var units = ['ko', 'mo', 'go', 'to']
        var u = -1;
        do {
            bytes /= thresh;
            ++u;
        } while (Math.abs(bytes) >= thresh && u < units.length - 1);

        return bytes.toFixed(1) + ' ' + units[u];
    }

    handleCaptureOnClick(event) {
        this.props.setPredefinedDmaid(null);
        event.preventDefault();
        event.stopPropagation();

        this.setState({takePhoto: true});
        return;

        this.refs.imageCapture.click();
    }

    handleUploadOnClick(event) {
        this.props.setPredefinedType(null);
        this.props.setPredefinedDmaid(null);
        event.preventDefault();
        event.stopPropagation();

        this.refs.upfile.click();
    }

    handleFileChanged(event) {

        let file = event.target.files[0];
        this.refs.upfile.value = "";
        if (file.type === "application/pdf" && this.props.dosid) {
            this.props.dispatchPDFInit();
            this.setState({pdfFile: file});
            return;
        }

        var formData = new FormData();
        formData.append('file', file);
        formData.append('docTypeCode', this.props.predefinedType);
        if (this.props.predefinedDmaid) {
            formData.append('dmaid', this.props.predefinedDmaid);
        }


        if (this.props.dosid) {
            this.props.updateThenUploadDocument(this.props.dosid, formData);
            return;
        }

        /// / if the deal is not saved yet, save it first then upload doc
        this.props.saveDeal && this.props.saveDealGeneric(this.props.saveDeal, (dealId, mode) => {
                if (mode === 'U') {
                    notify.show(this.props.intl.formatMessage(messages.updateSuccess), 'success');
                    return;
                }

                notify.show(this.props.intl.formatMessage(messages.saveSuccess), 'success');
                this.props.uploadDocument(dealId, formData);
            },
            (error) => {
                notify.show(this.props.intl.formatMessage(messages.saveError), 'error');
            },
            this.props.form
        );
    }

    componentWillMount() {
        this.props.fetchReferenceTableWithParams(tables.LANTUSPARAM, {
            'tusnom': 'DMATYPE'//,
            //'tpgcode': this.props.tpgcode
        });
        this.props.fetchReferenceTableWithParams(tables.LANTUSPARAM, {
            'tusnom': 'DMACAT'
        });

        if (this.props.dosid && this.props.dosid !== null) { /// / TODO after redux form merge , check doc type when passing
            // from one step to another (if lost)
            this.props.getListDocument(this.props.dosid); /// / fetch the list
        } else { /// / if new deal, clear the documents in the props otherwise, it will show the list of the last deal showed
            this.props.cleanDocumentList();
        }
    }

    handleDelete = (event, dmaid) => {
        event.preventDefault();
        event.stopPropagation();

        this.props.deleteDocument(this.props.dosid, dmaid);
    }

    handleDMATypeChanged = (event, dmaid) => {
        if (event) {
            this.props.setDmaType(event.target.value, dmaid);
        }

    }
    handleDMACatChanged = (event, dmaid) => {
        if (event) {
            this.props.setDmaCat(event.target.value, dmaid);
        }

    }

    handleDMACommentChanged = (value, dmaid) => {
        if (value) {
            this.props.setDmaComment(value, dmaid);
        }
    }

    handlePdfFiles(files) {
        this.refs.upfile.value = "";
        this.setState({pdfFile: null});
    }

    handleAttachPredefined = (event, typeCode, dmaid) => {
        this.props.setPredefinedType(typeCode);
        this.props.setPredefinedDmaid(dmaid);
        event.preventDefault();
        event.stopPropagation();

        this.refs.upfile.click();
    }

    handlePhotoDone() {
        this.setState({takePhoto: null});
        this.props.getListDocument(this.props.dosid);
    }

    render() {
        let buttons = null;

        if (!this.props.isLoading) {
            buttons = [
                <Button key="upload" className="upload-button pull-right" bsStyle="primary" type="button"
                        onClick={(event) => this.handleUploadOnClick(event)}>
                    <FormattedMessage id="pos.attach.btn.upload" defaultMessage="Upload new attachment"/>

                    <i className="fa fa-cloud-upload"/>
                </Button>,
                <Button key="scan" className="capture-button pull-right" bsStyle="primary" type="button"
                        onClick={(event) => this.handleCaptureOnClick(event)}>
                    <FormattedMessage id="pos.attach.btn.capture" defaultMessage="Scan it"/>

                    <i className="fa fa-camera"/>
                </Button>];
        }
        /**
         * USING GRIDDLE
         * @type {XML}
         */
        const columns = ['dmanature', 'dmadt', 'dmafilename', 'dmatype', 'dmacat', 'dmastatuslibelle', 'dmacomment', 'dmaid'];
        const columnMetadata = [
            {
                columnName: 'dmanature',
                customComponent: MimeIconDisplay,
                displayName: ''
            },
            {
                columnName: 'dmadt',
                displayName: <FormattedMessage id="pos.attach.column.date" defaultMessage="Upload date"/>,
                customComponent: DateDisplay
            },
            {
                columnName: 'dmafilename',
                displayName: <FormattedMessage id="pos.attach.column.file" defaultMessage="Filename"/>,
                customComponent: FilenameDisplay,
                customComponentMetadata: {
                    handleAttachPredefined: this.handleAttachPredefined
                }
            },
            {
                columnName: 'dmatype',
                displayName: <FormattedMessage id="pos.attach.column.type" defaultMessage="Type"/>,
                customComponent: DocTypeDisplay,
                customComponentMetadata: {
                    listDocTypes: this.props.listDocTypes,
                    handleDMATypeChanged: this.handleDMATypeChanged
                }
            },
            {
                columnName: 'dmacat',
                displayName: <FormattedMessage id="pos.attach.column.category" defaultMessage="Category"/>,
                customComponent: DocCategoryDisplay,
                customComponentMetadata: {
                    listDocCategories: this.props.listDocCategories,
                    handleDMACatChanged: this.handleDMACatChanged
                }
            },
            {
                columnName: 'dmastatuslibelle',
                displayName: <FormattedMessage id="pos.attach.column.status" defaultMessage="Status"/>
            },
            {
                columnName: 'dmacomment',
                displayName: <FormattedMessage id="pos.attach.column.comments" defaultMessage="Comments"/>,
                customComponent: InputDisplay,
                customComponentMetadata: {
                    handleDMACommentChanged: this.handleDMACommentChanged
                }
            },
            {
                columnName: 'dmaid',
                displayName: '',
                customComponent: CommandsDisplay,
                customComponentMetadata: {
                    handleDelete: this.handleDelete
                }
            }
        ];

        return (
            <div className="attachments-container">
                <FileDropZone className="fullWidth" onDrop={(e) => this.handleFileChanged(e)}>
                    <Box type="primary"
                         title={<FormattedMessage id="pos.attach.title" defaultMessage="Attachments"/>}
                         withBoder="true">

                        <MediaQuery query={'(max-width: ' + getBootstrapResolution("md") + ')'}>
                            {(isMobile) => {
                                return <Griddle
                                    tableClassName="table table-hover"
                                    useGriddleStyles={false}
                                    results={this.props.documents}
                                    initialSort='dmafilename'
                                    sortAscending={false}
                                    columns={columns}
                                    columnMetadata={columnMetadata}
                                    resultsPerPage={isMobile ? 30 : 12}
                                    useCustomPagerComponent={true}
                                    customPagerComponent={Pager}
                                    noDataMessage={this.props.isLoading && <Loader/>}
                                    customRowComponent={PatternGenerator}
                                    useCustomRowComponent={isMobile}
                                    customRowComponentClassName="griddle-body-custom"
                                />
                            }}
                        </MediaQuery>


                        <div className="box-footer">
                            {buttons}

                            { this.state.pdfFile && <PDFPagesDialog
                                messages={messages}
                                dosid={this.props.dosid}
                                file={this.state.pdfFile} onClose={(needUpdate) => this.handlePdfFiles(needUpdate)}
                                listDocTypes={this.props.listDocTypes}/> }

                            { this.state.takePhoto && <PhotoDialog
                                title="PDF pages" dosid={this.props.dosid}
                                onClose={() => this.handlePhotoDone()}
                                /> }
                        </div>
                        <div style={{height: 0, width: 0, overflow: 'hidden'}}>
                            <input id="upfile" ref="upfile" type="file"
                                   onChange={(event) => this.handleFileChanged(event)}/>

                            <input id="imageCapture" ref="imageCapture" type="file" accept="image/*;capture=camera"
                                   onChange={(event) => this.handleFileChanged(event)}/>

                            <input id="imageCapture" ref="imageCapture" type="file" accept="image/*;capture=camera"
                                   capture onChange={(event) => this.handleFileChanged(event)}/>
                        </div>
                    </Box>
                </FileDropZone>
            </div>
        );
    }
}

const selector = formValueSelector('dealForm');
const mapStateToProps = (state, props) => {
    let deal;
    if (props.form == 'dealForm') {
        let reducer = state.newdeal;
        deal = selector(state, 'deal');
    } else if (props.form == 'drawdeal') {
        let reducer = state.newdeal3;
        deal = reducer.drawdeal;

    } else {
        let reducer = state.newdeal2;
        deal = reducer.deal;
    }

    let attachmentsReducer = state.attachmentsReducer;
    return {
        dosid: deal.dosid,
        tpgcode: deal.tpgcode,
        listDocTypes: getReferenceTable(state, tables.LANTUSPARAM, {'tusnom': 'DMATYPE'}).data,//, 'tpgcode': deal.tpgcode
        listDocCategories: getReferenceTable(state, tables.LANTUSPARAM, {'tusnom': 'DMACAT'}).data,
        documents: state.attachmentsReducer.documents,
        predefinedType: state.attachmentsReducer.predefinedType,
        predefinedDmaid: state.attachmentsReducer.predefinedDmaid,
        isLoading: state.attachmentsReducer.isLoading,
    }
};
const mapDispatchToProps = {
    uploadDocument,
    updateThenUploadDocument,
    getListDocument,
    setDmaType,
    setDmaCat,
    setPredefinedType,
    setPredefinedDmaid,
    setDmaStatus,
    setDmaComment,
    deleteDocument,
    saveDealGeneric,
    cleanDocumentList,
    fetchReferenceTableWithParams,
    dispatchPDFInit
};
export default flow(
    DragDropContext(HTML5Backend),
    connect(mapStateToProps, mapDispatchToProps),
)(injectIntl(Attachments))
