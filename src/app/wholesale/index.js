import React from "react";
import {Route, IndexRoute} from "react-router";
import {FormattedMessage} from "react-intl";
import {getAsyncInjectors} from "../core/config/asyncInjector";

export const CREDITLINES = "/wholesale/creditlines";
export const CREDITLINEDETAIL = "/wholesale/creditlines";
export const CONTRACT = "/contract";

const containerLess = (props) => (<div>{props.children}</div>);

export default {
    menuItems: [
        {
            route: CREDITLINES,
            title: <FormattedMessage id="wholesale.creditlines.menu.mycreditlines" defaultMessage="My credit lines"/>,
            icon: 'fa fa-table'
        },

    ],
    /**
     * waring : here we used nested route because of breadcrumbs. Note route(/:id) can not be used because of bd..
     * */

    routes: (store) => {

        const {injectReducer} = getAsyncInjectors(store); //allow hot loading

        return [
            <Route path={CREDITLINES} components={{main: containerLess}}
                   name={<FormattedMessage  id="wholesale.creditlines.breadcrumbs.route.home" defaultMessage="Home"/>}
                   key={CREDITLINES}>

                <IndexRoute getComponent={ (nextState, callback) => {
                                require.ensure([], (require) => {
                                    let component = require("./creditlines/components/CreditlinesContainer");
                                    let reducer = require("./creditlines/reducers/creditLines");
                                    injectReducer("creditLines", reducer.default);
                                    callback(null, component.default)
                                })
                            }}
                />

                <Route path="/import"
                       name={<FormattedMessage  id="wholesale.creditlines.breadcrumbs.route.import" defaultMessage="Import Assets"/>}
                       getComponent={ (nextState, callback) => {
                           require.ensure([], (require) => {
                               let component = require("./creditlines/components/ImportCreditLineDetailContainer");
                               callback(null, component.default)
                           })
                       }}/>

                <Route path=":dosid" component={containerLess}
                       name={<FormattedMessage  id="wholesale.creditlines.breadcrumbs.route.creditline" defaultMessage="Credit line"/>}

                       staticName={true}>
                    <IndexRoute getComponent={ (nextState, callback) => {
                                    require.ensure([], (require) => {
                                        let component = require("./creditlines/components/CreditLineContainer");
                                        callback(null, component.default)
                                    })
                                }}/>
                    />

                    <Route path="contract/:contractId" component={containerLess}
                           name={<FormattedMessage  id="wholesale.creditlines.breadcrumbs.route.asset" defaultMessage="Asset details"/>}
                            staticName={true}>
                        <IndexRoute getComponent={ (nextState, callback) => {
                                        require.ensure([], (require) => {
                                            let component = require("./contracts/components/ContractFormContainer");
                                            let reducer = require("./contracts/reducers/contracts");
                                            injectReducer("contracts", reducer.default);
                                            callback(null, component.default)
                                        })
                                    }}
                        />
                        <Route path="documents"
                               name={<FormattedMessage  id="wholesale.creditlines.breadcrumbs.route.asset.documents" defaultMessage="Documents"/>}
                               getComponent={ (nextState, callback) => {
                                   require.ensure([], (require) => {
                                       let component = require("./contracts/components/ContractDocumentsFormContainer");
                                       let reducer = require("./contracts/reducers/contracts");
                                       injectReducer("contracts", reducer.default);
                                       callback(null, component.default)
                                   })
                               }}
                        />
                        <Route path="settle"
                               name={<FormattedMessage  id="wholesale.creditlines.breadcrumbs.route.asset.settle" defaultMessage="Settle an asset"/>}

                               getComponent={ (nextState, callback) => {
                                   require.ensure([], (require) => {
                                       let component = require("./contracts/components/ContractSettlementFormContainer");
                                       let reducer = require("./contracts/reducers/contracts");
                                       injectReducer("contracts", reducer.default);
                                       callback(null, component.default)
                                   })
                               }}
                        />
                        <Route path="convert"
                               name={<FormattedMessage  id="wholesale.creditlines.breadcrumbs.route.asset.convert" defaultMessage="Convert an asset"/>}

                               getComponent={ (nextState, callback) => {
                                   require.ensure([], (require) => {
                                       let component = require("./contracts/components/ContractConvertFormContainer");
                                       let reducer = require("./contracts/reducers/contracts");
                                       injectReducer("contracts", reducer.default);
                                       callback(null, component.default)
                                   })
                               }}
                        />
                    </Route>

                </Route>
            </Route>
        ]
    }
}