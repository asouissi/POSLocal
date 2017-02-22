import{expect, assert, should} from 'chai'
import Immutable from 'seamless-immutable'

import dashboardsReducer, * as actions from '../../src/app/core/dashboards/dashboardReducer'

describe('Dashboards Reducer', () => {

    var layoutData = {
        layout: [{
            "url": "fake",
        }, {
            "url": "/charts/fake",
            "layoutClass": "col-xs-6"
        }]
    };

    it('When A layout is fetch sucess a new dashboard item with id and layout must be added in state', () => {
        const initialSate = Immutable({dashboards: {}});


        var newstate = dashboardsReducer(initialSate, {
            type: actions.FETCH_LAYOUT_SUCCESS,
            dashboardId: 'main',
            result: {data: layoutData}
        });

        assert.equal(!!newstate.dashboards['main'], true, 'A new dashboard must be added');

        assert.deepEqual(newstate.dashboards['main'].layout, layoutData.layout, 'the new dashboard must have a layout');
    });

    it('When I load the same dashboard the layout must be updated', () => {
        const initialSate = Immutable({dashboards: {}});

        var newstate = dashboardsReducer(initialSate, {
            type: actions.FETCH_LAYOUT_SUCCESS,
            dashboardId: 'main',
            result: {data: layoutData}
        });

        let layoutData2 = {layout: [...layoutData.layout].concat([{url: 'updated'}])};
        var secondSate = dashboardsReducer(newstate, {
            type: actions.FETCH_LAYOUT_SUCCESS,
            dashboardId: 'main',
            result: {data: layoutData2}
        });
        assert.deepEqual(secondSate.dashboards['main'].layout, layoutData2.layout, 'the new dashboard must have a layout updated');
    });

    it('I can add a second dashboard', () => {
        const initialSate = Immutable({dashboards: {first: {id: 'first', layout: []}}});

        var newstate = dashboardsReducer(initialSate, {
            type: actions.FETCH_LAYOUT_SUCCESS,
            dashboardId: 'second',
            result: {data: {layout: []}}
        });

        assert.equal(!!newstate.dashboards['second'], true, 'A second dashboard must be added');
    });


    it('When an item is fetched the layout cell must be updated', () => {
        const initialSate = Immutable({
            dashboards: {
                main: {
                    id: 'main',
                    layout: [{url: 'anUrl', isLoading: false, $key: 'test'}]
                }
            }
        });

        var newstate = dashboardsReducer(initialSate, {
            type: actions.FETCH_ITEM_SUCCESS,
            dashboardId: 'main',
            itemKey: 'test',
            result: {data : {type: "KPI/CHART"} }
        });

        let item = newstate.dashboards['main'].layout.find(item => item.$key === 'test');
        assert.deepEqual(item, {
            $key: 'test',
            url: 'anUrl',
            type: "KPI/CHART",
            isLoading: false,
            drillUpConfig: undefined,
            error: null
        }, 'the item must merge the properties');
    });

});
