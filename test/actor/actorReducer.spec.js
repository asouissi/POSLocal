import{expect, assert, should} from 'chai'
import Immutable from 'seamless-immutable'


import actorReducer, {INITIAL_ACTOR} from '../../src/app/common/actor/reducers/actor'
import * as actorAction from '../../src/app/common/actor/reducers/actions'

import configureMockStore from 'redux-mock-store'
import MockAdapter from 'axios-mock-adapter'
import promiseMiddleware from '../../src/app/core/config/promiseMiddleware';
import axios from 'axios'
const mockStore = configureMockStore([promiseMiddleware]);

let mock = null;

describe('Actors Actions/Reducer: check actor model for redux form', () => {


    before(() => mock = new MockAdapter(axios));
    after(() => {
        mock.restore() // remove adapter
    } );

    const getStoreState = {
        authentication: {user: {uticode: 'UTI_TEST'}},
        actorReducer: {actor: {}}
    };

    it('When actor is created, we need to had telecom fields for redux-from biding', () => {
        const initialSate = Immutable({actor: INITIAL_ACTOR()});
        const store = mockStore(getStoreState);

        store.dispatch(actorAction.newActor('CLIENT'));
        const actions = store.getActions();

        var newstate = actorReducer(initialSate, actions[0]);

        assert.equal(newstate.actor.listactortelecom.length, 5, 'actor telecoms must be added');
        assert.deepEqual(newstate.actor.listactortelecom.map(telecom => telecom.atetype), ['TEL', 'NET', 'SITE', 'MOB', 'FAX'], 'all types');
        assert.deepEqual(newstate.actor.listactortelecom.map(telecom => telecom.ateordre), [1, 2, 3, 4, 5], 'bar order types');

    });

    it('When actor is fetch, we need to had telecom fields for redux-from biding if they are note here', (done) => {
        let actor = INITIAL_ACTOR();
        actor.actID = 12;
        actor.listactortelecom.push({
            atetype: 'TEL',
            ateordre: 2,
            actid: actor.actid

        });

        mock.onGet('https://front.cassiopae.com/FrontV4FOINNO1/RestServices/actors/12').reply(200, actor);

        const initialSate = Immutable({actor: []});
        const store = mockStore(getStoreState);

        store.dispatch({...actorAction.fetchActor(12), afterSuccess: ()=> {

            const actions = store.getActions();
            var newstateAfterFetch = actorReducer(initialSate, actions[1]); //action success

            assert.equal(newstateAfterFetch.actor.listactortelecom.length, 5, 'actor telecoms must be added');
            assert.deepEqual(newstateAfterFetch.actor.listactortelecom.map(telecom => telecom.atetype), ['TEL', 'NET', 'SITE', 'MOB', 'FAX'], 'all types');
            assert.deepEqual(newstateAfterFetch.actor.listactortelecom.map(telecom => telecom.ateordre), [2, 3, 4, 5, 6], 'bar order types');

            done();

        }});

    });

    it('When actor is saved, action need to remove unset telecoms', (done) => {

        const initialSate = Immutable({actor: INITIAL_ACTOR()});
        let store = mockStore(getStoreState);
        mock.onAny(/.*/).reply(200);
        store.dispatch(actorAction.newActor('CLIENT'));
        let actions = store.getActions();
        var newstate = actorReducer(initialSate, actions[0]);
        store = mockStore({actorReducer: newstate, authentication: {user: {uticode: 'UTI_TEST'}} });
        store.dispatch(actorAction.saveActor(newstate.actor.asMutable(), () => {
            const actions = store.getActions();
            let actorSended = JSON.parse (actions[1].result.config.data);
            assert.equal(actorSended.listactortelecom.length, 0, 'actor telecoms must be empty');
            done();
        }));

    });

});
