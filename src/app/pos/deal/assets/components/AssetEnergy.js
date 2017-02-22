'use strict'
import AssetSelect from './AssetSelect'
const ASSERT_ENERGY_LIST = "/referencetable?table=LANTUSPARAM&tusnom=CGENERGIE";

const debug = (...messages) => console.log.apply(console, messages);

export default class AssetEnergy extends AssetSelect { 
  
  getProps() {
    return [];
  }
    
  getUrl() {
    return ASSERT_ENERGY_LIST;
  }

}
