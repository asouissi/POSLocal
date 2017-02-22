import React, {Component} from 'react'
import Griddle from 'griddle-react'
import {FormattedMessage} from 'react-intl';
import Box from "../../../../core/components/lib/Box";
import {AmountDisplay, PercentDisplay} from "../../../../core/components/lib/CustomGriddle";
import applyAccessKeysOn from '../../../../common/accesskeys/AccessKeysForComponents';
import {getComponentAccessKeys} from '../../../../common/accesskeys/AccessKeysSelector';
import Pager from "../../../../core/components/lib/Pager";


class CommissionTable extends Component {

    render() {
        let {accessKeys, ...props}  = this.props;
        const defaultColumns = ['libelletypecommission', 'pcfmt', 'pcftx']

        const defaultColumnMetadata = [
            {
                columnName: defaultColumns[0],
                displayName: <FormattedMessage id="pos.deal.quote.commission.table.col.libelle"
                                               defaultMessage="Commission"/>,

            },
            {
                columnName: defaultColumns[1],
                displayName: <FormattedMessage id="pos.deal.quote.commission.table.col.pcfmtttc"
                                               defaultMessage="Amount(Excl.Tax)"/>,
                customComponent: AmountDisplay,
                customComponentMetadata: {
                    currencycode: this.props.currencyCode,
                }

            },

            {
                columnName: defaultColumns[2],
                displayName: <FormattedMessage id="pos.deal.quote.commission.table.col.pcftx"
                                               defaultMessage="Percent"/>,
                customComponent: PercentDisplay,


            }
        ]

        let componentAccesskey = getComponentAccessKeys(accessKeys, this.props.id);
        const {columns, columnMetadata} = applyAccessKeysOn("griddle", componentAccesskey, {
            defaultColumns,
            defaultColumnMetadata
        })


        return (<Box type="primary" id={this.props.id}
                     title={<FormattedMessage id="pos.deal.quote.commission.box.title" defaultMessage="Commission"/>}
                     {...componentAccesskey}>
                <Griddle
                    tableClassName="table table-hover"
                    useGriddleStyles={false}
                    results={ this.props.rows }
                    columns={ columns }
                    columnMetadata={ columnMetadata }
                    height={ 1000 }
                    customRowComponentClassName="griddle-body-custom"
                    useCustomPagerComponent={true}
                    customPagerComponent={Pager}

                />
            </Box>
        )
    }
}
export default CommissionTable;