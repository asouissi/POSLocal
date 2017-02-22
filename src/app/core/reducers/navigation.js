import { LOCATION_CHANGE } from 'react-router-redux'

import {CONFIGURATON_SUCCESS} from './authentication';
export const FETCH_DASHBOARDS = 'navigation/dashboard/FETCH';
export const FETCH_DASHBOARDS_SUCCESS = 'navigation/dashboard/FETCH_SUCCESS';
export const FETCH_DASHBOARDS_FAIL = 'navigation/dashboard/FETCH_FAIL';

export const DASHBOARD = '/dashboard';

const initialState = {
    //set by app.js
};

// Reducer
export default function navigationReducer(state = initialState, action) {
    switch (action.type) {

        case FETCH_DASHBOARDS_SUCCESS:
            var dashboards = action.result.data.dashboards;
            
            return {
                ...state,
                menuItems: state.menuItems.map(menuItem => {
                    if(menuItem.route != DASHBOARD) return menuItem;
                       if(menuItem.active){
                           dashboards[0].active = true; //not good
                       }
                    return {...menuItem,visible: dashboards != null && dashboards.length , subItems: dashboards};
                })
            };

        //need refactor
        case LOCATION_CHANGE:
            var locationAction = action.payload.action;
            if(locationAction === "POP"){
                return state

            }
            var route = action.payload.pathname;
            
            if (route === '/'){
                route = DASHBOARD + '/main';
            }
           
            return {
                ...state,
                menuItems: state.menuItems.map(menuItem => {

                    if(menuItem.subItems) {
                        let subItems=  menuItem.subItems.map((item) =>{
                            let subRoute = menuItem.route + (item.route || '/'+item.id);
                            if( item.active !== (subRoute === route)){
                                return {...item, active: subRoute === route}
                            }
                            return item;
                        });

                        let routedb = '/' + route.split('/')[1];
                        return {...menuItem, active:  routedb === menuItem.route, subItems: subItems}
                    }

                    let acitve = route === menuItem.route;
                    if(acitve !== menuItem.active) {
                        return {...menuItem, active: acitve }
                    }
                    return menuItem;
                })
            };
        
        case CONFIGURATON_SUCCESS:
            var accesskeys = action.result.data.accesskeys;
            return {
                ...state,
                menuItems: state.menuItems.map(menuItem => {
                    let accessKey = accesskeys.find(accessKey => accessKey.key === menuItem.route);
                    if (accessKey) return {...menuItem, visible: accessKey.visible};
                    return menuItem;
                }),
            };
        default:
            return state;
    }
}

//action
export function fetchDashboards() {
    var url = '/dashboards';
    return {
        types: [FETCH_DASHBOARDS, FETCH_DASHBOARDS_SUCCESS, FETCH_DASHBOARDS_FAIL],
        promise: (client) => client.get(url)
    };
}