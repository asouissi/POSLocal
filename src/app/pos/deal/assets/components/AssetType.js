'use strict'
import AssetSelect from './AssetSelect'

const ASSET_NAP_LIST = "/referencetable?table=lannap&acacode=$acacode&tpgcode=$tpgcode";

const debug = (...messages) => console.log.apply(console, messages);

export default class AssetType extends AssetSelect {
	getUrl() {
		return ASSET_NAP_LIST;
	}

    getProps() {
        return ["acacode","tpgcode"];
    }
}
