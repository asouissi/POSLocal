'use strict'
import NumberEntry from './NumberEntry'

export default class FormattedNumber extends NumberEntry {

  getClassName() {
    return "formatted-number";
  }

  isReadOnly() {
    return true;
  }
}
