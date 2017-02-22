/**
 * Created by zos on 13/06/2016.
 */
'use strict'
import React from 'react'
import {connect} from 'react-redux';


import {getTimeLine} from '../../../common/timeline/reducers/actions'
import Timeline from '../../../common/timeline/components/Timeline';

import {saveItem, readItem} from '../../../common/timeline/reducers/actions'
import {timelineSelector} from '../../../common/timeline/TimelineSelector'


class GenericTimeline extends React.Component {


    componentWillReceiveProps(nextProps) {

        if (this.props.dosid !== nextProps.dosid
            || this.props.dosid && !this.timeLineInterval) {
            this.startTimeLinePoll(nextProps.dosid);

            if (!nextProps.dosid) {
                this.props.dispatch(getTimeLine());
            }
        }
    }


    componentWillMount() {
        let dealId = this.props.dosid;
        this.props.dispatch(getTimeLine(dealId));
    }

    startTimeLinePoll(dealId) {
        this.stopTimeLinePoll();
        if (dealId) {
            this.props.dispatch(getTimeLine(dealId));
            this.timeLineInterval = setInterval(() => this.props.dispatch(getTimeLine(dealId)), 1000 * 30);
        }
    }

    stopTimeLinePoll() {
        if (this.timeLineInterval) {
            clearInterval(this.timeLineInterval);
            this.timeLineInterval = undefined
        }
    }

    componentWillUnmount() {
        this.stopTimeLinePoll();
    }

    constructor(props) {
        super(props);

        this.state = {
            items: [{
                creationdate: new Date(2016, 1, 11, 17, 27),
                subtype: 'sort-numeric-asc',
                userfirstname: 'DEALER1',
                description: 'Generate contract number'
            }, {
                creationdate: new Date(2016, 1, 3, 8, 0),
                subtype: 'bank',
                userfirstname: 'DEALER1',
                description: 'Transfer into Back Office'
            }, {
                creationdate: new Date(2016, 0, 3, 18, 0),
                subtype: 'user',
                userfirstname: 'DEALER1',
                description: 'Submit for approval',
                comment: 'Net Advance: £ 20,000\nStandard rate: 3.2%\nPayment: 36 months, £ 2,000'
            }, {
                creationdate: new Date(2016, 0, 3, 16, 0),
                subtype: 'file',
                userfirstname: 'Mina Lee',
                description: 'uploaded new document',
                documentURL: 'http://www.google.fr',
                previewURL: 'img/types/pdf.png'
            }, {
                creationdate: new Date(2015, 11, 22, 14, 0),
                subtype: 'money',
                userfirstname: 'DEALER1',
                description: 'Promote to deal'
            }, {
                creationdate: new Date(2015, 11, 2, 10, 0),
                subtype: 'money',
                userfirstname: 'DEALER1',
                description: 'New opportunity'
            }]
        };
    }

    handleNewItem = (event) => {
        this.setState((state) => {
            var items = state.items;

            items.forEach(item => item.editable = false);

            items.unshift({
                dealid: this.props.dosid,
                creationdate: new Date().getTime(),
                type: 'TASK',
                subtype: 'CHAT',
                userfirstname: 'Me',
                description: 'Note',
                editable: true
            });

            setTimeout(() => {
                this.refs.timeline.setFocus();
            }, 200);

            return {items: items};
        });
    }

    handleSaveItem = (item) => {
        this.state.items.shift();
        delete item.editable;
        item.userfirstname = this.props.user.firstname;
        item.userlastname = this.props.user.lastname;
        item.usercode = this.props.user.uticode;

        this.props.dispatch(saveItem(item))
    }

    handleReadItem = (item) => {
        this.props.dispatch(readItem(item, item.dealid));
    }

    render() {
        let items = _.union(this.props.timeLine, this.state.items);
        var dosid = this.props.dosid;
        var timelineBody = (
            <Timeline items={items}
                      onNewItem={this.handleNewItem}
                      onSaveNewItem={this.handleSaveItem}
                      onReadItem={this.handleReadItem}
                      ref="timeline"/>);
        return timelineBody;

    }


}

const makeMapStateToProps = () => {
    const getTimeLine = timelineSelector();

    const mapStateToProps = (state, props) => ({
        user: state.authentication.user,
        timeLine: getTimeLine(state.timeline.deal, props)
    });

    return mapStateToProps;

}

export default connect(
    makeMapStateToProps
)(GenericTimeline);