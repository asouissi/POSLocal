'use strict'

import React from 'react'
import {connect} from 'react-redux'
import {Modal, Grid, Row, Col, Button, Carousel, ProgressBar, Panel} from "react-bootstrap";
import ResizerDetection from '../../../../core/utils/ResizerDetection';
import {injectIntl, defineMessages, FormattedMessage, FormattedDate} from 'react-intl';
import classnames from 'classnames';
import Loader from '../../../../core/components/lib/Loader';

import {
    initPDFUpload,
    getPDFStatus,
    rotatePage,
    changeDMAType,
    dispatchDocumentTypes,
    uploadAllPDF,
    dispatchPDFInit,
    cleanUploadedPDF
} from '../../attachments/reducers/actions'


const dialogMessages = defineMessages({
    creationDate: {id: "pos.attach.pdf.meta.creationDate", defaultMessage: "Creation Date"},
    modificationDate: {id: "pos.attach.pdf.meta.modificationDate", defaultMessage: "Modification Date"},
    producer: {id: "pos.attach.pdf.meta.producer", defaultMessage: "Producer"},
    title: {id: "pos.attach.pdf.meta.title", defaultMessage: "Title"},
    author: {id: "pos.attach.pdf.meta.author", defaultMessage: "Author"},
    creator: {id: "pos.attach.pdf.meta.creator", defaultMessage: "Creator"},
});

const IMAGE_THUMBNAIL_WIDTH = 200;
const IMAGE_CAROUSEL_WIDTH = 800;

class PDFPagesDialog extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedPageIndex: undefined,
            infosRightPanelClosed: true
        };
    }

    close(needUpdate) {
        if (this.state.selectedPageIndex !== undefined) {
            this.handleBackToThumbnail();
            return;
        }
        this.props.onClose(needUpdate);
    }

    componentWillMount() {
        var formData = new FormData();
        formData.append("file", this.props.file);
        this.props.initPDFUpload(formData);
    }

    componentWillUnmount() {
        if (this._updateStatusIntervalId) {
            clearInterval(this._updateStatusIntervalId);
            delete this._updateStatusIntervalId;
        }
        if (this._updateCarrouselImageTimerId) {
            clearTimeout(this._updateCarrouselImageTimerId);
            delete this._updateCarrouselImageTimerId;
        }
        if (this._autoCloseTimeoutId) {
            clearTimeout(this._autoCloseTimeoutId);
            delete this._autoCloseTimeoutId;
        }

        this.props.cleanUploadedPDF(this.props.pdf.key);

        this.props.dispatchPDFInit();
    }


    componentWillReceiveProps(nextProps) {
        if (nextProps.pdfStatus !== this.props.pdfStatus) {
            if (nextProps.pdfStatus === "UPLOADED" || nextProps.pdfStatus === "PARSING") {
                if (!this._updateStatusIntervalId) {
                    this._updateStatusIntervalId = setInterval(() => {
                        this.props.getPDFStatus(this.props.pdf.key);
                    }, 1000);
                }

            } else if (this._updateStatusIntervalId) {
                clearInterval(this._updateStatusIntervalId);
                delete this._updateStatusIntervalId;
            }
        }
    }

    handleDMATypeChanged(event, page) {
        let value = event.target.value;
        if (value === "IND") {
            value = undefined;
        }
        this.props.changeDMAType(page, value);
    }

    handleZoom(page) {
        this.setState({selectedPageIndex: this.props.pages.findIndex((p) => p === page)});
    }

    handleCarouselSelect(index, event) {
        this.setState({
            selectedPageIndex: index,
            direction: event.direction
        });
    }

    handleRotateRight() {
        let page = this.props.pages[this.state.selectedPageIndex];
        this.props.rotatePage(page, 90);
    }

    handleRotateLeft() {
        let page = this.props.pages[this.state.selectedPageIndex];
        this.props.rotatePage(page, -90);
    }

    handleBackToThumbnail() {
        if (this._updateCarrouselImageTimerId) {
            clearTimeout(this._updateCarrouselImageTimerId);
            delete this._updateCarrouselImageTimerId;
        }

        this.setState({selectedPageIndex: undefined});
    }

    handleSelectCarouselPage(pageIndex) {
        if (pageIndex === this.state.selectedPageIndex) {
            return;
        }
        this.setState({
            selectedPageIndex: pageIndex,
            direction: (pageIndex > this.state.selectedPageIndex) ? 'next' : 'prev'
        });
    }

    handleUploadPDF() {
        this.props.uploadAllPDF(this.props.dosid, this.props.pdf.key);
    }

    handleDispatchPages() {
        let docTypes = this.props.listDocTypes.map((docType) => ({
            code: docType.code,
            pages: this.props.pages.filter((page) => page.dmaType === docType.code)
        }));
        docTypes = docTypes.filter((docType) => docType.pages.length);

        if (!docTypes.length) {
            this.close(false);
            return;
        }
        this.props.dispatchDocumentTypes(this.props.dosid, this.props.pdf.key, docTypes);
    }

    updateDimensions = (event) => {
        [...document.querySelectorAll(".thumbnailDynamicSize")].forEach((component) => {
            let pageIndex = parseInt(component.getAttribute("data-pageindex"));

            let page = this.props.pages[pageIndex];

            this.handleUpdateThumbnailImage(component, page, pageIndex);
        });

        [...document.querySelectorAll(".carouselDynamicSize")].forEach((component) => {
            let pageIndex = parseInt(component.getAttribute("data-pageindex"));

            let page = this.props.pages[pageIndex];

            this.handleUpdateCarouselImage(component, page, pageIndex);
        });
    };

    handleUpdateThumbnailImage(img, page, index) {
        if (!img) {
            return;
        }
        let cell = img.parentNode;

        let thumbnailWidth = cell.offsetWidth - 4;
        let rad = ((page.rotation + 360) % 360 ) / 360 * Math.PI * 2;
        let widthPt = Math.abs(page.widthPt * Math.cos(rad)) + Math.abs(page.heightPt * Math.sin(rad));
        let heightPt = Math.abs(page.widthPt * Math.sin(rad)) + Math.abs(page.heightPt * Math.cos(rad));
        let ratio = heightPt / widthPt;

        let thumbnailHeight = Math.floor(ratio * thumbnailWidth);

        let scale = 1.0;
        if (thumbnailHeight > thumbnailWidth) {
            scale = thumbnailWidth / thumbnailHeight;
        }

        let rad2 = ((page.clientRotation + 360) % 360 ) / 360 * Math.PI * 2;
        let dtw = Math.abs(thumbnailWidth * Math.cos(rad2)) + Math.abs(thumbnailHeight * Math.sin(rad2));
        let dth = Math.abs(thumbnailWidth * Math.sin(rad2)) + Math.abs(thumbnailHeight * Math.cos(rad2));

        dtw *= scale;
        dth *= scale;

        if (dtw > thumbnailWidth) {
            let s = thumbnailWidth / dtw;
            scale *= s;
            dtw *= s;
            dth *= s;
        }
        if (dth > thumbnailWidth) {
            let s = thumbnailWidth / dth;
            scale *= s;
            dtw *= s;
            dth *= s;
        }

        let transform = `rotate(${page.clientRotation}deg)`; // scale(${scale})`;

        let urlWidth = Math.floor((thumbnailWidth + 150) / 100) * 100;
        let src = page.previewURL + "/width/" + urlWidth;

        let updateImage = true;
        if (img.src === src) {
            updateImage = false;

        } else {
            let prevWidth = img.getAttribute("data-width");
            if (prevWidth) {
                if (parseInt(prevWidth) >= urlWidth) {
                    updateImage = false;
                }
            }
        }

        if (updateImage) {
            img.src = src;
            img.alt = "Page #" + (index + 1) + " " + thumbnailWidth + "x" + thumbnailHeight;
            img.className = "thumbnailDynamicSize";
            img.setAttribute("data-width", urlWidth);
        }
        img.width = thumbnailWidth * scale;
        img.height = thumbnailHeight * scale;
        img.style.transform = transform;
        img.setAttribute("data-pageindex", index);
        cell.style.height = cell.offsetWidth + "px";
    }


    handleUpdateCarouselImage(img, page, index) {
        if (!img) {
            return;
        }
        let cell = img.parentNode;
        let cellW = cell.offsetWidth - 10;
        let cellH = cell.offsetHeight - 10;

        if (cellW < 0) {
            return;
        }

        let thumbnailWidth = cellW;
        let thumbnailHeight = Math.floor(page.heightPt / page.widthPt * thumbnailWidth);

        let rad1 = ((page.rotation + 360) % 360 ) / 360 * Math.PI * 2;
        let tw = Math.abs(thumbnailWidth * Math.cos(rad1)) + Math.abs(thumbnailHeight * Math.sin(rad1));
        let th = Math.abs(thumbnailWidth * Math.sin(rad1)) + Math.abs(thumbnailHeight * Math.cos(rad1));

        let rad2 = ((page.clientRotation + 360) % 360 ) / 360 * Math.PI * 2;
        let dtw = Math.abs(tw * Math.cos(rad2)) + Math.abs(th * Math.sin(rad2));
        let dth = Math.abs(tw * Math.sin(rad2)) + Math.abs(th * Math.cos(rad2));

        let scale = 1.0;

        if (dtw > cellW) {
            let s = cellW / dtw;
            scale *= s;
            dth *= s;
            dtw = cellW;
        }
        if (dth > cellH) {
            let s = cellH / dth;
            scale *= s;
            dtw *= s;
            dth = cellH;
        }

        if (this._updateCarrouselImageTimerId) {
            clearTimeout(this._updateCarrouselImageTimerId);
            delete this._updateCarrouselImageTimerId;
        }

        let urlWidth = Math.floor((thumbnailWidth + 150) / 100) * 100;
        let src = page.previewURL + "/width/" + urlWidth;
        let urlWidth2 = Math.floor((thumbnailWidth / 2 + 150) / 100) * 100;
        let src2 = page.previewURL + "/width/" + urlWidth2;

        let updateImage = true;
        if (img.src === src || img.src === src2) {
            updateImage = false;

        } else {
            let prevWidth = img.getAttribute("data-width");
            if (prevWidth) {
                if (parseInt(prevWidth) >= urlWidth) {
                    updateImage = false;
                }
            }
        }

        if (updateImage) {
            img.src = src2;
            img.alt = "Page #" + (index + 1) + " " + thumbnailWidth + "x" + thumbnailHeight;
            img.className = "carouselImg carouselDynamicSize";
            img.setAttribute("data-pageindex", index);
            img.setAttribute("data-width", urlWidth2);

            this._updateCarrouselImageTimerId = setTimeout(() => {
                if (img.offsetWidth > 0) {
                    img.src = src;
                    img.setAttribute("data-width", urlWidth);
                }
            }, 2000);
        }

        img.style.left = Math.floor((cellW - tw) / 2 + 5) + "px";
        img.style.top = Math.floor((cellH - th) / 2 + 5) + "px";
        img.style.width = (tw) + "px";
        img.style.height = (th) + "px";
        img.style.transform = `rotate(${page.clientRotation}deg) scale(${scale})`;

    }

    handleShowInfos() {
        this.setState({infosRightPanelClosed: !this.state.infosRightPanelClosed});
    }

    render() {

        let documentTypeOptions = [(<option key="IND" value="IND"></option>),
            ...this.props.listDocTypes.map((row) => (
                (<option key={row.code} value={row.code}>{row.label}</option>)
            ))
        ];

        let infosPanel = null;
        if (this.props.pdf && this.props.pdf.infos) {
            let infos = [];
            let pdfInfos = this.props.pdf.infos;
            for (let key in pdfInfos) {
                if (key === 'metadata') {
                    continue;
                }
                let value = pdfInfos[key];
                if (!value) {
                    continue;
                }

                let intKey = key;
                if (dialogMessages[key]) {
                    intKey = this.props.intl.formatMessage(dialogMessages[key]);
                }

                let dv = new Date(value);
                if (dv.getTime() > 0) {
                    value = <FormattedDate year='numeric' month='long' day='2-digit' hour='2-digit' minute='2-digit'
                                           value={dv}/>
                }

                infos.push(<dl key={key}>
                    <dt>{intKey}</dt>
                    <dd>{value}</dd>
                </dl>);
            }


            let rightPanelStyles = {
                box: true,
                'box-primary': true,
                'infos-right-panel': true,
                'infos-right-panel-closed': this.state.infosRightPanelClosed
            };

            infosPanel = <Panel className={classnames(rightPanelStyles)}
                                header={<div className="box-header"><h3>Informations</h3></div>}>
                {infos}
            </Panel>;
        }

        let canDispatch = this.props.pages && this.props.pages.find((page) => page.dmaType);
        let canUploadOne = true;

        let carouselIndicators = '';
        let body;
        let headerButtons = null;
        let footerButtons = null;
        let isCarouselView = false;
        if (this.props.pdfStatus === "UPLOADALL" || this.props.pdfStatus === "DISPATCHING") {
            let progress = Math.floor(this.props.pdfProgress);

            body = (<div className="center-text">
                <FormattedMessage id="pos.pdfDialog.gedPDF.loading" defaultMessage="Uploading to GED ..."/>

                <ProgressBar active striped className="uploadProgress" now={progress} label={progress + "%"}/>
            </div>);

            canDispatch = false;
            canUploadOne = false;


            if (progress > 99) {
                this._autoCloseTimeoutId = setTimeout(() => {
                    this.close(true);
                }, 2000);

                footerButtons = (<Button onClick={(event) => this.close(true)} bsStyle="primary" key="close">
                    <FormattedMessage id="pos.pdfDialog.gedPDF.closeButton" defaultMessage="Close"/>
                </Button>);
            } else {
                footerButtons = (<Button onClick={(event) => this.close(true)} bsStyle="primary" key="cancel">
                    <FormattedMessage id="pos.pdfDialog.gedPDF.cancelButton" defaultMessage="Cancel"/>
                </Button>);
            }

        } else if (this.props.pdfStatus === "UPLOADALL-FAILED" || this.props.pdfStatus === "DISPATCHING-FAILED") {
            body = (<div className="center-text">
                <FormattedMessage id="pos.pdfDialog.gedPDF.error" defaultMessage="Uploading to GED ..."/>

                <ProgressBar active striped bsStyle="danger" className="uploadProgress" now={100}
                             label="ERROR"/>
            </div>);

            canDispatch = false;
            canUploadOne = (this.props.pdfStatus === "DISPATCHING-FAILED");
            footerButtons =
                <Button onClick={(event) => this.close(true)} bsStyle={canUploadOne ? "default" : "primary"}
                        key="closePDF">
                    <FormattedMessage id="pos.pdfDialog.getPDF.closeButton" defaultMessage="Close"/>
                </Button>;

        } else if (this.props.pdfStatus === "UPLOADING") {
            let progress = Math.floor((this.props.pdfProgress) / 100 * 90);

            body = (<div className="center-text">
                <FormattedMessage id="pos.pdfDialog.loading" defaultMessage="Loading ..."/>

                <ProgressBar active striped className="uploadProgress" now={progress}
                             label={progress + "%"}/>
            </div>);

            canUploadOne = false;
            canDispatch = false;
            footerButtons = <Button onClick={(event) => this.close(false)} bsStyle="primary" key="cancel">
                <FormattedMessage id="pos.pdfDialog.loading.cancelButton" defaultMessage="Cancel"/>
            </Button>;

        } else if (this.props.pdfStatus === "ERROR") {
            body = (<div className="center-text">
                <FormattedMessage id="pos.pdfDialog.error" defaultMessage="Error ..."/>

                <ProgressBar active striped bsStyle="danger" className="uploadProgress" now={100}
                             label="ERROR"/>
            </div>);

        } else if (this.props.pdfStatus === "UPLOADED" || this.props.pdfStatus === "PARSING") {
            body = (<div className="center-text">
                <FormattedMessage id="pos.pdfDialog.parsing" defaultMessage="Analysing ..."/>

                <ProgressBar active striped className="uploadProgress" now={100}
                             label="100%"/>
            </div>);

        } else if (!this.props.pages.length) {
            body = (<div className="center-text">
                <FormattedMessage id="pos.pdfDialog.noPages" defaultMessage="No pages !"/>
                <b>({this.props.pdfStatus})</b>
            </div>);

        } else if (this.state.selectedPageIndex !== undefined) {
            let selectedPage = this.props.pages[this.state.selectedPageIndex];
            isCarouselView = true;

            let items = this.props.pages.map((page, index) => {

                return (<Carousel.Item key={"page#" + index}>
                    <div className="carouselImgLoading">
                        <Loader/>
                    </div>
                    <img id={"carouselPage_" + index} className="carouselImg"
                         ref={(ref) => (this.handleUpdateCarouselImage(ref, page, index))}/>
                </Carousel.Item>);
            });

            body = (
                <div className="carousel-container">
                    <Carousel activeIndex={this.state.selectedPageIndex} direction={this.state.direction}
                              onSelect={(index, event) => this.handleCarouselSelect(index, event)}>
                        {items}

                        <ResizerDetection onResize={() => this.updateDimensions()}/>
                    </Carousel>

                    {infosPanel}
                </div>
            );
            headerButtons = [
                infosPanel && (<Button key="informations" className="pdf-modal-header-button"
                                       onClick={(event) => this.handleShowInfos()}>
                    <i className="fa fa-info-circle"/>
                </Button>),
                <Button className="pdf-modal-header-button" key="rotateRight"
                        onClick={(event) => this.handleRotateRight()}>
                    <i className="fa fa-rotate-right"/>
                </Button>,
                <Button className="pdf-modal-header-button" key="rotateLeft"
                        onClick={(event) => this.handleRotateLeft()}>
                    <i className="fa fa-rotate-left"/>
                </Button>
            ];

            let indicators = this.props.pages.map((page, index) => {
                let cls = {
                    item: true,
                    active: index === this.state.selectedPageIndex
                };

                return (<li key={"page#" + index} className={classnames(cls)}
                            title={"Page #" + (index + 1)}
                            onClick={(event) => this.handleSelectCarouselPage(index)}/>)
            });

            footerButtons = [
                <ol key="indicators" className="carousel-indicators">{indicators}</ol>,
                <div key="documentType" className="footer-document-type">
                    <FormattedMessage id="pos.pdfDialog.documentTypes" defaultMessage="Document type :"/>
                    <select onChange={(event) => this.handleDMATypeChanged(event, selectedPage)}
                            value={selectedPage.dmaType || 'IND'}>{documentTypeOptions}</select>
                </div>];

        } else {
            let thumbnailWidth = IMAGE_THUMBNAIL_WIDTH;

            let pages = this.props.pages.map((page, index) => {

                return (<Col xs={12} sm={6} md={4} lg={3} key={"page#" + index}>
                    <div className="thumbnail">
                        <button className="zoom" onClick={(event) => this.handleZoom(page)}>
                            <div className="imgLoading">
                                <Loader/>
                            </div>
                            <img ref={(ref) => this.handleUpdateThumbnailImage(ref, page, index)}/>
                            <div className="centered">
                                <i className="fa fa-search"/>
                            </div>
                        </button>
                        <div className="caption">
                            <p>
                                <span>Document type :</span>
                                <select onChange={(event) => this.handleDMATypeChanged(event, page)}
                                        value={page.dmaType}>{documentTypeOptions}</select>
                            </p>
                        </div>
                    </div>
                </Col>);
            });

            headerButtons = [
                infosPanel && (<Button key="informations" className="pdf-modal-header-button"
                                       onClick={(event) => this.handleShowInfos()}>
                    <i className="fa fa-info-circle"/>
                </Button>)
            ];

            body = (<div className="grid-container"><Grid className="attachments-pdf-grid">
                <Row>
                    {pages}
                </Row>

                <ResizerDetection onResize={() => this.updateDimensions()}/>
            </Grid>{infosPanel}</div>);
        }

        let classes = {
            'attachments-pdf-modal': true,
            'attachments-pdf-page': isCarouselView,
            [this.props.skinClass]: true
        };

        return (<Modal show={true} onHide={(event) => this.close(false)} bsSize="large" className={classnames(classes)}
                       aria-labelledby="pdf-modal-title-lg">
            <Modal.Header>
                <Button className="pdf-modal-header-button" onClick={(event) => this.close(false)} ref="close">
                    <i className="fa fa-close"/>
                </Button>

                {headerButtons}

                <Modal.Title id="pdf-modal-title-lg">
                    <FormattedMessage id="pos.pdfDialog.title"
                                      defaultMessage="Split PDF pages"/>
                </Modal.Title>

            </Modal.Header>
            <Modal.Body>

                {body}
            </Modal.Body>
            <Modal.Footer>

                {footerButtons}

                {canDispatch &&
                <Button onClick={(event) => this.handleDispatchPages()} bsStyle="primary" key="dispatchPages">
                    <FormattedMessage id="pos.pdfDialog.uploadAllButton"
                                      defaultMessage="Upload and dispatch"/>
                </Button>}

                {canUploadOne &&
                <Button key="onePDF" bsStyle={canDispatch ? "default" : "primary"}
                        onClick={(event) => this.handleUploadPDF()}>
                    <FormattedMessage id="pos.pdfDialog.doneButton" defaultMessage="Upload as one PDF"/>
                </Button>}
            </Modal.Footer>
        </Modal>);
    }
}

const mapStateToProps = (state, props) => {
    let attachmentsReducer = state.attachmentsReducer;
    return {
        pdf: attachmentsReducer.pdf,
        pages: (attachmentsReducer.pdf && attachmentsReducer.pdf.pages) || [],
        pdfStatus: attachmentsReducer.pdfStatus,
        pdfProgress: attachmentsReducer.pdfProgress,
        skinClass: state.authentication.skinClass,
        documentTypes: attachmentsReducer.documentTypes
    }
};
const mapDispatchToProps = {
    initPDFUpload,
    getPDFStatus,
    rotatePage,
    changeDMAType,
    dispatchDocumentTypes,
    uploadAllPDF,
    dispatchPDFInit,
    cleanUploadedPDF
};
export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(PDFPagesDialog))