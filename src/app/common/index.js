import React from 'react';
import {Route} from 'react-router';
import {FormattedMessage} from 'react-intl';

import users from './users';
import actor from './actor';
import timeline from './timeline';


export const USERS = "/users";
export const TIME_LINES = "/timeline";
export const ACTORS_SEARCH = '/actors';
export const ACTOR = "/actor";

export default {
    menuItems: [
        {
            route: USERS,
            title: <FormattedMessage id="common.menu.myusers" defaultMessage="My users"/>,
            icon: 'fa fa-table'
        },
        {
            route: TIME_LINES,
            title: <FormattedMessage id="common.main.timeline" defaultMessage="Timeline"/>,
            icon: 'fa  fa-calendar-check-o'
        },
        {
            route: ACTORS_SEARCH,
            title: <FormattedMessage id="common.main.myactor" defaultMessage="My actors"/>,
            icon: 'fa fa-user'
        },
    ],

    routes: [
        <Route path={USERS} components={{main: users.components.UsersContainer}} key={USERS}/>,
        <Route path={TIME_LINES} components={{main: timeline.components.GlobalTimeLineContainer}} key={TIME_LINES}/>,
        <Route path={ACTORS_SEARCH} components={{main: actor.components.ActorSearchPage}} key={ACTORS_SEARCH}/>,
        <Route path={ACTOR + "(/:actorId)"} components={{main: actor.components.ActorCreationPage}} key={ACTOR}/>,
    ],

    reducers: {
        users: users.reducer,
        actor: actor.reducer,
        timeline: timeline.reducer,
    }
}

/**
 * here just common features of font and back of KSIOP
 */

