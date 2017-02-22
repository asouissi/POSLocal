'use strict'
import Select from '../../../../core/components/lib/Select'

const FINANCIAL_PRODUCT_LIST =  "/referencetable?table=tprofilgestion&tpgflagfacility=0";
const FINANCIAL_PRODUCT_LIST_MF =  "/referencetable?table=tprofilgestion&tpgflagfacility=1";

const debug = (...messages) => console.log.apply(console, messages);

export default class FinancialProduct extends Select { 

  componentDidMount() {
    if(this.props.isMF){
      this.loadDatas(FINANCIAL_PRODUCT_LIST_MF);
    }else{
      this.loadDatas(FINANCIAL_PRODUCT_LIST);
    }
  }

  filterAndSortDatas(datas) {
    datas.sort((o1, o2) => (o1.label===o2.label)?0:((o1.label<o2.label)?-1:1));
    
    return datas;
  }
}
