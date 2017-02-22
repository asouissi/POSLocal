import React from 'react';
import {Route} from 'react-router';
import {FormattedMessage} from 'react-intl';
import {getAsyncInjectors} from "../core/config/asyncInjector";
import {enableBatching} from 'redux-batched-actions';

export const DEALS = "/pos/deals";
export const DEAL = "/pos/deal";
export const QUOTE = "/pos/quote";
export const DRAWNDEAL = "/pos/draw";
export const MFDEAL = "/pos/masterfacility";

export const DRIVERS = "/pos/drivers";
export const DRIVER = "/pos/driver";

export const CONTRACTS = "/pos/contracts"
export const DOCUMENTS = "/pos/documents";

export const SOLVER = "/pos/solver";
export const SOLVER_IFRAME = "/pos/solver-iframe(/:skin)"; //todo Add all the portals in a common route to add the skin
export const UPLOAD_DOCS = "/pos/upload-docs(/:dealId/:token)"; //todo Add all the portals in a common route to add the skin


export default {

    menuItems: [
        {
            route: CONTRACTS,
            title: <FormattedMessage id="common.menu.mycontracts" defaultMessage="My contracts"/>,
            icon: 'fa fa-table'
        },
        {route: DEALS, title: <FormattedMessage id="pos.menu.mydeals" defaultMessage="My deals"/>, icon: 'fa fa-table'},
        {
            route: DEAL,
            title: <FormattedMessage id="pos.menu.newdeal" defaultMessage="New deal"/>,
            icon: 'fa fa-files-o'
        },
        {
            route: QUOTE,
            title: <FormattedMessage id="pos.menu.newquote" defaultMessage="New quote"/>,
            icon: 'fa fa-files-o'
        },
        {
            route: MFDEAL,
            title: <FormattedMessage id="pos.menu.masterfacility" defaultMessage="New master facility"/>,
            icon: 'fa fa-files-o'
        },

        {
            route: DRIVERS,
            title: <FormattedMessage id="pos.menu.mydrivers" defaultMessage="My drivers"/>,
            icon: 'fa fa-car'
        },
        {
            route: DOCUMENTS,
            title: <FormattedMessage id="pos.menu.mydocuments" defaultMessage="My documents"/>,
            icon: 'fa fa-files-o'
        },

        {route: SOLVER, title: <FormattedMessage id="pos.menu.solver" defaultMessage="Solver"/>, icon: 'fa fa-files-o'},
    ],

    routes: (store) => {

        const {injectReducer} = getAsyncInjectors(store); //allow hot loading
        return [
            //My deals
            <Route path={DEALS} key={DEALS}
                   getComponents={ (nextState, callback) => {
                       require.ensure([], (require) => {
                           let component = require("./deals/components/DealsContainer");
                           let reducer = require("./deals/reducers/deals");
                           injectReducer("deals", enableBatching(reducer.default));
                           callback(null, {main: component.default})
                       })
                   }}
            />,

            //new deal
            <Route path={DEAL + "(/:dealid)"} key={DEAL}
                   getComponents={ (nextState, callback) => {
                       require.ensure([], (require) => {
                           let component = require("./deal/newdeal/components/NewDealContainer");
                           let reducer = require("./deal/newdeal/reducers/newdeal");
                           let reducerAttachments = require("./deal/attachments/reducers/attachmentsReducer");
                           injectReducer(
                               {name: "newdeal", reducer: reducer.default},
                               {name: "attachmentsReducer", reducer: reducerAttachments.default});
                           callback(null, {main: component.default})
                       })
                   }}
            />,

            //new Laster facility
            <Route path={MFDEAL} key={MFDEAL}
                   getComponents={ (nextState, callback) => {
                       require.ensure([], (require) => {
                           let component = require("./deal/newdeal/components/NewDealContainer");
                           let reducer = require("./deal/newdeal/reducers/newdeal");
                           let reducerAttachments = require("./deal/attachments/reducers/attachmentsReducer");
                           injectReducer(
                               {name: "newdeal", reducer: reducer.default},
                               {name: "attachmentsReducer", reducer: reducerAttachments.default});
                           callback(null, {main: component.default})
                       })
                   }}
            />,

            //new Quote
            <Route path={QUOTE + "(/:dealid)"} key={QUOTE}
                   getComponents={ (nextState, callback) => {
                       require.ensure([], (require) => {
                           let component = require("./deal/newdeal2/components/NewDeal2Container");
                           let reducer = require("./deal/newdeal2/reducers/newdeal2");
                           let reducerAttachments = require("./deal/attachments/reducers/attachmentsReducer");
                           injectReducer(
                               {name: "newdeal2", reducer: reducer.default},
                               {name: "attachmentsReducer", reducer: reducerAttachments.default});
                           callback(null, {main: component.default})
                       })
                   }}
            />,

            //draw deal
            <Route path={DRAWNDEAL + "(/:dealid)"} key={DRAWNDEAL}
                   getComponents={ (nextState, callback) => {
                       require.ensure([], (require) => {
                           let component = require("./deal/newdeal3/components/NewDeal3Container");
                           let reducer = require("./deal/newdeal3/reducers/newdeal3");
                           let reducerAttachments = require("./deal/attachments/reducers/attachmentsReducer");
                           injectReducer(
                               {name: "newdeal3", reducer: reducer.default},
                               {name: "attachmentsReducer", reducer: reducerAttachments.default});
                           callback(null, {main: component.default})
                       })
                   }}
            />,

            //drivers
            <Route path={DRIVER + "(/:actorId)"}
                   key={DRIVER}
                   getComponents={ (nextState, callback) => {
                       require.ensure([], (require) => {
                           let component = require("./deal/newdeal3/components/DriverCreationForm");
                           //actor reducer
                           callback(null, {main: component.default})
                       })
                   }}
            />,


            <Route path={DRIVERS} key={DRIVERS}
                   getComponents={ (nextState, callback) => {
                       require.ensure([], (require) => {
                           let component = require("./deal/newdeal3/components/Drivers");
                           let reducer = require("./deal/newdeal3/reducers/newdeal3"); //maybe use a different reducer
                           injectReducer("newdeal3", reducer.default);
                           callback(null, {main: component.default})
                       })
                   }}
            />,
            <Route path={CONTRACTS} key={CONTRACTS}
                   getComponents={ (nextState, callback) => {
                       require.ensure([], (require) => {
                           let component = require("./contracts/components/contractsContainer"); // add maj to Class
                           let reducer = require("./contracts/reducers/contracts"); //maybe use a different reducer
                           injectReducer("contractsList", reducer.default); //maybe rename this reducer
                           callback(null, {main: component.default})
                       })
                   }}
            />,
            <Route path={DOCUMENTS} key={DOCUMENTS}
                   getComponents={ (nextState, callback) => {
                       require.ensure([], (require) => {
                           let component = require("./documents/components/DocumentsContainer");
                           let reducer = require("./documents/reducers/documents"); //maybe use a different reducer
                           injectReducer("documents", reducer.default); //maybe rename this reducer
                           callback(null, {main: component.default})
                       })
                   }}
            />,

            <Route path={SOLVER} key={SOLVER}
                   getComponents={ (nextState, callback) => {
                       require.ensure([], (require) => {
                           let component = require("./solver/components/SolverContainer");
                           let reducer = require("./solver/reducers/solver"); //maybe use a different reducer
                           injectReducer("solver", reducer.default); //maybe rename this reducer
                           callback(null, {main: component.default})
                       })
                   }}
            />,
            <Route path={SOLVER_IFRAME} key={SOLVER_IFRAME} hideMenu={true} guestUser={true} portal={true}
                   getComponents={ (nextState, callback) => {
                       require.ensure([], (require) => {
                           let component = require("./solver/components/SolverContainer");
                           let reducer = require("./solver/reducers/solver"); //maybe use a different reducer
                           injectReducer("solver", reducer.default); //maybe rename this reducer
                           callback(null, {main: component.default})
                       })
                   }}
            />,
            <Route path={UPLOAD_DOCS} key={UPLOAD_DOCS} hideMenu={true} guestUser={true} portal={true}
                   getComponents={ (nextState, callback) => {
                       require.ensure([], (require) => {
                           let component = require("./deal/attachments/components/PhotoDialog");
                           let reducer = require("./deal/attachments/reducers/attachmentsReducer"); //maybe use a different reducer
                           injectReducer("attachmentsReducer", reducer.default); //maybe rename this reducer
                           callback(null, {main: component.default})
                       })
                   }}
            />,
        ]
    }
}