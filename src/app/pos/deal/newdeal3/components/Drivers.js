import React, {Component} from 'react';
import {hashHistory} from 'react-router';
import actor from '../../../../common/actor';
import {FormattedMessage} from 'react-intl';


import {DRIVER} from '../../../index'
const ActorSearchContainer = actor.components.ActorSearchContainer;

const TABLE_MIN_HEIGHT = 450;

export default class MyDrivers extends Component {

    onNewDriverclick = () => {
        hashHistory.push(DRIVER)
    };

    onDriverSelected = (actor) => {
        hashHistory.push(DRIVER + '/' + actor.actid)
    };

    render() {
        let gridBodyHeight = Math.max($(window).height()-260, TABLE_MIN_HEIGHT);

        return (<ActorSearchContainer
            title={<FormattedMessage id="pos.drawdeal.drivers.title" defaultMessage="Search driver" />}
            gridBodyHeight={gridBodyHeight}
            rolcodes={["DRIVER", "DRIVER2"]}
            onActorCreationClick={this.onNewDriverclick}
            onActorClick={this.onDriverSelected}/>)
    }
}
