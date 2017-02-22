import React from 'react'
import {FormattedMessage} from 'react-intl';
import IntlComponent from '../../components/lib/IntlComponent'

export class DashboardItem extends IntlComponent {

    constructor(props, context) {
        super(props, context);
    }

    render() {
        var item = this.props.item;
		var progressIcon = "";
		if (item.progress > 0) {
			progressIcon = <span className={"fa fa-long-arrow-up kpi-item-progress"} />;
		} else if (item.progress < 0) {
			progressIcon = <span className={"fa fa-long-arrow-down kpi-item-progress"} />;
		}

        let {formatMessage, formatNumber, formats} = this.context.intl;

        let style = item.style ==='currency' ? formats.number.currencyFormat : {style: item.style};
        return (
            <div className={"kpi-item small-box color-"+item.type}>
                <div className="inner">
                    <h3>{progressIcon}{formatNumber(item.number, style)}</h3>
                    <p>{formatMessage({id: item.title, defaultMessage: item.title})}</p>
                </div>
                <div className="icon"><span className={"fa "+item.icon}/></div>
                <a className="small-box-footer" href={item.link}>
                    <FormattedMessage id="core.dashboard.kpi.viewdetails" defaultMessage="View details"/>
                    <span className="fa fa-arrow-circle-right"/>
                </a>
            </div>
        );
    }
}

export class DashboardItem2 extends IntlComponent {

    constructor(props, context) {
        super(props, context);
    }

    render() {
        var item = this.props.item;
        let {formatMessage, formatNumber} = this.context.intl;
        return (
			<div className="info-box">
				<a className="small-box-footer" href={item.link}>
					<span className={"info-box-icon color-"+item.type}><i className={"fa "+item.icon}></i></span>
				</a>
				<div className="info-box-content">
					<span className="info-box-text">{formatMessage({id: item.title, defaultMessage: item.title})}</span>
					<span className="info-box-number">{item.number}<small>%</small></span>
				</div>
          </div>            
        );
    }
}
