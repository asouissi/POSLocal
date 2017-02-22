'use strict'
import IntegerEntry from './IntegerEntry'

export default class FormattedInteger extends IntegerEntry {

    getClassName() {
      return "formatted-integer";
    }

    isReadOnly() {
      return true;
    }

}
