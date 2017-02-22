import React from "react";
import {Route, IndexRoute, Router} from "react-router";
import {getAsyncInjectors} from "./core/config/asyncInjector";
import privateRoute from "./core/privateRoute";
import LandingPage from "./core/LandingPage";
import Dashboard from "./core/dashboards/components/DashboardContainer";
import MainLayout from "./core/components/MainLayout";
import LoginForm from "./core/components/LoginForm";
import DemoPage from "./calculator/DemoPage";
import {screenSizes} from "./core/adminLTE/adminLTE";

export const DEAL = "/pos/deal";
export const QUOTE = "/pos/quote";
export const DASHBOARD = '/dashboard';

function handleOnEnter(state) {
    var body = document.body;
    if (body.clientWidth <= (screenSizes.sm - 1) && body.className.indexOf(" sidebar-open") !== -1) {
        body.className = body.className.replace(' sidebar-open', '');
    }
}

export default (history, onLogout, modules, store) => {
    let  modulesRoutes = modules.map(module => {
        if(typeof module.routes === 'function'  )
            return module.routes(store)
        return module.routes;
    } );
    return (

        <Router history={history} onUpdate={handleOnEnter}>
            <Route path="/" name="app" component={privateRoute(MainLayout)} key="root">
                <IndexRoute components={{main: LandingPage}}/>
                {modulesRoutes}

                <Route path={DASHBOARD + "(/:config)"} components={{main: Dashboard}}/>


            </Route>

            <Route path={"iframe" + DASHBOARD + '(/:config)'} component={privateRoute(Dashboard)} className="skin-cass"
                   key="root.dashboard">
            </Route>

            <Route path="demo" component={DemoPage} key="root.demo"/>
            <Route path="calculator" component={DemoPage} key="root.calculator"/>

            <Route path="logout" onEnter={onLogout} key="root.logout"/>
            <Route path="login" component={LoginForm} key="root.login"/>

        </Router>

    )
};