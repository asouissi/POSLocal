'use strict'
import NumberEntry from './NumberEntry'

export default class IntegerEntry extends NumberEntry {

  getNumberOfDigitAfterDecimal() {
    return 0;
  }

  getClassName() {
    return this.props.className+" integer-entry";
  }
}
