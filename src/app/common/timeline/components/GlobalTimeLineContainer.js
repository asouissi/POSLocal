import React from 'react'
import {connect} from 'react-redux';

import Timeline from './Timeline';
import DateEntry from '../../../core/components/lib/DateEntry'
import { getGlobalTimeLine, readItem } from '../reducers/actions'
import { timelineSelector } from '../TimelineSelector'
import {FormattedMessage} from 'react-intl';


export class GlobalTimeLineContainer extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            startDateTime: new Date().getTime(),
            maxCount: 10
        }
    }

    componentWillMount(){
        this.props.dispatch(getGlobalTimeLine('page', this.state.startDateTime, this.state.maxCount));
    }

    handleStartDateChanged = (event) => {
        this.setState.startDateTime = event.target.value;
        this.props.dispatch(getGlobalTimeLine('page',event.target.value, this.state.maxCount));
    }

    handleSeeMore = () => {
        let maxCount = this.state.maxCount+=10;
        this.props.dispatch(getGlobalTimeLine('page',this.state.startDateTime, maxCount));
    };

    handleReadItem = (item, isRead) => {
        this.props.dispatch(readItem(item, 'page', isRead));
    };

    render() {
        return (
            <div className="global-timeline">
                <div className="global-timeline-parameter row">
                    <div className="col-md-2">
                    <DateEntry title={<FormattedMessage id="common.timeline.global.startdate" defaultMessage="Start date" />}
                               date={this.state.startDateTime}
                               onChange={this.handleStartDateChanged}  />
                        </div>
                </div>
                <Timeline ref="globalTimeline" items={this.props.timeLine} menuItems={this.props.menuItems}
                          showDealInfo={true}
                          onReadItem={this.handleReadItem}/>
                <button className="btn global-timeline-more" onClick={this.handleSeeMore}><FormattedMessage id="common.timeline.global.seemore" defaultMessage="See more..." /></button>
            </div>
        )
    }
}


const makeMapStateToProps = () => {
    const getTimeLine = timelineSelector();
    const mapStateToProps = (state) => ({
        timeLine: getTimeLine(state.timeline.page),
        menuItems: state.navigation.menuItems
    })

    return mapStateToProps;
};

export default connect(makeMapStateToProps)
(GlobalTimeLineContainer);