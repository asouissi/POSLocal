export default class AssetUtils {
    
    static isetLibelle(asset, dpmlibelle){
        return asset.set('dpmlibelle', dpmlibelle)
    }

    static updateDrawnAsset(deal, asset) {
        return deal.set('listdealasset', [asset]);
    }
    
    static getAssetIndex(deal, asset) {
        return deal.listdealasset.findIndex(a => a.dpmordre == asset.dpmordre)
    }
}

