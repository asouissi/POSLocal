'use strict';

import{expect, assert, should} from 'chai';
import deepFreeze from 'deep-freeze';
import Immutable from 'seamless-immutable'

import assets from '../../../src/app/pos/deal/assets';

const {
    ASSET_UPDATE_FROM_DPMMTINVEST_SUCCESS,
    ASSET_APPEND_NEW_SUCCESS,
    ASSET_UPDATE_FROM_ACACODE_SUCCESS,
    ASSET_UPDATE_FROM_NAPCODE_SUCCESS,
    removeAsset,

    setAssetCategory
} = assets.actions


const assetReducer = assets.reducer;
const INIT_STATE = Immutable({
        deal: {listdealasset: [{dpmordre: 1}, {dpmordre: 2}]},
        assetIndex: 0,
        variant: [{}, {}]
    }
);



describe('Asset Reducer: Appending an asset', () => {
    const action = {
        type : ASSET_APPEND_NEW_SUCCESS,
        result: {data: {dpmordre: 3}},
        deal: INIT_STATE.deal
    }

    deepFreeze(INIT_STATE);

    it('Asset list variant should have one more item', () => {
        const newState = assetReducer(INIT_STATE, action);

        expect(newState.variant.length).equal(3);
        expect(newState.assetIndex).equal(2);
    });
});

describe('Asset Reducer: Modifying an asset', () => {
    Immutable(INIT_STATE);

    it('Asset category must be updated', () => {
        const DPMORDRE = 2;
        const INDEX = 1;
        const NEW_ACACODE = "VEH";

        const action = {
            type: ASSET_UPDATE_FROM_ACACODE_SUCCESS,
            dpmordre: DPMORDRE,
            result: {data: {acacode: NEW_ACACODE, dpmordre: DPMORDRE}},
            deal: INIT_STATE.deal
        }

        const newState = assetReducer(INIT_STATE, action);

        expect(newState.deal.listdealasset[INDEX].acacode).equal(NEW_ACACODE);
    });

    it('Asset type must be updated', () => {
        const DPMORDRE = 2;
        const INDEX = 1;
        const NEW_NAPCODE = "CAR";

        const action = {
            type: ASSET_UPDATE_FROM_NAPCODE_SUCCESS,
            dpmordre: DPMORDRE,
            result: {data: {napcode: NEW_NAPCODE, dpmordre: DPMORDRE}},
            deal: INIT_STATE.deal
        }
        
        const newState = assetReducer(INIT_STATE, action);

        expect(newState.deal.listdealasset[INDEX].napcode).equal(NEW_NAPCODE);
    });

    it('Asset description must be updated', () => {
        //TODO change with redux form change
        // const DPMORDRE = 2;
        // const INDEX = 1;
        // const NEW_DESCRIPTION = "New description";
        //
        // const action = setAssetDescription(NEW_DESCRIPTION, DPMORDRE);
        //
        // const newState = assetReducer(INIT_STATE, action);
        //
        // expect(newState.deal.listdealasset[INDEX].dpmlibelle).equal(NEW_DESCRIPTION);
    });

    it('Asset amount must be updated', () => {
        const DPMORDRE = 2;
        const INDEX = 1;
        const NEW_AMOUNT = 10000.0;

        const action = {
            type: ASSET_UPDATE_FROM_DPMMTINVEST_SUCCESS,
            dpmordre: DPMORDRE,
            result: {data: {dpmmtinvest: NEW_AMOUNT, dpmordre: DPMORDRE}},
            deal: INIT_STATE.deal
        }

        const newState = assetReducer(INIT_STATE, action);

        expect(newState.deal.listdealasset[INDEX].dpmmtinvest).equal(NEW_AMOUNT);
    });
});

describe('Asset Reducer: Deleting an asset', () => {
    const action = removeAsset(1);

    deepFreeze(INIT_STATE);

    it('Asset list should have one less item', () => {
        const newState = assetReducer(INIT_STATE, action);

        expect(newState.deal.listdealasset.length).equal(2);//TODO what ? 
    });
});


