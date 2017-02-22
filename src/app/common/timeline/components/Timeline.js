'use strict'
import React from 'react';
import {Link} from 'react-router';
import classNames from 'classnames';
import {DEAL, QUOTE} from '../../../../app/router';
import {TIME_LINES} from '../../index';
import  {CREDITLINES} from '../../../wholesale/index';
import {FormattedMessage, FormattedRelative, FormattedDate} from 'react-intl';

const monthsNames = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "June", "July", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."];

export const getImageType = type => {
    switch (type) {
        case 'CHAT' :
            return 'fa-bookmark';

        default:
            return 'fa-user';
    }
};

export const ReadElement = (props) => {
    let cl = props.isNew ? 'fa fa-envelope' : 'fa fa-envelope-o';
    return (
        <span className="read" onClick={() => props.onClick()}>
         <i className={cl}/>
        </span>
    );

};

const emptyDefault = [];

export default class Timeline extends React.Component {
    constructor(props) {
        super(props);

        this.state = {hideGroupTime: new Set()};

        this.itemKey = 0;
        this.itemsWM = new WeakMap();
    }

    handleNewItemClick(event) {
        this.props.onNewItem(event);
    }

    handleReadItemClick(item, isRead) {
        this.props.onReadItem(item, isRead);
    }

    setFocus() {
        if (this.refs.textArea) {
            this.refs.textArea.focus();
            return;
        }

        if (this.refs.newItemButton) {
            this.refs.newItemButton.focus();
            return;
        }
    }

    showHideGroup(groupTime) {
        if (this.state.hideGroupTime.has(groupTime)) {
            this.state.hideGroupTime.delete(groupTime)
        } else {
            this.state.hideGroupTime.add(groupTime)
        }
        this.setState({hideGroupTime: this.state.hideGroupTime});
    }

    render() {
        var props = this.props;
        var state = this.state;

        var cl = {'timeline': true, 'timeline-inverse': true};
        if (this.props.className) {
            this.props.className.split(' ').forEach(className => {
                if (!className) {
                    return;
                }

                cl[className] = true;
            });
        }

        var currentGroup = null;
        var lines = [];

        props.items.sort((i1, i2) => i2.creationdate - i1.creationdate);

        var groupIdx = 0;
        props.items.forEach((item, idx) => {
            var date = item.creationdate;

            var dayDate = new Date(date);
            dayDate.setHours(0, 0, 0, 0);

            var first = false;
            if (!currentGroup || dayDate.getTime() !== currentGroup.dayDate.getTime()) {
                currentGroup = {
                    dayDate
                };
                lines.push(
                    <li className="time-label" key={'group-' + dayDate.getTime()}
                        onClick={() => {
                            this.showHideGroup(dayDate.getTime())
                        }}>
                        <FormattedDate value={dayDate} year='numeric'
                                       month='long'
                                       day='2-digit'/>
                    </li>
                );
            }

            if (this.state.hideGroupTime && this.state.hideGroupTime.has(dayDate.getTime())) return;

            var timelineBody = [];

            if (item.editable) {
                timelineBody.push(
                    <textArea
                        ref='textArea'
                        key='editor'
                        className="timeline-body timeline-editor"
                        onChange={event => {
                            item.comment = event.target.value;
                        }}
                        onBlur={event => {
                            this.props.onSaveNewItem(item)
                        }}
                        placeholder="Enter a new note ...">
                      {item.comment}
                    </textArea>
                );

            } else if (item.comment) {
                var divIdx = 0;
                var ps = item.comment.split('\n').map((t) => <div key={'p-' + (divIdx++)}>{t}</div>);
                timelineBody.push(<div key="comment" className="timeline-body">{ps}</div>);
            }
            if (item.documentURL) {
                timelineBody.push(
                    <div className="timeline-body" key="documentURL">
                        <img className="margin" alt="..." src={item.previewURL || 'http://placehold.it/150x100'}/>
                    </div>
                );
            }

            var hasBody = timelineBody.length > 0;

            var key = this.itemsWM.get(item);
            if (key === undefined) {
                key = this.itemKey++;
                this.itemsWM.set(item, key);
            }
            let cl = {
                'timeline-item': true,
                'timeline-item-new': item.isNew
            }


            let dealLink = emptyDefault;
            if (this.props.showDealInfo) {
                let routes = this.props.menuItems.filter(item => item.visible).map(item => item.route);
                let hasDealRoute = routes.indexOf(DEAL) !== -1;
                let hasQuoteRoute = routes.indexOf(QUOTE) !== -1;
                let hasWSRoute = routes.indexOf(CREDITLINES) !== -1;

                let nav = DEAL + '/' + item.dealid;
                if (hasDealRoute && hasQuoteRoute) {
                    let isDeal = item.dprnom && item.dprnom.indexOf('deal') > -1;
                    nav = isDeal ? DEAL + '/' + item.dealid : QUOTE + '/' + item.dealid;
                } else if (hasQuoteRoute) {
                    nav = QUOTE + '/' + item.dealid;
                }

                dealLink = <Link to={nav}
                                 onClick={() => this.handleReadItemClick(item, true)}>{item.dprnumero + ': ' + item.dprnom}</Link>;
                if (hasWSRoute) {
                    nav = TIME_LINES;
                    dealLink = "";// no deal link in the wholesale
                }
            }

            var eventPhase = (item.description && item.jallibelle) ? item.description + ' - ' + item.jallibelle :
                                                                     (item.description ? item.description : (item.jallibelle ? item.jallibelle : ''));

            let username = item.userfirstname;
            if (item.userlastname) {
                username += ' ' + item.userlastname;
            }
            lines.push(
                <li key={'item-' + key}>
                    <i className={"fa " + getImageType(item.subtype)}/>
                    <div className={classNames(cl)}>

                        <span className="time">
                          <i className="fa fa-clock-o"/>
                          <span>  <FormattedRelative value={date}/></span>
                        </span>

                        <ReadElement isNew={item.isNew} onClick={() => this.handleReadItemClick(item)}/>

                        <h3 className={"timeline-header" + ((hasBody) ? '' : ' no-border')}>
                            {dealLink}
                            <a title={username}
                               className="timeline-header-username">{username}</a>
                            <span>{eventPhase}</span>
                        </h3>

                        {timelineBody}
                    </div>
                </li>
            );
        });

        var newItemButton = emptyDefault;
        if (props.onNewItem) {
            newItemButton = (
                <li className="add-time" key='newItem'>
                    <button className="btn btn-primary" onClick={event => this.handleNewItemClick(event)}
                            ref="newItemButton" title="Add new note">
                        <i className="fa fa-plus"/>
                    </button>
                </li>
            );
        }

        return (
            <ul className={classNames(cl)}>
                {lines}
                <li className="time-label" key='end'>
                    <i className="fa fa-clock-o bg-gray"/>
                </li>
                {newItemButton}
            </ul> );
    }
}
