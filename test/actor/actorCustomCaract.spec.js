import{expect, assert, should} from 'chai';
import Immutable from 'seamless-immutable'


import actorReducer, {INITIAL_ACTOR} from '../../src/app/common/actor/reducers/actor'
import * as actorAction from '../../src/app/common/actor/reducers/actions'
import {additionalAccessKeysSelector, accessKeysSelector} from '../../src/app/common/accesskeys/AccessKeysSelector'

import configureMockStore from 'redux-mock-store'
import MockAdapter from 'axios-mock-adapter'
import promiseMiddleware from '../../src/app/core/config/promiseMiddleware';
import axios from 'axios'
const mockStore = configureMockStore([promiseMiddleware]);

import {GlobalMessages} from '../../src/app/core/intl/GlobalMessages'
import {validateForm} from '../../src/app/common/actor/components/ActorCreationPage'


let mock = null;

const accesskeys = [{
    key: '/fake/route',
    customFields: [
        {
            cchvaluecode: 'testField1',
            mandatory: true,
            field: 'listcustomcharacteristic[cchvaluecode:testField1].valueField'
        },
        {
            cchvaluecode: 'testField2',
            mandatory: true,
            field: 'listcustomcharacteristic[cchvaluecode:testField2].valueField'
        }

    ]
}];


describe('Actors custom characteristics', () => {

    before(() => mock = new MockAdapter(axios));
    after(() => {
        mock.restore() // remove adapter
    });

    const getStoreState = {
        authentication: {user: {uticode: 'UTI_TEST'}},
        actorReducer: {actor: {}}
    };

    it('When actor is created, we need to add Custom caract fields for redux-from biding', () => {
        const initialSate = Immutable({actor: INITIAL_ACTOR()});
        const store = mockStore(getStoreState);

        store.dispatch(actorAction.newActor('CLIENT', accesskeys[0].customFields));
        const actions = store.getActions();

        var newstate = actorReducer(initialSate, actions[0]);

        assert.equal(newstate.actor.listcustomcharacteristic.length, 2, 'CC must be added');
        assert.deepEqual(newstate.actor.listcustomcharacteristic.map(custom => custom.cchvaluecode), ['testField1', 'testField2'], 'all custom keys codes');

    });

    it('When actor is fetch, we need to add telecom fields for redux-from biding if they are note here', (done) => {
        let actor = INITIAL_ACTOR();
        actor.actID = 12;
        actor.listcustomcharacteristic.push({
            cchvaluecode: 'testField2',
            valueField: 'fill'
        });

        mock.onGet('https://front.cassiopae.com/FrontV4FOINNO1/RestServices/actors/12').reply(200, actor);

        const initialSate = Immutable({actor: []});
        const store = mockStore(getStoreState);

        store.dispatch({
            ...actorAction.fetchActor(12, accesskeys[0].customFields), afterSuccess: ()=> {

                const actions = store.getActions();
                var newstateAfterFetch = actorReducer(initialSate, actions[1]); //action success


                assert.equal(newstateAfterFetch.actor.listcustomcharacteristic.length, 2, 'CC must be added if there is there');

                var valuesFields = newstateAfterFetch.actor.listcustomcharacteristic.map(custom => custom.valueField);
                assert.deepEqual(valuesFields, ['fill', undefined], 'keep initial values');

                done();

            }
        });

    });


    it('When i submit an actor with required CC i get errors', () => {

        let values = {
            listcustomcharacteristic: [
                {cchvaluecode: 'testField1'},
                {cchvaluecode: 'testField2', valueField: 'fill'}
            ]
        };

        const  customFieldsSelector =  additionalAccessKeysSelector();
        const  keysSelector =  accessKeysSelector();
        let customFields = keysSelector('/fake/route', accesskeys, values);

        let errors = validateForm(values, {accessKeys :customFields});
        assert.equal(errors.listcustomcharacteristic[0].valueField
            , GlobalMessages.fieldRequire, 'TestField1 is mandatory');

        assert.equal(errors.listcustomcharacteristic[1]
            , undefined, 'TestField2 is not in error');

    });

});