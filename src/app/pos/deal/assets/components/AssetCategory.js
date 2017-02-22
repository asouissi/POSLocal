'use strict'

import AssetSelect from './AssetSelect'

const ASSET_CATEGORIES_LIST = "/referencetable?table=lanassetcategory&tpgcode=$tpgcode";
export default class AssetCategory extends AssetSelect {
	getUrl() {
		return ASSET_CATEGORIES_LIST;
	}

    getProps() {
        return ["tpgcode"];
    }
}
