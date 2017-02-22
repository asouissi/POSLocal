import React, { Component } from 'react'
import Griddle from 'griddle-react'
import Pager from '../../../core/components/lib/Pager'
import {Link} from 'react-router'
import {MYACTOR} from '../../index'

class DateDisplay extends Component {
    render(){
        var strDate = (this.props.data && new
                Date(this.props.data).toLocaleDateString()) || ''
        return (<span>{strDate}</span>)
    }
}

class LinkDisplay extends Component {
    render(){
        let nav = MYACTOR +'/';
        return (<Link to={nav +this.props.rowData.actid}>{this.props.data}</Link>);
    }
}


const columns = ['actid', 'actcode', 'actnom', 'actdtcreat']
const columnMetadata = [
    {columnName: 'actid', displayName: 'Actor ID', customComponent: LinkDisplay},
    {columnName: 'actcode', displayName: 'Actor code'},
    {columnName: 'actnom', displayName: 'Actor name'},
    {columnName: 'actdtcreat', displayName: 'Actor creation date', customComponent: DateDisplay}
]
export default class ActorTable extends Component {
    render() {
        return(
            <Griddle
                results={ this.props.rows }
                columns={ columns }
                columnMetadata={ columnMetadata }
                height={ 500 }
                useCustomPagerComponent='true'
                customPagerComponent={ Pager }
            />
        )
    }
}