import React, {Component} from "react";
import {connect} from "react-redux";
import Time from "react-time";
import KsiopTable from "../../../core/components/lib/Table";
import Box from "../../../core/components/lib/Box";
import {formValueSelector} from "redux-form";
import classNames from "classnames";
import {injectIntl, defineMessages, FormattedMessage} from "react-intl";
import {fetchReferenceTableWithParams, tables, getReferenceTable} from "../../../core/reducers/referenceTable";
import {saveDealForUploadDocument} from "../reducers/actions";
import {
    uploadDocument,
    getListDocument,
    setDmaType,
    setPredefinedType,
    setDmaStatus,
    deleteDocument,
    cleanDocumentList
} from "../../../pos/deal/attachments/reducers/actions";
import config from "./config";
import {notify} from "../../../core/components/lib/notify";
import {Table, Button} from "react-bootstrap";
import PDFPagesDialog from "../../../pos/deal/attachments/components/PDFPagesDialog";
import FileDropZone from "../../../core/components/lib/FileDropZone";
import flow from "lodash/flow";
import {BORROWER} from "../../../pos/deal/utils/dealUtils";
import Immutable from "seamless-immutable";
import HTML5Backend from "react-dnd-html5-backend";
const DragDropContext = require('react-dnd').DragDropContext;
import Loader from '../../../core/components/lib/Loader';

const messages = defineMessages({
    optionBalance: {id: "portal.quote.option.balance", defaultMessage: 'Balance sheet'},
    optionBankGaurantee: {id: "portal.quote.option.bank", defaultMessage: 'Bank guarantee'},
    optionGuaranteeDoc: {id: "portal.quote.option.gaurantee", defaultMessage: 'Guarantee document'},
    optionKbis: {id: "portal.quote.option.kbis", defaultMessage: 'Kbis extract'},
    optionManagerID: {id: "portal.quote.option.managerid", defaultMessage: 'Manager personal ID'},
    optionOtherDoc: {id: "portal.quote.option.otherdoc", defaultMessage: 'Other documents'},
    optionplaccounts: {id: "portal.quote.option.placcounts", defaultMessage: 'PL accounts'},

    optionActive: {id: "portal.quote.option.active", defaultMessage: 'Active'},
    optionInactive: {id: "portal.quote.option.inactive", defaultMessage: 'Inactive'},

    btnopen: {id: "portal.quote.btn.open", defaultMessage: 'Open'},
    btnDownload: {id: "portal.quote.bttn.download", defaultMessage: 'Download'},
    btnDelete: {id: "portal.quote.btn.delete", defaultMessage: 'Delete'},
    //  btnUpload: {id: "portal.quote.btn.upload", defaultMessage: 'Upload new attachment'},

    saveSuccess: {id: "portal.quote.save.success", defaultMessage: 'Save success'},
    saveError: {id: "portal.quote.save.error", defaultMessage: 'Save fails'},
    updateSuccess: {id: "portal.quote.update.success", defaultMessage: 'Update success'},

    typeFilePlaceholder: {
        id: "portal.quote.attach.typefile.placeholder",
        defaultMessage: 'Select a type'
    },
    statusPlaceholder: {
        id: "portal.quote.attach.status.placeholder",
        defaultMessage: 'Select a status'
    },

});

class Attachments extends KsiopTable {

    constructor(props) {
        super(props);
    }

    static _fileIcon(type) {
        switch (type) {
            case 'application/pdf':
            case 'application/x-pdf':
                return "file-pdf-o";

            case 'application/vnd.ms-excel':
                return "file-excel-o";

            case 'application/vnd.ms-powerpoint':
                return "file-powerpoint-o";

            case 'application/vnd.ms-word':
            case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
            case 'application/msword':
            case 'application/x-mswrite':
                return "file-word-o";

            case 'application/x-bzip2':
            case 'application/x-gzip':
            case 'application/zip':
            case 'application/x-compressed-zip':
            case 'application/x-rar-compressed':
            case 'application/x-7z-compressed':
                return "file-zip-o";
        }

        if (/^image\//.exec(type)) {
            return "file-image-o";
        }

        if (/^audio\//.exec(type)) {
            return "file-audio-o";
        }

        if (/^video\//.exec(type)) {
            return "file-video-o";
        }

        return "file-o";
    }

    static _mimeTypeByExtension(filename) {
        if (!filename) {
            return null;
        }

        let exp = /.*\.([^\.]+)$/.exec(filename);
        if (!exp) {
            return null;
        }

        let extension = exp[1].toLowerCase();
        switch (extension) {
            case 'pdf':
                return 'application/pdf';

            case 'xls':
            case 'xlsx':
                return 'application/vnd.ms-excel';

            case 'ppt':
            case 'pptx':
                return "file-powerpoint-o";

            case 'doc':
            case 'docx':
            case 'dot':
            case 'txt':
                return "application/msword";

            case 'gz':
            case 'bzip2':
            case 'gzip':
            case 'zip':
            case 'rar':
            case '7z':
            case 'tar':
                return 'application/zip';

            case 'png':
            case 'jpg':
            case 'gif':
            case 'tiff':
                return "image/" + extension;

            case 'mp3':
            case 'wav':
            case 'wave':
                return "audio/" + extension;

            case 'avi':
                return "movie/avi";
            case 'mpg':
            case 'mpeg':
                return "movie/mpeg";

            case 'mkv':
                return "movie/matroska";
        }

        return null;
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

    handleUploadOnClick(event) {
        this.props.setPredefinedType(null);
        event.preventDefault();
        event.stopPropagation();
        this.saveDealForDocUpload();
        this.refs.upfile.click();
    }

    saveDealForDocUpload() {
        let deal = this.props.deal;
        deal = Immutable.set(deal, 'listdealactor', this.transformActorToDealActor(this.props.actor, deal.listdealactor));
        this.props.saveDealForUploadDocument(deal);
    }

    transformActorToDealActor = (actor, listdealactor) => {
        let dealActor = listdealactor.find(item => item.actid === actor.actid);
        if (!dealActor) {
            listdealactor = Immutable.set(listdealactor, listdealactor.length, {
                rolcode: BORROWER,
                actcode: actor.actcode,
                actlibcourt: actor.actlibcourt,
                actnom: actor.actnom,
                actid: actor.actid,
                dpaordre: listdealactor.length
            });
        }
        return listdealactor;
    }

    handleFileChanged(event) {
        let file = event.target.files[0];
        if (file.type === "application/pdf") {
            this.setState({pdfFile: file});
            return;
        }
        var formData = new FormData();
        formData.append('file', file);
        formData.append('docTypeCode', this.props.predefinedType);

        if (this.props.dosid) {
            this.props.uploadDocument(this.props.dosid, formData);
            return;
        }
    }


    componentWillMount() {
        this.props.fetchReferenceTableWithParams(tables.LANTUSPARAM, {
            'tusnom': 'DMATYPE',
            'tpgcode': null
        });

        if (this.props.dosid && this.props.dosid !== null) { /// / TODO after redux form merge , check doc type when passing
            // from one step to another (if lost)
            this.props.getListDocument(this.props.dosid); /// / fetch the list
        } else { /// / if new deal, clear the documents in the props otherwise, it will show the list of the last deal showed
            this.props.cleanDocumentList();
        }
    }

    handleDelete(dmaid) {
        this.props.deleteDocument(this.props.dosid, dmaid);
    }

    handleDMATypeChanged(event, dmaid) {
        if (event) {
            this.props.setDmaType(event.target.value, dmaid);
        }

    }

    handleDMAStatusChanged(event, dmaid) {
        if (event) {
            this.props.setDmaStatus(event.target.value, dmaid);
        }
    }

    handlePdfFiles(files) {
        this.refs.upfile.value = "";
        this.setState({pdfFile: null});
    }

    handleAttachPredefined(event, typeCode) {
        this.props.setPredefinedType(typeCode);
        event.preventDefault();
        event.stopPropagation();

        this.refs.upfile.click();
    }

    render() {
        var item = this.props.item || {};
        var selectedRow = this.getSelectedRow();

        var statusOptions = [
            (<option key="UND" value="UND"></option>),
            (<option key="ACT" value="ACT">{this.props.intl.formatMessage(messages.optionActive)}</option>),
            (<option key="INA" value="INA">{this.props.intl.formatMessage(messages.optionInactive)}</option>)
        ];

        let docTypes;
        if (this.props.listDocTypes && this.props.listDocTypes.length) {
            docTypes = [(<option key="IND" value="IND"></option>),
                ...this.props.listDocTypes.map((row) => (
                    (<option key={row.code} value={row.code}>{row.label}</option>)
                ))
            ];
        }

        if (!docTypes) {
            docTypes = [
                (<option key="IND" value="IND"></option>),
                (<option key="BALA" value="BALA">{this.props.intl.formatMessage(messages.optionBalance)}</option>),
                (<option key="BANK"
                         value="BANK">{this.props.intl.formatMessage(messages.optionBankGaurantee)}</option>),
                (<option key="GUAR" value="GUAR">{this.props.intl.formatMessage(messages.optionGuaranteeDoc)}</option>),
                (<option key="KBIS" value="KBIS">{this.props.intl.formatMessage(messages.optionKbis)}</option>),
                (<option key="MPID" value="MPID">{this.props.intl.formatMessage(messages.optionManagerID)}</option>),
                (<option key="OTHE" value="OTHE">{this.props.intl.formatMessage(messages.optionOtherDoc)}</option>),
                (<option key="PLAC" value="PLAC">{this.props.intl.formatMessage(messages.optionplaccounts)}</option>)
            ];
        }

        let unknownTypes = docTypes;
        if (this.props.documents) {
            unknownTypes = docTypes.filter((type) => type.key !== "IND" && !this.props.documents.find((doc) => doc.dmatype === type.key));
        }

        var predefinedFiles = unknownTypes.map((row) => (

            <tr key={'unknown:' + row.key} className={classNames({selected: selectedRow === row})}>
                <td/>
                <td/>
                <td/>
                <td>{row.props.children}</td>
                <td/>
                <td>
                    <div className="btn-group">
                        <a onClick={(event) => this.handleAttachPredefined(event, row.code)}>
                            <i className="glyphicon glyphicon-paperclip"/>
                        </a>
                    </div>
                </td>
            </tr>));


        var noDataMessage = '';
        var rows = '';
        if (this.props.documents === undefined || !this.props.documents.length) {
            if (!predefinedFiles) {
                noDataMessage = (<p className="center-text">
                    <FormattedMessage id="portal.quote.attach.nodocs" defaultMessage="You have no documents."/>
                </p>);
            }
        } else {
            rows = this.props.documents.map((row) => {

                let mimeType = row.dmamimetype;
                if (!mimeType) {
                    mimeType = Attachments._mimeTypeByExtension(row.dmafilename);
                }

                let mimeIcon = Attachments._fileIcon(mimeType || 'application/download');

                return (
                    <tr key={row.dmaid} data-key={row.dmaid} className={classNames({selected: selectedRow === row})}>
                        <td><span className={'fa fa-' + mimeIcon}/></td>
                        <td><Time value={row.dmadt} format="DD/MM/YYYY"/></td>
                        <td>{row.dmafilename}</td>
                        <td><select placeholder={this.props.intl.formatMessage(messages.typeFilePlaceholder)}
                                    defaultValue={row.dmatype}
                                    onChange={(event) => this.handleDMATypeChanged(event, row.dmaid)}>{docTypes}</select>
                        </td>
                        <td><select placeholder={this.props.intl.formatMessage(messages.statusPlaceholder)}
                                    defaultValue={row.dmastatus}
                                    onChange={(event) => this.handleDMAStatusChanged(event, row.dmaid)}>{statusOptions}</select>
                        </td>
                        <td>
                            <div className="btn-group">

                                <a href={config.hostname + '/RestServices/deals/' + row.dosidprospect + '/documents/content/' + row.dmaid}>
                                    <i className="glyphicon glyphicon-cloud-download gi-2x gi-paddR"/>
                                </a>

                                <a onClick={() => this.handleDelete(row.dmaid)}><i
                                    className="glyphicon glyphicon-remove-circle gi-2x"/></a>
                            </div>
                        </td>
                    </tr>)
            });
        }

        let button;

        if (this.props.isLoading) {
            button = <Loader/>;
        }
        else {
            button = (<Button className="upload-button pull-right" bsStyle="primary"
                              onClick={(event) => this.handleUploadOnClick(event)}>
                <FormattedMessage id="portal.quote.attach.btn.upload" defaultMessage="Upload new attachment"/>

                <i className="fa fa-cloud-upload"/>
            </Button>);
        }

        return (
            <div className="my-deals-content attachments-container">
                <FileDropZone className="fullWidth" onDrop={(e) => this.handleFileChanged(e)}>
                    <Box type="primary"
                         title={<FormattedMessage id="portal.quote.attach.title" defaultMessage="Attachments"/>}
                         withBoder="true">
                        <Table condensed responsive bordered>
                            <thead>
                            <tr>
                                <th style={{width: '20px'}}></th>
                                <th><FormattedMessage id="portal.quote.attach.column.date"
                                                      defaultMessage="Document date"/>
                                </th>
                                <th><FormattedMessage id="portal.quote.attach.column.file" defaultMessage="Filename"/>
                                </th>
                                <th><FormattedMessage id="portal.quote.attach.column.type"
                                                      defaultMessage="Document type"/>
                                </th>
                                <th><FormattedMessage id="portal.quote.attach.column.status" defaultMessage="Status"/>
                                </th>
                                <th><FormattedMessage id="portal.quote.attach.column.commands"
                                                      defaultMessage="Commands"/>
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {rows}
                            {predefinedFiles}
                            </tbody>
                        </Table>
                        <div className="box-footer">
                            {button}
                            { this.state.pdfFile && <PDFPagesDialog
                                title="PDF pages"
                                messages={messages}
                                dosid={this.props.dosid}
                                file={this.state.pdfFile} onClose={(needUpdate) => this.handlePdfFiles(needUpdate)}
                                listDocTypes={docTypes}/>}
                        </div>
                        <div style={{height: 0, width: 0, overflow: 'hidden'}}>
                            <input id="upfile" ref="upfile" type="file"
                                   onChange={(event) => this.handleFileChanged(event)}/>
                        </div>
                    </Box>
                </FileDropZone>
            </div>
        );
    }
}

const selector = formValueSelector('portalquote');
const mapStateToProps = (state, props) => {
    let attachmentsReducer = state.attachmentsReducer;
    return {
        deal: state.portalquote.deal,
        dosid: state.portalquote.dosid,
        listDocTypes: getReferenceTable(state, tables.LANTUSPARAM, {'tusnom': 'DMATYPE', 'tpgcode': null}).data,
        documents: state.attachmentsReducer.documents,
        predefinedType: state.attachmentsReducer.predefinedType,
        isLoading: state.attachmentsReducer.isLoading,
        actor: selector(state, 'actor')
    }
};
const mapDispatchToProps = {
    uploadDocument,
    getListDocument,
    setDmaType,
    setPredefinedType,
    setDmaStatus,
    deleteDocument,
    saveDealForUploadDocument,
    cleanDocumentList,
    fetchReferenceTableWithParams
};
export default flow(
    DragDropContext(HTML5Backend),
    connect(mapStateToProps, mapDispatchToProps),
)(injectIntl(Attachments))