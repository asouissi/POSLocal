import React from "react";
import {Route} from "react-router";
import {getAsyncInjectors} from "../core/config/asyncInjector";
import quote from "./quote";

export const PORTALQUOTE = "/portal/quote(/:skin)";

export default {
    //routes with hideMenu={true}
    routes: (store) => {

        const {injectReducer} = getAsyncInjectors(store); //allow hot loading
        return [
            <Route path={PORTALQUOTE} key={PORTALQUOTE} hideMenu={true} guestUser={true}
                   getComponents={ (nextState, callback) => {
                       require.ensure([], (require) => {
                           let reducerAttachments = require("../pos/deal/attachments/reducers/attachmentsReducer");
                           injectReducer(
                               {name: "portalquote", reducer: quote.reducer},
                               {name: "attachmentsReducer", reducer: reducerAttachments.default}
                           );
                           callback(null, {main: quote.components.PortalQuoteContainer})
                       })
                   }}
            />,
        ]
    }
}