import assets from '../../assets'
const {
    appendNewAsset,
    updateAssetAfterAcacodeChanged,
    updateAssetAfterNapcodeChanged,
    updateAssetAfterDpmmtinvestChanged
} = assets.actions;

export function appendNewAsset2() {
    return (dispatch, getState) => {
        dispatch(appendNewAsset('dealQuote', getState().form.dealQuote.values))
    }
}

export function updateAssetAfterAcacodeChanged2(assetField, dpmordre, acacode) {
    return (dispatch, getState) => {
        dispatch(updateAssetAfterAcacodeChanged(getState().form.dealQuote.values, dpmordre, acacode))
    }
}

export function updateAssetAfterNapcodeChanged2(assetField, dpmordre, napcode) {
    return (dispatch, getState) => {
        dispatch(updateAssetAfterNapcodeChanged(getState().form.dealQuote.values, dpmordre, napcode))
    }
}

export function updateAssetAfterDpmmtinvestChanged2(assetField, dpmordre, dpmmtinvest) {
    return (dispatch, getState) => {
        dispatch(updateAssetAfterDpmmtinvestChanged(getState().form.dealQuote.values, dpmordre, dpmmtinvest))
    }
}