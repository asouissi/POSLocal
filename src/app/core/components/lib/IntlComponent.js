import React, {Component} from 'react'
import {injectIntl} from 'react-intl';


class IntlComponent extends Component {
    
    render() {
      return (<div></div>);
    }
}

export default injectIntl(IntlComponent)
