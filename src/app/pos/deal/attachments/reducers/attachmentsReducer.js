/**
 *
 */

import * as d from './actions'
import Immutable from 'seamless-immutable'
import config from "./config";
// Initial state
const initialState = {
    readOnly: false,
    documents: [],
    isLoading: false,
    photo: {}
};

// Reducer
export default function reducer(state = Immutable(initialState), action) {
    switch (action.type) {
        case d.FETCH_LIST_DOC:
            return state.merge({
                documents: [],
                isLoading: true
            });
        case d.FETCH_LIST_DOC_FAIL:
            return state.merge({
                documents: [],
                isLoading: false
            });
        case d.FETCH_LIST_DOC_SUCCESS:
            return state.merge({
                documents: action.result.data.documentmanagementlist,
                isLoading: false
            });
        case d.CLEAN_DOC_LIST:
            return state.merge({
                documents: [],
                isLoading: false
            });
        case d.UPLOAD_DOC_SUCCESS:
            return state.merge({
                documents: action.result.data.documentmanagementlist
            });

        case d.DOC_DELETE_SUCCESS:
            var docs = state.documents.filter((doc) => doc.dmaid !== action.dmaid);

            return state.merge({
                documents: docs
            });


        case d.DMATYPE_CHANGE:
            var docIndex = state.documents.findIndex((doc) => doc.dmaid === action.dmaid);

            return state.setIn(['documents', docIndex, 'dmatype'], action.doctype);

        case d.DMACAT_CHANGE:
            var docIndex = state.documents.findIndex((doc) => doc.dmaid === action.dmaid);

            return state.setIn(['documents', docIndex, 'dmacat'], action.category);

        case d.DMAPREDEFTYPE_CHANGE:
            return state.merge({
                predefinedType: action.doctype
            });
        case d.DMAPREDEFDMAID_CHANGE:
            return state.merge({
                predefinedDmaid: action.dmaid
            });

        case d.DMASTATUS_CHANGE:
            var docIndex = state.documents.findIndex((doc) => doc.dmaid === action.dmaid);

            return state.setIn(['documents', docIndex, 'dmastatus'], action.status);

        case d.DMACOMMENT_CHANGE:
            var docIndex = state.documents.findIndex((doc) => doc.dmaid === action.dmaid);
            return state.setIn(['documents', docIndex, 'dmacomment'], action.comment);

        case d.UPLOAD_PDF:
            return state.merge({
                pdf: null,
                pdfStatus: "UPLOADING"
            });

        case d.UPLOAD_PDF_SUCCESS:
            return state.merge({
                pdf: {
                    key: action.result.data.key,
                },
                pdfStatus: "UPLOADED"
            });

        case d.UPLOAD_PDF_FAIL:
        case d.STATUS_PDF_FAIL:
            return state.merge({
                pdfStatus: "ERROR"
            });

        case d.STATUS_PDF_SUCCESS:
            let status = action.result.data;
            const api = config.apis[config.masterApi];
            let pdfSplitService = api.pdfSplitServices || '/upload-pdf/';

            if (status.pages) {
                status.pages.forEach((p, index) => {
                    p.pdfURL = api.api + pdfSplitService + status.key + "/page/" + index;
                    p.previewURL = p.pdfURL + "/image";
                    p.clientRotation = 0;
                    p.index = index;
                });
            }

            return state.merge({
                pdf: status,
                pdfStatus: status.status
            });

        case d.ROTATE_PAGE:
            const rotatePageIndex = state.pdf.pages.findIndex((page) => page === action.page);
            let newRotation = ((action.page.clientRotation || 0) + action.angle );

            return state.setIn(['pdf', 'pages', rotatePageIndex, 'clientRotation'], newRotation);

        case d.CHANGE_DMA_TYPE_PAGE:
            let pageIndex = state.pdf.pages.findIndex((page) => page === action.page);

            return state.setIn(['pdf', 'pages', pageIndex, 'dmaType'], action.dmaType);

        case d.UPLOAD_PDF_PROGRESS:
            let progressEvent = action.progress;
            state = state.setIn(['pdfProgress'], Math.floor(progressEvent.loaded * 100 / progressEvent.total));
            return state;

        case d.UPLOAD_ALL_PDF:
            return state.merge({
                pdfStatus: 'UPLOADALL',
                pdfProgress: 0
            });

        case d.UPLOAD_ALL_PDF_SUCCESS:
            return state.merge({
                pdfProgress: 100
            });

        case d.UPLOAD_ALL_PDF_FAIL:
            return state.merge({
                pdfStatus: 'UPLOADALL-FAILED',
            });

        case d.DISPATCH_PDF_DOC_TYPES:
            return state.merge({
                pdfStatus: 'DISPATCHING',
                pdfProgress: 0
            });

        case d.DISPATCH_PDF_DOC_TYPE_SUCCESS:
            return state.merge({
                pdfStatus: 'DISPATCHING',
                pdfProgress: Math.floor((action.documentTypeIndex + 1) / action.documentTypes.length * 100)
            });

        case d.DISPATCH_PDF_DOC_TYPES_END:
            return state.merge({
                pdfStatus: 'DISPATCHING',
                pdfProgress: 100
            });

        case d.DISPATCH_PDF_DOC_TYPE_FAILED:
            return state.merge({
                pdfStatus: 'DISPATCHING-FAILED'
            });


        case d.DISPATCH_PDF_INIT:
            return state.merge({
                pdf: null,
                pdfStatus: 'INIT',
                pdfProgress: 0,
                documentTypes: null,
                documentTypeIndex: 0
            });

        case d.CHANGE_DMA_TYPE_PHOTO:
            return state.setIn(['photo', 'dmaType'], action.dmaType);

        case d.PHOTO_INIT:
            return state.merge({
                photo: {
                    dmaType: null,
                    progress: 0,
                    uploading: false,
                    error: null,
                }
            });

        case d.PHOTO_FAIL:
            return state.merge({
                photo: {
                    progress: 0,
                    uploading: false,
                    error: action.error,
                }
            });

        case d.UPLOAD_PHOTO_PROGRESS:
            return state.merge({
                photo: {
                    progress: action.progress,
                    uploading: true,
                    error: null
                }
            });

        default:
            return state;
    }
}