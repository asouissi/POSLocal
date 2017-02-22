import React, {Component} from 'react'
import {FormattedDate} from 'react-intl';

export default class DateDisplay extends Component {
    render() {
        return this.props.data && <FormattedDate value={this.props.data}/>;
    }
} 

