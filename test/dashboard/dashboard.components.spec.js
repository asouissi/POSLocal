import React from 'react';
import{expect, assert, should} from 'chai'
import {shallow, mount} from 'enzyme';

import {
    IntlProvider,intlShape

} from 'react-intl';

import configureMockStore from 'redux-mock-store'
import MockAdapter from 'axios-mock-adapter'

import axios from 'axios'
import promiseMiddleware from '../../src/app/core/config/promiseMiddleware';

const mockStore = configureMockStore([promiseMiddleware]);

import {Dashboard} from '../../src/app/core/dashboards/components/DashboardContainer'

const props = {dispatch: mockStore().dispatch}; //use for mount a connected component
const client = new axios.create({
    baseURL: 'https://front.cassiopae.com/FrontV4FODEMO451/RestServices',
});

axios.baseURL = 'https://front.cassiopae.com/FrontV4FODEMO451/RestServices'
const mock = new MockAdapter(client); //no mockhere but just an exemple

let messages = {};
const intlProvider = new IntlProvider({ locale: 'en', messages }, {});
const { intl } = intlProvider.getChildContext();

function nodeWithIntlProp(node) {
    return React.cloneElement(node, { intl });
}

export function shallowWithIntl(node, { context }) {
    return shallow(
        nodeWithIntlProp(node),
        {
            context: Object.assign({}, context, {intl}),
        }
    );
}

export function mountWithIntl(node, { context, childContextTypes }) {
    return mount(
        nodeWithIntlProp(node),
        {
            context: Object.assign({}, context, {intl}),
            childContextTypes: Object.assign({}, { intl: intlShape }, childContextTypes)
        }
    );
}


describe('Dashboard Components', () => {


    it('Renders an empty Dashboard  component', () => {
        const wrapper = shallowWithIntl(<Dashboard dashboard={{}} resources="main" />, intl);
        expect(wrapper.find('form')).to.have.length(1);
    });


    it('Renders a Dashboard with two lines and charts', () => {
        let dashboardModel = {
            id: "MAIN",
            layout: [
                [
                    {
                        "url": "/chart/KPIDEALINPROGRESS",
                        "layoutClass": "col-md-3 col-xs-6",
                        "rowIndex": 0,
                        "itemIndex": 0,
                        "isLoading": false,
                        "type": "KPI",
                        "parameters": {
                            "type": "green",
                            "title": "Deals in progress",
                            "icon": "fa-thumbs-o-up",
                            "link": "#mydeals2",
                            "number": 179
                        }
                    }
                ],
                [
                    {
                        "url": "/chart/KPIDEALINPROGRESS",
                        "layoutClass": "col-md-3 col-xs-6",
                        "rowIndex": 0,
                        "itemIndex": 0,
                        "isLoading": false,
                        "type": "KPI",
                        "parameters": {
                            "type": "green",
                            "title": "Deals in progress",
                            "icon": "fa-thumbs-o-up",
                            "link": "#mydeals2",
                            "number": 179
                        }
                    }
                ]
            ]
        };

        const wrapper = mountWithIntl(<Dashboard dashboard={{}} resources="main" {...props} />, intl);
        expect(wrapper.find('row')).to.have.length(0);
        assert.equal(wrapper.find('.row').length, 0, 'It should have no lines');
        
        wrapper.setProps({dashboard: dashboardModel});
        assert.equal(wrapper.find('.row').length, 1, 'It should have one lines');
        assert.equal(wrapper.find( '.kpi-item').length, 2, 'It should have two KPI Dashboard item');
    });

});
