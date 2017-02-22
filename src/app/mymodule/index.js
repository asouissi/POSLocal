import React from 'react'
import { Route } from 'react-router'
export const MYACTOR = "mymodule/actor"
import myactor from './actor'
export default {
    menuItems: [
        {
            route: MYACTOR,
            title: "My module actors",
            icon: 'fa fa-user',
            visible: true
        }
    ],
    routes: [
        <Route path={ MYACTOR } components={ {
            main:myactor.components.ActorContainer } }></Route>,
        <Route path={ MYACTOR+"/:actid" } components={ {
            main:myactor.components.ActorDetail } }></Route>,
    ],
    reducers: {
        myactor: myactor.reducer
    }
}