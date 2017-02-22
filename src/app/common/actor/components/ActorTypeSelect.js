'use strict'

import Select from '../../../core/components/lib/Select'

const CUSTOMER_TYPE_WS = "/referencetable?table=lanttrparam&ttrnom=TYPECLIENT&tpgcode=TOUT";

export default class ActorTypeSelect extends Select {

    componentDidMount() {
        this.loadDatas(CUSTOMER_TYPE_WS);
    }    
}
