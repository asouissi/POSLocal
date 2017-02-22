import{expect, assert, should} from 'chai'
import deepFreeze from 'deep-freeze'

import reducer from '../../src/app/common/timeline/reducers/timeline'
import * as actions from '../../src/app/common/timeline/reducers/actions';

describe('Timeline Reducer', () => {
    
    it('Global timeline : New items must be identify', () => {
        const initialSate = {
            global: [{dealid: 1,description: 'An old item', isNew: false}]
        };

        deepFreeze(initialSate);

        var state = reducer(initialSate, {
            type: actions.GTM_FETCH_SUCCESS,
            timelineId: 'global',
            result: {data: [
                {dealid: 2,description: 'A new item'},
                {dealid: 1,description: 'An old item'}
            ]}
        });

        assert.equal(state.global[0].isNew, true, 'the new item is not read');
        assert.equal(state.global[1].isNew, false, 'the old item is always as read');
    });


    it('Global timeline : New items must be identify after reload', () => {
        const initialSate = {
            global: [{dealid: 1,description: 'An old item but not read', isNew: true}]
        };

        deepFreeze(initialSate);

        var state = reducer(initialSate, {
            type: actions.GTM_FETCH_SUCCESS,
            timelineId: 'global',
            result: {data: [

                {dealid: 2,description: 'A new item'},
                {dealid: 1,description: 'An old item but not read'}
            ]}
        });

        assert.equal(state.global[0].isNew, true, 'the new item is not read');
        assert.equal(state.global[1].isNew, true, 'the old item is always as read');
    });


    it('Deal timeline : First, all items with a creation date before the lastDateTime must be read', () => {

        var dayDate = new Date();
        dayDate.setHours(0, 0, 0, 0);

        const initialSate = {
            deal: [],
            lastDealDateTime: dayDate.getTime()
        };
        deepFreeze(initialSate);

        var state = reducer(initialSate, {
            type: actions.TM_FETCH_SUCCESS,
            lastDealDateTime: new Date().getTime(),
            result: {data: [
                {dealid: 1,description: 'A new item', creationdate: new Date().getTime()},
                {dealid: 1,description: 'An old item read', creationdate: dayDate.getTime()}
            ]}
        });

        assert.equal(state.deal[0].isNew, true, 'the new item is not read');
        assert.equal(state.deal[1].isNew, false, 'the old item is always as read');
    });

    it('Deal timeline : Secondary, all items with a creation date before the lastDateTime but was new must stay not read', () => {

        var dayDate = new Date();
        dayDate.setHours(0, 0, 0, 0);

        const initialSate = {
            deal: [{dealid: 1, description: 'An old item not read', creationdate: dayDate.getTime(), isNew :true}],
            lastDealDateTime: dayDate.getTime()
        };
        deepFreeze(initialSate);

        var state = reducer(initialSate, {
            type: actions.TM_FETCH_SUCCESS,
            lastDealDateTime: new Date().getTime(),
            result: {data: [
                {dealid: 1,description: 'An old item not read', creationdate: dayDate.getTime()}
            ]}
        });

        assert.equal(state.deal[0].isNew, true, 'the old item is always as not read');
    });

    it('Deal timeline : When we fetch a deal, all items with a creation date before the lastDateTime must be read', () => {

        var dayDate = new Date();
        dayDate.setHours(0, 0, 0, 0);

        const initialSate = {
            deal: [],
            lastDealDateTime: dayDate.getTime()
        };
        deepFreeze(initialSate);

        var state = reducer(initialSate, {
            type: actions.TM_FETCH_SUCCESS,
            lastDealDateTime: new Date().getTime(),
            result: {data: [
                {dealid: 1,description: 'A new item', creationdate: new Date().getTime()},
                {dealid: 1,description: 'An old item read', creationdate: dayDate.getTime()}
            ]}
        });

        assert.equal(state.deal[0].isNew, true, 'the new item is not read');
        assert.equal(state.deal[1].isNew, false, 'the old item is always as read');
    });

    it('Deal timeline : When we fetch a deal, the last time must be updated', () => {

        var dayDate = new Date();
        dayDate.setHours(0, 0, 0, 0);

        const initialSate = {
            deal: [],
            lastDealDateTime: dayDate.getTime()
        };
        deepFreeze(initialSate);

        let newDatetime = new Date().getTime();
        var state = reducer(initialSate, {
            type: actions.TM_FETCH_SUCCESS,
            lastDealDateTime: newDatetime,
            result: {data: []}
        });

        assert.equal(state.lastDealDateTime, newDatetime, 'the new date is not updated');

    });

    it('Deal timeline : When we switch to another deal, the last time must be renit', () => {

        var dayDate = new Date();
        dayDate.setHours(0, 0, 0, 0);

        const initialSate = {
            deal: [],
            lastDealDateTime: dayDate.getTime()
        };
        deepFreeze(initialSate);

        var state = reducer(initialSate, {
            type: actions.TM_RESET
        });

        assert.notEqual(state.lastDealDateTime, initialSate.lastDealDateTime, 'the new date is not updated');
    });

    it('Deal timeline : New items must be identify after reload if the deal recieve new item', () => {
        const initialSate = {
            deal: [{dealid: 1,description: 'An old item read', isNew: false}],
            lastDealDateTime: new Date().getTime()
        };

        deepFreeze(initialSate);

        var state = reducer(initialSate, {
            type: actions.TM_FETCH_SUCCESS,
            lastDealDateTime: new Date().getTime(),
            result: {data: [
                {dealid: 1,description: 'A new item'},
                {dealid: 1,description: 'An old item read'}
            ]}
        });

        assert.equal(state.deal[0].isNew, true, 'the new item is not read');
        assert.equal(state.deal[1].isNew, false, 'the old item is always as read');
    });

    it('Deal timeline : As ORFI user i do not want to have new item', () => {
        const initialSate = {
            deal: [],
            lastDealDateTime: new Date().getTime()
        };

        deepFreeze(initialSate);

        var state = reducer(initialSate, {
            type: actions.TM_FETCH_SUCCESS,
            lastDealDateTime: new Date().getTime(),
            uticode: 'ORFI',
            result: {data: [
                {dealid: 1,description: 'An ORFI item', usercode:'ORFI'},
                {dealid: 2,description: 'A DEALER1 item', usercode:'DEALER1'}
            ]}
        });

        assert.equal(state.deal[0].isNew, false, 'the ORFI item is not new');
        assert.equal(state.deal[1].isNew, true, 'the DEALER item is new');
    });


});
