'use strict'
import React from 'react'

import Modal from '../../../../core/components/lib/Modal.js'
import CurrencyEntry from '../../../../core/components/lib/CurrencyEntry.js'
import {FormattedMessage} from 'react-intl';

export default class DepositPopup extends React.Component {
    constructor(props) {
      super(props);
    }    
    
    toggle() {
      this.refs.modal.toggle();
      
      setTimeout(() => {
        this.refs.cost.focus();
      }, 200);
    }
    
    handleSaveEvent() {
      this.refs.modal.toggle();
      
      // Use Redux to change deal state
    }    

    handleResetEvent() {
      this.refs.modal.toggle();
    }    

  
    render() {
        let {currencyCode, ...props} = this.props;
       return (
           <Modal ref="modal" title={<FormattedMessage id="pos.quote.depositpopup.title" defaultMessage="Analysis of advance" />}
                   onReset={event => this.handleResetEvent(event)} 
                   onSave={event => this.handleSaveEvent(event)}>
             <CurrencyEntry currencyCode={currencyCode} title={<FormattedMessage id="pos.quote.depositpopup.cost" defaultMessage="Cost (exc VAT)" />}  ref="cost" />
             <CurrencyEntry currencyCode={currencyCode} title={<FormattedMessage id="pos.quote.cash.cost" defaultMessage="Cash deposit" />}/>
             <CurrencyEntry currencyCode={currencyCode} title={<FormattedMessage id="pos.quote.vat.cost" defaultMessage="VAT on cost" />} />
             <CurrencyEntry currencyCode={currencyCode} title={<FormattedMessage id="pos.quote.netadvance.cost" defaultMessage="Net advance" />}/>
               
           </Modal>       
      );
    }
}
