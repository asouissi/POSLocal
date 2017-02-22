'use strict'

import CurrencyEntry from './CurrencyEntry'

export default class FormattedCurrency extends CurrencyEntry {
    
    getClassName() {
      return "formatted-currency";
    }

    isReadOnly() {
      return true;
    }

}
