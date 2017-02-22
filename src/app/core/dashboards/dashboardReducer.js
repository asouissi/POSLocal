import isArray from 'lodash/isArray'
import Immutable from 'seamless-immutable';

export const DEFAULT_DASHBOARD_ID = "MAIN";
export const DASHBOARD_EDITOR_ID = "$EDITOR$";

// Action names
export const FETCH_LAYOUT = 'dashboard/layout/FETCH';
export const FETCH_LAYOUT_SUCCESS = 'dashboard/layout/FETCH_SUCCESS';
export const FETCH_LAYOUT_FAIL = 'dashboard/layout/FETCH_FAIL';

export const FETCH_ITEM = 'dashboard/item/FETCH';
export const FETCH_ITEM_SUCCESS = 'dashboard/item/FETCH_SUCCESS';
export const FETCH_ITEM_FAIL = 'dashboard/item/FETCH_FAIL';

export const DRILL_UP = 'dashboard/drill/UP';

export const PARAM_CHANGE = 'dashboard/param/CHANGE';
export const PARAM_RESET = 'dashboard/param/RESET';

export const FETCH_CONFIG = 'dashboard/config/FETCH';
export const FETCH_CONFIG_SUCCESS = 'dashboard/config/FETCH_SUCCESS';
export const FETCH_CONFIG_FAIL = 'dashboard/config/FETCH_FAIL';

export const LAYOUT_UPDATE = '/dashboard/layout/CHANGED';

export const BEGIN_DRAG = '/dashboard/drag/BEGIN';
export const END_DRAG = '/dashboard/drag/END';

export const LOAD_LAYOUT = '/dashboard/layout/LOAD';


var itemKeyCounter = Date.now();

const MOCK = [{
    "url": "/charts/KPIDEALINPROGRESS",
    "layoutClass": "col-md-3 col-xs-6"
}, {
    "url": "/charts/KPICOMMISSION",
    "layoutClass": "col-md-3 col-xs-6"
}, {
    "url": "/charts/KPIPROPOSALATTENTION",
    "layoutClass": "col-md-3 col-xs-6"
}, {
    "url": "/charts/KPIRENEGOCIATION",
    "layoutClass": "col-md-3 col-xs-6"
}, {
    "url": "/charts/DEALINPROGRESS",
    "layoutClass": "col-md-4"
}, {
    "url": "/charts/COMMISSIONPERMONTH",
    "layoutClass": "col-md-4"
}, {
    "url": "/charts/SALESPERMONTH2",
    "layoutClass": "col-md-4"
}, {
    "url": "/charts/CONTACTLIST",
    "layoutClass": "col-md-4"
}, {
    "url": "/charts/HTMLCASSIOPAE",
    "layoutClass": "col-md-8"
}];


const MOCK_EDITOR =
    [
        {
            "title": "PAV4_GENERIC_POS_DASHBOARD.LAYOUT_EDITOR.Numbers",
            "subTitle": "PAV4_GENERIC_POS_DASHBOARD.LAYOUT_EDITOR.NumbersSubTitle",
            "items": [
                {
                    "title": "PAV4_GENERIC_POS_CHART.F_KPIDEALINPROGRESS.DealsInProgress",
                    "url": "/charts/KPIDEALINPROGRESS",
                    "layoutClass": "col-md-3 col-xs-6"
                    ,"description": "This chart will show the number of deals in progress and an arrow showing the overall progress."

                },
                {
                    "title": "PAV4_GENERIC_POS_CHART.F_KPICOMMISSION.CommissionThisMonth",
                    "url": "/charts/KPICOMMISSION",
                    "layoutClass": "col-md-3 col-xs-6"
                    ,"description": "This chart will show your current commissions for this month."

                },
                {
                    "title": "PAV4_GENERIC_POS_CHART.F_KPIPROPOSALATTENTION.ProposalNeedYourAttention",
                    "url": "/charts/KPIPROPOSALATTENTION", "layoutClass": "col-md-3 col-xs-6"
                },
                {
                    "title": "PAV4_GENERIC_POS_CHART.F_KPIRENEGOCIATION.RenegociationRequests",
                    "url": "/charts/KPIRENEGOCIATION",
                    "layoutClass": "col-md-3 col-xs-6"
                }
            ]
        },
        {
            "title": "PAV4_GENERIC_POS_DASHBOARD.LAYOUT_EDITOR.Charts",
            "subTitle": "PAV4_GENERIC_POS_DASHBOARD.LAYOUT_EDITOR.ChartsSubtitle",
            "items": [
                {
                    "title": "PAV4_GENERIC_POS_CHART.F_DEALINPROGRESS.ProposalStageAmountAsPercentageOfPipeline",
                    "url": "/charts/DEALINPROGRESS",
                    "layoutClass": "col-md-4"
                    ,"description": "This chart display a pie based on your current deals. Each sector represents the stages of the pipeline. You can drill into data by clicking a sector."

                },
                {
                    "title": "PAV4_GENERIC_POS_CHART.F_COMMISSIONPERMONTH.CommissionsPerMonth",
                    "url": "/charts/COMMISSIONPERMONTH",
                    "layoutClass": "col-md-4"
                    ,"description": "This chart display all your commissions month by month"

                },
                {
                    "title": "PAV4_GENERIC_POS_CHART.F_SALESPERMONTH2.SalesPerMonth",
                    "url": "/charts/SALESPERMONTH2",
                    "layoutClass": "col-md-4"
                }
            ]
        },
        {
            "title": "PAV4_GENERIC_POS_DASHBOARD.LAYOUT_EDITOR.Corporate",
            "subTitle": "PAV4_GENERIC_POS_DASHBOARD.LAYOUT_EDITOR.CorporateSubTitle",
            "items": [
                {
                    "title": "PAV4_GENERIC_POS_CHART.F_CONTACTLIST.ContactList",
                    "url": "/charts/CONTACTLIST",
                    "layoutClass": "col-md-4"
                    ,"description": "This chart display your contact in our organization."

                },
                {
                    "title": "News from the Front",
                    "url": "/charts/HTMLCASSIOPAE",
                    "layoutClass": "col-md-8"
                    ,"description": "This chart will show the latest Cassiopae news."

                }
            ]
        }
    ];


function serializeDashboardParameters(parameters) {
    return parameters.map(parameter => {
        return {key: parameter.key, value: parameter.value};
    });
}

export function fetchEditorConfig(api) {
    var url = '/charts';

    return {
        types: [FETCH_CONFIG, FETCH_CONFIG_SUCCESS, FETCH_CONFIG_FAIL],
        promise: (client) => client.get(url, {api: api}).then((result) => {
            if (false) {
                result.data = MOCK_EDITOR;
            }

            return result;
        })
    };
}



export function fetchDashboardLayout(dashboardId = DEFAULT_DASHBOARD_ID, api) {

    let localStorageLayout;
    try {
        localStorageLayout = localStorage.getItem('dashboard:layout:' + dashboardId);

    } catch (x) {
        console.error(x);
    }

    if (localStorageLayout) {
        try {
            let lsl = JSON.parse(localStorageLayout);

            if (lsl.layout) {
                // Force the $key
                lsl.layout.forEach((item)=> {
                    //if (!item.$key) {
                    item.$key = allocateItemKey();
                    //}
                });

                return updateDashboardLayout(dashboardId, lsl.layout, lsl.parameters, false, lsl.editable);
            }
        } catch (x) {
            console.error(x);
        }
    }

    var url = '/dashboards/' + dashboardId;

    return {
        types: [FETCH_LAYOUT, FETCH_LAYOUT_SUCCESS, FETCH_LAYOUT_FAIL],
        dashboardId,
        promise: (client) => client.get(url, {api: api}).then((result) => {
            if (false) {
                result.data = MOCK;
            }

            return result;
        }),
        afterSuccess: (dispatch, getState, result) => {
            let params;

            let layout = result.data;
            if (!isArray(result.data)) {
                layout = result.data.layout;
                params = serializeDashboardParameters(result.data.parameters || []);
            }
            if (isArray(layout[0])) {
                layout = layout.reduce((prev, cells) => prev.concat(cells), []);
                layout = layout.map((item) => ({layoutClass: 'col-md-4', ...item}));
            }

            // Force the $key
            layout.forEach((item)=> {
                //if (!item.$key) {
                item.$key = allocateItemKey();
                //}
            });

            dispatch(updateDashboardLayout(dashboardId, layout, params, false, result.data.Editable));
//            dispatch(loadDashboardItems(dashboardId, layout, params || [], api));
        }
    };
}

export function fetchItem(dashboardId = DEFAULT_DASHBOARD_ID, link, itemKey, parameters, drillUpConfig, api) {
    return {
        types: [FETCH_ITEM, FETCH_ITEM_SUCCESS, FETCH_ITEM_FAIL],
        promise: (client) => client.get(link, {params: {params: parameters}, api: api}),
        dashboardId,
        itemKey,
        drillUpConfig
    };
}

export function fetchFirstItem(dashboardId = DEFAULT_DASHBOARD_ID, link, itemKey, layoutClass, parameters, drillUpConfig, api) {

    return {
        types: [FETCH_ITEM, FETCH_ITEM_SUCCESS, FETCH_ITEM_FAIL],
        promise: (client) => client.get(link, {params: {params: parameters}, api: api}),
        dashboardId,
        forceFirstItem: true,
        itemKey,
        layoutClass,
        url: link,
        drillUpConfig
    };
}

export function setParameter(dashboardId, parameter) {
    return {
        type: PARAM_CHANGE,
        dashboardId,
        parameter
    }
}

export function resetParameters(dashboardId) {
    return {
        type: PARAM_RESET,
        dashboardId
    };
}

export function drillUp(dashboardId = DEFAULT_DASHBOARD_ID, itemKey, drillUpConfig) {
    return {
        type: DRILL_UP,
        dashboardId,
        itemKey,
        drillUpConfig
    };
}

export function updateDashboardLayout(dashboardId = DEFAULT_DASHBOARD_ID, layout, params, saveIntoLocalStorage, editable) {

    if (saveIntoLocalStorage !== false) {
        let localStorageLayout = layout.asMutable().map((layout) => {
            return {url: layout.url, layoutClass: layout.layoutClass};
        });

        let p = params || [];
        if (p.asMutable) {
            p = p.asMutable();
        }

        let json = JSON.stringify({layout: localStorageLayout, parameters: p, editable: editable});
        try {
            localStorage.setItem('dashboard:layout:' + dashboardId, json);

        } catch (x) {
            console.error(x);
        }
    }

    return {
        type: LAYOUT_UPDATE,
        dashboardId,
        layout,
        editable
    };
}

export function beginDashboardDrag(dashboardId = DEFAULT_DASHBOARD_ID, cellKey) {
    return {
        type: BEGIN_DRAG,
        dashboardId,
        cellKey
    };
}

export function endDashboardDrag(dashboardId = DEFAULT_DASHBOARD_ID, cellKey) {
    return {
        type: END_DRAG,
        dashboardId,
        cellKey
    };
}

export function allocateItemKey() {
    return itemKeyCounter++;
}

const initialState = {
    dashboards: {
        [DASHBOARD_EDITOR_ID]: {
            id: DASHBOARD_EDITOR_ID,
            $internal: true,
            layout: [{$key: 'dnd'}]
        }
    },
    config: {
        types: []
    }
};

//result.data.parameters
const initialParam = [];
//[
//    {
//        type: 'SELECT',
//        key: 'param1',
//        value: 'v1',
//        options: [{value: "v1", label: "label 1"}, {value: "v2", label: "label 2"}]
//    },
//    {
//        type: 'SELECT',
//        key: 'param2',
//        value: 'v2',
//        options: [{value: "v1", label: "label 1"}, {value: "v2", label: "label 2"}]
//    }
//];

/*
 *  - This reducer manage all dahsboards of the application
 *  - @dashboardId: Is the route param or the props.resource of the dashboard component
 *
 */
export default function reducer(state = Immutable(initialState), action) {
    switch (action.type) {
        case FETCH_LAYOUT_SUCCESS: {
            if (state.dashboards[action.dashboardId]) {
                return state; //.setIn(['dashboards', action.dashboardId, "layout"], layout);
            }
            state = state.setIn(['dashboards', action.dashboardId], {
                id: action.dashboardId,
                editable: action.result.data.Editable,
                initialParameters: initialParam,
                parameters: initialParam
            });
            return state;
        }

        case DRILL_UP: {
            let layout = state.dashboards[action.dashboardId].layout;
            let itemIndex = layout.findIndex((i) => i.$key === action.itemKey);
            if (itemIndex < 0) {
                return state;
            }

            return state.setIn(['dashboards', action.dashboardId, "layout", itemIndex], action.drillUpConfig);
        }

        case PARAM_RESET:
            return state.setIn(['dashboards', action.dashboardId, 'parameters'], dashboard.initialParameters);

        case PARAM_CHANGE:
            var parameter = (state.parameters || []).find(p => p.key === action.parameter.key);
            if (!parameter) {
                return state;
            }
            return state.setIn(['dashboards', action.dashboardId, 'parameters', parameter.key], action.parameter.value);

        case FETCH_ITEM: {
            if (action.forceFirstItem) {
                state = state.setIn(['dashboards', action.dashboardId, 'layout', 0, '$key'], action.itemKey);
                state = state.setIn(['dashboards', action.dashboardId, 'layout', 0, 'layoutClass'], action.layoutClass);
                state = state.setIn(['dashboards', action.dashboardId, 'layout', 0, 'url'], action.url);
            }

            let layout = state.dashboards[action.dashboardId].layout;
            let itemIndex = layout.findIndex((i) => i.$key === action.itemKey);
            if (itemIndex < 0) {
                return state;
            }

            return state.setIn(['dashboards', action.dashboardId, 'layout', itemIndex, 'isLoading'], true);
        }

        case FETCH_ITEM_SUCCESS: {
            let layout = state.dashboards[action.dashboardId].layout;
            let itemIndex = layout.findIndex((i) => i.$key === action.itemKey);
            if (itemIndex < 0) {
                return state;
            }

            return state.updateIn(['dashboards', action.dashboardId, 'layout', itemIndex], (o) => ({
                ...o,
                ...action.result.data, //add chart config
                isLoading: false,
                error: null,
                drillUpConfig: action.drillUpConfig
            }));
        }

        case FETCH_ITEM_FAIL: {
            let layout = state.dashboards[action.dashboardId].layout;
            let itemIndex = layout.findIndex((i) => i.$key === action.itemKey);
            if (itemIndex < 0) {
                return state;
            }

            return state.updateIn(['dashboards', action.dashboardId, 'layout', itemIndex], (o) => ({
                ...o,
                isLoading: false,
                error: action.error.data
            }));
        }

        case LAYOUT_UPDATE:
            let newState = state.setIn(['dashboards', action.dashboardId, 'layout'], action.layout);

            if(!newState.dashboards[action.dashboardId].id){
                newState = newState.setIn(['dashboards', action.dashboardId, 'id'], action.dashboardId);
            }

            newState = newState.setIn(['dashboards', action.dashboardId, 'editable'], action.editable);

            return newState;

        case FETCH_CONFIG:
            return state.setIn(['config', 'loading'], true);

        case FETCH_CONFIG_SUCCESS:
            return state.updateIn(['config'], (o) => ({
                ...o,
                types: action.result.data,
                loading: false
            }));

        case
        FETCH_CONFIG_FAIL:
            return state.updateIn(['config'], (o) => ({
                ...o,
                loading: false,
                error: action.error.data
            }));

        default:
            return state;
    }
}

