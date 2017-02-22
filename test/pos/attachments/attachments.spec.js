/**
 * Created by zos on 28/09/2016.
 */
import{expect, assert, should} from 'chai';
import Immutable from 'seamless-immutable'

import attachmentsReducer from '../../../src/app/pos/deal/attachments/reducers/attachmentsReducer';
import * as actionType from '../../../src/app/pos/deal/attachments/reducers/actions';

const docList = [
    {destination:"AVDOSS", dmadt:1475009248000, dmafilename:"IFRToolLog.txt",dmaid:679589,dmapath: "DEAL/_ORIG_/2016-09/00000680/IFRToolLog.txt",
        dmastatus:null,dmastatuslibelle:null, dmatype:null,dmatypelibelle:null,dosidprospect:null}
    ,{destination:"AVDOSS", dmadt:1474009248000, dmafilename:"UnitTest.txt",dmaid:111111,dmapath: "DEAL/_ORIG_/2016-09/00000680/UnitTest.txt",
        dmastatus:"ACT",dmatype:"BALA",dosidprospect:76255}

];
const INIT_EMPTY_STATE = Immutable({
    documents: [],
    isLoading: false
});
const INIT_FULL_STATE = Immutable({
    documents: docList,
    isLoading: false
});
const result  = {
        data : {documentmanagementlist:docList}
}

describe('Attachments Reducer ', () => {

    it('is fetching the list of attachments so the sate is loading', () => {

        const newState = attachmentsReducer(INIT_EMPTY_STATE, {
            type: actionType.FETCH_LIST_DOC
        });

        expect(newState.isLoading).equal(true);
        assert.equal(newState.isLoading, true, 'the state should be loading');
        assert.equal(newState.documents.length, 0, 'the doc list is empty');
    });
    it('cleans the list of attachments so the list is empty', () => {

        const newState = attachmentsReducer(INIT_EMPTY_STATE, {
            type: actionType.CLEAN_DOC_LIST
        });

        expect(newState.documents.length).equal(0);
    });
    it('fetchs the list of attachments and the fetch succeed so we get the doc list', () => {

        const newState = attachmentsReducer(INIT_EMPTY_STATE, {
            type: actionType.FETCH_LIST_DOC_SUCCESS,
            result : result
        });

        expect(newState.isLoading).equal(false);
        assert.equal(newState.isLoading, false, 'the state should not be loading');
        assert.equal(newState.documents.length, 2, 'the state get the documents list');
    });
    it('deletes one of the attachments so we get the doc list minus the deleted one', () => {

        const newState = attachmentsReducer(INIT_FULL_STATE, {
            type: actionType.DOC_DELETE_SUCCESS,
            dmaid:111111
        });

        assert.equal(newState.documents.length, 1, 'the state get the new documents list');
    });
    it('changes the type of an attachment', () => {

        const newState = attachmentsReducer(INIT_FULL_STATE, {
            type: actionType.DMATYPE_CHANGE,
            dmaid:111111,
            doctype:"TestType"
        });
        assert.equal(newState.documents[1].dmatype, "TestType", 'the state get the new type of the document');
    });
    it('changes the status of an attachment', () => {

        const newState = attachmentsReducer(INIT_FULL_STATE, {
            type: actionType.DMASTATUS_CHANGE,
            dmaid:111111,
            status:"TestStatus"
        });
        assert.equal(newState.documents[1].dmastatus, "TestStatus", 'the state get the new status of the document');
    });
});