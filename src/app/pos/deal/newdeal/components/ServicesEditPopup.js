import React, {Component, PropTypes} from "react";
import Griddle from "griddle-react";
import {Checkbox} from "react-bootstrap";
import Modal from "../../../../core/components/lib/Modal";
import {FormattedMessage} from "react-intl";
import {setServiceAction, resetPossibleServices} from "../reducers/actions";
import * as sharedConst from "../../../../core/utils/sharedUtils";
import {change} from "redux-form";
import Pager from "../../../../core/components/lib/Pager";
import {AmountDisplay} from "../../../../core/components/lib/CustomGriddle";

export const COL1 = 'ppeflagauto';
export const COL2 = 'pellibelle';
export const COL3 = 'pfpmt';


class CheckBoxDisplay extends Component {

    render() {
        return <Checkbox checked={this.props.data===true} onChange={(event) => this.props.metadata.customComponentMetadata.handleCheckBoxClick(this.props.rowData.pelid, !this.props.data)}/>
    }
}

export default class ServicesEditPopup extends Component {
    handleClose = () => {
    }
    handleCheckBoxClick = (pelid, checked) =>{
            this.props.dispatch(setServiceAction(pelid, checked));
    }
    handleResetEvent = () => {
        this.props.dispatch(resetPossibleServices(this.props.initialPossibleServices));
    }
    handleSaveServices = () => {
        this.refs.modal.toggle();
        let finalServices = [];

        let dealServices = this.props.initialSavedServices;

        let updateServices =  this.props.possibleServices;

        let maxPfpOrdre = dealServices.length> 0 ? Math.max(...dealServices.map(o => o.pfpordre)) : 0;

        updateServices.forEach(service =>{
            let existantService = dealServices.find(item => item.pelid === service.pelid);

            // if there is already the service on the quote and the flag is false, then delete it
            if( existantService){
                if(service.ppeflagauto===false){
                    let updatedService = existantService.set('action', sharedConst.ACTION_MODE_DELETION);
                    finalServices.push(updatedService);
                }else{
                    finalServices.push(existantService);
                }

            }else{
                // if there is not the service on the quote and the flag is true, then insert it
                if( service.ppeflagauto===true){
                    maxPfpOrdre++;
                    let newService = service.merge({action : sharedConst.ACTION_MODE_INSERTION, pfpordre:maxPfpOrdre});
                    finalServices.push(newService);
                }
            }


        });
        this.props.dispatch(change('dealForm', 'deal.listdealquote[' + this.props.quoteIndex + '].listdealquoteservice', finalServices));
    }

    toggle() {
        this.refs.modal.toggle();
    }

    render() {
        const columns = [COL1, COL2, COL3];
        const columnMetadata = [
            {
                columnName: COL1,
                displayName: <FormattedMessage id="pos.deal.financialquote.services.choice" defaultMessage="Choice"/>,
                customComponent: CheckBoxDisplay,
                customComponentMetadata: {
                    handleCheckBoxClick: this.handleCheckBoxClick
                }
            },
            {
                columnName: COL2,
                displayName: <FormattedMessage id="pos.deal.financialquote.services.name"/>
            },
            {
                columnName: COL3,
                displayName: <FormattedMessage id="pos.deal.financialquote.services.amount"/>,
                customComponent: AmountDisplay,
                customComponentMetadata: {
                    currencycode: this.props.currencyCode,

                }
            }
        ];

        let allServicesGriddle = ( <Griddle
                                    tableClassName="table table-hover"
                                    useGriddleStyles={false}
                                    results={this.props.possibleServices}
                                    initialSort='pellibelle'
                                    sortAscending={false}
                                    columns={columns}
                                    columnMetadata={columnMetadata}
                                    useCustomPagerComponent={true}
                                    customPagerComponent={Pager}
                                    /> );

        return (
            <Modal ref="modal"  title={<FormattedMessage id="pos.deal.financialquote.services.popup" defaultMessage="Services edition"/>}
                   onSave={this.handleSaveServices} saveLabel={<FormattedMessage id="pos.deal.financialquote.services.Apply" defaultMessage="Apply"/>}
                   onReset={this.handleResetEvent}
                   onClose={this.handleClose}>
                {allServicesGriddle}

            </Modal>);

    }

}