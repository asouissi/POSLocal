'use strict'
import Select from '../../../../core/components/lib/Select'

export default class FinancialScale extends Select {

    componentWillReceiveProps(nextProps) {
        var {taccode, tpgcode, devcode, pfiinvestissement} =  this.props;
        if (nextProps.taccode !== taccode || nextProps.tpgcode !== tpgcode
            || nextProps.devcode !== devcode || nextProps.pfiinvestissement !== pfiinvestissement) {
            this.load(nextProps)
        }
    }

    componentWillMount() {
        this.load(this.props)
    }

    load(props) {

        this.loadDatas('/referencetable', {
            table: 'lanpricingcriteria',
            taccode: props.taccode,
            tpgcode: props.tpgcode,
            devcode: props.devcode,
            pfiinvestissement: props.pfiinvestissement
        });
    }
}
