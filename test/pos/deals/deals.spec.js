import{expect, assert, should} from 'chai';
import Immutable from 'seamless-immutable'


import dealsReducer, * as actionType from '../../../src/app/pos/deals/reducers/deals';

const INIT_STATE = {
    deals: [],
    isLoading: false
};

describe('Deals Reducer: Fetch list of deals', () => {


    it('When i fetch a deal the sate is loading', () => {

        const newState = dealsReducer(Immutable(INIT_STATE), {
            type: actionType.FETCH
        });

        assert.equal(newState.isLoading, true, 'the state should be loading');
        expect(newState.isLoading).equal(true);
    });

});