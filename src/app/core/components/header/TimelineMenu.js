import React from 'react'
import {Link} from 'react-router';

import classNames from 'classnames';
import { getImageType } from '../../../common/timeline/components/Timeline'
import {DEAL, QUOTE} from '../../../../app/router';
import {TIME_LINES} from '../../../common/index';
import  {CREDITLINES} from '../../../wholesale/index';
import {FormattedMessage, FormattedRelative} from 'react-intl';

export default class TimeLineDropdownMenu extends React.Component {
    
    render() {
        let  onReadItem =  this.props.onReadItem;
        var timeLineList = this.props.timeline.map((item, iterator) =>{
            
            let cl = {
                'timeline-item': true,
                'timeline-item-new' : item.isNew
            };

            let routes = this.props.menuItems.filter(item => item.visible).map(item => item.route)
            let hasDealRoute = routes.indexOf(DEAL) !== -1;
            let hasQuoteRoute = routes.indexOf(QUOTE) !== -1;
            let hasWSRoute = routes.indexOf(CREDITLINES) !== -1;

            let nav =  DEAL+'/';
            if(hasDealRoute && hasQuoteRoute){
                let isDeal = item.dprnom && item.dprnom.indexOf('deal') > -1;
                nav = isDeal  ? DEAL+'/'+item.dealid : QUOTE+'/'+item.dealid;
            } else if (hasQuoteRoute) {
                nav = QUOTE+'/' +item.dealid;
            }
            if(hasWSRoute){
                nav = TIME_LINES;
            }

            var error = item.haserror ? ' error' : '';

            return (
                <li key={iterator} className={classNames(cl)}>
                    <Link to={nav} onClick={() =>{if(item.isNew) onReadItem(item, true)}} >
                        <div className="pull-left">
                            <i className={"fa " + getImageType(item.subtype) + error }/>
                        </div>
                        <h4>
                            {item.userfirstname+' '+(item.userlastname || '')}
                            <small><i className="fa fa-clock-o"></i> <FormattedRelative value={item.creationdate} /></small>
                        </h4>
                        <p>{item.description}</p>
                    </Link>
                </li>
            )
        });
        
        return (
            <ul className="dropdown-menu timeline-menu">
                <li className="header">
                    <FormattedMessage id="core.header.timeline.numbermessage" defaultMessage="You have {number} new messages" values={{number: this.props.nbNewTimeline.toString()}}/>
                </li>
                <li>
                    <ul className="menu">
                        {timeLineList.slice(0,5)}
                    </ul>
                </li>
                <li className="footer">
                    <Link to={TIME_LINES}>
                    <FormattedMessage id="core.header.timeline.seeall"  defaultMessage="See all items"/>
                    </Link>
                </li>
            </ul>
        );
    }
}