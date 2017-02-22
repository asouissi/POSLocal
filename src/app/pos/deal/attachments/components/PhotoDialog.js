'use strict'
import axios from "axios";
import React from 'react'
import {notify} from '../../../../core/components/lib/notify';
import {connect} from 'react-redux'
import {Modal, Button, ProgressBar} from "react-bootstrap";
import {injectIntl, defineMessages, FormattedMessage, FormattedDate} from 'react-intl';
import Webcam from './react-webcam';
import classnames from 'classnames';
import {
    initPhoto,
    uploadPhoto,
    setPhotoDmaType
} from '../reducers/actions';
import QRCode from "qrcode.react";
import {getReferenceTable, tables, fetchReferenceTableWithParams} from "../../../../core/reducers/referenceTable";

class PhotoDialog extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            record: true,
            canShoot: false
        }
    }

    componentWillMount() {
        this.props.fetchReferenceTableWithParams(tables.LANTUSPARAM, {tusnom: 'DMATYPE'});
        if (!this.props.params || !this.props.params.dealId) {
            axios.get('/token/deals/' + this.props.dosid  + '/documents').then(result =>{
                this.setState({documentToken : result.data})
            })
        }
    }
    componentDidMount() {
        Webcam.listVideoDevices().then((videoSources) => {

            if (videoSources && videoSources.length) {
                this.setState({videoSources: videoSources, videoSourceId: videoSources[0].deviceId});
            }
        }, (error) => {
            this.setState({error: error});
        })
    }

    componentWillUnmount() {
        if (this._autoCloseTimeout) {
            clearTimeout(this._autoCloseTimeout);
            delete this._autoCloseTimeout;
        }
    }

    componentDidUpdate(prevProps) {
        if (!this._autoCloseTimeout && this.props.progress === 100) {
            this._autoCloseTimeout = setTimeout(() => {
                this.close();
            }, 2000);
        }
    }

    close() {
        this.props.onClose && this.props.onClose();

        this.props.initPhoto();
        this.setState({record: true, canShoot: false});
    }

    handleRotateRight() {
        let canvas = document.getElementById('photoCanvas');
        if (canvas) {
            canvas.rotate(90);
        }

    }

    handleRotateLeft() {

    }

    handleWebcamMedia(error, stream) {
        if (error) {
            console.error(error);
            this.setState({error: error});
            return;
        }

        this.setState({canShoot: true});
    }

    handleShoot() {
        let canvas = this._webcam.getScreenshot();
        this.setState({record: false});

        if (!canvas) {
            this.setState({image: false});
            return;
        }

        //console.log("=> canvas=", canvas);

        if (canvas) {
            let parent = this.refs.photo;
            let previousPhoto = document.getElementById('photoCanvas');
            if (previousPhoto) {
                previousPhoto.parentNode.removeChild(previousPhoto);
            }

            canvas.id = 'photoCanvas';
            parent.appendChild(canvas);
        }

        this.setState({image: true});
    }

    handleFreeze() {
        this.handleShoot();
    }

    handleRetry() {
        this.setState({record: true});
    }

    handleUpload() {
        let canvas = document.getElementById('photoCanvas');
        const {dealId, token} = this.props.params || {};

        this.props.uploadPhoto(this.props.dosid || dealId, this.props.dmaType, canvas, token)
            .catch(error => {
                notify.show(<FormattedMessage id="pos.deal.documents.fileupload.error" defaultMessage="File not uploaded "/>, 'error');
            });
    }

    handleDMATypeChanged(event) {
        let value = event.target.value;

        this.props.setPhotoDmaType(value);
    }

    handleChangeSource() {
        let idx = this.state.videoSources.findIndex((source) => source.deviceId === this.state.videoSourceId);

        console.log("IDX=", idx, this.state.videoSources);

        this.setState({
            videoSourceId: this.state.videoSources[(idx + 1) % this.state.videoSources.length].deviceId,
            toggle: false
        });

        setTimeout(() => {
            this.setState({toggle: true});
        }, 1000);
    }

    render() {

        let classes = {
            'photo-modal-dialog': true,
            [this.props.skinClass]: true,
            'photo-modal-toggle': this.state.toggle
        };

        let documentTypeOptions = [(<option key="IND" value="IND"></option>),
            ...this.props.listDocTypes.map((row) => (
                (<option key={row.code} value={row.code}>{row.label}</option>)
            ))
        ];

        const {dealId} = this.props.params || {};

        return (<Modal show={true} onHide={(event) => this.close(false)} bsSize="large" className={classnames(classes)}
                       aria-labelledby="photo-modal-title-lg">
            <Modal.Header>
                <Button className="photo-modal-header-button" onClick={(event) => this.close(false)} ref="close">
                    <i className="fa fa-close"/>
                </Button>

                {!this.state.record && this.state.image && !this.props.uploading &&
                [<Button className="photo-modal-header-button" key="rotateRight"
                         onClick={(event) => this.handleRotateRight()}>
                    <i className="fa fa-rotate-right"/>
                </Button>,
                    <Button className="photo-modal-header-button" key="rotateLeft"
                            onClick={(event) => this.handleRotateLeft()}>
                        <i className="fa fa-rotate-left"/>
                    </Button>]
                }
                {this.state.videoSources && this.state.videoSources.length > 1 && this.state.record &&
                <Button className="photo-modal-header-button photo-video-source" key="videoSource"
                        onClick={(event) => this.handleChangeSource()}>
                    <img src="img/icons/photoBackFront.png" width="24" height="20"/>
                </Button>
                }

                <Modal.Title id="photo-modal-title-lg">
                    <FormattedMessage id="pos.photoDialog.title" defaultMessage="Scan it"/>
                </Modal.Title>

            </Modal.Header>
            <Modal.Body>

                {this.state.record && this.state.videoSourceId &&
                <Webcam ref="webcam" className="webcam" width="100%" height="100%" screenshotFormat="image/png"
                        videoSourceId={this.state.videoSourceId}
                        audio={false} onClick={() => this.handleShoot()}
                        onFreeze={() => this.handleFreeze()}
                        onUserMedia={(error, stream) => this.handleWebcamMedia(error, stream)}
                        initController={(webcam) => this._webcam = webcam}/>}


                {this.state.record && !this.state.videoSourceId && (
                    <div className="upload-content">
                        <FormattedMessage id="pos.deal.upload" default="Read this QRCode with your mobile device QR Code reader application then scan it"/>
                    </div>)
                }
                {this.state.record && !dealId && this.state.documentToken && (
                    <div className="upload-qrCode">
                       <QRCode value={window.location.protocol + '//' + window.location.host + window.location.pathname
                            + '#/pos/upload-docs/' + this.props.dosid + '/' + this.state.documentToken}/>
                    </div>)
                }

                {!this.props.error && !this.props.uploading &&
                <div ref="photo" className="canvasZone"
                     style={{display: (this.state.record ? 'none' : 'block')}}>

                    <div className="canvasFlash"/>
                </div>
                }
                {this.props.error &&
                <div className="errorZone">
                    <p className="errorMessage">
                        <FormattedMessage id="pos.photo.error" defaultMessage="Can not access to the photo feature."/>
                    </p>
                </div>
                }
                {this.props.uploading &&
                <div className="photoUploading">
                    <p className="uploadingMessage">
                        <FormattedMessage id="pos.photo.uploading" defaultMessage="Uploading photo ..."/>
                    </p>

                    <ProgressBar active striped className="uploadProgress" now={this.props.progress}
                                 label={this.props.progress + "%"}/>
                </div>
                }

            </Modal.Body>
            <Modal.Footer>
                {!this.state.record && !this.props.uploading &&
                <div key="documentType" className="footer-document-type">
                    <FormattedMessage id="pos.photoDialog.documentTypes" defaultMessage="Document type :"/>
                    <select onChange={(event) => this.handleDMATypeChanged(event)}
                            value={this.props.dmaType || 'IND'}>{documentTypeOptions}</select>
                </div>
                }

                {this.state.record && <Button key="shot" disabled={!this.state.canShoot} bsStyle="default"
                                              onClick={(event) => this.handleShoot()}>
                    <FormattedMessage id="pos.photoDialog.doneButton" defaultMessage="SHOOT !"/>

                    <i className="fa fa-camera"/>
                </Button>
                }
                {!this.state.record && !this.props.uploading &&
                <Button key="retry" disabled={!this.state.canShoot} bsStyle="default"
                        onClick={(event) => this.handleRetry()}>
                    <FormattedMessage id="pos.photoDialog.retryButton" defaultMessage="Retry"/>

                    <i className="fa fa-refresh"/>
                </Button>
                }
                {!this.state.record && !this.props.uploading && this.state.image &&
                <Button key="upload" bsStyle="default"
                        onClick={(event) => this.handleUpload()}>
                    <FormattedMessage id="pos.photoDialog.uploadButton" defaultMessage="Upload"/>
                    <i className="fa fa-cloud-upload"/>
                </Button>
                }
                {this.props.uploading && (this.props.progress === 100) &&
                <Button key="close" bsStyle="default"
                        onClick={(event) => this.close()}>
                    <FormattedMessage id="pos.photoDialog.closeButton" defaultMessage="Done"/>
                </Button>
                }
            </Modal.Footer>
        </Modal>);
    }
}

const mapStateToProps = (state, props) => {
    let attachmentsReducer = state.attachmentsReducer;
    return {
        uploading: attachmentsReducer.photo.uploading,
        progress: attachmentsReducer.photo.progress,
        dmaType: attachmentsReducer.photo.dmaType,
        error: attachmentsReducer.photo.error,
        listDocTypes: getReferenceTable(state, tables.LANTUSPARAM, {'tusnom': 'DMATYPE'}).data,//, 'tpgcode': deal.tpgcode

    }
};
const mapDispatchToProps = {
    initPhoto,
    uploadPhoto,
    setPhotoDmaType,
    fetchReferenceTableWithParams
};
export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(PhotoDialog))
