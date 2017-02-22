'use strict'

import React, {Component, PropTypes} from "react";
import Box from '../../../../core/components/lib/Box'
import Griddle from 'griddle-react';
import {injectIntl, FormattedMessage} from 'react-intl';
import ServicesEditPopup from './ServicesEditPopup'
import * as sharedConst from "../../../../core/utils/sharedUtils";
import Pager from "../../../../core/components/lib/Pager";
import {AmountDisplay} from "../../../../core/components/lib/CustomGriddle";
import RefTableDisplay from "../../../../core/components/lib/RefTableDisplay";
import applyAccessKeysOn from '../../../../common/accesskeys/AccessKeysForComponents';
import {getComponentAccessKeys} from '../../../../common/accesskeys/AccessKeysSelector';
import {tables} from '../../../../core/reducers/referenceTable'

class ScaleServices extends Component {


    handleEditServices = () => {
        this.refs.servicesPopup.toggle();
    };

    render() {
        const defaultColumns = ['tprcode', 'pfpmt'];
        const defaultColumnMetadata = [
            {
                columnName: 'tprcode',
                displayName: <FormattedMessage id="pos.deal.financialquote.services.name"
                                               defaultMessage="Service name"/>,
                customComponent: RefTableDisplay,
                customComponentMetadata: {
                    refTable: tables.AVTPRESTATION,
                    refParams: {'tpgcode': this.props.tpgcode},
                    allowEmptyParams: true,
                }
            },
            {
                columnName: 'pfpmt',
                displayName: <FormattedMessage id="pos.deal.financialquote.services.amount" defaultMessage="Amount"/>,
                customComponent: AmountDisplay,
                customComponentMetadata: {
                    currencycode: this.props.currencyCode,

                }
            }
        ];

        let componentAccesskey = getComponentAccessKeys(this.props.accessKeys, this.props.id);
        const {columns, columnMetadata} = applyAccessKeysOn("griddle", componentAccesskey, {
            defaultColumns,
            defaultColumnMetadata
        })

        var servicesPopup = (<ServicesEditPopup ref="servicesPopup"
                                                existantServices={this.props.rows}
                                                initialSavedServices = {this.props.initialSavedServices}
                                                possibleServices ={this.props.possibleServices}
                                                initialPossibleServices ={this.props.initialPossibleServices}
                                                quoteIndex = {this.props.quoteIndex}
                                                currencyCode={this.props.currencyCode}
                                                dispatch={this.props.dispatch}/>);


        let toolBox = (    <div className="box-tools pull-right">
                            <button type="button" className="btn btn-box-tool" onClick={this.handleEditServices}>
                                <i className="fa fa-edit fa-2x"></i>
                            </button>
                        </div> );
        return (<Box type="primary" id={this.props.id} {...componentAccesskey}
                     title={<FormattedMessage id="pos.deal.financialquote.services.box.title" defaultMessage="Services" />}
                     withBoder="true"  tools={toolBox}>
                {servicesPopup}
                    <Griddle
                        tableClassName="table table-hover"
                        useGriddleStyles={false}
                        results={this.props.rows.filter(item=>item.action!==sharedConst.ACTION_MODE_DELETION)}
                        initialSort='pellibelle'
                        sortAscending={false}
                        columns={columns}
                        columnMetadata={columnMetadata}
                        useCustomPagerComponent={true}
                        customPagerComponent={Pager}
                    />
                </Box>
        )
    }
}
ScaleServices.contextTypes = {
    intl: PropTypes.object.isRequired,
}
export default (injectIntl(ScaleServices));
