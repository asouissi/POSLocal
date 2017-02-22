/**
 * 
 */
import config from "./config";
import {GUEST_LOGIN_FAIL} from "../../../../core/reducers/authentication";
import {hashHistory} from 'react-router';

export const UPLOAD_DOC = 'deal/UPLOAD_DOC';
export const UPLOAD_DOC_SUCCESS = 'deal/UPLOAD_DOC_SUCCESS';
export const UPLOAD_DOC_FAIL = 'deal/UPLOAD_DOC_FAIL';

export const DOWNLOAD_DOC = 'deal/attachments/DOWNLOAD_DOC';
export const DOWNLOAD_DOC_SUCCESS = 'deal/attachments/DOWNLOAD_DOC_SUCCESS';
export const DOWNLOAD_DOC_FAIL = 'deal/attachments/DOWNLOAD_DOC_FAIL';

export const FETCH_LIST_DOC = 'deal/attachments/FETCH_LIST_DOC';
export const FETCH_LIST_DOC_SUCCESS = 'deal/attachments/FETCH_LIST_DOC_SUCCESS';
export const FETCH_LIST_DOC_FAIL = 'deal/attachments/FETCH_LIST_DOC_FAIL';
export const CLEAN_DOC_LIST = 'deal/attachments/CLEAN_DOC_LIST';

export const UPDATE_DOCS_PROPS = 'deal/attachments/UPDATE_DOCS_PROPS';
export const UPDATE_DOCS_PROPS_SUCCESS = 'deal/attachments/UPDATE_DOCS_PROPS_SUCCESS';
export const UPDATE_DOCS_PROPS_FAIL = 'deal/attachments/UPDATE_DOCS_PROPS_FAIL';

export const DOC_DELETE = 'deal/attachments/DOC_DELETE';
export const DOC_DELETE_SUCCESS = 'deal/attachments/DOC_DELETE_SUCCESS';
export const DOC_DELETE_FAIL = 'deal/attachments/DOC_DELETE_FAIL';

export const DMATYPE_CHANGE = 'deal/attachments/DMATYPE_CHANGE';
export const DMACAT_CHANGE = 'deal/attachments/DMACAT_CHANGE';
export const DMASTATUS_CHANGE = 'deal/attachments/DMASTATUS_CHANGE';
export const DMACOMMENT_CHANGE = 'deal/attachments/DMACOMMENT_CHANGE';

export const UPLOAD_PDF = 'deal/attachments/pdf/UPLOAD';
export const UPLOAD_PDF_SUCCESS = 'deal/attachments/pdf/UPLOAD_SUCCESS';
export const UPLOAD_PDF_FAIL = 'deal/attachments/pdf/UPLOAD_FAIL';
export const UPLOAD_PDF_PROGRESS = 'deal/attachments/pdf/UPLOAD_PROGRESS';

export const STATUS_PDF = 'deal/attachments/pdf/STATUS_PDF';
export const STATUS_PDF_SUCCESS = 'deal/attachments/pdf/STATUS_PDF_SUCCESS';
export const STATUS_PDF_FAIL = 'deal/attachments/pdf/STATUS_PDF_FAIL';

export const UPLOAD_ALL_PDF = 'deal/attachments/pdf/PUT_GED_ALL_PDF';
export const UPLOAD_ALL_PDF_SUCCESS = 'deal/attachments/pdf/PUT_GED_ALL_PDF_SUCCESS';
export const UPLOAD_ALL_PDF_FAIL = 'deal/attachments/pdf/PUT_GED_ALL_PDF_FAIL';

export const ROTATE_PAGE = 'deal/attachments/page/ROTATE';
export const DMAPREDEFTYPE_CHANGE = 'deal/DMAPREDEFTYPE_CHANGE';
export const DMAPREDEFDMAID_CHANGE = 'deal/DMAPREDEFDMAID_CHANGE';
export const CHANGE_DMA_TYPE_PAGE = 'deal/attachments/page/CHANGE_DMATYPE';

export const DISPATCH_PDF_INIT = '/deal/attachments/pdf/DISPATCH_PDF_INIT';

export const DISPATCH_PDF_DOC_TYPES = '/deal/attachments/pdf/DISPATCH_PDF_PAGES';
export const DISPATCH_PDF_DOC_TYPES_END = '/deal/attachments/pdf/DISPATCH_PDF_PAGES_END';

export const DISPATCH_PDF_DOC_TYPE = '/deal/attachments/pdf/DISPATCH_PDF_PAGE';
export const DISPATCH_PDF_DOC_TYPE_SUCCESS = '/deal/attachments/pdf/DISPATCH_PDF_PAGE_SUCCESS';
export const DISPATCH_PDF_DOC_TYPE_FAILED = '/deal/attachments/pdf/DISPATCH_PDF_PAGE_FAIL';

export const CLEAN_UPLOADED_PDF = '/deal/attachments/pdf/CLEAN';
export const CLEAN_PDF_SUCCESS = '/deal/attachments/pdf/CLEAN_SUCCESS';
export const CLEAN_PDF_FAIL = '/deal/attachments/pdf/CLEAN_FAIL';

export const UPLOAD_PHOTO = 'deal/attachments/photo/UPLOAD';
export const UPLOAD_PHOTO_SUCCESS = 'deal/attachments/photo/UPLOAD_SUCCESS';
export const UPLOAD_PHOTO_FAIL = 'deal/attachments/photo/UPLOAD_FAIL';
export const UPLOAD_PHOTO_PROGRESS = 'deal/attachments/photo/UPLOAD_PHOTO_PROGRESS';

export const PHOTO_INIT = 'deal/attachments/photo/INIT';
export const PHOTO_FAIL = 'deal/attachments/photo/FAIL';
export const CHANGE_DMA_TYPE_PHOTO = 'deal/attachments/photo/CHANGE_DMA_TYPE';

export function uploadDocument(dealId, file) {
    return {
        types: [UPLOAD_DOC, UPLOAD_DOC_SUCCESS, UPLOAD_DOC_FAIL],
        promise: (client) => client.post('/deals/' + dealId + '/documents', file)
    };
}
export function updateThenUploadDocument(dealId, file) {
    return (dispatch, getState) => {
        var documentObject = {
            documentmanagementlist: getState().attachmentsReducer.documents
        }
        if(documentObject.documentmanagementlist && documentObject.documentmanagementlist.length>0){
            dispatch({
                types: [UPDATE_DOCS_PROPS, UPDATE_DOCS_PROPS_SUCCESS, UPDATE_DOCS_PROPS_FAIL],
                promise: (client) => client.patch('/deals/' + dealId + '/documents', documentObject),
                afterSuccess: (dispatch) => {
                    dispatch(uploadDocument(dealId, file));
                }
            });
        }else{ // no update as no document
            dispatch(uploadDocument(dealId, file));
        }

    }
}

export function getListDocument(dealId) {
    return {
        types: [FETCH_LIST_DOC, FETCH_LIST_DOC_SUCCESS, FETCH_LIST_DOC_FAIL],
        promise: (client) => client.get('/deals/' + dealId + '/documents')
    };
}
export function cleanDocumentList() {
    return {
        type: CLEAN_DOC_LIST
    }
}

export function updateDocumentsProps(dealId) {
    return (dispatch, getState) => {
        var documentObject = {
            documentmanagementlist: getState().attachmentsReducer.documents
        }
        if(documentObject.documentmanagementlist && documentObject.documentmanagementlist.length>0){
            dispatch({
                types: [UPDATE_DOCS_PROPS, UPDATE_DOCS_PROPS_SUCCESS, UPDATE_DOCS_PROPS_FAIL],
                promise: (client) => client.patch('/deals/' + dealId + '/documents', documentObject),
                afterSuccess: (dispatch) => {
                    dispatch(getListDocument(dealId));
                }
            });
        }

    }
}

// download an attachment
export function downloadDocument(dealId, docid) {
    return {
        types: [DOWNLOAD_DOC, DOWNLOAD_DOC_SUCCESS, DOWNLOAD_DOC_FAIL],
        promise: (client) => client.get('/deals/' + dealId + '/documents/content/' + docid)
    };
}
// delete document
export function deleteDocument(dealId, dmaid) {

    return (dispatch, getState) => {

        dispatch({
            types: [DOC_DELETE, DOC_DELETE_SUCCESS, DOC_DELETE_FAIL],
            promise: (client) => client.delete('/deals/' + dealId + '/documents/' + dmaid),
            dmaid
        });
    }
}


// update the doc type of the attachment
export function setDmaType(doctype, dmaid) {
    return {
        type: DMATYPE_CHANGE,
        dmaid,
        doctype
    }
}
// update the doc type of the attachment
export function setDmaCat(category, dmaid) {
    return {
        type: DMACAT_CHANGE,
        dmaid,
        category
    }
}
// update the predefined doc type of the attachment
export function setPredefinedType(doctype) {
    return {
        type: DMAPREDEFTYPE_CHANGE,
        doctype
    }
}
// set the predefined doc dmaid of the attachment to the props
export function setPredefinedDmaid(dmaid) {
    return {
        type: DMAPREDEFDMAID_CHANGE,
        dmaid
    }
}
// update the doc status of the attachment
export function setDmaStatus(status, dmaid) {
    return {
        type: DMASTATUS_CHANGE,
        dmaid,
        status
    }
}
// update the doc comment of the attachment
export function setDmaComment(comment, dmaid) {
    return {
        type: DMACOMMENT_CHANGE,
        dmaid,
        comment
    }
}

export function saveDealGeneric(fn, onSuccess, onError, form) {
    return (dispatch, getState) => {

        let deal = getState().form[form].values;
        // cleaning form data from non valid attribute for the object deal (draw), that will be post to the ws
        if (deal.masterfacilitycode) {
            delete deal.masterfacilitycode;
        }
        dispatch(fn(deal, onSuccess, onError))
    }
}
export function initPDFUpload(file) {
    return (dispatch, getState) => {

        dispatch(dispatchPDFInit());

        dispatch(uploadPDF(file));
    }
}

export function uploadPDF(file) {
    let pdfSplitService = config.apis[config.masterApi].pdfSplitServices || '/upload-pdf/';

    return {
        types: [UPLOAD_PDF, UPLOAD_PDF_SUCCESS, UPLOAD_PDF_FAIL],
        promise: (client, dispatch) => {
            return client.get(pdfSplitService + 'new').then((result) => {
                let docId = result.data.key;

                return client.post(pdfSplitService + docId, file, {
                    progress: (event) => {
                        dispatch({
                            type: UPLOAD_PDF_PROGRESS,
                            progress: event
                        });
                    }, headers: {'Content-Type': 'multipart/form-data'}
                });
            });
        }
    };
}

export function getPDFStatus(documentKey) {
    let pdfSplitService = config.apis[config.masterApi].pdfSplitServices || '/upload-pdf/';

    return {
        types: [STATUS_PDF, STATUS_PDF_SUCCESS, STATUS_PDF_FAIL],
        promise: (client) => client.get(pdfSplitService + documentKey + '/status')
    };
}

export function rotatePage(page, angle) {
    return {
        type: ROTATE_PAGE,
        page,
        angle
    };
}

export function cleanUploadedPDF(documentKey) {
    let pdfSplitService = config.apis[config.masterApi].pdfSplitServices || '/upload-pdf/';

    return {
        types: [CLEAN_UPLOADED_PDF, CLEAN_PDF_SUCCESS, CLEAN_PDF_FAIL],
        promise: (client) => client.get(pdfSplitService + documentKey + '/close'),
        afterSuccess: (dispatch, getState) => {
            //To refresh the list of document after pdf upload
            let deal = getState().form['dealForm'].values.deal;
            let dealID = deal ? deal.dosid:null;
            if(dealID){
                dispatch(getListDocument(dealID));
            }
        }
    };
}

export function changeDMAType(page, dmaType) {
    return {
        type: CHANGE_DMA_TYPE_PAGE,
        page,
        dmaType
    };
}

export function dispatchDocumentTypes(dosId, documentKey, documentTypes) {
    return (dispatch, getState) => {

        dispatch({
            type: DISPATCH_PDF_DOC_TYPES,
            dosId,
            documentKey,
            documentTypes
        });

        dispatch(dispatchDocumentType(dosId, documentKey, documentTypes, 0));
    };
}

export function dispatchDocumentType(dosId, documentKey, documentTypes, documentTypeIndex) {
    let pdfSplitService = config.apis[config.masterApi].pdfSplitServices || '/upload-pdf/';

    let docType = documentTypes[documentTypeIndex];

    let pages = docType.pages.map((page) => (page.index + 1) + "@" + page.clientRotation);

    return {
        types: [DISPATCH_PDF_DOC_TYPE, DISPATCH_PDF_DOC_TYPE_SUCCESS, DISPATCH_PDF_DOC_TYPE_FAILED],
        promise: (client) => client.get(pdfSplitService + documentKey + '/putGED/' + pages.join(','), {
            params: {
                dosId: dosId,
                type: docType.code
            }
        }),
        afterSuccess: (dispatch, getState, result) => {
            documentTypeIndex++;
            if (documentTypeIndex >= documentTypes.length) {
                dispatch({
                    type: DISPATCH_PDF_DOC_TYPES_END,
                    dosId,
                    documentKey
                });
                return;
            }
            dispatch(dispatchDocumentType(dosId, documentKey, documentTypes, documentTypeIndex++));
        },
        dosId,
        documentTypeIndex,
        documentTypes,
        documentKey
    };
}

export function uploadAllPDF(dosId, documentKey) {
    let pdfSplitService = config.apis[config.masterApi].pdfSplitServices || '/upload-pdf/';

    return {
        types: [UPLOAD_ALL_PDF, UPLOAD_ALL_PDF_SUCCESS, UPLOAD_ALL_PDF_FAIL],
        promise: (client) => client.get(pdfSplitService + documentKey + '/putGED', {
            params: {
                dosId: dosId
            }
        })
    };
}

export function dispatchPDFInit() {
    return {
        type: DISPATCH_PDF_INIT
    };
}

export function initPhoto() {
    return {
        type: PHOTO_INIT
    };
}

export function photoError(error) {
    return {
        type: PHOTO_FAIL,
        error: error
    };
}

export function uploadPhoto(dosId, docType, canvas, token) {

    let quality = undefined; // ?

    let toBlobPromise = new Promise((resolve, reject) => {
        try {
            canvas.toBlob(resolve, "image/png", quality);

        } catch (x) {
            reject(x);
        }
    });

    return {
        types: [UPLOAD_PHOTO, UPLOAD_PHOTO_SUCCESS, UPLOAD_PHOTO_FAIL],
        promise: (client, dispatch) => {
            dispatch({
                type: UPLOAD_PHOTO_PROGRESS,
                progress: 0
            });

            return toBlobPromise.then((blob) => {

                dispatch({
                    type: UPLOAD_PHOTO_PROGRESS,
                    progress: 10
                });

                let formData = new FormData();
                formData.append('file', blob);
                formData.append('docTypeCode', docType || '');
                formData.append('filename', "photo.png");

                let path = '/deals/';
                if (token) {
                    path = '/portal/' + path;
                    formData.append('token', token);

                }
                return client.post(path + dosId + '/documents/filename', formData, {
                    onUploadProgress: (progressEvent) => {
                        dispatch({
                            type: UPLOAD_PHOTO_PROGRESS,
                            progress: Math.floor(progressEvent.loaded / progressEvent.total * 90) + 10
                        });
                    }, headers: {'Content-Type': 'multipart/form-data'}
                }).catch(error => {
                    if (token) {
                        hashHistory.push('login');
                        dispatch({
                            type : GUEST_LOGIN_FAIL,
                            error
                        });

                    }
                });

                promise = promise.then((success) => {
                    dispatch({
                        type: UPLOAD_PHOTO_PROGRESS,
                        progress: 100
                    });
                });

                return promise;

            }, (error) => {
                return dispatch({
                    type: PHOTO_FAIL,
                    error: error
                });
            });
        }
    };
}

export function setPhotoDmaType(dmaType) {
    return {
        type: CHANGE_DMA_TYPE_PHOTO,
        dmaType
    };
}
