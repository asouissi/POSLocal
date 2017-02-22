import React, {Component} from 'react';
import {FormattedMessage} from 'react-intl';
import actor from '../../../../common/actor';

import {DRIVER} from '../index'
const ActorCreationPage = actor.components.ActorCreationPage;

export default class MyDrivers extends Component {
    
    render () {
        //params are throw to keep route actorId
        return (<ActorCreationPage title={<FormattedMessage id="pos.drawdeal.driver.creation.title" defaultMessage="Edit driver" />}
                                   { ...this.props} rolcode="DRIVER"/>)
    }
}