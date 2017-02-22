'use strict';

import dealUtils, * as dconst from '../../utils/dealUtils'
import AssetUtils  from '../../utils/AssetUtils'
import sharedUtils, * as sharedConst from '../../../../core/utils/sharedUtils';
import * as imutils from '../../../../core/utils/ImmutableUtils';
import Immutable from 'seamless-immutable'

import * as a from './actions'


// Reducer
const EMPTY_ARRAY = [];

export default function reducer(state, action) {
    switch (action.type) {

        case a.DEAL_ASSET_CHANGE:
            return state.set('assetIndex', action.assetIndex);


        case a.ASSET_APPEND_NEW_SUCCESS:
            var newAssetIndex = action.deal.listdealasset.length;
            var variant = state.variant ? state.variant.set(newAssetIndex, EMPTY_ARRAY) : EMPTY_ARRAY;
            return state.merge({
                assetIndex: newAssetIndex,
                variant: variant
            });

        case a.ASSET_REMOVE:
            let assetIndex = action.assetIndex;
            let newIndex = assetIndex ? assetIndex-1 : assetIndex;
            var variant = state.variant ? imutils.iremoveArrayIndex(state.variant, assetIndex) : EMPTY_ARRAY;
            return state.merge({
                assetIndex: newIndex,
                quoteIndex : newIndex,
                variant: variant
            });

        case a.ASSET_UPDATE_FROM_ACACODE_SUCCESS:
        case a.ASSET_UPDATE_FROM_NAPCODE_SUCCESS:
        case a.ASSET_UPDATE_FROM_DPMMTINVEST_SUCCESS:
            var asset = Immutable(action.result.data);
            if(sharedConst.ACTION_MODE_INSERTION != asset.actionMode){
                asset =sharedUtils.updateActionMode(asset, sharedConst.ACTION_MODE_MODIFICATION);
            }
            return state.set('deal', dealUtils.updateAsset(Immutable(action.deal), asset));

        case a.CAR_VARiANT_INIT:
            return state.merge({
                variant: state.variant.set(state.assetIndex, EMPTY_ARRAY)
            });


        case a.CAR_VARIANT_CHANGED:
            let options = _getOptions(action);

            return state.merge({
                variant: state.variant.set(state.assetIndex, EMPTY_ARRAY),
                options: options
            });

        case a.CAR_FETCH_SUCCESS:

            let variant = action.result.data;
            return state.merge({
                variant: state.variant.set(state.assetIndex, variant),
                dealLoading: false
            });
        
        case a.VARIANT_FETCH_SUCCESS:
            var variant = action.result.data;
            return state.set('variant', variant);

        case a.RESET_VARIANT:
            return state.merge({
                variant: [{}],
                options: null
            });
        case a.COPY_VARIANT:
            return state.merge({
                variant: state.variant.set(action.assetIndex, action.variant)
            });

        default:
            return state;
    }
}

const _getOptions = (action) => {
    if (action.varid === "3417") {
        return [{
            key: "1",
            description: "GT-361",
            quantity: 1,
            unitPriceBeforeTax: 22000,
            unitPriceAfterTax: 22000,
            totalBeforeTax: 22000,
            totalAfterTax: 22000,
            option: false,
            tax: 'Tax free',
            vatAmount: 0,
        }, {
            key: "2",
            description: "Heat-Press",
            quantity: 1,
            unitPriceBeforeTax: 2500,
            unitPriceAfterTax: 2500,
            totalBeforeTax: 2500,
            totalAfterTax: 2500,
            option: true,
            tax: 'Tax free',
            vatAmount: 0,
        }, {
            key: "3",
            description: "Dryer",
            quantity: 1,
            unitPriceBeforeTax: 4000,
            unitPriceAfterTax: 4000,
            totalBeforeTax: 4000,
            totalAfterTax: 4000,
            option: true,
            tax: 'Tax free',
            vatAmount: 0,
        }, {
            key: "4",
            description: "Pre-Treat Machine",
            quantity: 1,
            unitPriceBeforeTax: 4200,
            unitPriceAfterTax: 4200,
            totalBeforeTax: 4200,
            totalAfterTax: 4200,
            option: true,
            tax: 'Tax free',
            vatAmount: 0,
        }];
    }
    else if (action.varid === "3416") {
        return [{
            key: "1",
            description: "GT-341",
            quantity: 1,
            unitPriceBeforeTax: 20000,
            unitPriceAfterTax: 20000,
            totalBeforeTax: 20000,
            totalAfterTax: 20000,
            option: false,
            tax: 'Tax free',
            vatAmount: 0,
        }, {
            key: "2",
            description: "Heat-Press",
            quantity: 1,
            unitPriceBeforeTax: 1500,
            unitPriceAfterTax: 1500,
            totalBeforeTax: 1500,
            totalAfterTax: 1500,
            option: true,
            tax: 'Tax free',
            vatAmount: 0,
        }];
    }
    else if (action.varid === "3421") {
        return [{
            key: "1",
            description: "GT-381",
            quantity: 1,
            unitPriceBeforeTax: 25000,
            unitPriceAfterTax: 25000,
            totalBeforeTax: 25000,
            totalAfterTax: 25000,
            option: false,
            tax: 'Tax free',
            vatAmount: 0,
        }, {
            key: "2",
            description: "Heat-Press",
            quantity: 1,
            unitPriceBeforeTax: 3000,
            unitPriceAfterTax: 3000,
            totalBeforeTax: 3000,
            totalAfterTax: 3000,
            option: true,
            tax: 'Tax free',
            vatAmount: 0,
        }, {
            key: "3",
            description: "Dryer",
            quantity: 1,
            unitPriceBeforeTax: 4000,
            unitPriceAfterTax: 4000,
            totalBeforeTax: 4000,
            totalAfterTax: 4000,
            option: true,
            tax: 'Tax free',
            vatAmount: 0,
        }, {
            key: "4",
            description: "Pre-Treat Machine",
            quantity: 1,
            unitPriceBeforeTax: 4200,
            unitPriceAfterTax: 4200,
            totalBeforeTax: 4200,
            totalAfterTax: 4200,
            option: true,
            tax: 'Tax free',
            vatAmount: 0,
        }, {
            key: "5",
            description: "PR-655",
            quantity: 1,
            unitPriceBeforeTax: 8000,
            unitPriceAfterTax: 8000,
            totalBeforeTax: 8000,
            totalAfterTax: 8000,
            option: true,
            tax: 'Tax free',
            vatAmount: 0,
        }];
    }
    else if (action.varid === "13001" || action.varid === "13011" || action.varid === "13021" || action.varid === "13031" || action.varid === "13041" || action.varid === "13051") {
        return [{
            key: "1",
            description: "Additional oil reservoir",
            quantity: 1,
            unitPriceBeforeTax: 25000,
            unitPriceAfterTax: 25000,
            totalBeforeTax: 25000,
            totalAfterTax: 25000,
            option: false,
            tax: 'Tax free',
            vatAmount: 0,
        }, {
            key: "2",
            description: "Control Lever SCV Position 3 and 4",
            quantity: 1,
            unitPriceBeforeTax: 3000,
            unitPriceAfterTax: 3000,
            totalBeforeTax: 3000,
            totalAfterTax: 3000,
            option: true,
            tax: 'Tax free',
            vatAmount: 0,
        }, {
            key: "3",
            description: "E-ICV Control Lever (Joystick) 3 Function with CommandARM only",
            quantity: 1,
            unitPriceBeforeTax: 4000,
            unitPriceAfterTax: 4000,
            totalBeforeTax: 4000,
            totalAfterTax: 4000,
            option: true,
            tax: 'Tax free',
            vatAmount: 0,
        }, {
            key: "4",
            description: "E-SCV, 450 SERIES, Position 4",
            quantity: 1,
            unitPriceBeforeTax: 4200,
            unitPriceAfterTax: 4200,
            totalBeforeTax: 4200,
            totalAfterTax: 4200,
            option: true,
            tax: 'Tax free',
            vatAmount: 0,
        }, {
            key: "5",
            description: "ICV Oil Line Kit",
            quantity: 1,
            unitPriceBeforeTax: 8000,
            unitPriceAfterTax: 8000,
            totalBeforeTax: 8000,
            totalAfterTax: 8000,
            option: true,
            tax: 'Tax free',
            vatAmount: 0,
        }];
    }
    else {
        return [{
            key: "1",
            description: "VOLSKWAGEN Confort Line",
            quantity: 1,
            unitPriceBeforeTax: 37400,
            unitPriceAfterTax: 37400,
            totalBeforeTax: 37400,
            totalAfterTax: 37400,
            tax: 'EXO Tax free',
            vatAmount: 0,
        }, {
            key: "2",
            description: "Incl. Camera recul",
            quantity: 1,
            unitPriceBeforeTax: 0,
            unitPriceAfterTax: 0,
            totalBeforeTax: 0,
            totalAfterTax: 0,
            option: true,
            tax: 'EXO Tax free',
            vatAmount: 0,
        }];
    }
}





