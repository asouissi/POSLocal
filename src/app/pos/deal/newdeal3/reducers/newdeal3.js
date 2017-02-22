import Immutable from 'seamless-immutable';
import {LOCATION_CHANGE} from 'react-router-redux'

import * as d from './actions'
import dealUtils from '../../utils/dealUtils'
import AssetUtils from '../../utils/AssetUtils'

import customer from '../../customer';

// Initial state
const initialState = {
    readOnly: false,
    stepIndex: 0,
    driverIndex: 1,
    undrawns: [],
    dpmordreSelected: {},
    variant: {},
    acttypes: [],
    deal: {
        listdealasset: [
            {}
        ],
        listdealquote: [
            {
                listdealquoteelement: [],
                listdealquotepayment: [],
                listdealquoteattribute: []
            }
        ],
        listdealactor: [],
        dealextrainfo: {}
    },
    drawdeal: {
        listdealasset: [
            {}
        ],
        listdealquote: [
            {
                listdealquoteelement: [{}],
                listdealquotepayment: [{}],
                listdealquoteattribute: []
            }
        ],
        listdealactor: [],
        dealextrainfo: {}
    }
};

// Reducer
export default function newdeal3(state = Immutable(initialState), action) {
    switch (action.type) {
        case d.FETCH:
            return state.merge({
                stepIndex: 0,
                dealLoading: true,
                options: null,
                acttypes: [],
                onEdit: true
            });

        case d.FETCH_SUCCESS:
            // New deal received, reset the whole deal state
            var deal = action.result.data;

            return state.merge({
                deal: deal,
                dealLoading: false
            });

        case d.FETCH_DRAW:
            return state.merge({
                stepIndex: 0,
                dealLoading: true,
                options: null,
                onEdit: true
            });

        case d.FETCH_DRAW_SUCCESS:
            // New draw deal received, reset the whole draw deal state
            var drawdeal = action.result.data;

            return state.merge({
                drawdeal: drawdeal,
                dpmordreSelected: drawdeal.listdealasset[0].dpmordre,
                readonlyAssets: true,
                dealLoading: false
            });

        case d.STEP_CHANGE:
            return state.set('stepIndex', action.index);


        case d.FETCH_U_SUCCESS:
            return state.merge({
                undrawns: action.result.data,
                dealLoading: false
            });

        case d.FINANCIAL_PRODUCT_CHANGE:
            var drawdeal = state.drawdeal;
            drawdeal = dealUtils.isetFinanceType(drawdeal, action.tpgcode);
            drawdeal = dealUtils.isetDealName(drawdeal, action.tpgcode);
            return state.set('drawdeal', drawdeal);//dealUtils.isetFinanceType(state.drawdeal, action.tpgcode));


        case d.SELECT_ASSET_TO_DRAW_SUCCESS:
            //return state.set('dpmordreSelected', action.dpmordreSelected);
            var deal = state.deal;
            var drawdeal = state.drawdeal;
            var asset = dealUtils.getDealAssetFromDpmOrdre(deal, action.dpmordreSelected);
            drawdeal = AssetUtils.updateDrawnAsset(drawdeal, asset);
            if (asset.varid) {
                return state.merge({
                    drawdeal: drawdeal,
                    dpmordreSelected: action.dpmordreSelected,
                    variant: action.result.data
                });
            }

            return state.merge({
                drawdeal: drawdeal,
                dpmordreSelected: action.dpmordreSelected,
                variant: {}
            });

        case d.VARIANT_FETCH_SUCCESS:
            let variant = action.result.data;
            return state.merge({
                variant: variant
            });

        case d.NEW_SUCCESS:
            // New "empty" deal received, reset the whole deal state
            let drawdeal = action.result.data;

            // Default deal name and financial name
            drawdeal.dprnom = drawdeal.tpgcode + ' (drawn deal)';

            drawdeal.listdealasset.length = 0;
            drawdeal.dealextrainfo.dosidautorisation = action.dosid;

            return state.merge({
                drawdeal: drawdeal,
                dealLoading: false,
                dpmordreSelected: 0,
                driverIndex: 1,
                variant: [],
                onEdit: true,
                readonlyAssets: false
            });

        case d.SAVE_SUCCESS:
            // Inserted draw deal received, reset the whole draw deal state
            return state.merge({
                drawdeal: action.result.data,
                dealLoading: false,
                readonlyAssets: true
            });

        case LOCATION_CHANGE:
            var locationAction = action.payload.action;
            if (locationAction === "POP") {
                return state

            }
            return state.set('onEdit', false);

        default:
            if (state.onEdit) {
                state = customer.reducer(state, action, 'drawdeal');
            }
            return state;
    }
}