import{expect, assert, should} from 'chai'
import merge from 'lodash/merge'
import Immutable from 'seamless-immutable'
import {reducer as formReducer} from 'redux-form'
import {createStore, combineReducers} from 'redux'

import quoteReducer, * as quotes from '../../../src/app/pos/deal/newdeal2/reducers/dealQuote'
import * as dconst from '../../../src/app/pos/deal/utils/dealUtils'


//Todo expect action payload or formreducer like quote/spec
describe('Quote Actions', () => {


    it('should create an action to add an asset cost', () => {
        const initialSate = Immutable({deal: dconst.INITIAL_DEAL()});

        const assetCost = 10000;

        var quote = quotes.setAssetCost(initialSate.deal.listdealquote[0], 'testQuote', 'listdealquote[0]', assetCost).payload;
        expect(quote.pfiinvestissement).eql(assetCost);
        expect(quote.listdealquoteattribute[13].pfadouble).eql(assetCost); //pfacode =MAINFINACEAMT
    })
})


describe('Quotes Reducer: rules of asset cost', () => {

    let store
    beforeEach(() => {
        store = createStore(combineReducers({form: formReducer}))

    });

    it('When asset cost change, netadvance should be updated (MAINFINACEAMT) and netAdvance pct too', () => {
        const initialSate = Immutable({deal: dconst.INITIAL_DEAL()});

        var action = quotes.setAssetCost(initialSate.deal.listdealquote[0], 'testQuote', 'listdealquote[0]', 10000);
        store.dispatch(action);

        let values = store.getState().form.testQuote.values;

        assert.equal(values.listdealquote[0].pfiinvestissement, 10000, 'pfiinvestissement must be setted to 10000');
        assert.equal(values.listdealquote[0].listdealquoteelement[0].pfrmontant, 10000, 'pfrmontant must be setted to 10000');
        assert.includeDeepMembers(values.listdealquote[0].listdealquoteattribute, [{
            pfacode: 'MAINFINACEAMT',
            pfadouble: 10000
        }], 'NetAdvance must setted');
        assert.includeDeepMembers(values.listdealquote[0].listdealquoteattribute, [{
            pfacode: 'TMP_PCTFINVALUE',
            pfadouble: 100
        }], 'NetAdvance must setted to 100%');
    });

    it('When asset cost change with deposite the deposite pct need to be calc', () => {
        const initialSate = Immutable(merge({
            deal: {
                listdealquote: [
                    {
                        pfimtdownpayment:500,
                        listdealquotepayment: [
                            {pfvmt: 100}
                        ]
                    }
                ]
            }
        }, {deal: dconst.INITIAL_DEAL()}));

        assert.deepEqual(initialSate.deal.listdealquote[0].listdealquotepayment,
            [{
                pfvordre: 1,
                pfvtypeversement: "DOWNPAYMENTARR",
                pfvmt: 100
            }], 'deposit amount is setted and percent must unset');

        var action = quotes.setAssetCost(initialSate.deal.listdealquote[0], 'testQuote', 'listdealquote[0]', 10000);
        store.dispatch(action);

        let values = store.getState().form.testQuote.values;

        assert.equal(values.listdealquote[0].pfipctdownpayment, 5, 'deposit percent must be setted to 5');
        assert.equal(values.listdealquote[0].pfimtdownpayment, 500, 'deposit amount must be setted to 500');
        assert.equal(values.listdealquote[0].pfiinvestissement, 10000, 'asset cost must be setted to 10000');

    });


    it('When asset cost change with VAT amount the VAT percent need to be calc', () => {
        const initialSate = Immutable({deal: dconst.INITIAL_DEAL()});

        var action = quotes.setVATMnt(initialSate.deal.listdealquote[0], 'listdealquote[0]', 100);
        store.dispatch(action);

        let values = store.getState().form.dealQuote.values;

        action = quotes.setAssetCost(values.listdealquote[0], 'dealQuote', 'listdealquote[0]', 10000);
        store.dispatch(action);

        values = store.getState().form.dealQuote.values;

        assert.includeDeepMembers(values.listdealquote[0].listdealquoteattribute, [{
            pfacode: 'TMP_PCTVAT',
            pfadouble: 1
        }], 'VAT must setted');
    });

})
